import subprocess
import os
import sqlite3
import uuid
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="OpenClaw Web Deploy API - SOP v2.5")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "/root/.openclaw/workspace/invite_codes.db"
USERS_BASE_DIR = "/root/.openclaw/users"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS codes (
            code TEXT PRIMARY KEY,
            is_used INTEGER DEFAULT 0,
            used_by_agent TEXT,
            app_id TEXT
        )
    ''')
    try:
        cursor.execute("INSERT INTO codes (code) VALUES (?)", ("JJ-VIP-2026",))
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

@app.post("/api/deploy")
async def deploy(req: DeployRequest):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT is_used FROM codes WHERE code = ?", (req.invite_code,))
    row = cursor.fetchone()
    if not row or row[0] == 1:
        conn.close()
        raise HTTPException(status_code=403, detail="邀请码无效或已被使用")
    
    user_id = str(uuid.uuid4())[:8]
    user_dir = os.path.join(USERS_BASE_DIR, f"{req.agent_name}_{user_id}")
    os.makedirs(user_dir, exist_ok=True)

    def run_isolated_cmd(args):
        custom_env = os.environ.copy()
        custom_env["OPENCLAW_DIR"] = user_dir
        return subprocess.run(["openclaw"] + args, env=custom_env, capture_output=True, text=True)

    # 自动化指令流
    run_isolated_cmd(["config", "set", "channels.feishu.appId", req.feishu_app_id])
    run_isolated_cmd(["config", "set", "channels.feishu.appSecret", req.feishu_app_secret])
    run_isolated_cmd(["config", "set", "channels.feishu.enabled", "true"])
    run_isolated_cmd(["config", "set", "channels.feishu.connectionMode", "websocket"])
    run_isolated_cmd(["config", "set", "agents.defaults.model", "google/gemini-3-flash-preview"])
    
    # 异步启动网关
    subprocess.Popen(
        ["openclaw", "gateway", "start"],
        env={"OPENCLAW_DIR": user_dir, **os.environ}
    )

    cursor.execute("UPDATE codes SET is_used = 1, used_by_agent = ?, app_id = ? WHERE code = ?", 
                  (req.agent_name, req.feishu_app_id, req.invite_code))
    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message": "Deployment successful",
        "agent_name": req.agent_name
    }

@app.post("/api/test-connection")
async def test_connection(req: dict):
    # 模拟发送测试消息的接口
    # 在生产环境下，这里会通过 API 向用户的 Feishu Bot 发送一条心跳
    return {"status": "success", "message": "已检测到长连接信号 (模拟)！请查看飞书。"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
