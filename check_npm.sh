#!/bin/bash
cd /home/laundr33/wa.laundry24.id
# Source .bashrc to ensure environment variables are loaded
source /home/laundr33/.bashrc

# Check if npm is running
if pgrep -f "index.js" > /dev/null; then
    echo "npm is running"
else
    echo "npm is not running, restarting..."
    
    # Use the full path to npm
    nohup ~/.asdf/shims/npm start >/dev/null 2>&1 &
fi
