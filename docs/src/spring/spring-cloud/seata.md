# Spring Cloud Alibaba Seata

## 启动 Seata 服务器
```sh
docker run --name seata-server \
    -p 8091:8091 \
    -p 7091:7091 \
    -e SEATA_IP=192.168.1.1 \
    -e SEATA_PORT=8091 \
    seataio/seata-server
```