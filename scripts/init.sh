#!/bin/bash

echo "Installing common package..."
cd ../common
npm ci

echo "Installing server packages..."
cd ../server
npm ci
touch .env
mkdir -p ./html/frontend
npm i ../common

echo "Installing frontend packages..."
cd ../frontend
npm ci
touch .env
npm i ../common

echo "Done."
