# GitHub Actions 自动编译说明

本项目已配置GitHub Actions自动编译，可以在GitHub上自动构建Linux版本的可执行文件。

## 🚀 自动触发编译

### 方式1: 推送代码触发
当您推送代码到`main`或`master`分支时，会自动触发编译：

```bash
git push origin master
```

### 方式2: 手动触发编译
1. 访问GitHub仓库页面
2. 点击 `Actions` 标签
3. 选择 `Build Linux Version` 工作流
4. 点击 `Run workflow` 按钮
5. 选择构建类型：
   - `amd64`: 仅构建AMD64版本（推荐，适用于大多数服务器）
   - `arm64`: 仅构建ARM64版本
   - `both`: 构建两个版本

## 📦 下载编译结果

### 从Actions页面下载
1. 访问GitHub仓库的 `Actions` 页面
2. 点击最新的构建任务
3. 在 `Artifacts` 部分下载 `chat-api-linux-xxx` 文件
4. 解压后获得编译好的文件

### 从Release页面下载（如果创建了标签）
1. 访问GitHub仓库的 `Releases` 页面
2. 下载最新版本的二进制文件

## 📁 编译产物说明

下载的压缩包包含以下文件：

```
chat-api-linux-xxx/
├── chat-api-linux-amd64     # Linux AMD64版本二进制文件
├── chat-api-linux-arm64     # Linux ARM64版本二进制文件（如果构建了）
└── deploy/                  # 部署包
    ├── chat-api             # 重命名的二进制文件（默认AMD64）
    ├── start.sh             # 启动脚本
    ├── stop.sh              # 停止脚本
    ├── .env                 # 环境变量配置
    ├── docker-compose-simple.yml
    ├── MYSQL_CONFIG.md
    ├── README.md
    └── DEPLOY.md            # 部署说明
```

## 🚀 服务器部署步骤

### 快速部署（推荐）
1. 下载并解压编译产物
2. 上传 `deploy/` 目录到服务器
3. 在服务器上运行：
   ```bash
   cd deploy
   chmod +x start.sh
   ./start.sh
   ```

### 手动部署
1. 下载对应架构的二进制文件：
   - `chat-api-linux-amd64` (适用于大多数服务器)
   - `chat-api-linux-arm64` (适用于ARM服务器)
2. 上传到服务器并设置权限：
   ```bash
   chmod +x chat-api-linux-amd64
   ```
3. 运行：
   ```bash
   ./chat-api-linux-amd64
   ```

## 🔧 环境配置

确保服务器上有正确的 `.env` 文件：

```bash
# MySQL数据库配置
SQL_DSN=chatapihub:XdxpZsD6P2TSWTAx@tcp(1.92.83.101:3306)/chatapihub?parseTime=true&charset=utf8mb4&collation=utf8mb4_unicode_ci

# 数据库连接池配置
SQL_MAX_IDLE_CONNS=10
SQL_MAX_OPEN_CONNS=100
SQL_MAX_LIFETIME=60

# 会话密钥
SESSION_SECRET=chatapi_session_secret_2024

# 运行模式
DEBUG=false
GIN_MODE=release
```

## 🌐 访问服务

服务启动后：
- 访问地址: `http://your-server:3000`
- 管理界面: `http://your-server:3000/admin`
- 默认管理员: `root` / `123456`

## 🛠️ 故障排除

### 编译失败
1. 检查GitHub Actions日志
2. 确保前端依赖正确安装
3. 检查Go模块依赖

### 服务启动失败
1. 检查端口3000是否被占用
2. 确认数据库连接配置正确
3. 检查服务器防火墙设置

### 数据库连接问题
1. 确认数据库服务器可访问
2. 检查用户名密码是否正确
3. 确认数据库存在且用户有权限

## 📝 注意事项

1. **架构选择**: 大多数云服务器使用AMD64架构，选择对应版本
2. **权限设置**: 上传后务必设置执行权限 `chmod +x`
3. **端口开放**: 确保服务器防火墙开放3000端口
4. **数据库连接**: 确保服务器能访问MySQL数据库
5. **持久运行**: 建议使用systemd、supervisor或screen等工具保持服务运行

## 🔄 更新部署

当有新版本时：
1. 停止当前服务: `./stop.sh`
2. 下载新版本编译文件
3. 替换旧的二进制文件
4. 重新启动: `./start.sh`
