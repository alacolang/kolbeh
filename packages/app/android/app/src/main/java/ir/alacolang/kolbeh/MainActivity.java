package ir.alacolang.kolbeh;

import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;

import org.devio.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.firebase.messaging.FirebaseMessaging;

import bolts.Task;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "app";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, false);
    super.onCreate(savedInstanceState);

    String TAG = "FIREBASE";

    FirebaseMessaging.getInstance().getToken()
        .addOnCompleteListener(new OnCompleteListener<String>() {
          @Override
          public void onComplete(@NonNull com.google.android.gms.tasks.Task<String> task) {
            if (!task.isSuccessful()) {
              Log.w(TAG, "Fetching FCM registration token failed", task.getException());
              return;
            }

            // Get new FCM registration token
            String token = task.getResult();
            Log.d(TAG, token);
          }
        });
  }
}
