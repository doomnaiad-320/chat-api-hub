#!/bin/bash

# 测试MySQL数据库连接的脚本
# 使用mysql客户端工具测试连接

echo "🔍 正在测试MySQL数据库连接..."
echo "主机: 1.92.83.101:3306"
echo "数据库: chatapihub"
echo "用户名: chatapihub"
echo ""

# 检查是否安装了mysql客户端
if ! command -v mysql &> /dev/null; then
    echo "❌ 未找到mysql客户端工具"
    echo "请安装MySQL客户端: brew install mysql-client (macOS) 或 apt-get install mysql-client (Ubuntu)"
    exit 1
fi

# 测试连接
echo "正在连接数据库..."
mysql -h 1.92.83.101 -P 3306 -u chatapihub -pXdxpZsD6P2TSWTAx -D chatapihub -e "
SELECT 'MySQL连接成功!' as status;
SELECT VERSION() as mysql_version;
SELECT DATABASE() as current_database;
SHOW TABLES;
" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ MySQL数据库连接测试成功!"
else
    echo "❌ MySQL数据库连接失败"
    echo "请检查:"
    echo "1. 网络连接是否正常"
    echo "2. 数据库服务器是否运行"
    echo "3. 用户名和密码是否正确"
    echo "4. 数据库是否存在"
    echo "5. 防火墙设置是否允许连接"
fi
