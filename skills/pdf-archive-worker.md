# Skill: PDF Archive Worker (Sub-Agent Workflow)

## 场景 (Scenario)
当用户发送 PDF 文件（或 file_key）请求归档时使用。目的是保护主会话 Token 空间，避免大段原始文本进入上下文。

## 逻辑 (Logic)
1. **主代理 (Main Agent)**：接收请求，确认文件信息，派生子代理。
2. **子代理 (Sub-Agent)**：
   - 使用 `sessions_spawn` 启动，模式为 `run` 或 `session`。
   - 任务描述：下载文件 -> 读取/解析文本 -> 提取核心精华（Markdown 格式）-> 写入对应的 `memory/` 目录。
   - 成功后向主代理报告简短结果（文件名、核心公式/摘要）。
3. **主代理 (Main Agent)**：接收子代理报告，更新 `MEMORY.md` 索引，通知用户。

## 工具指令 (Tool Snippet)
```javascript
// 示例任务指令
sessions_spawn({
  task: "下载飞书文件 ${file_key}，解析 PDF 内容。提取核心内容并以 Markdown 格式写入 `memory/01_Marketing/${filename}.md`。完成后在当前会话回复核心精华总结。",
  model: "claude-proxy" // 推荐使用处理长文本能力强的模型
});
```

## 注意事项 (Notes)
- **命名规范**：文件名优先使用中文，反映核心主题。
- **重试机制**：若子代理因 API 限制失败，主代理应建议分段处理或稍后重试。
- **分类标准**：根据内容自动分流至 `01_Marketing`, `02_Decision`, `03_Management`, `04_Product` 等目录。
