yarn install
yarn workspace server build
cp ../shared/.env packages/server/
cp ../shared/firebase.json packages/server/lib/
