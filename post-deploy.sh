yarn install
cp ../shared/.env packages/server
cp ../shared/firebase.json packages/server/src/
yarn workspace server build
yarn workspace server optimize-images
cp ../shared/firebase.json packages/server/lib/
cp -r packages/server/src/content packages/server/lib/
cp -r packages/server/src/static packages/server/lib/
