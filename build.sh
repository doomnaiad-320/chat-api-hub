#!/bin/bash

# Chat API 编译脚本
# 支持多平台编译

set -e

echo "🚀 开始编译 Chat API..."

# 项目信息
PROJECT_NAME="chat-api"
VERSION=$(cat VERSION 2>/dev/null || echo "v1.0.0")
BUILD_TIME=$(date '+%Y-%m-%d %H:%M:%S')
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

# 创建构建目录
BUILD_DIR="build"
mkdir -p $BUILD_DIR

echo "📦 项目信息:"
echo "  名称: $PROJECT_NAME"
echo "  版本: $VERSION"
echo "  构建时间: $BUILD_TIME"
echo "  Git提交: $GIT_COMMIT"
echo ""

# 构建标志
LDFLAGS="-s -w -X 'one-api/common.Version=$VERSION' -X 'one-api/common.BuildTime=$BUILD_TIME' -X 'one-api/common.GitCommit=$GIT_COMMIT'"

# 编译函数
build_for_platform() {
    local GOOS=$1
    local GOARCH=$2
    local SUFFIX=$3
    
    echo "🔨 编译 $GOOS/$GOARCH..."
    
    local OUTPUT_NAME="$PROJECT_NAME-$GOOS-$GOARCH$SUFFIX"
    local OUTPUT_PATH="$BUILD_DIR/$OUTPUT_NAME"
    
    env GOOS=$GOOS GOARCH=$GOARCH go build -ldflags "$LDFLAGS" -o "$OUTPUT_PATH" .
    
    if [ $? -eq 0 ]; then
        echo "✅ 编译成功: $OUTPUT_PATH"
        
        # 显示文件大小
        if command -v ls >/dev/null 2>&1; then
            SIZE=$(ls -lh "$OUTPUT_PATH" | awk '{print $5}')
            echo "   文件大小: $SIZE"
        fi
    else
        echo "❌ 编译失败: $GOOS/$GOARCH"
        return 1
    fi
    
    echo ""
}

# 检查Go环境
if ! command -v go &> /dev/null; then
    echo "❌ 未找到Go环境，请先安装Go"
    echo "   macOS: brew install go"
    echo "   Ubuntu: sudo apt-get install golang-go"
    echo "   或访问: https://golang.org/dl/"
    exit 1
fi

echo "🔍 Go版本信息:"
go version
echo ""

# 下载依赖
echo "📥 下载依赖..."
go mod download
go mod tidy
echo ""

# 编译不同平台版本
echo "🏗️  开始多平台编译..."
echo ""

# Linux AMD64 (最常用的服务器架构)
build_for_platform "linux" "amd64" ""

# Linux ARM64 (ARM服务器)
build_for_platform "linux" "arm64" ""

# macOS AMD64 (Intel Mac)
build_for_platform "darwin" "amd64" ""

# macOS ARM64 (Apple Silicon Mac)
build_for_platform "darwin" "arm64" ""

# Windows AMD64
build_for_platform "windows" "amd64" ".exe"

echo "🎉 编译完成！"
echo ""
echo "📁 编译文件位置: $BUILD_DIR/"
echo "📋 编译文件列表:"
ls -la $BUILD_DIR/
echo ""

# 创建部署包
echo "📦 创建部署包..."
DEPLOY_DIR="$BUILD_DIR/deploy"
mkdir -p $DEPLOY_DIR

# 复制必要文件到部署目录
cp .env $DEPLOY_DIR/ 2>/dev/null || echo "⚠️  .env文件不存在，请手动创建"
cp docker-compose.yml $DEPLOY_DIR/
cp docker-compose-simple.yml $DEPLOY_DIR/
cp MYSQL_CONFIG.md $DEPLOY_DIR/
cp README.md $DEPLOY_DIR/

# 复制Linux版本到部署目录（最常用）
cp $BUILD_DIR/chat-api-linux-amd64 $DEPLOY_DIR/chat-api 2>/dev/null || echo "⚠️  Linux AMD64版本编译失败"

echo "✅ 部署包创建完成: $DEPLOY_DIR/"
echo ""
echo "🚀 部署说明:"
echo "1. 将 $DEPLOY_DIR/ 目录上传到服务器"
echo "2. 在服务器上运行: chmod +x chat-api && ./chat-api"
echo "3. 或使用Docker: docker-compose up -d"
echo ""
echo "🔗 访问地址: http://your-server:3000"
echo "👤 默认管理员: root / 123456"
