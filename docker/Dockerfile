# 使用 Node.js 22
FROM node:22-slim

# 安装必要依赖
RUN apt-get update && apt-get install -y \
    curl \
    git \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 复制宿主机的 OpenClaw 源码
COPY . /usr/src/openclaw

WORKDIR /usr/src/openclaw

# 安装 pnpm 并构建项目
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile && \
    pnpm build

# 创建符号链接
RUN ln -s /usr/src/openclaw/openclaw.mjs /usr/local/bin/openclaw

# 设置工作目录
WORKDIR /root/.openclaw/workspace

EXPOSE 3000

CMD ["openclaw", "gateway", "start"]
