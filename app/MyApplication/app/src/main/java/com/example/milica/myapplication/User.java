package com.example.milica.myapplication;

public class User {
    private String ime, prezime, username, ocena, firmaNaziv, firmaEmail, firmaTelefon;
    private boolean zauzet;

    public User(String ime, String prezime, String username, String ocena, String firmaNaziv, String firmaEmail, String firmaTelefon) {
        this.ime = ime;
        this.prezime = prezime;
        this.username = username;
        this.ocena = ocena;
        this.firmaNaziv = firmaNaziv;
        this.firmaEmail = firmaEmail;
        this.firmaTelefon = firmaTelefon;
    }

    public String getIme() {
        return ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getPrezime() {
        return prezime;
    }

    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getOcena() {
        return ocena;
    }

    public void setOcena(String ocena) {
        this.ocena = ocena;
    }

    public String getFirmaNaziv() {
        return firmaNaziv;
    }

    public void setFirmaNaziv(String firmaNaziv) {
        this.firmaNaziv = firmaNaziv;
    }

    public String getFirmaEmail() {
        return firmaEmail;
    }

    public void setFirmaEmail(String firmaEmail) {
        this.firmaEmail = firmaEmail;
    }

    public String getFirmaTelefon() {
        return firmaTelefon;
    }

    public void setFirmaTelefon(String firmaTelefon) {
        this.firmaTelefon = firmaTelefon;
    }

    public boolean isZauzet() {
        return zauzet;
    }

    public void setZauzet(boolean zauzet) {
        this.zauzet = zauzet;
    }
}
