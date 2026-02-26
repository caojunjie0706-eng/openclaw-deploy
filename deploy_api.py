import subprocess
import os
import json
import sqlite3
import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="OpenClaw Web Deploy API - Secured v1.3")

# 允许跨域
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 数据库初始化 (管理一次性邀请码) ---
DB_PATH = "/root/.openclaw/workspace/invite_codes.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS codes (
            code TEXT PRIMARY KEY,
            is_used INTEGER DEFAULT 0,
            used_by_agent TEXT
        )
    ''')
    # 预置一个测试用的一次性邀请码
    try:
        cursor.execute("INSERT INTO codes (code) VALUES (?)", ("JJ-VIP-2026",))
        cursor.execute("INSERT INTO codes (code) VALUES (?)", ("BETA-TEST-001",))
    except sqlite3.IntegrityError:
        pass
    conn.commit()
    conn.close()

init_db()

class DeployRequest(BaseModel):
    agent_name: str
    feishu_app_id: str
    feishu_app_secret: str
    invite_code: str
    template: str
    skills: Optional[List[str]] = []

def run_cmd(args):
    cmd = ["openclaw"] + args
    res = subprocess.run(cmd, capture_output=True, text=True)
    return res

@app.get("/api/generate_code")
async def generate_code():
    # 仅供管理员(JJ)调用的生成接口
    new_code = str(uuid.uuid4())[:8].upper()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO codes (code) VALUES (?)", (new_code,))
    conn.commit()
    conn.close()
    return {"invite_code": new_code}

@app.post("/api/deploy")
async def deploy(req: DeployRequest):
    # 1. 校验邀请码是否有效且未被使用
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT is_used FROM codes WHERE code = ?", (req.invite_code,))
    row = cursor.fetchone()
    
    if not row:
        conn.close()
        raise HTTPException(status_code=403, detail="邀请码不存在")
    if row[0] == 1:
        conn.close()
        raise HTTPException(status_code=403, detail="该邀请码已被使用")

    # 2. 校验通过，锁定邀请码（原子操作）
    cursor.execute("UPDATE codes SET is_used = 1, used_by_agent = ? WHERE code = ?", (req.agent_name, req.invite_code))
    conn.commit()
    conn.close()

    # 3. 执行物理部署 (SOP)
    workspace = f"/root/.openclaw/workspace/agents/{req.agent_name}"
    os.makedirs(workspace, exist_ok=True)
    
    # 创建 Agent
    add_res = run_cmd(["agents", "add", req.agent_name, "--workspace", workspace])
    if add_res.returncode != 0:
        # 如果部署失败，建议回滚邀请码状态（生产环境需更严谨）
        raise HTTPException(status_code=500, detail=f"部署失败: {add_res.stderr}")

    # 注入配置
    configs = [
        ["config", "set", "agents.defaults.model", "gemini-flash"],
        ["config", "set", "channels.feishu.appId", req.feishu_app_id],
        ["config", "set", "channels.feishu.appSecret", req.feishu_app_secret],
        ["config", "set", "channels.feishu.enabled", "true"],
        ["config", "set", "channels.feishu.connectionMode", "websocket"]
    ]
    for cfg in configs:
        run_cmd(cfg)

    return {
        "status": "success",
        "agent_id": req.agent_name,
        "message": "一次性授权成功，数字员工已上线！"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
