#!/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/usr/lib/jvm/java-16-oracle/bin:/usr/lib/jvm/java-16-oracle/db/bin
docker-compose build
docker-compose down
docker-compose up -d
