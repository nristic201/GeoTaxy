package com.example.milica.myapplication;

/**
 * Created by Milica on 04-Jan-19.
 */

public class Odgovor {

    public String getPoruka() {
        return poruka;
    }

    public void setPoruka(String poruka) {
        this.poruka = poruka;
    }

    public boolean isConfirmed() {
        return isConfirmed;
    }

    public void setConfirmed(boolean confirmed) {
        isConfirmed = confirmed;
    }

    public void setListeningQueue(String queue) {
        this.listeningQueue = queue;
    }

    public String getListeningQueue() {
        return this.listeningQueue;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return this.username;
    }

    private String poruka;
    private boolean isConfirmed;
    private String listeningQueue;
    private String username;

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

    private String lat, lon;
}
