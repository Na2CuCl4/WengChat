<div align="center">

# ![WengChat](docs/images/icon.svg) WengChat

[English](./README.md) / 简体中文 / [日本語](./README_JA.md) / [한국어](./README_KO.md)

✨ 轻量、快速的 AI 助手，支持 Claude, DeepSeek, GPT & Gemini Pro。

[<img src="https://vercel.com/button" alt="Deploy on Vercel" height="30">](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNa2CuCl4%2FWengChat&env=OPENAI_API_KEY&env=CODE&project-name=wengchat&repository-name=WengChat) [<img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in Gitpod" height="30">](https://gitpod.io/#https://github.com/Na2CuCl4/WengChat)

</div>

## 截图

![Settings](./docs/images/settings.png)

![More](./docs/images/more.png)

![主界面](./docs/images/cover.png)

## 功能特性

- **一键免费部署**：在 Vercel 上 1 分钟内完成部署
- **轻量客户端**：Linux/Windows/MacOS 上约 5MB，[立即下载](https://github.com/Na2CuCl4/WengChat/releases)
- **自部署模型兼容**：完全兼容自部署 LLM，推荐配合 [RWKV-Runner](https://github.com/josStorer/RWKV-Runner) 或 [LocalAI](https://github.com/go-skynet/LocalAI)
- **隐私优先**：所有数据存储在浏览器本地
- **Markdown 支持**：LaTeX、Mermaid、代码高亮等
- **响应式设计**：支持暗黑模式和 PWA
- **快速加载**：首屏 ~100kb，支持流式响应
- **提示词模板 (Mask)**：创建、分享和调试你的对话工具
- **精选提示词**：内置 [awesome-chatgpt-prompts-zh](https://github.com/PlexPt/awesome-chatgpt-prompts-zh) 和 [awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts)
- **自动压缩**：自动压缩聊天记录，支持长对话同时节省 Token
- **多语言**：English, 简体中文, 繁体中文, 日本語, Français, Español, Italiano, Türkçe, Deutsch, Tiếng Việt, Русский, Čeština, 한국어, Indonesia
- **文件上传**：支持上传图片、文档等文件供模型处理
- **图像生成**：支持 GPT-Image 模型的文生图和图生图
- **OpenAI Responses 格式**：支持 `/v1/responses` 和 GPT-5 系列参数 `reasoning_effort`、`response_format`、`verbosity`
- **文件转换**：内置文件转换页面，支持 MarkItDown 和 MinerU 双引擎批量处理
- **MCP 支持**：Model Context Protocol 集成（通过 `ENABLE_MCP=true` 启用）
- **自动更新**：自动检测并提示更新

## 更新日志

- **v2.19.2**：将本 Fork 的发行标识更名为 WengChat，继续兼容 NextChat 生态
- **v2.19.1**：修复"全部清除"按钮未重置转换日志、修复转换失败时无限重试循环、下载全部改为 zip 打包提取，更新 MinerU 引擎至最新 API（解析后端名称、OCR 语言、解析精度设置）
- **v2.19.0**：文件转换页面（MarkItDown & MinerU 引擎），Docker Compose profiles（readfile, mineru），docker-build.sh 构建脚本
- **v2.18.0**：OpenAI Responses 格式 `/v1/responses`，GPT-5 系列模型参数 `reasoning_effort` / `response_format` / `verbosity`，图生图，上传数量扩至 15 张
- **v2.17.0**：自定义对话摘要模型，GPT-Image 文生图，修复切换页面多次同步问题
- **v2.16.2**：文件上传支持，自动更新检测，多语言改进，服务端响应超时延长至 10 分钟
- **v2.15.8**：支持 Realtime Chat [#5672](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/issues/5672)
- **v2.15.4**：Tauri 拉取 LLM API，更安全 [#5379](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/issues/5379)
- **v2.15.0**：支持插件！[NextChat-Awesome-Plugins](https://github.com/ChatGPTNextWeb/NextChat-Awesome-Plugins)
- **v2.14.0**：支持 Artifacts & Stable Diffusion
- **v2.10.1**：支持 Google Gemini Pro 模型
- **v2.9.11**：支持 Azure 端点
- **v2.8**：跨平台桌面客户端
- **v2.7**：对话分享为图片或 ShareGPT
- **v2.0**：提示词模板 — 将你的想法变为现实

## 路线图

- [x] **系统提示词**：将用户自定义提示词固定为系统提示词 [#138](https://github.com/Yidadaa/ChatGPT-Next-Web/issues/138)
- [x] **用户提示词**：用户可编辑和保存自定义提示词
- [x] **提示词模板**：使用预定义上下文提示词创建新对话 [#993](https://github.com/Yidadaa/ChatGPT-Next-Web/issues/993)
- [x] **分享**：分享为图片或 ShareGPT [#1741](https://github.com/Yidadaa/ChatGPT-Next-Web/pull/1741)
- [x] **桌面应用**：Tauri 构建的跨平台客户端
- [x] **自托管模型**：兼容 [RWKV-Runner](https://github.com/josStorer/RWKV-Runner) 和 [LocalAI](https://github.com/go-skynet/LocalAI)
- [x] **Artifacts**：通过独立窗口预览、复制和分享生成内容 [#5092](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/pull/5092)
- [x] **插件**：网络搜索、计算器、自定义 API [#165](https://github.com/Yidadaa/ChatGPT-Next-Web/issues/165) [#5353](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/issues/5353)
- [x] **Realtime Chat**：WebSocket 实时对话 [#5672](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/issues/5672)
- [x] **文件上传**：对话中上传和处理文件
- [x] **图像生成**：GPT-Image 模型的文生图和图生图
- [x] **OpenAI Responses 格式**：`/v1/responses` 及 GPT-5 系列参数
- [x] **自定义摘要模型**：为对话摘要配置专用模型
- [x] **文件转换**：MarkItDown 和 MinerU 引擎批量转换
- [x] **Docker Compose Profiles**：可选服务部署（readfile, mineru）

## 开始使用

1. 准备 [OpenAI API Key](https://platform.openai.com/account/api-keys)；
2. 点击 [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNa2CuCl4%2FWengChat&env=OPENAI_API_KEY&env=CODE&project-name=wengchat&repository-name=WengChat)，设置 `CODE` 为页面访问密码；
3. 开始使用 :)

## 部署

### Docker Compose（推荐）

```shell
# 克隆仓库
git clone https://github.com/Na2CuCl4/WengChat.git
cd WengChat

# 创建 .env 配置文件
cp .env.template .env
# 编辑 .env 填入 API Key 和配置

# 启动主服务
docker compose up -d

# 或启动可选服务：
docker compose --profile readfile up -d                   # 文件读取服务
docker compose --profile mineru up -d                     # MinerU API 服务
docker compose --profile readfile --profile mineru up -d  # 两者同时
```

### Docker

```shell
docker pull na2cucl4/wengchat:latest

docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=页面访问密码 \
   na2cucl4/wengchat:latest
```

使用代理：

```shell
docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=页面访问密码 \
   -e PROXY_URL=http://localhost:7890 \
   na2cucl4/wengchat:latest
```

代理需要密码：

```shell
-e PROXY_URL="http://127.0.0.1:7890 user password"
```

启用 MCP：

```shell
docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=页面访问密码 \
   -e ENABLE_MCP=true \
   na2cucl4/wengchat:latest
```

### Shell

```shell
bash <(curl -s https://raw.githubusercontent.com/Na2CuCl4/WengChat/main/scripts/setup.sh)
```

## 保持更新

如果通过 Vercel 一键部署，可能会持续提示"存在更新"，因为 Vercel 默认创建新项目而非 fork，导致无法正确检测更新。

推荐按以下步骤重新部署：

- 删除原仓库；
- 使用页面右上角 fork 按钮 fork 本项目；
- 在 Vercel 重新部署，[查看详细教程](./docs/vercel-cn.md)。

### 开启自动更新

> 如 Upstream Sync 执行失败，请[手动同步代码](#手动更新代码)。

Fork 后需在 Actions 页面手动启用 Workflows 和 Upstream Sync Action，启用后每小时自动更新：

![自动更新](./docs/images/enable-actions.jpg)

![启用自动更新](./docs/images/enable-actions-sync.jpg)

### 手动更新代码

如需立即更新，参考 [GitHub 文档](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)。

可 star/watch 本项目或关注作者获取更新通知。

## 开发

NodeJS ≥ 18, Docker ≥ 20

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Na2CuCl4/WengChat)

在项目根目录创建 `.env` 文件：

```shell
OPENAI_API_KEY=<your api key here>

# 中国大陆用户可使用代理
BASE_URL=https://b.nextweb.fun/api/proxy
```

### 本地开发

```shell
# 1. 安装 nodejs 18 和 yarn
# 2. 在 .env 中配置环境变量
# 3. 运行
yarn install
yarn dev
```

## 环境变量

### 核心

#### `OPENAI_API_KEY`（必填）

OpenAI API 密钥，多个 key 用英文逗号分隔实现负载均衡。

#### `CODE`（可选）

访问密码，多个密码用英文逗号分隔。

#### `BASE_URL`（可选）

> 默认：`https://api.openai.com`
> 示例：`http://your-openai-proxy.com`

OpenAI API 代理地址。

#### `OPENAI_ORG_ID`（可选）

指定 OpenAI 组织 ID。

#### `PROXY_URL`（可选）

HTTP 代理（Docker 专用）。

> 示例：`http://localhost:7890`
> 带认证：`http://127.0.0.1:7890 user password`

---

### 服务商配置

大多数服务商遵循 `{PROVIDER}_API_KEY`（必填）和 `{PROVIDER}_URL`（可选，覆盖默认端点）的模式。

#### Azure OpenAI

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `AZURE_API_KEY` | 是 | Azure API Key |
| `AZURE_URL` | 是 | Azure 端点 URL，如 `https://{resource-url}/openai` |
| `AZURE_API_VERSION` | 否 | Azure API 版本，见 [Azure 文档](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#chat-completions) |

#### Google Gemini

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `GOOGLE_API_KEY` | 是 | Google Gemini API Key |
| `GOOGLE_URL` | 否 | 覆盖 Google API URL |

#### Anthropic Claude

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | 是 | Anthropic API Key |
| `ANTHROPIC_URL` | 否 | 覆盖 Anthropic API URL |
| `ANTHROPIC_API_VERSION` | 否 | 覆盖 Anthropic API 版本 |

#### Baidu

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `BAIDU_API_KEY` | 是 | 百度 API Key |
| `BAIDU_SECRET_KEY` | 是 | 百度 Secret Key |
| `BAIDU_URL` | 否 | 覆盖百度 API URL |

#### ByteDance

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `BYTEDANCE_API_KEY` | 是 | 字节跳动 API Key |
| `BYTEDANCE_URL` | 否 | 覆盖字节跳动 API URL |

#### Alibaba

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `ALIBABA_API_KEY` | 是 | 阿里云 API Key |
| `ALIBABA_URL` | 否 | 覆盖阿里云 API URL |

#### Tencent

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `TENCENT_API_KEY` | 是 | 腾讯混元 API Key |
| `TENCENT_SECRET_ID` | 是 | 腾讯 Secret ID |
| `TENCENT_SECRET_KEY` | 是 | 腾讯 Secret Key |
| `TENCENT_URL` | 否 | 覆盖腾讯 API URL |

#### Moonshot

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `MOONSHOT_API_KEY` | 是 | Moonshot API Key |
| `MOONSHOT_URL` | 否 | 覆盖 Moonshot API URL |

#### iFlytek

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `IFLYTEK_API_KEY` | 是 | 讯飞星火 API Key |
| `IFLYTEK_API_SECRET` | 是 | 讯飞星火 API Secret |
| `IFLYTEK_URL` | 否 | 覆盖讯飞星火 API URL |

#### ChatGLM

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `CHATGLM_API_KEY` | 是 | ChatGLM API Key |
| `CHATGLM_URL` | 否 | 覆盖 ChatGLM API URL |

#### DeepSeek

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | 是 | DeepSeek API Key |
| `DEEPSEEK_URL` | 否 | 覆盖 DeepSeek API URL |

#### xAI

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `XAI_API_KEY` | 是 | xAI (Grok) API Key |
| `XAI_URL` | 否 | 覆盖 xAI API URL |

#### SiliconFlow

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `SILICONFLOW_API_KEY` | 是 | SiliconFlow API Key |
| `SILICONFLOW_URL` | 否 | 覆盖 SiliconFlow API URL |

#### 302.AI

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `AI302_API_KEY` | 是 | 302.AI API Key |
| `AI302_URL` | 否 | 覆盖 302.AI API URL |

#### Stability AI

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `STABILITY_API_KEY` | 是 | Stability AI API Key |
| `STABILITY_URL` | 否 | 覆盖 Stability API URL |

---

### 功能开关

#### `HIDE_USER_API_KEY`（可选）

> 默认：空

设为 `1` 禁止用户自行填入 API Key。

#### `DISABLE_GPT4`（可选）

> 默认：空

设为 `1` 隐藏 GPT-4 模型。

#### `ENABLE_BALANCE_QUERY`（可选）

> 默认：空

设为 `1` 允许用户查询余额。

#### `DISABLE_FAST_LINK`（可选）

> 默认：空

设为 `1` 禁止从 URL 解析设置。

#### `ENABLE_MCP`（可选）

> 默认：空

设为 `true` 启用 MCP（Model Context Protocol）功能。

---

### 模型配置

#### `CUSTOM_MODELS`（可选）

> 默认：空
> 示例：`+llama,+claude-2,-gpt-3.5-turbo,gpt-4-1106-preview=gpt-4-turbo`

控制模型列表：
- `+模型名` — 添加模型
- `-模型名` — 隐藏模型
- `模型名=显示名` — 自定义显示名称
- `-all` — 禁用所有默认模型
- `+all` — 启用所有默认模型

Azure 模式：`modelName@Azure=deploymentName`
> 示例：`+gpt-3.5-turbo@Azure=gpt35` 显示 `gpt35(Azure)`

ByteDance 模式：`modelName@bytedance=deploymentName`
> 示例：`+Doubao-lite-4k@bytedance=ep-xxxxx-xxx`

#### `DEFAULT_MODEL`（可选）

设置默认模型。

#### `VISION_MODELS`（可选）

> 默认：空（自动检测模型名称模式）
> 示例：`gpt-4-vision,claude-3-opus,my-custom-model`

额外指定具备视觉能力的模型，多个用逗号分隔。

#### `DEFAULT_INPUT_TEMPLATE`（可选）

自定义"设置"中的"用户输入预处理"默认模板。

---

### 服务端点

#### `FILE_READING_SERVER`（可选）

> 示例：`http://nextchat-readfile:8000`

文件读取 sidecar 服务地址（用于解析上传的文档）。

#### `MINERU_SERVER`（可选）

> 示例：`http://mineru-api:8000`

MinerU API 服务地址（用于 PDF/图片转换）。

---

### 同步与存储

#### `WHITE_WEBDAV_ENDPOINTS`（可选）

增加允许的 WebDAV 服务地址。格式：
- 每个地址必须是完整端点，如 `https://xxxx/yyy`
- 多个地址用 `,` 分隔

#### Cloudflare KV 同步（可选）

| 变量 | 说明 |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID |
| `CLOUDFLARE_KV_NAMESPACE_ID` | KV 命名空间 ID |
| `CLOUDFLARE_KV_API_KEY` | KV API Key |
| `CLOUDFLARE_KV_TTL` | KV 条目 TTL（秒） |

---

### 数据分析（可选）

| 变量 | 说明 |
| --- | --- |
| `GTM_ID` | Google Tag Manager 容器 ID |
| `GA_ID` | Google Analytics 测量 ID |

## 同步与备份

[简体中文](./docs/synchronise-chat-logs-cn.md) | [English](./docs/synchronise-chat-logs-en.md) | [Italiano](./docs/synchronise-chat-logs-es.md) | [日本語](./docs/synchronise-chat-logs-ja.md) | [한국어](./docs/synchronise-chat-logs-ko.md)

## 文档

- [常见问题](./docs/faq-cn.md)
- [如何添加新翻译](./docs/translation.md)
- [Vercel 使用教程](./docs/vercel-cn.md)
- [用户手册（WIP）](./docs/user-manual-cn.md)

## 翻译

想要添加新语言？参考[此文档](./docs/translation.md)。

## 鸣谢

### 贡献者

<a href="https://github.com/Na2CuCl4/WengChat/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Na2CuCl4/WengChat" />
</a>

## 开源协议

[MIT](https://opensource.org/license/mit/)
