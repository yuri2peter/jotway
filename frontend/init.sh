#!/bin/bash

echo "Installing frontend packages..."
npm ci
touch .env

echo "Done."
