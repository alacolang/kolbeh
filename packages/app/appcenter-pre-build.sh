GOOGLE_SERVICES_JSON_FILE=$APPCENTER_SOURCE_DIRECTORY/packages/app/android/app/google-services.json

echo "Creating google-services.json"
echo "$GOOGLE_SERVICES_JSON" > $GOOGLE_SERVICES_JSON_FILE
sed -i -e 's/\\"/'\"'/g' $GOOGLE_SERVICES_JSON_FILE

echo "File content:"
cat $GOOGLE_SERVICES_JSON_FILE

env