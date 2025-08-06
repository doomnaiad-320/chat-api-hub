package model

import (
	"one-api/common"
	"one-api/common/config"
	"os"
	"strings"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func createRootAccountIfNeed() error {
	var user User
	//if user.Status != common.UserStatusEnabled {
	if err := DB.First(&user).Error; err != nil {
		common.SysLog("no user exists, create a root user for you: username is root, password is 123456")
		hashedPassword, err := common.Password2Hash("123456")
		if err != nil {
			return err
		}
		rootUser := User{
			Username:    "root",
			Password:    hashedPassword,
			Role:        common.RoleRootUser,
			Status:      common.UserStatusEnabled,
			DisplayName: "Root User",
			AccessToken: common.GetUUID(),
			Quota:       100000000,
		}
		DB.Create(&rootUser)
	}
	return nil
}

func chooseDB() (*gorm.DB, error) {
	// 优先使用环境变量SQL_DSN
	if dsn := os.Getenv("SQL_DSN"); dsn != "" {
		if strings.HasPrefix(dsn, "mysql://") || strings.Contains(dsn, "@tcp(") {
			common.SysLog("使用MySQL数据库")
			// 检查parseTime参数
			if !strings.Contains(dsn, "parseTime") {
				if strings.Contains(dsn, "?") {
					dsn += "&parseTime=true"
				} else {
					dsn += "?parseTime=true"
				}
			}
			// 添加其他MySQL连接参数
			if !strings.Contains(dsn, "charset") {
				if strings.Contains(dsn, "?") {
					dsn += "&charset=utf8mb4"
				} else {
					dsn += "?charset=utf8mb4"
				}
			}
			return gorm.Open(mysql.Open(dsn), &gorm.Config{
				PrepareStmt: true,
			})
		}
		// 如果DSN不是MySQL格式，尝试作为SQLite处理
		common.SysLog("使用SQLite数据库: " + dsn)
		return gorm.Open(sqlite.Open(dsn), &gorm.Config{
			PrepareStmt: true,
		})
	}

	// 默认使用SQLite数据库
	dbPath := "./one-api.db"
	common.SysLog("使用默认SQLite数据库: " + dbPath)
	return gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		PrepareStmt: true,
	})
}

func InitDB() (err error) {
	db, err := chooseDB()
	if err == nil {
		if config.DebugEnabled {
			db = db.Debug()
		}
		DB = db
		sqlDB, err := DB.DB()
		if err != nil {
			return err
		}
		sqlDB.SetMaxIdleConns(common.GetOrDefault("SQL_MAX_IDLE_CONNS", 100))
		sqlDB.SetMaxOpenConns(common.GetOrDefault("SQL_MAX_OPEN_CONNS", 1000))
		sqlDB.SetConnMaxLifetime(time.Second * time.Duration(common.GetOrDefault("SQL_MAX_LIFETIME", 60)))

		if !common.IsMasterNode {
			return nil
		}
		common.SysLog("database migration started")
		// 检查索引`idx_channels_key`是否存在于`channels`表上，如果存在就删除它
		if db.Migrator().HasIndex(&Channel{}, "idx_channels_key") {
			err = db.Migrator().DropIndex(&Channel{}, "idx_channels_key")
			if err != nil {
				return err // 处理错误
			}
		}
		err = db.AutoMigrate(&Channel{})
		if err != nil {
			return err
		}
		err = db.AutoMigrate(&Token{})
		if err != nil {
			return err
		}
		err = db.AutoMigrate(&User{})
		if err != nil {
			return err
		}
		err = db.AutoMigrate(&Option{})
		if err != nil {
			return err
		}
		err = db.AutoMigrate(&Redemption{})
		if err != nil {
			return err
		}
		err = db.AutoMigrate(&Ability{})
		if err != nil {
			return err
		}
		err = db.AutoMigrate(&Log{})
		if err != nil {
			return err
		}
		err = db.AutoMigrate(&Midjourney{})
		if err != nil {
			return err
		}
		err = db.AutoMigrate(&TopUp{})
		if err != nil {
			return err
		}
		err = db.AutoMigrate(&QuotaData{})
		if err != nil {
			return err
		}
		err = db.AutoMigrate(&RechargeRecord{})
		if err != nil {
			return err
		}
		err = db.AutoMigrate(&WithdrawalOrder{})
		if err != nil {
			return err
		}
		err = db.AutoMigrate(&MjImageSeed{})
		if err != nil {
			return err
		}
		err = db.AutoMigrate(&QuotaAlertSettings{})
		if err != nil {
			return err
		}
		common.SysLog("database migrated")
		err = createRootAccountIfNeed()
		return err
	} else {
		common.FatalLog(err)
	}
	return err
}

func CloseDB() error {
	sqlDB, err := DB.DB()
	if err != nil {
		return err
	}
	err = sqlDB.Close()
	return err
}
