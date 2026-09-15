<div align="center">

# ![WengChat](docs/images/icon.svg) WengChat

English / [简体中文](./README_CN.md) / [日本語](./README_JA.md) / [한국어](./README_KO.md)

✨ Light and Fast AI Assistant, with Claude, DeepSeek, GPT & Gemini Pro support.

[<img src="https://vercel.com/button" alt="Deploy on Vercel" height="30">](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNa2CuCl4%2FWengChat&env=OPENAI_API_KEY&env=CODE&project-name=wengchat&repository-name=WengChat) [<img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in Gitpod" height="30">](https://gitpod.io/#https://github.com/Na2CuCl4/WengChat)

</div>

## Screenshots

![Settings](./docs/images/settings.png)

![More](./docs/images/more.png)

![Main](./docs/images/cover.png)

## Features

- **Deploy for Free**: One-click deploy on Vercel in under 1 minute
- **Compact Client**: ~5MB on Linux/Windows/MacOS, [download now](https://github.com/Na2CuCl4/WengChat/releases)
- **Self-Hosted Compatible**: Fully compatible with self-deployed LLMs, recommended with [RWKV-Runner](https://github.com/josStorer/RWKV-Runner) or [LocalAI](https://github.com/go-skynet/LocalAI)
- **Privacy First**: All data stored locally in the browser
- **Markdown Support**: LaTeX, mermaid, code highlight, and more
- **Responsive Design**: Dark mode and PWA support
- **Fast Loading**: ~100kb first screen, streaming response
- **Prompt Templates (Mask)**: Create, share and debug your chat tools
- **Awesome Prompts**: Powered by [awesome-chatgpt-prompts-zh](https://github.com/PlexPt/awesome-chatgpt-prompts-zh) and [awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts)
- **Auto Compression**: Automatically compresses chat history for long conversations while saving tokens
- **I18n**: English, 简体中文, 繁体中文, 日本語, Français, Español, Italiano, Türkçe, Deutsch, Tiếng Việt, Русский, Čeština, 한국어, Indonesia
- **File Upload**: Upload images, documents, and other files for the model to process
- **Image Generation**: Support for text-to-image and image-to-image generation with GPT-Image models
- **OpenAI Responses Format**: Support for `/v1/responses` and GPT-5 series with `reasoning_effort`, `response_format`, `verbosity`
- **File Conversion**: MarkItDown and MinerU engines with batch processing and download
- **MCP Support**: Disabled by default; requires an access code and operator-managed local configuration
- **Auto Update**: Automatic update detection and notification

## What's New

- **v2.19.2**: Renamed this fork to WengChat while retaining NextChat ecosystem compatibility
- **v2.19.1**: Fixed Clear All button not resetting conversion log, fixed infinite retry loop on conversion failure, DownloadAll now packages as zip with extraction, updated MinerU engine to latest API (backend names, OCR languages, parse effort setting)
- **v2.19.0**: File Conversion page with MarkItDown & MinerU engines, Docker Compose profiles
- **v2.18.0**: OpenAI Responses format `/v1/responses`, GPT-5 series models with `reasoning_effort` / `response_format` / `verbosity`, image-to-image generation
- **v2.17.0**: Custom conversation summary model, GPT-Image family text-to-image generation
- **v2.16.2**: File upload support, auto update detection, multi-language improvements
- **v2.15.8**: Realtime Chat [#5672](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/issues/5672)
- **v2.15.4**: Tauri fetch LLM API for enhanced security [#5379](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/issues/5379)
- **v2.15.0**: Plugins! [NextChat-Awesome-Plugins](https://github.com/ChatGPTNextWeb/NextChat-Awesome-Plugins)
- **v2.14.0**: Artifacts & Stable Diffusion
- **v2.10.1**: Google Gemini Pro model support
- **v2.9.11**: Azure endpoint support
- **v2.8**: Cross-platform desktop client
- **v2.7**: Share conversations as image, or share to ShareGPT
- **v2.0**: Prompt templates — turn your ideas into reality

## Roadmap

- [x] **System Prompt**: Pin a user defined prompt as system prompt [#138](https://github.com/Yidadaa/ChatGPT-Next-Web/issues/138)
- [x] **User Prompt**: User can edit and save custom prompts to prompt list
- [x] **Prompt Template**: Create a new chat with pre-defined in-context prompts [#993](https://github.com/Yidadaa/ChatGPT-Next-Web/issues/993)
- [x] **Share**: Share as image or to ShareGPT [#1741](https://github.com/Yidadaa/ChatGPT-Next-Web/pull/1741)
- [x] **Desktop App**: Cross-platform client built with Tauri
- [x] **Self-host Model**: Compatible with [RWKV-Runner](https://github.com/josStorer/RWKV-Runner) and [LocalAI](https://github.com/go-skynet/LocalAI): llama/gpt4all/rwkv/vicuna/koala/gpt4all-j/cerebras/falcon/dolly etc.
- [x] **Artifacts**: Preview, copy and share generated content through a separate window [#5092](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/pull/5092)
- [x] **Plugins**: Network search, calculator, custom APIs [#165](https://github.com/Yidadaa/ChatGPT-Next-Web/issues/165) [#5353](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/issues/5353)
- [x] **Realtime Chat**: WebSocket-based real-time conversation [#5672](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/issues/5672)
- [x] **File Upload**: Upload and process files in conversations
- [x] **Image Generation**: Support for text-to-image and image-to-image with GPT-Image models
- [x] **OpenAI Responses Format**: Support for `/v1/responses` with GPT-5 series model parameters
- [x] **Custom Summary Model**: Dedicated model for conversation summarization
- [x] **File Conversion**: MarkItDown and MinerU engines with batch conversion
- [x] **Docker Compose Profiles**: Optional service deployment (readfile, mineru)

## Get Started

1. Get [OpenAI API Key](https://platform.openai.com/account/api-keys);
2. Click [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNa2CuCl4%2FWengChat&env=OPENAI_API_KEY&env=CODE&project-name=wengchat&repository-name=WengChat), set `CODE` as your page password;
3. Enjoy :)

## Deployment

### Docker Compose (Recommended)

```shell
# Clone the repository
git clone https://github.com/Na2CuCl4/WengChat.git
cd WengChat

# Create .env file with your configuration
cp .env.template .env
# Edit .env with your API keys and settings

# Start the main service
docker compose up -d

# Or start with optional services:
docker compose --profile readfile up -d                   # with file reading service
docker compose --profile mineru up -d                     # with MinerU API service
docker compose --profile readfile --profile mineru up -d  # with both
```

### Docker

```shell
docker pull na2cucl4/wengchat:latest

docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=your-password \
   na2cucl4/wengchat:latest
```

Start behind a proxy:

```shell
docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=your-password \
   -e PROXY_URL=http://localhost:7890 \
   na2cucl4/wengchat:latest
```

If your proxy needs password:

```shell
-e PROXY_URL="http://127.0.0.1:7890 user pass"
```

Enable MCP:

```shell
docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=your-password \
   -e ENABLE_MCP=true \
   na2cucl4/wengchat:latest
```

### Shell

```shell
bash <(curl -s https://raw.githubusercontent.com/Na2CuCl4/WengChat/main/scripts/setup.sh)
```

## Keep Updated

If you deployed via Vercel one-click, you may encounter constant "Updates Available" notifications because Vercel creates a new project instead of forking, preventing correct update detection.

We recommend re-deploying as follows:

- Delete the original repository;
- Use the fork button in the upper right corner of the page to fork this project;
- Choose and deploy in Vercel again, [see detailed tutorial](./docs/vercel-cn.md).

### Enable Automatic Updates

> If Upstream Sync fails, please [manually update code](#manually-updating-code).

After forking, manually enable Workflows and Upstream Sync Action on the Actions page. Once enabled, automatic updates run every hour:

![Automatic Updates](./docs/images/enable-actions.jpg)

![Enable Automatic Updates](./docs/images/enable-actions-sync.jpg)

### Manually Updating Code

To update instantly, see [GitHub docs on syncing a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork).

Star or watch this project to get release notifications in time.

## Development

NodeJS ≥ 18, Docker ≥ 20

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Na2CuCl4/WengChat)

Create a `.env` file at project root with your API key:

```shell
OPENAI_API_KEY=<your api key here>

# if you cannot access OpenAI directly, use a proxy BASE_URL
BASE_URL=https://chatgpt1.nextweb.fun/api/proxy
```

### Local Development

```shell
# 1. install nodejs and yarn first
# 2. config local env vars in `.env`
# 3. run
yarn install
yarn dev
```

## Environment Variables

### Core

#### `OPENAI_API_KEY` (required)

Your OpenAI API key. Join multiple keys with comma for load balancing.

#### `CODE` (optional)

Access password, separated by comma. When set, users must enter a password to access the app.

#### `BASE_URL` (optional)

> Default: `https://api.openai.com`
> Example: `http://your-openai-proxy.com`

Override the OpenAI API request base URL.

#### `OPENAI_ORG_ID` (optional)

Specify the OpenAI organization ID.

#### `PROXY_URL` (optional)

HTTP proxy for outgoing requests (Docker only).

> Example: `http://localhost:7890`
> With auth: `http://127.0.0.1:7890 user password`

---

### Provider-Specific

Most providers follow the pattern `{PROVIDER}_API_KEY` (required) and `{PROVIDER}_URL` (optional, overrides the default endpoint).

#### Azure OpenAI

| Variable | Required | Description |
| --- | --- | --- |
| `AZURE_API_KEY` | Yes | Azure API Key |
| `AZURE_URL` | Yes | Azure endpoint URL, e.g. `https://{resource-url}/openai` |
| `AZURE_API_VERSION` | No | Azure API version. See [Azure docs](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#chat-completions) |

#### Google Gemini

| Variable | Required | Description |
| --- | --- | --- |
| `GOOGLE_API_KEY` | Yes | Google Gemini API Key |
| `GOOGLE_URL` | No | Override Google API URL |

#### Anthropic Claude

| Variable | Required | Description |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Yes | Anthropic API Key |
| `ANTHROPIC_URL` | No | Override Anthropic API URL |
| `ANTHROPIC_API_VERSION` | No | Override Anthropic API version |

#### Baidu

| Variable | Required | Description |
| --- | --- | --- |
| `BAIDU_API_KEY` | Yes | Baidu API Key |
| `BAIDU_SECRET_KEY` | Yes | Baidu Secret Key |
| `BAIDU_URL` | No | Override Baidu API URL |

#### ByteDance

| Variable | Required | Description |
| --- | --- | --- |
| `BYTEDANCE_API_KEY` | Yes | ByteDance API Key |
| `BYTEDANCE_URL` | No | Override ByteDance API URL |

#### Alibaba

| Variable | Required | Description |
| --- | --- | --- |
| `ALIBABA_API_KEY` | Yes | Alibaba Cloud API Key |
| `ALIBABA_URL` | No | Override Alibaba API URL |

#### Tencent

| Variable | Required | Description |
| --- | --- | --- |
| `TENCENT_API_KEY` | Yes | Tencent Hunyuan API Key |
| `TENCENT_SECRET_ID` | Yes | Tencent Secret ID |
| `TENCENT_SECRET_KEY` | Yes | Tencent Secret Key |
| `TENCENT_URL` | No | Override Tencent API URL |

#### Moonshot

| Variable | Required | Description |
| --- | --- | --- |
| `MOONSHOT_API_KEY` | Yes | Moonshot API Key |
| `MOONSHOT_URL` | No | Override Moonshot API URL |

#### iFlytek

| Variable | Required | Description |
| --- | --- | --- |
| `IFLYTEK_API_KEY` | Yes | iFlytek API Key |
| `IFLYTEK_API_SECRET` | Yes | iFlytek API Secret |
| `IFLYTEK_URL` | No | Override iFlytek API URL |

#### ChatGLM

| Variable | Required | Description |
| --- | --- | --- |
| `CHATGLM_API_KEY` | Yes | ChatGLM API Key |
| `CHATGLM_URL` | No | Override ChatGLM API URL |

#### DeepSeek

| Variable | Required | Description |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | Yes | DeepSeek API Key |
| `DEEPSEEK_URL` | No | Override DeepSeek API URL |

#### xAI

| Variable | Required | Description |
| --- | --- | --- |
| `XAI_API_KEY` | Yes | xAI (Grok) API Key |
| `XAI_URL` | No | Override xAI API URL |

#### SiliconFlow

| Variable | Required | Description |
| --- | --- | --- |
| `SILICONFLOW_API_KEY` | Yes | SiliconFlow API Key |
| `SILICONFLOW_URL` | No | Override SiliconFlow API URL |

#### 302.AI

| Variable | Required | Description |
| --- | --- | --- |
| `AI302_API_KEY` | Yes | 302.AI API Key |
| `AI302_URL` | No | Override 302.AI API URL |

#### Stability AI

| Variable | Required | Description |
| --- | --- | --- |
| `STABILITY_API_KEY` | Yes | Stability AI API Key |
| `STABILITY_URL` | No | Override Stability API URL |

---

### Feature Flags

#### `HIDE_USER_API_KEY` (optional)

> Default: Empty

Set to `1` to prevent users from entering their own API key.

#### `DISABLE_GPT4` (optional)

> Default: Empty

Set to `1` to hide GPT-4 models from the model list.

#### `ENABLE_BALANCE_QUERY` (optional)

> Default: Empty

Set to `1` to allow users to query their API balance.

#### `DISABLE_FAST_LINK` (optional)

> Default: Empty

Set to `1` to disable parsing settings from URL parameters.

#### `ENABLE_MCP` (optional)

> Default: `false`

Set to `true` to enable the Model Context Protocol (MCP) feature. A non-empty
`CODE` is required. MCP servers must be defined by the operator in
`app/mcp/mcp_config.json`; the web UI and API cannot install servers or edit
their process definitions.
Treat that file as trusted code because its commands run on the server.
After a production build, run `yarn test:cve-2026-7644` for the local HTTP security regression.

---

### Model Configuration

#### `CUSTOM_MODELS` (optional)

> Default: Empty
> Example: `+llama,+claude-2,-gpt-3.5-turbo,gpt-4-1106-preview=gpt-4-turbo`

Control the model list:

- `+model` — add a custom model
- `-model` — hide a model
- `name=displayName` — customize the display name
- `-all` — disable all default models
- `+all` — enable all default models

For Azure: use `modelName@Azure=deploymentName`.
> Example: `+gpt-3.5-turbo@Azure=gpt35` shows `gpt35(Azure)` in the model list.

For ByteDance: use `modelName@bytedance=deploymentName`.
> Example: `+Doubao-lite-4k@bytedance=ep-xxxxx-xxx`

#### `DEFAULT_MODEL` (optional)

Set the default model for new conversations.

#### `VISION_MODELS` (optional)

> Default: Empty (auto-detected by model name patterns)
> Example: `gpt-4-vision,claude-3-opus,my-custom-model`

Add additional models with vision capabilities. Separate multiple models with commas.

#### `DEFAULT_INPUT_TEMPLATE` (optional)

Customize the default User Input Preprocessing template in Settings.

---

### Service Endpoints

#### `FILE_READING_SERVER` (optional)

> Example: `http://nextchat-readfile:8000`

URL of the file reading sidecar service (used to parse uploaded documents).

#### `MINERU_SERVER` (optional)

> Example: `http://mineru-api:8000`

URL of the MinerU API service (used for PDF/image conversion).

---

### Sync & Storage

#### `WHITE_WEBDAV_ENDPOINTS` (optional)

Allow additional WebDAV service addresses. Format:

- Each address must be a complete endpoint, e.g. `https://xxxx/yyy`
- Multiple addresses are separated by `,`

#### Cloudflare KV Sync (optional)

| Variable | Description |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID |
| `CLOUDFLARE_KV_NAMESPACE_ID` | KV Namespace ID |
| `CLOUDFLARE_KV_API_KEY` | KV API Key |
| `CLOUDFLARE_KV_TTL` | KV entry TTL in seconds |

---

### Analytics (optional)

| Variable | Description |
| --- | --- |
| `GTM_ID` | Google Tag Manager container ID |
| `GA_ID` | Google Analytics measurement ID |

## Sync & Backup

[简体中文](./docs/synchronise-chat-logs-cn.md) | [English](./docs/synchronise-chat-logs-en.md) | [Italiano](./docs/synchronise-chat-logs-es.md) | [日本語](./docs/synchronise-chat-logs-ja.md) | [한국어](./docs/synchronise-chat-logs-ko.md)

## Documentation

- [Frequently Asked Questions](./docs/faq-en.md) ([简体中文](./docs/faq-cn.md) · [Español](./docs/faq-es.md) · [日本語](./docs/faq-ja.md) · [한국어](./docs/faq-ko.md))
- [How to add a new translation](./docs/translation.md)
- [Deploy on Vercel](./docs/vercel-cn.md) ([Español](./docs/vercel-es.md) · [日本語](./docs/vercel-ja.md) · [한국어](./docs/vercel-ko.md))
- [User Manual (Chinese, WIP)](./docs/user-manual-cn.md)

## Translation

To add a new translation, read this [guide](./docs/translation.md).

## Special Thanks

### Contributors

<a href="https://github.com/Na2CuCl4/WengChat/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Na2CuCl4/WengChat" />
</a>

## LICENSE

[MIT](https://opensource.org/license/mit/)
