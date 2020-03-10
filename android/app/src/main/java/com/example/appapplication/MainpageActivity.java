package com.example.appapplication;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

public class MainpageActivity extends AppCompatActivity {

    TextView mDisplayCity;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_mainpage);

        mDisplayCity = findViewById(R.id.tv_city_disp);

        Intent intentThatStartedThisActivity = getIntent();

        if (intentThatStartedThisActivity.hasExtra(Intent.EXTRA_TEXT)) {

            String textEntered = intentThatStartedThisActivity.getStringExtra(Intent.EXTRA_TEXT);

            mDisplayCity.setText(textEntered);
        }


    }
}
