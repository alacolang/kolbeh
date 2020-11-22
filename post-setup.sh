echo "node_env=${NODE_ENV}"
BASE=/home/www/kolbeh-environments
cp "${BASE}/.env.${NODE_ENV}" ../shared/.env
cp "${BASE}/firebase.json" ../shared/