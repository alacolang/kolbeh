# https://docs.microsoft.com/en-us/appcenter/build/android/code-signing
export $(cat .env.production | xargs) && cd android && ./gradlew assembleRelease
# creates apk in android/app/build/outputs/apk/release/app-armeabi-v7a-release.apk
