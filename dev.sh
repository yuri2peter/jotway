# /bin/bash

# check ports
netstat -tunlp | grep 8000
netstat -tunlp | grep 3000

# free ports
cd ./frontend
npm run free-port

cd ../server
npm run free-port

# dev app
cd ../frontend
npm run dev &

cd ../server
npm run dev