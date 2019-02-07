package com.example.milica.myapplication;

import android.content.Context;
import android.content.SharedPreferences;

import com.rabbitmq.client.Consumer;

/**
 * Created by Milica on 02-Jan-19.
 */

public class Session {

    public SharedPreferences prefs;
    SharedPreferences.Editor editor;
    Context context;

    public Session(Context ctx) {
        this.context = ctx;
        prefs = ctx.getSharedPreferences("FlorerExplorer", Context.MODE_PRIVATE);
        editor = prefs.edit();
    }
    public void setLoggedIn(boolean loggedIn) {
        editor.putBoolean("loggedIn", loggedIn);
        editor.commit();
    }
    public void setUser(String taxiDriver) {
        editor.putString("username", taxiDriver);
        editor.commit();
    }
    public void setIme(String ime) {
        editor.putString("ime", ime);
        editor.commit();
    }
    public String getIme() {
        return prefs.getString("ime", "");
    }
    public void setPrezime(String prezime) {
        editor.putString("prezime", prezime);
        editor.commit();
    }
    public String getPrezime() {
        return prefs.getString("prezime", "");
    }
    public void setPassword(String pw) {
        editor.putString("password", pw);
        editor.commit();
    }
    public String getPassword() {
        return prefs.getString("password", "");
    }

    public void setLatitude(String lat) {
        editor.putString("latitude", lat);
    }
    public void setLongitude(String longitude) {
        editor.putString("latitude", longitude);
    }
    public String getLatitude() {
        return prefs.getString("latitude", "");
    }
    public String getLongitude() {
        return prefs.getString("longitude", "");
    }

    public boolean getLoggedIn() {
        return prefs.getBoolean("loggedIn", false);
    }

    public String getUser() {
        return prefs.getString("username", "");
    }
}
