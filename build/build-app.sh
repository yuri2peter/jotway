#!/bin/bash

echo "Building app dist..."

# 编译前后端
cd ../scripts
sh build-frontend.sh
sh build-server.sh

# 回到当前目录
cd ../build
# 如果 app.zip存在,则删除
if [ -e "app.zip" ]; then
  unlink app.zip
fi
# 如果 app目录存在,则删除
if [ -d "./app" ]; then
  rm -rf ./app
fi

# 构建app
mkdir -p app/html
rsync -av ./extra/ ./app/
cp -r ../server/dist ./app
cp -r ../server/html/frontend ./app/html

# 打包
zip -r ./app.zip ./app

echo "Done."
