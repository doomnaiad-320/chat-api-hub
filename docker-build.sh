#!/bin/bash

# 使用Docker编译Go项目
# 适用于没有本地Go环境的情况

set -e

echo "🐳 使用Docker编译 Chat API..."

# 项目信息
PROJECT_NAME="chat-api"
VERSION=$(cat VERSION 2>/dev/null || echo "v1.0.0")
BUILD_TIME=$(date '+%Y-%m-%d %H:%M:%S')
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

echo "📦 项目信息:"
echo "  版本: $VERSION"
echo "  构建时间: $BUILD_TIME"
echo "  Git提交: $GIT_COMMIT"

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo "❌ 未找到Docker环境"
    echo "请先安装Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# 创建构建目录
mkdir -p build

# 构建标志
LDFLAGS="-s -w -X 'one-api/common.Version=$VERSION'"

echo "🔨 使用Docker编译..."

# 使用官方Go镜像编译
docker run --rm \
    -v "$(pwd)":/workspace \
    -w /workspace \
    golang:1.22-alpine \
    sh -c "
        echo '📥 下载依赖...'
        go mod download
        go mod tidy
        
        echo '🔨 编译 Linux AMD64...'
        CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags '$LDFLAGS' -o build/chat-api-linux-amd64 .
        
        echo '🔨 编译 Linux ARM64...'
        CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -ldflags '$LDFLAGS' -o build/chat-api-linux-arm64 .
        
        echo '✅ Docker编译完成!'
    "

if [ $? -eq 0 ]; then
    echo "🎉 编译成功!"
    
    # 创建部署目录
    echo "📦 创建部署包..."
    DEPLOY_DIR="build/deploy"
    mkdir -p $DEPLOY_DIR
    
    # 复制文件
    cp build/chat-api-linux-amd64 $DEPLOY_DIR/chat-api
    cp .env $DEPLOY_DIR/ 2>/dev/null || echo "⚠️  请手动复制.env文件到部署目录"
    cp docker-compose-simple.yml $DEPLOY_DIR/
    cp MYSQL_CONFIG.md $DEPLOY_DIR/
    cp README.md $DEPLOY_DIR/
    
    # 设置执行权限
    chmod +x $DEPLOY_DIR/chat-api
    
    echo "📁 部署文件列表:"
    ls -la $DEPLOY_DIR/
    
    echo ""
    echo "🚀 部署说明:"
    echo "1. 将 $DEPLOY_DIR/ 目录上传到Linux服务器"
    echo "2. 在服务器上运行: ./chat-api"
    echo "3. 访问: http://your-server:3000"
    echo "4. 默认管理员: root / 123456"
    
else
    echo "❌ Docker编译失败"
    exit 1
fi
