#!/bin/bash

# 快速编译脚本 - 仅编译Linux AMD64版本（最常用的服务器版本）

set -e

echo "🚀 快速编译 Chat API (Linux AMD64)..."

# 检查Go环境
if ! command -v go &> /dev/null; then
    echo "❌ 未找到Go环境"
    echo "正在等待Go安装完成..."
    exit 1
fi

# 项目信息
PROJECT_NAME="chat-api"
VERSION=$(cat VERSION 2>/dev/null || echo "v1.0.0")
BUILD_TIME=$(date '+%Y-%m-%d %H:%M:%S')
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

echo "📦 项目信息:"
echo "  版本: $VERSION"
echo "  构建时间: $BUILD_TIME"
echo "  Git提交: $GIT_COMMIT"

# 创建构建目录
mkdir -p build

# 构建标志
LDFLAGS="-s -w -X 'one-api/common.Version=$VERSION'"

echo "📥 下载依赖..."
go mod download

echo "🔨 编译 Linux AMD64 版本..."
env GOOS=linux GOARCH=amd64 go build -ldflags "$LDFLAGS" -o build/chat-api-linux-amd64 .

if [ $? -eq 0 ]; then
    echo "✅ 编译成功!"
    
    # 创建部署目录
    mkdir -p build/deploy
    cp build/chat-api-linux-amd64 build/deploy/chat-api
    cp .env build/deploy/ 2>/dev/null || echo "⚠️  请手动复制.env文件"
    cp docker-compose-simple.yml build/deploy/
    cp MYSQL_CONFIG.md build/deploy/
    
    chmod +x build/deploy/chat-api
    
    echo "📁 部署文件已准备完成: build/deploy/"
    echo "🚀 上传到服务器后运行: ./chat-api"
else
    echo "❌ 编译失败"
    exit 1
fi
