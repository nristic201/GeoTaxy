package com.example.milica.myapplication;

import android.app.DownloadManager;
import android.content.Context;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by Milica on 17-Feb-19.
 */

public class ApiService {


    public interface ProfileResult {
        void onError();
        void onSuccess(User user);
    }

    public static void getUserInfo(final ProfileResult profileResult, String username, Context context) {
      //  requestQueue =  Volley.newRequestQueue();
        StringRequest stringRequest = new StringRequest(Request.Method.GET, Constants.serverName +
                "/profile?username=" + username,
                new Response.Listener<String>() {

            @Override
            public void onResponse(String response) {

                try {
                    JSONObject jsonObject = new JSONObject(response);

                    JSONObject firmaObj = jsonObject.getJSONObject("firma");

                    User user = new User(jsonObject.getString("ime"),
                            jsonObject.getString("prezime"),
                            jsonObject.getString("username"),
                            Double.toString(jsonObject.getDouble("ocena")),
                            firmaObj.getString("naziv"),
                            firmaObj.getString("email"),
                            firmaObj.getString("telefon"));

                    profileResult.onSuccess(user);
                    //SetupTaxiInfo(user);

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                profileResult.onError();
            }
        });
        RequestQueueSingleton.getInstance(context).addRequest(stringRequest);
    }
}
