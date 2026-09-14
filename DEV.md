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
cd ~/Projects/Website/WengChatReadFile
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

## Docker 编译和发布流程

- 编译

```bash
docker build -t na2cucl4/wengchat:v2.19.2 .
```

- 重命名

```bash
docker tag na2cucl4/wengchat:v2.19.2 na2cucl4/wengchat:latest
```

- 登录 Docker Hub

```bash
docker login
```

- 发布

```bash
docker push na2cucl4/wengchat:v2.19.2
docker push na2cucl4/wengchat:latest
```
