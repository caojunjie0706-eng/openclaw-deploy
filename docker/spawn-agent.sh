#!/bin/bash

# 检查输入参数
if [ "$#" -ne 2 ]; then
    echo "使用方式: ./spawn-agent.sh <USER_ID> <PORT>"
    exit 1
fi

USER_ID=$1
PORT=$2

# 创建用户数据目录
mkdir -p ./data/${USER_ID}/workspace
mkdir -p ./data/${USER_ID}/config

# 动态生成特定用户的 docker-compose.yml
# 这一步是为了让每个容器独立管理，不干扰全局配置
sed "s/\${USER_ID}/${USER_ID}/g; s/\${PORT}/${PORT}/g" docker/docker-compose.template.yml > ./data/${USER_ID}/docker-compose.generated.yml

# 启动容器
docker compose -f ./data/${USER_ID}/docker-compose.generated.yml up -d

echo "✅ 用户 [${USER_ID}] 的隔离环境已启动，映射端口为 [${PORT}]。"
echo "👉 配置路径: ./data/${USER_ID}/config"
echo "👉 工作路径: ./data/${USER_ID}/workspace"
