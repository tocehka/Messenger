#!/usr/bin/env sh

cd /usr/front
echo "upgrade npm"
npm install -g yarn
echo "installing deps"
yarn
echo "DONE"
GENERATE_SOURCEMAP=false yarn build