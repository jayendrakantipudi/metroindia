package com.example.appapplication;


import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.Toast;

public class HomepageActivity extends Activity {

    Button buttonClick;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_homepage);

        final Spinner mySpinner = findViewById(R.id.spinner1);
        buttonClick = (Button) findViewById(R.id.btn_city_next);

        ArrayAdapter adapter = ArrayAdapter.createFromResource(HomepageActivity.this, R.array.names, R.layout.spinner_item);
        mySpinner.setAdapter(adapter);

        buttonClick.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String text = mySpinner.getSelectedItem().toString();
                Context context = HomepageActivity.this;
                Class destinationActivity = MainpageActivity.class;
                if(text.equals("SELECT ONE")){
                    Toast.makeText(HomepageActivity.this,"Please choose a city",Toast.LENGTH_SHORT).show();
                }
                else {
                    Intent startChildActivityIntent = new Intent(context, destinationActivity);
                    startChildActivityIntent.putExtra(Intent.EXTRA_TEXT, text);
                    startActivity(startChildActivityIntent);
                }
            }
        });

    }
}
