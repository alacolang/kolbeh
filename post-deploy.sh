yarn install
yarn workspace server build
yarn workspace server optimize-images
cd packages/server
cp ../../../shared/.env .
cp ../../../shared/firebase.json ./lib/
cp -r ./src/content ./lib/