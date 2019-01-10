package com.example.milica.myapplication;

import android.content.Context;
import android.location.LocationManager;
import android.net.ConnectivityManager;

/**
 * Created by Milica on 02-Jan-19.
 */

public class CheckInternet {

    public boolean isInternetAvailable(Context context) {

        final ConnectivityManager connectivityManager = ((ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE));
        return connectivityManager.getActiveNetworkInfo() != null && connectivityManager.getActiveNetworkInfo().isConnected();
    }

    public boolean checkLocation(Context context) {

        final LocationManager manager = (LocationManager) context.getSystemService( Context.LOCATION_SERVICE );

        if ( !manager.isProviderEnabled( LocationManager.GPS_PROVIDER)|| !manager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)
                || !manager.isProviderEnabled(LocationManager.PASSIVE_PROVIDER)) {

            //context.startActivity(new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS));
            return false;
        }
        return true;
    }
}
