#!/bin/bash

# OpenClaw 一键部署脚本 (One-Click Deploy Script) v1.0

# 1. 环境自检
echo "🔍 正在进行环境自检..."

if ! command -v docker &> /dev/null; then
    echo "❌ 错误: 未检测到 Docker，请先安装 Docker (https://docs.docker.com/get-docker/)"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo "❌ 错误: 未检测到 Docker Compose，请先安装 Docker Compose"
    exit 1
fi

# 2. 检查镜像是否存在
IMAGE_NAME="openclaw-vibe:latest"
if [[ "$(docker images -q $IMAGE_NAME 2> /dev/null)" == "" ]]; then
    echo "🏗️  未检测到镜像 $IMAGE_NAME，准备构建..."
    if [ ! -f "docker/Dockerfile" ]; then
        echo "❌ 错误: 未找到 docker/Dockerfile。请确保您在 OpenClaw 根目录下运行此脚本。"
        exit 1
    fi
    docker build -t $IMAGE_NAME -f docker/Dockerfile .
    echo "✅ 镜像构建完成。"
else
    echo "✅ 镜像 $IMAGE_NAME 已就绪。"
fi

# 3. 收集部署信息
read -p "👤 请输入用户 ID (建议使用字母数字, 如 jj): " USER_ID
read -p "🔌 请输入映射端口 (如 3001): " PORT

# 4. 执行派生脚本
if [ -f "docker/spawn-agent.sh" ]; then
    chmod +x docker/spawn-agent.sh
    ./docker/spawn-agent.sh "$USER_ID" "$PORT"
else
    echo "❌ 错误: 未找到 docker/spawn-agent.sh"
    exit 1
fi

echo "🚀 OpenClaw 环境 [${USER_ID}] 部署成功！"
echo "🌐 访问地址: http://localhost:${PORT}"
echo "📁 数据保存在: ./data/${USER_ID}/"
