import PushNotification from "react-native-push-notification";

// can't use react-native-firebase to scheduled notifications!
// so here I use react-native-push-notifications for scheduled notifications
// and react-native-firebase for (firebase remote) push notification
// https://github.com/invertase/react-native-firebase/issues/2566

// however, currently no need anymore for remote push notifications
// for reminder to try happiness exercises!

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  // onRegister: function (token) {
  //   console.log("TOKEN:", token);
  // },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);

    // process the notification

    // // (required) Called when a remote is received or opened, or local notification is opened
    // notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

PushNotification.createChannel(
  {
    channelId: "happiness-reminder", // (required)
    channelName: "Happiness reminder", // (required)
    // soundName: "sample.mp3", // (optional) See `soundName` parameter of `localNotification` function
    importance: 4, // (optional) default: 4. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  },
  (created) =>
    console.log(`createChannel 'happiness-reminder' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

setTimeout(() => {
  // PushNotification.localNotification({
  //   /* Android Only Properties */
  //   channelId: "happiness-reminder", //
  //   message: "My Notification Message", // (required)
  // });

  PushNotification.getChannels(function (channel_ids) {
    // console.log({ channel_ids }); // ['channel_id_1']
  });

  PushNotification.channelBlocked("happiness-reminder", function (blocked) {
    // console.log({ blocked }); // true/false
  });

  PushNotification.getScheduledLocalNotifications(
    (scheduledLocalNotifications) => {
      console.log({ scheduledLocalNotifications });
    }
  );
}, 1000);
