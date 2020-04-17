// javascript

const wdio = require("webdriverio");
const assert = require("assert");

const opts = {
  port: 4723,
  capabilities: {
    platformName: "Android",
    platformVersion: "8",
    deviceName: "Android Emulator",
    app:
      "/Users/yasser/works/parisa/yara/packages/app/android/app/build/outputs/apk/release/app-armeabi-v7a-release.apk",
    appPackage: "io.appium.android.apis",
    appActivity: ".view.TextFields",
    automationName: "UiAutomator2",
  },
};

async function main() {
  const client = await wdio.remote(opts);

  const field = await client.$("android.widget.EditText");
  await field.setValue("Hello World!");
  const value = await field.getText();
  assert.equal(value, "Hello World!");

  await client.deleteSession();
}

main();
