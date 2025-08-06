#!/bin/bash

echo "🚀 启动Chat API前端开发服务器"
echo "================================"

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "❌ Node.js环境未安装，请先安装Node.js"
    exit 1
fi

# 检查npm环境
if ! command -v npm &> /dev/null; then
    echo "❌ npm未安装，请先安装npm"
    exit 1
fi

# 进入前端目录
cd web-user

# 检查.env文件
if [ ! -f ".env" ]; then
    echo "📝 创建.env配置文件..."
    cat > .env << EOF
# 后端API服务器地址
REACT_APP_SERVER=http://1.92.83.101:3000

# 开发服务器端口
PORT=3001

# 浏览器自动打开
BROWSER=none
EOF
    echo "✅ .env文件已创建"
fi

echo "📊 当前配置:"
echo "   后端API地址: http://1.92.83.101:3000"
echo "   前端开发服务器: http://localhost:3001"
echo ""

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖包..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
else
    echo "📦 检查依赖更新..."
    npm install
fi

echo ""
echo "🎯 启动前端开发服务器..."
echo "访问地址: http://localhost:3001"
echo "API地址: http://1.92.83.101:3000"
echo "按 Ctrl+C 停止服务"
echo ""

# 启动开发服务器
npm start
