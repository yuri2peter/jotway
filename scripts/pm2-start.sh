#!/bin/bash
cd ../server
pm2 start npm --name "my-app" -- run start 

# pm2 startup
# pm2 save
