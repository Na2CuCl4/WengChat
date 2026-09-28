# 开发说明

## 运行程序

- 开发

```bash
yarn dev
```

- 生产

```bash
yarn build
yarn start
```

## 启动本地文件转换服务

- 启动 MarkItDown 服务

```bash
cd ~/Projects/Website/NextChatReadFile
conda activate personal-website
uvicorn main:app --reload --port 8000
```

使用 Ctrl + C 停止服务。

- 启动 MinerU 服务

```bash
cd ~/service/mineru/
sudo docker compose -f docker-compose.yml up -d
```

使用以下命令停止服务：

```bash
sudo docker compose -f docker-compose.yml down
```

## GitHub 版本发布与 Verified 标签

发布前先在本地创建并推送 **SSH 签名的附注标签（annotated tag）**，再在 GitHub Release 页面选择该标签。本项目使用 `~/.ssh/wengchat_signing` 签名密钥；公钥已注册到 GitHub，`v2.19.2` 标签已验证为 `Verified`。

### 签名配置（首次配置或更换开发机器时）

需要 Git 2.34 或更新版本。复用已有签名密钥，并确认 `git config user.email` 是 GitHub 已验证邮箱。公钥 `~/.ssh/wengchat_signing.pub` 应添加到 GitHub 的 `Settings → SSH and GPG keys`，类型选择 **Signing Key**。

在仓库根目录配置 SSH 签名；以下配置仅作用于当前仓库：

```bash
git config --local gpg.format ssh
git config --local user.signingkey "$HOME/.ssh/wengchat_signing.pub"
git config --local commit.gpgsign true
git config --local tag.gpgsign true
```

为本地 `git tag -v` 配置信任公钥的文件。该文件只用于本地验证；GitHub 使用账户中登记的 Signing Key 验证：

```bash
printf '%s %s\n' "$(git config user.email)" "$(cat "$HOME/.ssh/wengchat_signing.pub")" \
  > "$HOME/.ssh/wengchat_allowed_signers"
git config --local gpg.ssh.allowedSignersFile "$HOME/.ssh/wengchat_allowed_signers"
```

### 每次发布（以 v2.19.3 为例）

先完成测试，将 `package.json`、`src-tauri/Cargo.toml`、`src-tauri/Cargo.lock` 和 `src-tauri/tauri.conf.json` 中的项目版本同步为 `2.19.3`，并提交本次发布的代码和文档。标签只包含目标提交的内容，未提交的修改不会进入 Release。

切换到发布分支，确认工作区干净，且最新提交包含本次发布的全部修改；`git status --short` 应无输出，确认后再继续：

```bash
git switch main
git status --short
git log -1 --oneline
```

当前终端没有可用的 `ssh-agent` 时，先启动它：

```bash
eval "$(ssh-agent -s)"
```

加载签名密钥，创建并验证标签。仅在 `git tag -v` 验证成功后，推送分支和标签：

```bash
ssh-add "$HOME/.ssh/wengchat_signing" &&
git tag -s v2.19.3 -m "WengChat v2.19.3" HEAD &&
git tag -v v2.19.3 &&
git push --atomic origin main refs/tags/v2.19.3
```

推送后在 [GitHub Tags](https://github.com/Na2CuCl4/WengChat/tags) 确认 `v2.19.3` 显示 `Verified`，再创建 Release，选择**已经存在的 `v2.19.3`** 并填写 Release Note。后续版本替换上述版本号即可；不要在 Release 页面临时创建未签名标签，也不要用 `-f` 覆盖已发布标签。

Git 标签签名、Tauri updater 更新包签名、操作系统应用代码签名是不同机制；这里的 `Verified` 来自 Git 标签签名。发布 Release 会触发现有的 Docker 镜像和 Tauri 桌面应用构建工作流。

参考：[GitHub 签名标签文档](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-tags)、[GitHub SSH 签名配置](https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key#telling-git-about-your-ssh-key)。

## Docker 编译和发布流程

- 编译

```bash
docker build -t na2cucl4/wengchat:v2.19.3 .
```

- 重命名

```bash
docker tag na2cucl4/wengchat:v2.19.3 na2cucl4/wengchat:latest
```

- 登录 Docker Hub

```bash
docker login
```

- 发布

```bash
docker push na2cucl4/wengchat:v2.19.3
docker push na2cucl4/wengchat:latest
```
