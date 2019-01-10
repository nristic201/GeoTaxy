package com.example.milica.myapplication;

import com.google.android.gms.maps.model.LatLng;
import com.google.maps.android.clustering.Cluster;
import com.google.maps.android.clustering.ClusterItem;

/**
 * Created by Milica on 03-Jan-19.
 */

public class ClusterMarker implements ClusterItem {
    private LatLng position;
    private String title;
    private String snippet;
    private int iconPicture;
    private TaxiDriver taxiDriver;

    public ClusterMarker(LatLng pos, String title, String snippet,
                         int iconPicture, TaxiDriver driver) {
        this.position = pos;
        this.title = title;
        this.snippet = snippet;
        this.iconPicture = iconPicture;
        this.taxiDriver = driver;

    }

    public ClusterMarker() {

    }


    @Override
    public LatLng getPosition() {
        return position;
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public String getSnippet() {
        return snippet;
    }

    public int getIconPicture() {
        return iconPicture;
    }
}
