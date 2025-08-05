# MySQL数据库配置说明

本项目已配置为使用外部MySQL数据库，具体配置如下：

## 数据库信息

- **主机地址**: 1.92.83.101
- **端口**: 3306
- **数据库名**: chatapihub
- **用户名**: chatapihub
- **密码**: XdxpZsD6P2TSWTAx

## 配置文件

### 1. 环境变量配置 (.env文件)

项目根目录下的 `.env` 文件已配置好MySQL连接：

```bash
# MySQL数据库配置
SQL_DSN=chatapihub:XdxpZsD6P2TSWTAx@tcp(1.92.83.101:3306)/chatapihub?parseTime=true&charset=utf8mb4&collation=utf8mb4_unicode_ci

# 数据库连接池配置
SQL_MAX_IDLE_CONNS=10
SQL_MAX_OPEN_CONNS=100
SQL_MAX_LIFETIME=60

# 会话密钥
SESSION_SECRET=chatapi_session_secret_2024

# 调试模式
DEBUG=false
GIN_MODE=release
```

### 2. Docker Compose配置

#### 完整版 (docker-compose.yml)
包含Redis缓存服务：
```bash
docker-compose up -d
```

#### 简化版 (docker-compose-simple.yml)
仅包含chat-api服务，不包含Redis：
```bash
docker-compose -f docker-compose-simple.yml up -d
```

## 运行方式

### 方式1: 直接运行 (需要Go环境)
```bash
# 加载环境变量并运行
go run main.go
```

### 方式2: Docker运行
```bash
# 使用完整版配置
docker-compose up -d

# 或使用简化版配置
docker-compose -f docker-compose-simple.yml up -d
```

## 数据库初始化

程序首次运行时会自动：
1. 连接到MySQL数据库
2. 创建所需的数据表
3. 创建默认管理员账户
   - 用户名: root
   - 密码: 123456

## 访问地址

服务启动后可通过以下地址访问：
- 用户界面: http://localhost:3000
- 管理界面: http://localhost:3000/admin

## 注意事项

1. 确保MySQL数据库服务正常运行
2. 确保网络连接正常，能够访问 1.92.83.101:3306
3. 确保数据库用户 `chatapihub` 有足够的权限创建表和操作数据
4. 如果遇到连接问题，请检查防火墙设置

## 故障排除

如果遇到数据库连接问题，请检查：
1. 数据库服务器是否正常运行
2. 网络连接是否正常
3. 用户名和密码是否正确
4. 数据库是否存在
5. 用户权限是否足够

查看日志获取详细错误信息：
```bash
# Docker方式查看日志
docker-compose logs chat-api

# 或
docker-compose -f docker-compose-simple.yml logs chat-api
```
