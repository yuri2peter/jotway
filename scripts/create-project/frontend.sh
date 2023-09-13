#!/bin/bash

# cd /your_project

# Get codes
if [ -e "wac.zip" ]; then
  echo "File wac.zip exists."
else
  echo "Downloading file wac.zip ..."
  curl -L https://github.com/yuri2peter/web-aircraft-carrier/archive/refs/heads/main.zip -o wac.zip
fi

# Decompression
unzip wac.zip
mv -n web-aircraft-carrier-main/frontend/{.*,*} .
rm -rf web-aircraft-carrier-main
rm -rf wac.zip

# Initialize
sh init.sh

# Done