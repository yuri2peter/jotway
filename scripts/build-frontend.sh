#!/bin/bash

echo "Building frontend dist..."
cd ../frontend
npm run build

echo "Copying files..."
cd ../
rm -rf ./server/html/frontend
cp -r ./frontend/dist ./server/html/frontend

echo "Done."
