#!/bin/sh

# Replace the placeholder with the actual API_URL environment variable
if [ ! -z "$API_URL" ]; then
    sed -i "s|REACT_APP_API_URL_PLACEHOLDER|$API_URL|g" /usr/share/nginx/html/config.json
else
    # Use default if no environment variable is set
    sed -i "s|REACT_APP_API_URL_PLACEHOLDER|http://localhost:3000/todos|g" /usr/share/nginx/html/config.json
fi

# Start nginx
nginx -g "daemon off;"
