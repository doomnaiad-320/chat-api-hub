package common

// 强制使用MySQL，移除其他数据库支持标志
var UsingSQLite = false
var UsingPostgreSQL = false
var UsingMySQL = true

// 保留SQLitePath变量以防其他地方引用，但不会被使用
var SQLitePath = "one-api.db?_busy_timeout=5000"

// MySQL连接配置
var MySQLDSN = "chatapihub:XdxpZsD6P2TSWTAx@tcp(1.92.83.101:3306)/chatapihub?parseTime=true&charset=utf8mb4"
