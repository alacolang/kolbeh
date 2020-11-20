yarn install
yarn workspace server build
cd packages/server
cp ../../../shared/.env .
cp ../../../shared/firebase.json ./lib/
cp -r ./src/content ./lib/