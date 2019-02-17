package com.example.milica.myapplication;

import android.content.Context;

import com.android.volley.RequestQueue;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

/**
 * Created by Milica on 17-Feb-19.
 */

public class RequestQueueSingleton {
    private static RequestQueueSingleton requestQueueInstance;

    private RequestQueue requestQueue;

    private RequestQueueSingleton(Context context){
        requestQueue = Volley.newRequestQueue(context);
    }

    public static RequestQueueSingleton getInstance(Context context) {
        if(requestQueueInstance == null) {
            requestQueueInstance = new RequestQueueSingleton(context);
        }
        return requestQueueInstance;
    }

    public void addRequest(StringRequest stringRequest) {
        this.requestQueue.add(stringRequest);
    }
}
