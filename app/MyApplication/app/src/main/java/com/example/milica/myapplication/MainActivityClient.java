package com.example.milica.myapplication;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.os.Handler;
import android.os.Message;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.HeaderViewListAdapter;
import android.widget.RadioGroup;
import android.widget.Toast;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.google.maps.android.clustering.ClusterManager;
import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Consumer;
import com.rabbitmq.client.DefaultConsumer;
import com.rabbitmq.client.Envelope;

import java.io.IOException;
import java.lang.reflect.Type;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingDeque;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeoutException;

public class MainActivityClient extends AppCompatActivity implements OnMapReadyCallback, GoogleMap.OnInfoWindowClickListener, RatingBarDialog.RatingDialogListener {

    private static final String FINE_LOCATION = Manifest.permission.ACCESS_FINE_LOCATION;
    private static final String COURSE_LOCATION = Manifest.permission.ACCESS_COARSE_LOCATION;
    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1234;
    private boolean mLocationPermissionsGranted = false;

    ConnectionFactory factory = new ConnectionFactory();
    private BlockingDeque<String> requestQueue = new LinkedBlockingDeque<>();
    private BlockingDeque<String> ocenaQueue = new LinkedBlockingDeque<>();

    private MapResolver mapResolver;
    private Thread subscribeThread;
    private ArrayList<TaxiDriver> all_taxi_drivers;
    private Session session;
    private ClusterManager mClusterManager;
    private MyClusterManagerRenderer mClusterManagerRenderer;
    private ArrayList<ClusterMarker> mClusterMarkers = new ArrayList<>();
    private String android_id;
    private Thread responseQueueThread;
    private Thread ocenaQueueThread;
    private Thread requestQueueThread;
    private Thread respondToOcenaThread;
    private Zahtev zahtev;
    private IdVoznje idVoznje;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main_client);

        mapResolver = new MapResolver(getApplicationContext());
        session = new Session(getApplicationContext());
        all_taxi_drivers = new ArrayList<>();
        android_id = Settings.Secure
                .getString(getApplicationContext()
                                .getContentResolver(),
                        Settings.Secure.ANDROID_ID);

        getLocationPermission();

        @SuppressLint("HandlerLeak") final Handler fanoutMessageHandler = new Handler() {
            @Override
            public void handleMessage(Message msg) {

                String message = msg.getData().getString("fanout");

                parseJSON(message);
                addTaxisToMap();
            }
        };
        @SuppressLint("HandlerLeak") final Handler resposeMessageHandler = new Handler() {
            @Override
            public void handleMessage(Message msg) {

                String message = msg.getData().getString("response");

                Gson gson = new Gson();
                Odgovor odgovor = gson.fromJson(message, Odgovor.class);
                Toast.makeText(getApplicationContext(), odgovor.getPoruka(), Toast.LENGTH_SHORT).show();

            }
        };
        @SuppressLint("HandlerLeak") final Handler renspodToOcenaZahtev = new Handler() {
            @Override
            public void handleMessage(Message msg) {

                String message = msg.getData().getString("rseponseToOcena");
                Gson gson = new Gson();

                idVoznje = gson.fromJson(message, IdVoznje.class);


                RatingBarDialog ratingBarDialog = new RatingBarDialog();
                ratingBarDialog.show(getSupportFragmentManager(),  "Rating reply dialog");
            }
        };
//[{"ime":"Milica","koordinateLat":"43.3329682","koordinateLong":"21.8932287","password":"0000","prezime":"Martinovic","username":"comi"}]

        setupConnectionFactory(Constants.hostName);

        SubscribeToFanoutExchange(fanoutMessageHandler);

        ListenToResponseQueue(resposeMessageHandler);
        ReceiveRequestToGrade(renspodToOcenaZahtev);
        SendToRequestQueue();
        SendToOcenaQueue();

    }

    private void addTaxisToMap() {

        if(mapResolver.getmMap() != null) {
            if(mClusterManager == null) {
                mClusterManager = new ClusterManager<ClusterMarker>(getApplicationContext(), mapResolver.getmMap());
            }
            if(mClusterManagerRenderer == null){
                mClusterManagerRenderer = new MyClusterManagerRenderer(
                        MainActivityClient.this,
                        mapResolver.getmMap(),
                        mClusterManager
                );
                mClusterManager.setRenderer(mClusterManagerRenderer);
            }
            for(TaxiDriver driver : all_taxi_drivers) {

                double lat = Double.parseDouble(driver.getKoordinateLat());
                double lon = Double.parseDouble(driver.getKoordinateLong());
                LatLng ll = new LatLng(lat, lon);
                //mapResolver.getmMap().addMarker(new MarkerOptions().position(ll));
                try {
                    int avatar = R.drawable.ic_cheif_new;

                    ClusterMarker newClusterMarker = new ClusterMarker(
                            ll,
                            driver.getUsername(),
                            "Choose this Taxi driver: " + driver.getUsername() + " to take you?",
                            avatar,
                            driver
                    );
                    mClusterManager.addItem(newClusterMarker);
                    mClusterMarkers.add(newClusterMarker);
                }
                catch(NullPointerException e) {

                }
                mClusterManager.cluster();
            }
        }
    }

    private void parseJSON(String jsonString) {

        Gson gson = new Gson();
        Type type = new TypeToken<List<TaxiDriver>>(){}.getType();
        List<TaxiDriver> driverList = gson.fromJson(jsonString, type);
        for (TaxiDriver driver : driverList){
            all_taxi_drivers.add(driver);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        subscribeThread.interrupt();
    }

    public void SubscribeToFanoutExchange(final Handler handler) {

        subscribeThread = new Thread(new Runnable() {
            @Override
            public void run() {

                    try {
                        Connection connection = factory.newConnection();
                        Channel channel = connection.createChannel();

                        channel.basicQos(1);
                        AMQP.Queue.DeclareOk q = channel.queueDeclare();
                        channel.queueBind(q.getQueue(), "amq.fanout", "");

                        Consumer consumer = new DefaultConsumer(channel) {
                            @Override
                            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body)
                                    throws IOException {

                                String message = new String(body, "UTF-8");

                                Message msg = handler.obtainMessage();
                                Bundle bundle = new Bundle();
                                bundle.putString("fanout", message);
                                msg.setData(bundle);
                                handler.sendMessage(msg);

                            }
                        };
                        channel.basicConsume(q.getQueue(), true, consumer);

                    } catch (TimeoutException e) {
                        e.printStackTrace();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
               }

        });

        subscribeThread.start();
    }

    public void ReceiveRequestToGrade(final Handler handler) {

        respondToOcenaThread = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Connection connection = factory.newConnection();
                    Channel channel = connection.createChannel();

                    AMQP.Queue.DeclareOk q = channel.queueDeclare(android_id + "1", true,
                            false, false, null);

                    Consumer consumer = new DefaultConsumer(channel) {
                        @Override
                        public void handleDelivery(String consumerTag, Envelope envelope,
                                                   AMQP.BasicProperties properties, byte[] body)
                                throws IOException {

                            String message = new String(body, "UTF-8");

                            Message msg = handler.obtainMessage();
                            Bundle bundle = new Bundle();
                            bundle.putString("rseponseToOcena", message);
                            msg.setData(bundle);
                            handler.sendMessage(msg);
                        }
                    };
                    channel.basicConsume(q.getQueue(), true, consumer);

                } catch (TimeoutException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });
        respondToOcenaThread.start();
    }


    public void ListenToResponseQueue(final Handler handler) {

        responseQueueThread = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Connection connection = factory.newConnection();
                    Channel channel = connection.createChannel();

                    AMQP.Queue.DeclareOk q = channel.queueDeclare(android_id, true,
                            false, false, null);

                    Consumer consumer = new DefaultConsumer(channel) {
                        @Override
                        public void handleDelivery(String consumerTag, Envelope envelope,
                                                   AMQP.BasicProperties properties, byte[] body)
                                throws IOException {

                            String message = new String(body, "UTF-8");

                            Message msg = handler.obtainMessage();
                            Bundle bundle = new Bundle();
                            bundle.putString("response", message);
                            msg.setData(bundle);
                            handler.sendMessage(msg);
                        }
                    };
                    channel.basicConsume(q.getQueue(), true, consumer);

                } catch (TimeoutException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });
        responseQueueThread.start();
    }

    public void PublishToRequestQueue(Zahtev zahtev) {

        try {
            Gson gson = new Gson();
            String z = gson.toJson(zahtev);
            requestQueue.putLast(z);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void SendToOcenaQueue(Ocena ocena) {

        Gson gson = new Gson();
        String msg = gson.toJson(ocena);
        try {
            ocenaQueue.putLast(msg);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void GiveStars(float ocena) {

        Ocena o = new Ocena();
        o.setOcena(Float.toString(ocena));
        o.setIdVoznje(idVoznje.getId_voznje());
        SendToOcenaQueue(o);
    }

    private void SendToOcenaQueue() {
        ocenaQueueThread = new Thread(new Runnable() {
            @Override
            public void run() {
                while(true)
                {
                    try
                    {
                        Connection connection = factory.newConnection();
                        Channel channel = connection.createChannel();
                        channel.confirmSelect();

                        while(true)
                        {
                            String message;
                            if(ocenaQueue.size() > 0) {
                                message = ocenaQueue.takeFirst();
                                try {
                                    channel.basicPublish("", Constants.QUEUE_OCENA,
                                            null, message.getBytes("UTF-8"));
                                    channel.waitForConfirmsOrDie();
                                } catch (Exception e) {
                                    Toast.makeText(getApplicationContext(),
                                            "Message not sent, trying again....",
                                            Toast.LENGTH_SHORT).show();

                                    ocenaQueue.putFirst(message);
                                    e.printStackTrace();
                                }
                            }

                        }

                    }
                    catch(Exception e)
                    {
                        Toast.makeText(getApplicationContext(),
                                "Message not sent, connection broken.",
                                Toast.LENGTH_SHORT).show();
                    }
                }
            }
        });
        ocenaQueueThread.start();
    }

    private void SendToRequestQueue() {

        requestQueueThread = new Thread(new Runnable() {
            @Override
            public void run() {

                while(true)
                {
                    try
                    {
                        Connection connection = factory.newConnection();
                        Channel channel = connection.createChannel();
                        channel.confirmSelect();

                        while(true)
                        {
                            String message;
                            if(requestQueue.size() > 0) {
                                message = requestQueue.takeFirst();
                                try {
                                    channel.basicPublish("", Constants.QUEUE_REQUEST,
                                            null, message.getBytes("UTF-8"));
                                    channel.waitForConfirmsOrDie();
                                } catch (Exception e) {
                                    Toast.makeText(getApplicationContext(),
                                            "Message not sent, trying again....",
                                            Toast.LENGTH_SHORT).show();

                                    requestQueue.putFirst(message);
                                    e.printStackTrace();
                                }
                            }

                        }

                    }
                    catch(Exception e)
                    {
                        Toast.makeText(getApplicationContext(),
                                "Message not sent, connection broken.",
                                Toast.LENGTH_SHORT).show();
                    }
                }
            }
        });
        requestQueueThread.start();
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mapResolver.setmMap(googleMap);

        mapResolver.getmMap().setOnInfoWindowClickListener(this);

        addTaxisToMap();


        if (mLocationPermissionsGranted) {

            mapResolver.moveCamera(new LatLng(mapResolver.getLastKnownLocation().getLatitude(),
                    mapResolver.getLastKnownLocation().getLongitude()), 1f);

            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                    != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this,
                    Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                return;
            }
            mapResolver.getmMap().setMyLocationEnabled(true);

        }
        setUpMapClick();
    }

    private void getLocationPermission(){

        String[] permissions = {Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION};

        if(ContextCompat.checkSelfPermission(this.getApplicationContext(),
                FINE_LOCATION) == PackageManager.PERMISSION_GRANTED){
            if(ContextCompat.checkSelfPermission(this.getApplicationContext(),
                    COURSE_LOCATION) == PackageManager.PERMISSION_GRANTED){
                mLocationPermissionsGranted = true;
                initMap();
            }else{
                ActivityCompat.requestPermissions(this,
                        permissions,
                        LOCATION_PERMISSION_REQUEST_CODE);
            }
        }else{
            ActivityCompat.requestPermissions(this,
                    permissions,
                    LOCATION_PERMISSION_REQUEST_CODE);
        }
    }

    private void initMap() {
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map_client);

        mapFragment.getMapAsync(MainActivityClient.this);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {

        mLocationPermissionsGranted = false;

        switch(requestCode){
            case LOCATION_PERMISSION_REQUEST_CODE:{
                if(grantResults.length > 0){
                    for(int i = 0; i < grantResults.length; i++){
                        if(grantResults[i] != PackageManager.PERMISSION_GRANTED){
                            mLocationPermissionsGranted = false;
                            return;
                        }
                    }
                    mLocationPermissionsGranted = true;
                    initMap();
                }
            }
        }
    }

    private void setUpMapClick() {

        mapResolver.getmMap().setOnMapClickListener(new GoogleMap.OnMapClickListener() {
            @Override
            public void onMapClick(final LatLng arg0) {
                AlertDialog.Builder builder = new AlertDialog.Builder(MainActivityClient.this);

                builder.setMessage("Is this where you want taxi to wait?")
                        .setCancelable(true)
                        .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {

                                zahtev = new Zahtev();

                                zahtev.setMyLatitude(Double.toString(arg0.latitude));
                                zahtev.setMyLongitude(Double.toString(arg0.longitude));

                                Toast.makeText(getApplicationContext(), "You chose your location", Toast.LENGTH_SHORT).show();

                                dialog.dismiss();
                            }
                        })
                        .setNegativeButton("No", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.cancel();
                            }
                        });
                AlertDialog alert = builder.create();
                alert.show();
            }
        });
    }
    @Override
    public void onInfoWindowClick(final Marker marker) {
        final AlertDialog.Builder builder = new AlertDialog.Builder(this);

        builder.setMessage(marker.getSnippet())
                .setCancelable(true)
                .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {

                        zahtev.setQueueNameForResponse(android_id);
                        zahtev.setUsernameTaksiste(marker.getTitle());

                        PublishToRequestQueue(zahtev);

                        dialog.dismiss();
                    }
                })
                .setNegativeButton("No", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.cancel();
                    }
                });
        final AlertDialog alert = builder.create();
        alert.show();
    }

    private void setupConnectionFactory(String uri) {
        try
        {
            factory.setAutomaticRecoveryEnabled(false);
            factory.setUri(uri);
        }
        catch(KeyManagementException | NoSuchAlgorithmException | URISyntaxException e)
        {
            e.printStackTrace();
        }
    }
    @Override
    public void applyReply(String reply) {
        GiveStars(Float.parseFloat(reply));
    }
}


