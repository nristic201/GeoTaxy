package com.example.milica.myapplication;

import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.io.IOException;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.TimeoutException;

/**
 * Created by Milica on 17-Feb-19.
 */

public class ConnectionSingletonTaxi {

    private ConnectionFactory factory;
    private Connection connection;

    private static ConnectionSingletonTaxi newInstance = null;

    private ConnectionSingletonTaxi() {
        factory = new ConnectionFactory();
        try
        {
            factory.setAutomaticRecoveryEnabled(false);
            factory.setUri(Constants.hostName);
        }
        catch(KeyManagementException | NoSuchAlgorithmException | URISyntaxException e)
        {
            e.printStackTrace();
        }

        try {
            connection = factory.newConnection();
        } catch (IOException | TimeoutException e) {
            e.printStackTrace();
        }

    }

    public static ConnectionSingletonTaxi getNewInstance()
    {
        if(newInstance == null)
            newInstance = new ConnectionSingletonTaxi();
        return newInstance;
    }

    public Connection getConnection() {
        return this.connection;
    }
}
