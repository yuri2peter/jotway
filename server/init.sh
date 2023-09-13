#!/bin/bash

echo "Installing server packages..."
npm ci
touch .env
mkdir -p ./html/frontend

echo "Done."
