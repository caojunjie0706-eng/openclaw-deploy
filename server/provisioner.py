from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import os
import json

app = FastAPI()

# 允许跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class DeploymentRequest(BaseModel):
    user_id: str
    app_id: str
    app_secret: str
    agent_name: str

# 基础端口，新用户将从 3001 开始分配
BASE_PORT = 3000

def get_next_port():
    # 逻辑：检查 data/ 目录下已有的容器数来分配端口
    if not os.path.exists("data"):
        return BASE_PORT + 1
    users = [d for d in os.listdir("data") if os.path.isdir(os.path.join("data", d))]
    return BASE_PORT + len(users) + 1

@app.post("/deploy")
async def deploy_agent(req: DeploymentRequest):
    port = get_next_port()
    
    # 1. 调用 spawn-agent.sh 启动隔离容器
    try:
        subprocess.run(["bash", "docker/spawn-agent.sh", req.user_id, str(port)], check=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Container failed: {str(e)}")

    # 2. 注入飞书配置到该容器的独立 config 目录
    config_path = f"data/{req.user_id}/config/config.json"
    os.makedirs(os.path.dirname(config_path), exist_ok=True)
    
    feishu_config = {
        "channels": {
            "feishu": {
                "appId": req.app_id,
                "appSecret": req.app_secret
            }
        },
        "agents": [
            {
                "identity": {"name": req.agent_name},
                "model": "gemini-flash"
            }
        ]
    }
    
    with open(config_path, "w") as f:
        json.dump(feishu_config, f, indent=2)

    return {
        "status": "success",
        "message": f"Agent {req.agent_name} deployed!",
        "port": port,
        "user_id": req.user_id
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
