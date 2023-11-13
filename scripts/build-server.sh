#!/bin/bash

echo "Building server dist..."
cd ../server
rm -rf ./dist
npm run build-prod

echo "Done."
