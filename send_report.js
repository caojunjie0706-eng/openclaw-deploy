const webhook = "https://open.feishu.cn/open-apis/bot/v2/hook/c52a552e-be1a-4bd8-90de-a35aceed5b12";

const report = {
    msg_type: "post",
    content: {
        post: {
            zh_cn: {
                title: "🚀 JJ 每日 AI 行业深度研究报告 (2026-03-03)",
                content: [
                    [ { tag: "text", text: "📅 报告时间：2026年3月3日 | 行业焦点：军事AI、大厂架构调整、Vibe Coding" } ],
                    [ { tag: "text", text: "------------------------------------------------" } ],
                    [ { tag: "text", text: "1. 🌐 X (Twitter) & 行业大咖动态", un_escape: true } ],
                    [ { tag: "text", text: "🔹 Sam Altman 更新 OpenAI 与五角大楼协议：Sam Altman 在 X 上确认 OpenAI 已与美国国防部达成新协议，允许在分类网络中部署模型，同时强调禁止国内大规模监控及确保武器系统的人为责任。此外，他还在为 Anthropic 被列为“供应链风险”一事发声抗议。" } ],
                    [ { tag: "text", text: "💡 行业影响（电商视角）：AI 算力的国家级竞争正在从基础设施转向法律与安全协议的角力。对于跨境电商，数据主权和合规性将成为未来 AI 工具集成的核心门槛。" } ],
                    [ { tag: "a", text: "🔗 原文链接 (The Verge 汇总)", href: "https://www.theverge.com/ai-artificial-intelligence" } ],

                    [ { tag: "text", text: "2. 🎥 YouTube & 深度解析" } ],
                    [ { tag: "text", text: "🔹 微软 Copilot 进军手持设备与游戏录制：微软在其 Xbox Insider PC 版及 Xbox Ally X 等掌机上推出了 AI 驱动的“赛后回顾 (Postgame Recaps)”功能。通过 NPU 实现自动剪辑精彩瞬间，标志着端侧 AI (On-device AI) 正在消费级硬件中深度渗透。" } ],
                    [ { tag: "text", text: "💡 行业影响（电商视角）：AI 自动剪辑技术在游戏领域的成熟，将迅速平移至电商短视频与直播，降低内容生产成本。" } ],
                    [ { tag: "a", text: "🔗 官方资讯链接", href: "https://news.xbox.com/en-us/2026/02/18/available-for-xbox-insiders-on-pc-postgame-recaps/" } ],

                    [ { tag: "text", text: "3. 🛍️ 电商与 AI 商业化" } ],
                    [ { tag: "text", text: "🔹 Amazon AGI 实验室高层变动：亚马逊旧金山 AGI 实验室负责人 David Luan 宣布离职。这暗示了科技巨头在 AGI 研发路径上的潜在调整或核心人才向初创企业的流动。" } ],
                    [ { tag: "text", text: "💡 行业影响（电商视角）：大厂 AGI 研发的阵痛可能意味着短期内更倾向于实用型 AI（如智能客服、选品插件）的落地。" } ],
                    [ { tag: "a", text: "🔗 相关报道", href: "https://www.theverge.com/tech/884372/amazon-agi-lab-leader-david-luan-departure" } ],

                    [ { tag: "text", text: "4. 💻 Vibe Coding & GitHub 推荐" } ],
                    [ { tag: "text", text: "🔥 当日最火项目：Easy-Vibe (Datawhale)" } ],
                    [ { tag: "text", text: "Datawhale 出品的“Vibe Coding 零基础教程”。涵盖了从产品原型到 AI 能力集成、前后端开发的全流程，强调感觉优先的编程范式。" } ],
                    [ { tag: "text", text: "💡 行业影响（电商视角）：Vibe Coding 降低了技术壁垒，有助于运营团队快速搭建内部效率工具。" } ],
                    [ { tag: "a", text: "🔗 GitHub 仓库地址", href: "https://github.com/datawhalechina/easy-vibe" } ],
                    [ { tag: "text", text: "------------------------------------------------" } ],
                    [ { tag: "text", text: "报告由 JARVIS 自动生成" } ]
                ]
            }
        }
    }
};

fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report)
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data)))
.catch(err => console.error(err));
