# `Docker` 常用命令

## 镜像
### 搜索镜像
- `docker search [OPTIONS] <IMAGE>`
```sh
# 以查询 nginx 镜像为例：
# 根据镜像名查询
docker search nginx
# 查询结果的前10条数据
docker search --limit 10 nginx
# 过滤：-f [option]
docker search -f is-officail=true nginx # 查询官方镜像
docker search -f stars=10 nginx # stars数不小于10的镜像
docker search -f is-automated=true nginx # 搜索自动构建的镜像
```

### 本地镜像
- `docker image ls`
- `docker images`

### 拉取镜像
- `docker image pull [OPTIONS] <IMAGE>[:TAG|@DIGEST]`
- `docker pull [OPTIONS] <IMAGE>[:TAG|@DIGEST]`
```sh
# 拉取 指定镜像所有进行
docker pull -a nginx
```

### 删除镜像
- `docker image rm <IMAGE>`
- `docker rmi <IMAGE>`
```sh
docker rmi nginx:latest
# 强制删除
docker rmi -f nginx:latest
```

### 保存镜像
- `docker image save`
- `docker save`
```sh
docker image save [OPTIONS] <IMAGE> [IMAGE...]
```

### 加载镜像
- `docker load [OPTIONS]`

## 容器
### 创建容器
#### 创建并运行一个容器
- `docker container run [OPTIONS] <IMAGE> [COMMAND] [ARG...]`
- `docker run [OPTIONS] <IMAGE> [COMMAND] [ARG...]`

|         option        | 作用 |
|-----------------------|:---:|
|-i	                    |以交互模式运行容器，通常与 -t 同时使用|
|-t	                    |启动容器后，为容器分配一个命令行，通常与 -i 同时使用|
|-v	                    |目录映射，容器目录挂载到宿主机目录，格式： <host目录>:<容器目录>|
|-d	                    |守护进程，后台运行该容器|
|-p	                    |指定端口映射，格式：主机(宿主)端口:容器端口|
|-P	                    |随机端口映射，容器内部端口随机映射到主机的端口（49153起始 49153到65535）|
|-u	                    |以什么用户身份创建容器|
|–name                  |“nginx-lb”	容器名字|
|-m, --memory bytes	    |设置容器使用内存最大值|
|-h, --hostname string	|指定容器的 host name|
|–dns 8.8.8.8	        |指定容器 dns 服务器|
|-e username="param"	|设置环境变量|
|–restart Docker	    |重启后，容器是否自动重启|
|–privileged	        |容器内是否使用真正的 root 权限|

```sh
docker run \
-d \                # 后台运行
--name my-nginx \   # 容器名
-p 80:80 \          # 端口映射[主机端口]:[容器端口]
-v /app/nginx/html:/usr/nginx/share/html \  # 数据卷：挂载目录
-v nginx-config:/etc/nginx \  # 数据卷：挂载卷（不以 / 或者 ./ 开头，则认为是挂载卷）
--network network-nginx \  # 需要先新增网络
nginx
```

### 启动容器
- `docker start <container>`
- `docker restart <container>`

### 停止容器
`docker stop <container>`

### 删除容器
`docker rm <container>`

### 查看容器
#### 容器列表
- `docker ps`

#### 容器状态
- `docker stats [CONTAINER]`

#### 日志
- `docker logs`

### 进入容器
- `docker exec <CONTAINER>`
```sh
docker exec -it nginx /bin/bash
```

### 容器镜像
- 将容器提交为一个镜像。
- `docker container commit [OPTIONS] <CONTAINER> [NEW-IMAGE[:TAG]]`
- `docker commit [OPTIONS] <CONTAINER> [NEW-IMAGE[:TAG]]`

## 卷
- `docker volume <COMMAND>`

### 新增卷
- `docker volume create <NETWORK>`

### 删除卷
- `docker volume rm <NETWORK>`

### 查看已有卷
- `docker volume ls`

### 查看卷详情
- `docker volume inspect <NETWORK>`

## 网络
- `docker network <COMMAND>`

### 新增网络
- `docker network create <NETWORK>`

### 删除网络
- `docker network rm <NETWORK>`

### 查看已有网络
- `docker network ls`

### 查看网络详情
- `docker network inspect <NETWORK>`

## Docker Compose

### Compose File
```yaml compose.yaml
# 名字
name: blog

services:
  mysql:
    # 镜像名
    image: mysql:8.0 
    # 端口映射
    protes: 
      - "3306:3306"
    # 环境变量
    environment: 
      - MYSQL_ROOT_PASSWORD=123456
      - MYSQL_DATABASE=wordpress
    # 卷
    volumes: 
      - mysql-data:/var/lib/mysql
      - /app/myconf:/etc/mysql/conf.d
    restart: always
    # 网络
    networks: 
      - blog

  wordpress:
    image: wordpress:latest
    protes: 
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: mysql
      WORDPRESS_DB_USER: root
      WORDPRESS_DB_PASSWORD: 123456
      WORDPRESS_DB_NAME: wordpress
    volumes: 
      - wordpress:/var/www/html 
    restart: always
    networks: 
      - blog
    # 依赖于mysql，mysql需要有限启动
    depends_on:
      - mysql

# 声明数据卷
volumes:
  mysql-data:
  wordpress:

# 声明网络配置
networks:
  blog:
```
:::info
更多详细信息，请查阅[官方文档](https://docs.docker.com/reference/compose-file/)
:::

### 常用命令
- `docker compose [OPTIONS] <COMMAND>`
```sh
# 上线 以及 增量更新
docker compose -f ./compose.yml up -d
# 下线
docker compose -f ./compose.yml down
# 移除时一并移除卷和镜像
docker compose -f ./compose.yml down --rmi all -v
# 启动
docker compose start [service]
# 停止
docker compose stop [service]
#扩容
docker compose scale [service=number]
```

### `docker-compose`
:::tip
`docker compose` 与 `docker-compose` 的区别：[官方文档](https://docs.docker.com/compose/install/linux/)
:::

## DockerFlie
:::info
更多详细信息，请查阅[官方文档](https://docs.docker.com/reference/dockerfile/)
:::

## 其他常用命令
### `docker cp`
- 将容器内文件复制到主机
- docker cp <CONTAINER>:<path> <host-path>

## 参考资料
- [【Docker系列】从头学起 Docker——docker run 命令详解](https://blog.csdn.net/qq_45547688/article/details/125785419)
- [尚硅谷3小时速通Docker教程，名师带练docker部署到实战！](https://www.bilibili.com/video/BV1Zn4y1X7AZ?spm_id_from=333.788.videopod.episodes&vd_source=82c8936823dd2e33632d42e87e1732ba)
