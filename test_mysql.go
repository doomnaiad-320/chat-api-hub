package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// MySQL连接信息
	host := "1.92.83.101"
	port := "3306"
	username := "chatapihub"
	password := "XdxpZsD6P2TSWTAx"
	database := "chatapihub"

	// 构建DSN (Data Source Name)
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", username, password, host, port, database)
	
	fmt.Printf("正在测试MySQL连接...\n")
	fmt.Printf("主机: %s:%s\n", host, port)
	fmt.Printf("数据库: %s\n", database)
	fmt.Printf("用户名: %s\n", username)
	
	// 尝试连接数据库
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("❌ 连接数据库失败: %v", err)
	}
	defer db.Close()

	// 测试连接
	err = db.Ping()
	if err != nil {
		log.Fatalf("❌ 数据库连接测试失败: %v", err)
	}

	fmt.Println("✅ MySQL数据库连接成功!")

	// 测试查询数据库版本
	var version string
	err = db.QueryRow("SELECT VERSION()").Scan(&version)
	if err != nil {
		log.Printf("⚠️  查询数据库版本失败: %v", err)
	} else {
		fmt.Printf("📊 MySQL版本: %s\n", version)
	}

	// 测试查询数据库列表
	rows, err := db.Query("SHOW DATABASES")
	if err != nil {
		log.Printf("⚠️  查询数据库列表失败: %v", err)
	} else {
		fmt.Println("📋 可用数据库:")
		for rows.Next() {
			var dbName string
			if err := rows.Scan(&dbName); err != nil {
				log.Printf("⚠️  读取数据库名失败: %v", err)
				continue
			}
			fmt.Printf("  - %s\n", dbName)
		}
		rows.Close()
	}

	// 测试查询当前数据库的表
	rows, err = db.Query("SHOW TABLES")
	if err != nil {
		log.Printf("⚠️  查询表列表失败: %v", err)
	} else {
		fmt.Printf("📋 数据库 '%s' 中的表:\n", database)
		tableCount := 0
		for rows.Next() {
			var tableName string
			if err := rows.Scan(&tableName); err != nil {
				log.Printf("⚠️  读取表名失败: %v", err)
				continue
			}
			fmt.Printf("  - %s\n", tableName)
			tableCount++
		}
		if tableCount == 0 {
			fmt.Println("  (数据库为空，没有表)")
		}
		rows.Close()
	}

	fmt.Println("\n🎉 数据库连接测试完成!")
}
