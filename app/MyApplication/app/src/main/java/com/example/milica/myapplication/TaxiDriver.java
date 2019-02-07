package com.example.milica.myapplication;

/**
 * Created by Milica on 02-Jan-19.
 */

public class TaxiDriver {

    private String username, password;
    private String ime;
    private String koordinateLat, koordinateLong;
    private String prezime;


    public TaxiDriver(String username, String password, String ime, String koordinateLat, String koordinateLong, String prezime) {

        this.username = username;
        this.password = password;
        this.ime = ime;
        this.koordinateLat = koordinateLat;
        this.koordinateLong = koordinateLong;
        this.prezime = prezime;
    }
    public TaxiDriver(String username, String password, String ime, String prezime) {
        this.username = username;
        this.password = password;
        this.ime = ime;
        this.prezime = prezime;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getIme() {
        return ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getKoordinateLat() {
        return koordinateLat;
    }

    public void setKoordinateLat(String koordinateLat) {
        this.koordinateLat = koordinateLat;
    }

    public String getKoordinateLong() {
        return koordinateLong;
    }

    public void setKoordinateLong(String koordinateLong) {
        this.koordinateLong = koordinateLong;
    }


    public String getPrezime() {
        return prezime;
    }

    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

}
