<div align="center">

# ![WengChat](docs/images/icon.svg) WengChat

[English](./README.md) / [简体中文](./README_CN.md) / [日本語](./README_JA.md) / 한국어

✨ 가볍고 빠른 AI 어시스턴트, Claude, DeepSeek, GPT & Gemini Pro 지원.

[<img src="https://vercel.com/button" alt="Deploy on Vercel" height="30">](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNa2CuCl4%2FWengChat&env=OPENAI_API_KEY&env=CODE&project-name=wengchat&repository-name=WengChat) [<img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in Gitpod" height="30">](https://gitpod.io/#https://github.com/Na2CuCl4/WengChat)

</div>

## 스크린샷

![Settings](./docs/images/settings.png)

![More](./docs/images/more.png)

![메인 화면](./docs/images/cover.png)

## 주요 기능

- **무료 원클릭 배포**: Vercel에서 1분 이내 배포
- **가벼운 클라이언트**: Linux/Windows/MacOS 약 5MB, [지금 다운로드](https://github.com/Na2CuCl4/WengChat/releases)
- **자체 LLM 호환**: [RWKV-Runner](https://github.com/josStorer/RWKV-Runner) 및 [LocalAI](https://github.com/go-skynet/LocalAI)와 완벽 호환
- **개인정보 보호**: 모든 데이터를 브라우저 로컬에 저장
- **Markdown 지원**: LaTeX, Mermaid, 코드 하이라이팅 등
- **반응형 디자인**: 다크 모드 및 PWA 지원
- **빠른 로딩**: 첫 화면 약 100kb, 스트리밍 응답
- **프롬프트 템플릿 (Mask)**: 대화 도구 생성, 공유 및 디버깅
- **고급 프롬프트**: [awesome-chatgpt-prompts-zh](https://github.com/PlexPt/awesome-chatgpt-prompts-zh) 및 [awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts) 내장
- **자동 압축**: 긴 대화를 자동 압축하여 토큰 절약
- **다국어**: English, 简体中文, 繁体中文, 日本語, Français, Español, Italiano, Türkçe, Deutsch, Tiếng Việt, Русский, Čeština, 한국어, Indonesia
- **파일 업로드**: 이미지, 문서 등 파일을 업로드하여 모델 처리
- **이미지 생성**: GPT-Image 모델 text-to-image 및 image-to-image 생성
- **OpenAI Responses 형식**: `/v1/responses` 및 GPT-5 시리즈 `reasoning_effort`, `response_format`, `verbosity` 지원
- **파일 변환**: MarkItDown 및 MinerU 엔진 기반 배치 변환 페이지 내장
- **MCP 지원**: Model Context Protocol 통합 (`ENABLE_MCP=true`로 활성화)
- **자동 업데이트**: 업데이트 자동 감지 및 알림

## 업데이트 소식

- **v2.19.2**: 이 Fork의 배포 이름을 WengChat으로 변경하고 NextChat 생태계 호환성을 유지
- **v2.19.1**: "전체 삭제" 버튼이 변환 로그를 초기화하지 않는 문제 수정, 변환 실패 시 무한 재시도 루프 수정, 전체 다운로드를 zip 패키지로 변경, MinerU 엔진 최신 API 업데이트 (백엔드 이름, OCR 언어, 파싱 정밀도 설정)
- **v2.19.0**: 파일 변환 페이지 (MarkItDown & MinerU 엔진), Docker Compose profiles (readfile, mineru), docker-build.sh 스크립트
- **v2.18.0**: OpenAI Responses 형식 `/v1/responses`, GPT-5 시리즈 `reasoning_effort` / `response_format` / `verbosity`, image-to-image 생성, 업로드 15장으로 확대
- **v2.17.0**: 사용자 정의 대화 요약 모델, GPT-Image 패밀리 text-to-image 생성, 탭 전환 다중 동기화 문제 수정
- **v2.16.2**: 파일 업로드 지원, 자동 업데이트 감지, 다국어 개선, 서버 응답 시간 10분으로 연장
- **v2.15.8**: 실시간 채팅 지원 [#5672](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/issues/5672)
- **v2.15.4**: Tauri LLM API 호출, 보안 강화 [#5379](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/issues/5379)
- **v2.15.0**: 플러그인 지원! [NextChat-Awesome-Plugins](https://github.com/ChatGPTNextWeb/NextChat-Awesome-Plugins)
- **v2.14.0**: Artifacts & Stable Diffusion 지원
- **v2.10.1**: Google Gemini Pro 모델 지원
- **v2.9.11**: Azure 엔드포인트 지원
- **v2.8**: 크로스 플랫폼 데스크톱 클라이언트
- **v2.7**: 대화를 이미지 또는 ShareGPT로 공유
- **v2.0**: 프롬프트 템플릿 — 아이디어를 현실로

## 로드맵

- [x] **시스템 프롬프트**: 사용자 정의 프롬프트를 시스템 프롬프트로 고정 [#138](https://github.com/Yidadaa/ChatGPT-Next-Web/issues/138)
- [x] **사용자 프롬프트**: 사용자 정의 프롬프트 편집 및 저장
- [x] **프롬프트 템플릿**: 사전 정의된 컨텍스트로 새 채팅 생성 [#993](https://github.com/Yidadaa/ChatGPT-Next-Web/issues/993)
- [x] **공유**: 이미지 또는 ShareGPT로 공유 [#1741](https://github.com/Yidadaa/ChatGPT-Next-Web/pull/1741)
- [x] **데스크톱 앱**: Tauri로 구축된 크로스 플랫폼 클라이언트
- [x] **자체 모델 호스팅**: [RWKV-Runner](https://github.com/josStorer/RWKV-Runner) 및 [LocalAI](https://github.com/go-skynet/LocalAI)와 호환
- [x] **Artifacts**: 생성된 콘텐츠를 별도 창에서 미리보기, 복사, 공유 [#5092](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/pull/5092)
- [x] **플러그인**: 웹 검색, 계산기, 사용자 정의 API [#165](https://github.com/Yidadaa/ChatGPT-Next-Web/issues/165) [#5353](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/issues/5353)
- [x] **실시간 채팅**: WebSocket 기반 실시간 대화 [#5672](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/issues/5672)
- [x] **파일 업로드**: 대화 중 파일 업로드 및 처리
- [x] **이미지 생성**: GPT-Image 모델 text-to-image 및 image-to-image
- [x] **OpenAI Responses 형식**: `/v1/responses` 및 GPT-5 시리즈 파라미터 지원
- [x] **사용자 정의 요약 모델**: 대화 요약용 전용 모델 설정
- [x] **파일 변환**: MarkItDown 및 MinerU 엔진 배치 변환
- [x] **Docker Compose Profiles**: 선택적 서비스 배포 (readfile, mineru)

## 시작하기

1. [OpenAI API 키](https://platform.openai.com/account/api-keys) 발급
2. [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNa2CuCl4%2FWengChat&env=OPENAI_API_KEY&env=CODE&project-name=wengchat&repository-name=WengChat) 클릭, `CODE`를 페이지 비밀번호로 설정
3. Enjoy :)

## 배포

### Docker Compose (권장)

```shell
# 저장소 클론
git clone https://github.com/Na2CuCl4/WengChat.git
cd WengChat

# .env 파일 생성 및 설정
cp .env.template .env
# .env 파일에 API 키와 설정 입력

# 메인 서비스 시작
docker compose up -d

# 선택적 서비스도 함께 시작:
docker compose --profile readfile up -d                   # 파일 읽기 서비스
docker compose --profile mineru up -d                     # MinerU API 서비스
docker compose --profile readfile --profile mineru up -d  # 둘 다
```

### Docker

```shell
docker pull na2cucl4/wengchat:latest

docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=비밀번호 \
   na2cucl4/wengchat:latest
```

프록시 사용:

```shell
docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=비밀번호 \
   -e PROXY_URL=http://localhost:7890 \
   na2cucl4/wengchat:latest
```

프록시 인증이 필요한 경우:

```shell
-e PROXY_URL="http://127.0.0.1:7890 user password"
```

MCP 활성화:

```shell
docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=비밀번호 \
   -e ENABLE_MCP=true \
   na2cucl4/wengchat:latest
```

### Shell

```shell
bash <(curl -s https://raw.githubusercontent.com/Na2CuCl4/WengChat/main/scripts/setup.sh)
```

## 최신 상태 유지

Vercel 원클릭 배포 시 "업데이트 있음" 알림이 계속 표시될 수 있습니다. Vercel이 포크 대신 새 프로젝트를 생성하기 때문입니다.

다음 절차로 재배포를 권장합니다:

- 기존 저장소 삭제
- 페이지 우측 상단 Fork 버튼으로 본 프로젝트 포크
- Vercel에서 재선택 및 배포, [자세한 튜토리얼 보기](./docs/vercel-ko.md)

### 자동 업데이트 활성화

> Upstream Sync 오류 발생 시 [수동 코드 업데이트](#수동-업데이트-방법)를 진행하세요.

포크 후 GitHub 제한으로 Actions 페이지에서 Workflows 및 Upstream Sync Action을 수동 활성화해야 합니다. 활성화 후 매시간 자동 업데이트:

![자동 업데이트](./docs/images/enable-actions.jpg)

![업스트림 동기화 활성화](./docs/images/enable-actions-sync.jpg)

### 수동 업데이트 방법

즉시 업데이트는 [GitHub 문서](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)를 참고하세요.

Star 또는 Watch로 릴리스 알림을 받아보세요.

## 개발

NodeJS ≥ 18, Docker ≥ 20

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Na2CuCl4/WengChat)

프로젝트 루트에 `.env` 파일 생성:

```shell
OPENAI_API_KEY=<your api key here>

# OpenAI에 직접 접근할 수 없는 경우 프록시 사용
BASE_URL=https://chatgpt1.nextweb.fun/api/proxy
```

### 로컬 개발

```shell
# 1. Node.js 18 및 Yarn 설치
# 2. .env에 환경 변수 설정
# 3. 실행
yarn install
yarn dev
```

## 환경 변수

### 핵심

#### `OPENAI_API_KEY` (필수)

OpenAI API 키. 여러 키를 쉼표로 구분하여 로드 밸런싱.

#### `CODE` (선택)

접근 비밀번호. 쉼표로 구분하여 여러 개 설정 가능.

#### `BASE_URL` (선택)

> 기본값: `https://api.openai.com`
> 예시: `http://your-openai-proxy.com`

OpenAI API 요청 기본 URL 재정의.

#### `OPENAI_ORG_ID` (선택)

OpenAI 조직 ID 지정.

#### `PROXY_URL` (선택)

HTTP 프록시 (Docker 전용).

> 예시: `http://localhost:7890`
> 인증 필요: `http://127.0.0.1:7890 user password`

---

### 제공업체별 설정

대부분의 제공업체는 `{PROVIDER}_API_KEY` (필수) 및 `{PROVIDER}_URL` (선택, 기본 엔드포인트 재정의) 패턴을 따릅니다.

#### Azure OpenAI

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `AZURE_API_KEY` | 예 | Azure API 키 |
| `AZURE_URL` | 예 | Azure 엔드포인트 URL, 예: `https://{resource-url}/openai` |
| `AZURE_API_VERSION` | 아니오 | Azure API 버전. [Azure 문서](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#chat-completions) 참조 |

#### Google Gemini

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `GOOGLE_API_KEY` | 예 | Google Gemini API 키 |
| `GOOGLE_URL` | 아니오 | Google API URL 재정의 |

#### Anthropic Claude

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | 예 | Anthropic API 키 |
| `ANTHROPIC_URL` | 아니오 | Anthropic API URL 재정의 |
| `ANTHROPIC_API_VERSION` | 아니오 | Anthropic API 버전 재정의 |

#### Baidu

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `BAIDU_API_KEY` | 예 | Baidu API 키 |
| `BAIDU_SECRET_KEY` | 예 | Baidu Secret 키 |
| `BAIDU_URL` | 아니오 | Baidu API URL 재정의 |

#### ByteDance

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `BYTEDANCE_API_KEY` | 예 | ByteDance API 키 |
| `BYTEDANCE_URL` | 아니오 | ByteDance API URL 재정의 |

#### Alibaba

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `ALIBABA_API_KEY` | 예 | Alibaba Cloud API 키 |
| `ALIBABA_URL` | 아니오 | Alibaba API URL 재정의 |

#### Tencent

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `TENCENT_API_KEY` | 예 | Tencent Hunyuan API 키 |
| `TENCENT_SECRET_ID` | 예 | Tencent Secret ID |
| `TENCENT_SECRET_KEY` | 예 | Tencent Secret Key |
| `TENCENT_URL` | 아니오 | Tencent API URL 재정의 |

#### Moonshot

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `MOONSHOT_API_KEY` | 예 | Moonshot API 키 |
| `MOONSHOT_URL` | 아니오 | Moonshot API URL 재정의 |

#### iFlytek

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `IFLYTEK_API_KEY` | 예 | iFlytek API 키 |
| `IFLYTEK_API_SECRET` | 예 | iFlytek API Secret |
| `IFLYTEK_URL` | 아니오 | iFlytek API URL 재정의 |

#### ChatGLM

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `CHATGLM_API_KEY` | 예 | ChatGLM API 키 |
| `CHATGLM_URL` | 아니오 | ChatGLM API URL 재정의 |

#### DeepSeek

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | 예 | DeepSeek API 키 |
| `DEEPSEEK_URL` | 아니오 | DeepSeek API URL 재정의 |

#### xAI

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `XAI_API_KEY` | 예 | xAI (Grok) API 키 |
| `XAI_URL` | 아니오 | xAI API URL 재정의 |

#### SiliconFlow

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `SILICONFLOW_API_KEY` | 예 | SiliconFlow API 키 |
| `SILICONFLOW_URL` | 아니오 | SiliconFlow API URL 재정의 |

#### 302.AI

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `AI302_API_KEY` | 예 | 302.AI API 키 |
| `AI302_URL` | 아니오 | 302.AI API URL 재정의 |

#### Stability AI

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `STABILITY_API_KEY` | 예 | Stability AI API 키 |
| `STABILITY_URL` | 아니오 | Stability API URL 재정의 |

---

### 기능 플래그

#### `HIDE_USER_API_KEY` (선택)

> 기본값: 비어 있음

`1`로 설정하면 사용자가 자신의 API 키를 입력할 수 없습니다.

#### `DISABLE_GPT4` (선택)

> 기본값: 비어 있음

`1`로 설정하면 GPT-4 모델을 숨깁니다.

#### `ENABLE_BALANCE_QUERY` (선택)

> 기본값: 비어 있음

`1`로 설정하면 잔액 조회를 허용합니다.

#### `DISABLE_FAST_LINK` (선택)

> 기본값: 비어 있음

`1`로 설정하면 URL 설정 파싱을 비활성화합니다.

#### `ENABLE_MCP` (선택)

> 기본값: 비어 있음

`true`로 설정하면 MCP (Model Context Protocol) 기능을 활성화합니다.

---

### 모델 설정

#### `CUSTOM_MODELS` (선택)

> 기본값: 비어 있음
> 예시: `+llama,+claude-2,-gpt-3.5-turbo,gpt-4-1106-preview=gpt-4-turbo`

모델 목록 제어:
- `+모델명` — 모델 추가
- `-모델명` — 모델 숨기기
- `모델명=표시명` — 표시 이름 사용자 정의
- `-all` — 모든 기본 모델 비활성화
- `+all` — 모든 기본 모델 활성화

Azure: `modelName@Azure=deploymentName`
> 예시: `+gpt-3.5-turbo@Azure=gpt35` → `gpt35(Azure)` 표시

ByteDance: `modelName@bytedance=deploymentName`
> 예시: `+Doubao-lite-4k@bytedance=ep-xxxxx-xxx`

#### `DEFAULT_MODEL` (선택)

기본 모델 변경.

#### `VISION_MODELS` (선택)

> 기본값: 비어 있음 (모델명 패턴으로 자동 감지)
> 예시: `gpt-4-vision,claude-3-opus,my-custom-model`

기본 패턴 매칭 외에 비전 기능을 가진 모델을 추가 지정. 쉼표로 구분.

#### `DEFAULT_INPUT_TEMPLATE` (선택)

설정의 '사용자 입력 전처리' 기본 템플릿을 사용자 정의.

---

### 서비스 엔드포인트

#### `FILE_READING_SERVER` (선택)

> 예시: `http://nextchat-readfile:8000`

파일 읽기 사이드카 서비스 URL (업로드된 문서 파싱에 사용).

#### `MINERU_SERVER` (선택)

> 예시: `http://mineru-api:8000`

MinerU API 서비스 URL (PDF/이미지 변환에 사용).

---

### 동기화 및 저장소

#### `WHITE_WEBDAV_ENDPOINTS` (선택)

허용할 WebDAV 서비스 주소 추가. 형식:
- 각 주소는 완전한 엔드포인트여야 함 (예: `https://xxxx/yyy`)
- 여러 주소는 `,`로 구분

#### Cloudflare KV 동기화 (선택)

| 변수 | 설명 |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 계정 ID |
| `CLOUDFLARE_KV_NAMESPACE_ID` | KV 네임스페이스 ID |
| `CLOUDFLARE_KV_API_KEY` | KV API 키 |
| `CLOUDFLARE_KV_TTL` | KV 항목 TTL (초) |

---

### 분석 (선택)

| 변수 | 설명 |
| --- | --- |
| `GTM_ID` | Google Tag Manager 컨테이너 ID |
| `GA_ID` | Google Analytics 측정 ID |

## 동기화 및 백업

[简体中文](./docs/synchronise-chat-logs-cn.md) | [English](./docs/synchronise-chat-logs-en.md) | [Italiano](./docs/synchronise-chat-logs-es.md) | [日本語](./docs/synchronise-chat-logs-ja.md) | [한국어](./docs/synchronise-chat-logs-ko.md)

## 문서

- [자주 묻는 질문](./docs/faq-ko.md)
- [새 번역 추가 방법](./docs/translation.md)
- [Vercel 사용법](./docs/vercel-ko.md)
- [사용자 매뉴얼 (중국어, 작성 중)](./docs/user-manual-cn.md)

## 번역

새로운 번역을 추가하려면 [이 가이드](./docs/translation.md)를 참고하세요.

## 감사의 말

### 기여자

<a href="https://github.com/Na2CuCl4/WengChat/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Na2CuCl4/WengChat" />
</a>

## 라이선스

[MIT](https://opensource.org/license/mit/)
