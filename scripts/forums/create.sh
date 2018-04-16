#!/bin/bash

API="http://localhost:4741"
URL_PATH="/forums"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}" \
  --data '{
    "forum": {
      "body": "'"${BODY}"'"
    }
  }'

echo
