#!/bin/bash

# OpenViking Memory Maintenance Script for OpenClaw
# 作用：自动归档过期的 P1/P2 记忆条目

WORKSPACE="/root/.openclaw/workspace"
ARCHIVE_DIR="$WORKSPACE/memory/archive"
mkdir -p "$ARCHIVE_DIR"

CURRENT_DATE=$(date +%Y-%m-%d)
THRESHOLD_P1=90 # 90天归档
THRESHOLD_P2=30 # 30天清理

echo "[$CURRENT_DATE] Starting OpenViking memory maintenance..."

# 1. 扫描所有 .md 文件中的 P2 标签（模拟逻辑，实际建议增强解析）
# 2. 这里演示：将 30 天前的旧 memory 文件移入归档
find "$WORKSPACE/memory" -name "*.md" -mtime +$THRESHOLD_P2 -exec mv {} "$ARCHIVE_DIR/" \;

echo "Maintenance complete."
