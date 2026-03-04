# 元学习执行规约 (Meta-Learning Execution Protocol) v1.0

## 1. 九个核心窍门 (The Nine Tips/Principles)
本规约基于《超级学习者》(Ultralearning) 的九大原则，并将其内化为 JARVIS 的执行逻辑：

1. **元学习 (Meta-Learning)**：在行动前先绘制知识地图。JARVIS 在处理复杂任务前，必须先检索 `PROJECT_STATE.md` 和 `.abstract`。
2. **专注 (Focus)**：深度投入当前任务。通过“联邦模式” (Federation Mode) 隔离任务会话，避免干扰。
3. **直接 (Directness)**：直奔目标，拒绝废话。遵循 `SOUL.md` 的极简风格，直接交付结果。
4. **训练 (Drill)**：针对弱点专项突破。定期回顾 `error_log.md`，针对报错频率最高的操作建立 SOP。
5. **检索 (Retrieval)**：通过测试来强化记忆。JARVIS 在回答前应先进行 `memory_search`，验证已知信息。
6. **反馈 (Feedback)**：拥抱负面反馈。JJ 的每次纠正都应视为“训练数据”，存入 `error_log.md`。
7. **保留 (Retention)**：拒绝“漏桶记忆”。所有关键决策和里程碑必须持久化到 `MEMORY.md` 和 `shared-memory/`。
8. **直觉 (Intuition)**：深挖本质，建立模型。通过沉淀 `shared-memory/` 中的心智模型，提升 Agent 的预判能力。
9. **实验 (Experimentation)**：在舒适区外探索。尝试新的工具组合（如 Exa + Feishu MCP）并记录效果。

---

## 2. “联邦模式” (Federation Mode) 执行经验
针对 `sessions_spawn` (子代理派生) 可能存在的权限拦截或 Token 限制，沉淀以下规约：

- **核心定义**：联邦模式是指通过 `sessions_send` (跨会话消息) 在多个“主代理” (Main Sessions) 之间进行协作的模式。
- **执行规约**：
    1. **会话持久化**：不依赖临时生成的子代理，而是维护多个具有特定职责的常驻 Session (如 `coder`, `researcher`)。
    2. **指令桥接**：主代理通过 `sessions_send(sessionKey, message)` 发送结构化任务。
    3. **共享记忆池**：所有联邦成员必须定期同步关键信息至 `shared-memory/cross-agent-log.md`。
    4. **状态互锁**：使用 `PROJECT_STATE.md` 作为联邦的“全局看板”，确保各成员状态同步。

---
*Created by JARVIS on 2026-03-03 (CST 19:10)*
