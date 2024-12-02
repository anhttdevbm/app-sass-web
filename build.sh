export PATH=$PATH:/root/.nvm/versions/node/v17.19.0/bin/

echo "Current PATH: $PATH"
node --version
pm2 --version
yarn --version


yarn cache clean
yarn install
yarn build

pm2 restart web-app
