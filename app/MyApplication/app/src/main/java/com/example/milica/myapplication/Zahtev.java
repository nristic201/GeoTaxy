package com.example.milica.myapplication;

/**
 * Created by Milica on 03-Jan-19.
 */

public class Zahtev {

    private String usernameTaksiste;
    private String myLatitude, myLongitude;
    private String queueNameForResponse;

    public String getUsernameTaksiste() {
        return usernameTaksiste;
    }

    public void setUsernameTaksiste(String usernameTaksiste) {
        this.usernameTaksiste = usernameTaksiste;
    }

    public String getMyLatitude() {
        return myLatitude;
    }

    public void setMyLatitude(String myLatitude) {
        this.myLatitude = myLatitude;
    }

    public String getMyLongitude() {
        return myLongitude;
    }

    public void setMyLongitude(String myLongitude) {
        this.myLongitude = myLongitude;
    }

    public String getQueueNameForResponse() {
        return queueNameForResponse;
    }

    public void setQueueNameForResponse(String queueNameForResponse) {
        this.queueNameForResponse = queueNameForResponse;
    }

}
