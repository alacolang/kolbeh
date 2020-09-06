package ir.alacolang.kolbeh

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Handler
import android.view.View

class SplashActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val intent = Intent(this@SplashActivity, MainActivity::class.java)
        startActivity(intent)
        finish()
    }
}