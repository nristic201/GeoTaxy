package com.example.milica.myapplication;

/**
 * Created by Milica on 10-Jan-19.
 */

public class EndRide {
    private String username, lat, lon;
    private String queueForResponse;

    public String getQueueForResponse() {
        return queueForResponse;
    }

    public void setQueueForResponse(String queueForResponse) {
        this.queueForResponse = queueForResponse;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getLat() {
        return lat;
    }

    public void setLat(String lat) {
        this.lat = lat;
    }

    public String getLon() {
        return lon;
    }

    public void setLon(String lon) {
        this.lon = lon;
    }
}
