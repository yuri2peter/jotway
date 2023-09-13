#!/bin/bash

netstat -tunlp | grep 8000
netstat -tunlp | grep 3000

# npx kill-port 3000
# npx kill-port 8000 