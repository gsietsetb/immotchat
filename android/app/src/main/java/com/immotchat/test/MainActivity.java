package com.immotchat.test;

import com.facebook.react.ReactActivity;
import io.branch.rnbranch.*;
import android.content.Intent;


public class MainActivity extends ReactActivity {

    /*@Override
    public void onNewIntent (Intent intent) {
     super.onNewIntent(intent);
       setIntent(intent);
    }*/
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
     @Override
     protected void onStart() {
         super.onStart();
         RNBranchModule.initSession(getIntent().getData(), this);
     }
     @Override
    public void onNewIntent(Intent intent) {
        setIntent(intent);
    }

    @Override
    protected String getMainComponentName() {
        return "immotchat";
    }
}
