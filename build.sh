export PATH=$PATH:/root/.nvm/versions/node/v18.19.0/bin/

echo "Current PATH: $PATH"
node --version
pm2 --version
yarn --version


yarn cache clean
yarn install
yarn build

pm2 restart saas-web-app