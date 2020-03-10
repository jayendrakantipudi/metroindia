package com.example.appapplication;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.afollestad.materialdialogs.DialogAction;
import com.afollestad.materialdialogs.MaterialDialog;
import com.example.appapplication.Retrofit.IMyService;
import com.example.appapplication.Retrofit.RetrofitClient;
import com.github.javiersantos.materialstyleddialogs.MaterialStyledDialog;
import com.rengwuxian.materialedittext.MaterialEditText;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.functions.Consumer;
import io.reactivex.schedulers.Schedulers;
import retrofit2.Retrofit;

public class registerActivity extends AppCompatActivity {


    TextView txt_login_account;
    MaterialEditText edt_register_email, edt_register_password, edt_register_fname, edt_register_lname, edt_register_uname;
    Button btn_register;

    ProgressBar mLoadingIndicator;

    CompositeDisposable compositeDisposable = new CompositeDisposable();
    IMyService iMyService;

    @Override
    protected void onStop() {
        compositeDisposable.clear();
        super.onStop();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.register_layout);

        //Init Service
        Retrofit retrofitClient = RetrofitClient.getInstance();
        iMyService = retrofitClient.create(IMyService.class);

        mLoadingIndicator = (ProgressBar) findViewById(R.id.pb_loading_indicator1);

        btn_register = findViewById(R.id.btn_register);
        btn_register.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                edt_register_email = (MaterialEditText) findViewById(R.id.edt_email);
                edt_register_fname = (MaterialEditText) findViewById(R.id.edt_fname);
                edt_register_lname = (MaterialEditText) findViewById(R.id.edt_lname);
                edt_register_uname = (MaterialEditText) findViewById(R.id.edt_uname);
                edt_register_password = (MaterialEditText) findViewById(R.id.edt_password);

                registerUser(edt_register_email.getText().toString(),
                        edt_register_fname.getText().toString(),
                        edt_register_lname.getText().toString(),
                        edt_register_uname.getText().toString(),
                        edt_register_password.getText().toString());

                txt_login_account = (TextView) findViewById(R.id.txt_login_account);
                txt_login_account.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        startActivity(new Intent(registerActivity.this, MainActivity.class));
                    }
                });
}
        });

    }

    private void registerUser(String email, String firstname, String lastname, String username, String password) {


        if(TextUtils.isEmpty(email))
        {
            Toast.makeText(this, "Enter Email", Toast.LENGTH_SHORT).show();
            return;
        }

        if(TextUtils.isEmpty(firstname))
        {
            Toast.makeText(this,"Enter First Name", Toast.LENGTH_SHORT).show();
            return;
        }

        if(TextUtils.isEmpty(lastname))
        {
            Toast.makeText(this,"Enter Last Name", Toast.LENGTH_SHORT).show();
            return;
        }

        if(TextUtils.isEmpty(username))
        {
            Toast.makeText(this,"Enter Username", Toast.LENGTH_SHORT).show();
            return;
        }

        if(TextUtils.isEmpty(password))
        {
            Toast.makeText(this, "Enter Password", Toast.LENGTH_SHORT).show();
            return;
        }

        mLoadingIndicator.setVisibility(View.VISIBLE);

        compositeDisposable.add(iMyService.registerUser(email, firstname, lastname, username, password)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(new Consumer<String>() {
                    @Override
                    public void accept(String response) throws Exception {
                        mLoadingIndicator.setVisibility(View.INVISIBLE);
                        if (response.equals("Please check your email to complete registration")){
                            startActivity(new Intent(registerActivity.this, MainActivity.class));
                        }
                        Toast.makeText(registerActivity.this,""+response,Toast.LENGTH_LONG).show();
                    }
                }));
    }
}
