<div align="center">

# ![WengChat](docs/images/icon.svg) WengChat

[English](./README.md) / [简体中文](./README_CN.md) / 日本語 / [한국어](./README_KO.md)

✨ 軽量で高速なAIアシスタント、Claude, DeepSeek, GPT & Gemini Pro 対応。

[<img src="https://vercel.com/button" alt="Deploy on Vercel" height="30">](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNa2CuCl4%2FWengChat&env=OPENAI_API_KEY&env=CODE&project-name=wengchat&repository-name=WengChat) [<img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in Gitpod" height="30">](https://gitpod.io/#https://github.com/Na2CuCl4/WengChat)

</div>

## スクリーンショット

![Settings](./docs/images/settings.png)

![More](./docs/images/more.png)

![メイン画面](./docs/images/cover.png)

## 機能

- **無料デプロイ**：Vercelで1分以内にワンクリックデプロイ
- **軽量クライアント**：Linux/Windows/MacOSで約5MB、[今すぐダウンロード](https://github.com/Na2CuCl4/WengChat/releases)
- **セルフホストLLM対応**：[RWKV-Runner](https://github.com/josStorer/RWKV-Runner)や[LocalAI](https://github.com/go-skynet/LocalAI)と完全互換
- **プライバシー優先**：全データをブラウザのローカルに保存
- **Markdown対応**：LaTeX、Mermaid、コードハイライト等
- **レスポンシブデザイン**：ダークモードとPWA対応
- **高速読み込み**：初回画面約100kb、ストリーミング応答
- **プロンプトテンプレート (Mask)**：チャットツールの作成・共有・デバッグ
- **高品質プロンプト**：[awesome-chatgpt-prompts-zh](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)と[awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts)を内蔵
- **自動圧縮**：長文会話を自動圧縮しトークンを節約
- **多言語**：English, 简体中文, 繁体中文, 日本語, Français, Español, Italiano, Türkçe, Deutsch, Tiếng Việt, Русский, Čeština, 한국어, Indonesia
- **ファイルアップロード**：画像、ドキュメント等をアップロードしてモデルに処理
- **画像生成**：GPT-Imageモデルによるtext-to-imageとimage-to-image生成
- **OpenAI Responses形式**：`/v1/responses`とGPT-5シリーズの`reasoning_effort`、`response_format`、`verbosity`対応
- **ファイル変換**：MarkItDownとMinerUエンジンによるバッチ変換ページを内蔵
- **MCP対応**：Model Context Protocol統合（`ENABLE_MCP=true`で有効化）
- **自動更新**：更新を自動検出して通知

## 更新情報

- **v2.19.2**：本 Fork の配布名を WengChat に変更し、NextChat エコシステムとの互換性を維持
- **v2.19.1**：「すべてクリア」ボタンで変換ログがリセットされない問題を修正、変換失敗時の無限リトライループを修正、一括ダウンロードをzipパッケージ抽出に変更、MinerUエンジンを最新APIに対応（バックエンド名、OCR言語、解析精度設定）
- **v2.19.0**：ファイル変換ページ（MarkItDown & MinerUエンジン）、Docker Compose profiles（readfile, mineru）、docker-build.shスクリプト
- **v2.18.0**：OpenAI Responses形式`/v1/responses`、GPT-5シリーズ`reasoning_effort` / `response_format` / `verbosity`、image-to-image生成、アップロード上限15枚に拡大
- **v2.17.0**：カスタム要約モデル、GPT-Imageファミリーtext-to-image生成、タブ切替時の複数同期問題を修正
- **v2.16.2**：ファイルアップロード対応、自動更新検出、多言語改善、サーバー応答タイムアウト10分に延長
- **v2.15.8**：リアルタイムチャット対応 [#5672](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/issues/5672)
- **v2.15.4**：TauriでLLM API取得、セキュリティ向上 [#5379](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/issues/5379)
- **v2.15.0**：プラグイン対応！[NextChat-Awesome-Plugins](https://github.com/ChatGPTNextWeb/NextChat-Awesome-Plugins)
- **v2.14.0**：Artifacts & Stable Diffusion対応
- **v2.10.1**：Google Gemini Proモデル対応
- **v2.9.11**：Azureエンドポイント対応
- **v2.8**：クロスプラットフォームデスクトップクライアント
- **v2.7**：会話を画像またはShareGPTで共有
- **v2.0**：プロンプトテンプレート — アイデアを現実に

## ロードマップ

- [x] **システムプロンプト**：ユーザー定義プロンプトをシステムプロンプトとして固定 [#138](https://github.com/Yidadaa/ChatGPT-Next-Web/issues/138)
- [x] **ユーザープロンプト**：カスタムプロンプトの編集・保存
- [x] **プロンプトテンプレート**：定義済みコンテキストで新規チャット作成 [#993](https://github.com/Yidadaa/ChatGPT-Next-Web/issues/993)
- [x] **共有**：画像またはShareGPTで共有 [#1741](https://github.com/Yidadaa/ChatGPT-Next-Web/pull/1741)
- [x] **デスクトップアプリ**：Tauriで構築されたクロスプラットフォームクライアント
- [x] **セルフホストモデル**：[RWKV-Runner](https://github.com/josStorer/RWKV-Runner)と[LocalAI](https://github.com/go-skynet/LocalAI)に対応
- [x] **Artifacts**：生成コンテンツを別ウィンドウでプレビュー・コピー・共有 [#5092](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/pull/5092)
- [x] **プラグイン**：ウェブ検索、計算機、カスタムAPI [#165](https://github.com/Yidadaa/ChatGPT-Next-Web/issues/165) [#5353](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/issues/5353)
- [x] **リアルタイムチャット**：WebSocketベースのリアルタイム会話 [#5672](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/issues/5672)
- [x] **ファイルアップロード**：会話内でファイルのアップロードと処理
- [x] **画像生成**：GPT-Imageモデルによるtext-to-imageとimage-to-image
- [x] **OpenAI Responses形式**：`/v1/responses`とGPT-5シリーズパラメータ対応
- [x] **カスタム要約モデル**：会話要約用の専用モデル設定
- [x] **ファイル変換**：MarkItDownとMinerUエンジンによるバッチ変換
- [x] **Docker Compose Profiles**：オプションサービスデプロイ（readfile, mineru）

## はじめに

1. [OpenAI API Key](https://platform.openai.com/account/api-keys)を準備；
2. [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNa2CuCl4%2FWengChat&env=OPENAI_API_KEY&env=CODE&project-name=wengchat&repository-name=WengChat)をクリック、`CODE`をページパスワードに設定；
3. お楽しみください :)

## デプロイ

### Docker Compose（推奨）

```shell
# リポジトリをクローン
git clone https://github.com/Na2CuCl4/WengChat.git
cd WengChat

# .envファイルを作成して設定
cp .env.template .env
# .envを編集してAPIキーと設定を記入

# メインサービスを起動
docker compose up -d

# オプションサービスも起動する場合：
docker compose --profile readfile up -d                   # ファイル読み取りサービス
docker compose --profile mineru up -d                     # MinerU APIサービス
docker compose --profile readfile --profile mineru up -d  # 両方
```

### Docker

```shell
docker pull na2cucl4/wengchat:latest

docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=ページパスワード \
   na2cucl4/wengchat:latest
```

プロキシを使用する場合：

```shell
docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=ページパスワード \
   -e PROXY_URL=http://localhost:7890 \
   na2cucl4/wengchat:latest
```

プロキシに認証が必要な場合：

```shell
-e PROXY_URL="http://127.0.0.1:7890 user password"
```

MCPを有効にする場合：

```shell
docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=ページパスワード \
   -e ENABLE_MCP=true \
   na2cucl4/wengchat:latest
```

### Shell

```shell
bash <(curl -s https://raw.githubusercontent.com/Na2CuCl4/WengChat/main/scripts/setup.sh)
```

## 更新の維持

Vercelでワンクリックデプロイした場合、「更新があります」と常に表示されることがあります。これはVercelがフォークではなく新規プロジェクトを作成するため、更新を正しく検出できないからです。

以下の手順で再デプロイすることを推奨します：

- 元のリポジトリを削除；
- ページ右上のフォークボタンで本プロジェクトをフォーク；
- Vercelで再選択してデプロイ、[詳細チュートリアルはこちら](./docs/vercel-ja.md)。

### 自動更新を有効にする

> Upstream Syncの実行エラーが発生した場合は、[手動でコードを更新](#手動でコードを更新する)してください。

フォーク後、GitHubの制限により、ActionsページでWorkflowsとUpstream Sync Actionを手動で有効にする必要があります。有効後、1時間ごとに自動更新されます：

![自動更新](./docs/images/enable-actions.jpg)

![自動更新を有効にする](./docs/images/enable-actions-sync.jpg)

### 手動でコードを更新する

即時更新するには、[GitHubドキュメント](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)を参照してください。

スターまたはウォッチでリリース通知を受け取れます。

## 開発

NodeJS ≥ 18, Docker ≥ 20

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Na2CuCl4/WengChat)

プロジェクトルートに`.env`ファイルを作成：

```shell
OPENAI_API_KEY=<your api key here>

# OpenAIに直接アクセスできない場合はプロキシを使用
BASE_URL=https://chatgpt1.nextweb.fun/api/proxy
```

### ローカル開発

```shell
# 1. Node.js 18とYarnをインストール
# 2. .envに環境変数を設定
# 3. 実行
yarn install
yarn dev
```

## 環境変数

### コア

#### `OPENAI_API_KEY`（必須）

OpenAI APIキー。複数キーをカンマ区切りで設定可能（ロードバランシング）。

#### `CODE`（オプション）

アクセスパスワード。カンマ区切りで複数設定可能。

#### `BASE_URL`（オプション）

> デフォルト: `https://api.openai.com`
> 例: `http://your-openai-proxy.com`

OpenAI APIリクエストのベースURLを上書きします。

#### `OPENAI_ORG_ID`（オプション）

OpenAI組織IDを指定します。

#### `PROXY_URL`（オプション）

HTTPプロキシ（Dockerのみ）。

> 例: `http://localhost:7890`
> 認証あり: `http://127.0.0.1:7890 user password`

---

### プロバイダー設定

多くのプロバイダーは`{PROVIDER}_API_KEY`（必須）と`{PROVIDER}_URL`（オプション、デフォルトエンドポイントを上書き）のパターンです。

#### Azure OpenAI

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `AZURE_API_KEY` | はい | Azure APIキー |
| `AZURE_URL` | はい | AzureエンドポイントURL、例: `https://{resource-url}/openai` |
| `AZURE_API_VERSION` | いいえ | Azure APIバージョン。[Azureドキュメント](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#chat-completions)参照 |

#### Google Gemini

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `GOOGLE_API_KEY` | はい | Google Gemini APIキー |
| `GOOGLE_URL` | いいえ | Google API URLを上書き |

#### Anthropic Claude

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | はい | Anthropic APIキー |
| `ANTHROPIC_URL` | いいえ | Anthropic API URLを上書き |
| `ANTHROPIC_API_VERSION` | いいえ | Anthropic APIバージョンを上書き |

#### Baidu

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `BAIDU_API_KEY` | はい | Baidu APIキー |
| `BAIDU_SECRET_KEY` | はい | Baiduシークレットキー |
| `BAIDU_URL` | いいえ | Baidu API URLを上書き |

#### ByteDance

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `BYTEDANCE_API_KEY` | はい | ByteDance APIキー |
| `BYTEDANCE_URL` | いいえ | ByteDance API URLを上書き |

#### Alibaba

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `ALIBABA_API_KEY` | はい | Alibaba Cloud APIキー |
| `ALIBABA_URL` | いいえ | Alibaba API URLを上書き |

#### Tencent

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `TENCENT_API_KEY` | はい | Tencent Hunyuan APIキー |
| `TENCENT_SECRET_ID` | はい | Tencent Secret ID |
| `TENCENT_SECRET_KEY` | はい | Tencent Secret Key |
| `TENCENT_URL` | いいえ | Tencent API URLを上書き |

#### Moonshot

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `MOONSHOT_API_KEY` | はい | Moonshot APIキー |
| `MOONSHOT_URL` | いいえ | Moonshot API URLを上書き |

#### iFlytek

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `IFLYTEK_API_KEY` | はい | iFlytek APIキー |
| `IFLYTEK_API_SECRET` | はい | iFlytek APIシークレット |
| `IFLYTEK_URL` | いいえ | iFlytek API URLを上書き |

#### ChatGLM

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `CHATGLM_API_KEY` | はい | ChatGLM APIキー |
| `CHATGLM_URL` | いいえ | ChatGLM API URLを上書き |

#### DeepSeek

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | はい | DeepSeek APIキー |
| `DEEPSEEK_URL` | いいえ | DeepSeek API URLを上書き |

#### xAI

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `XAI_API_KEY` | はい | xAI (Grok) APIキー |
| `XAI_URL` | いいえ | xAI API URLを上書き |

#### SiliconFlow

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `SILICONFLOW_API_KEY` | はい | SiliconFlow APIキー |
| `SILICONFLOW_URL` | いいえ | SiliconFlow API URLを上書き |

#### 302.AI

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `AI302_API_KEY` | はい | 302.AI APIキー |
| `AI302_URL` | いいえ | 302.AI API URLを上書き |

#### Stability AI

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `STABILITY_API_KEY` | はい | Stability AI APIキー |
| `STABILITY_URL` | いいえ | Stability API URLを上書き |

---

### 機能フラグ

#### `HIDE_USER_API_KEY`（オプション）

> デフォルト: 空

`1`に設定すると、ユーザーが自分のAPIキーを入力できなくなります。

#### `DISABLE_GPT4`（オプション）

> デフォルト: 空

`1`に設定すると、GPT-4モデルを非表示にします。

#### `ENABLE_BALANCE_QUERY`（オプション）

> デフォルト: 空

`1`に設定すると、残高照会を許可します。

#### `DISABLE_FAST_LINK`（オプション）

> デフォルト: 空

`1`に設定すると、URLからの設定解析を無効にします。

#### `ENABLE_MCP`（オプション）

> デフォルト: 空

`true`に設定すると、MCP（Model Context Protocol）機能を有効にします。

---

### モデル設定

#### `CUSTOM_MODELS`（オプション）

> デフォルト: 空
> 例: `+llama,+claude-2,-gpt-3.5-turbo,gpt-4-1106-preview=gpt-4-turbo`

モデルリストの制御：
- `+モデル名` — モデルを追加
- `-モデル名` — モデルを非表示
- `モデル名=表示名` — 表示名をカスタマイズ
- `-all` — デフォルトモデルをすべて無効化
- `+all` — デフォルトモデルをすべて有効化

Azureの場合：`modelName@Azure=deploymentName`
> 例: `+gpt-3.5-turbo@Azure=gpt35` → `gpt35(Azure)`と表示

ByteDanceの場合：`modelName@bytedance=deploymentName`
> 例: `+Doubao-lite-4k@bytedance=ep-xxxxx-xxx`

#### `DEFAULT_MODEL`（オプション）

デフォルトモデルを変更します。

#### `VISION_MODELS`（オプション）

> デフォルト: 空（モデル名パターンで自動検出）
> 例: `gpt-4-vision,claude-3-opus,my-custom-model`

デフォルトのパターンマッチングに加えて、視覚機能を持つモデルを追加指定します。カンマ区切り。

#### `DEFAULT_INPUT_TEMPLATE`（オプション）

「設定」の「ユーザー入力前処理」のデフォルトテンプレートをカスタマイズします。

---

### サービスエンドポイント

#### `FILE_READING_SERVER`（オプション）

> 例: `http://nextchat-readfile:8000`

ファイル読み取りサイドカーサービスのURL（アップロードされたドキュメントの解析に使用）。

#### `MINERU_SERVER`（オプション）

> 例: `http://mineru-api:8000`

MinerU APIサービスのURL（PDF/画像変換に使用）。

---

### 同期とストレージ

#### `WHITE_WEBDAV_ENDPOINTS`（オプション）

許可するWebDAVサービスアドレスを追加します。形式：
- 各アドレスは完全なエンドポイントであること（例: `https://xxxx/yyy`）
- 複数アドレスは`,`で区切る

#### Cloudflare KV同期（オプション）

| 変数 | 説明 |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | CloudflareアカウントID |
| `CLOUDFLARE_KV_NAMESPACE_ID` | KV名前空間ID |
| `CLOUDFLARE_KV_API_KEY` | KV APIキー |
| `CLOUDFLARE_KV_TTL` | KVエントリTTL（秒） |

---

### アナリティクス（オプション）

| 変数 | 説明 |
| --- | --- |
| `GTM_ID` | Google Tag ManagerコンテナID |
| `GA_ID` | Google Analytics測定ID |

## 同期とバックアップ

[简体中文](./docs/synchronise-chat-logs-cn.md) | [English](./docs/synchronise-chat-logs-en.md) | [Italiano](./docs/synchronise-chat-logs-es.md) | [日本語](./docs/synchronise-chat-logs-ja.md) | [한국어](./docs/synchronise-chat-logs-ko.md)

## ドキュメント

- [よくある質問](./docs/faq-ja.md)
- [新しい翻訳の追加方法](./docs/translation.md)
- [Vercelの使い方](./docs/vercel-ja.md)
- [ユーザーマニュアル（中国語、作成中）](./docs/user-manual-cn.md)

## 翻訳

新しい翻訳を追加するには[このガイド](./docs/translation.md)をお読みください。

## 謝辞

### コントリビューター

<a href="https://github.com/Na2CuCl4/WengChat/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Na2CuCl4/WengChat" />
</a>

## ライセンス

[MIT](https://opensource.org/license/mit/)
