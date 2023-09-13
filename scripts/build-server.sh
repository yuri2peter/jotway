#!/bin/bash

echo "Building server dist..."
cd ../server
npm run build-prod

echo "Done."
