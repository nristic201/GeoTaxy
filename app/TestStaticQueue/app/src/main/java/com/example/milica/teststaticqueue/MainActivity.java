package com.example.milica.teststaticqueue;

import android.annotation.SuppressLint;
import android.os.Handler;
import android.os.Message;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.google.gson.Gson;
import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Consumer;
import com.rabbitmq.client.DefaultConsumer;
import com.rabbitmq.client.Envelope;

import java.io.IOException;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.BlockingDeque;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeoutException;

public class MainActivity extends AppCompatActivity {

    ConnectionFactory factory = new ConnectionFactory();
    private BlockingDeque<String> queue = new LinkedBlockingDeque<String>();
    Thread subscribeThread;
    Thread publishThread;
    private static String QUEUE_NAME_REQUEST = "loginRequest";
    private static String QUEUE_NAME_RESPONSE= "loginResponse";
    private static String hostName = "amqp://yfidhcfx:D_3FHXHAUckbirmes_ZKCqICb3lFYL2V@bee.rmq.cloudamqp.com/yfidhcfx";

    @SuppressLint("AuthLeak")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        setupConnectionFactory(hostName);
        SendMessage();
        setupSendButton();
        @SuppressLint("HandlerLeak") final Handler incomingMessageHandler = new Handler() {
            @Override
            public void handleMessage(Message msg) {
                String message = msg.getData().getString("msg");
                TextView tv = (TextView) findViewById(R.id.response);
                Date now;
                now = new Date();
                @SuppressLint("SimpleDateFormat") SimpleDateFormat ft = new SimpleDateFormat ("hh:mm:ss");
                tv.append(ft.format(now) + ' ' + message + '\n');
            }
        };
        ReceieveMessage(incomingMessageHandler);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        publishThread.interrupt();
        subscribeThread.interrupt();
    }

    void setupSendButton() {
        Button button = (Button) findViewById(R.id.send);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                EditText etUsername = (EditText) findViewById(R.id.username);
                EditText etPassword = (EditText) findViewById(R.id.password);
                User user = new User(etUsername.getText().toString(), etPassword.getText().toString());
                Gson gson = new Gson();
                String userJSON = gson.toJson(user);
                PushToInternalQueue(userJSON);
                //et.setText("");
            }
        });
    }

    void PushToInternalQueue(String message)
    {
        try {
            Log.d("","[q] " + message);
            queue.putLast(message);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    void ReceieveMessage(final Handler handler)
    {
        subscribeThread = new Thread(new Runnable()
        {
            @Override
            public void run()
            {
                try
                {
                    Connection connection = factory.newConnection();
                    Channel channel = connection.createChannel();

                    Consumer consumer = new DefaultConsumer(channel) {
                            @Override
                            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body)
                             throws IOException {

                                String message = new String(body, "UTF-8");

                                Message msg = handler.obtainMessage();
                                Bundle bundle = new Bundle();
                                bundle.putString("msg", message);
                                msg.setData(bundle);
                                handler.sendMessage(msg);
                            }
                    };
                    channel.basicConsume(QUEUE_NAME_RESPONSE, true, consumer);

            } catch (TimeoutException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }});
        subscribeThread.start();
    }

    void SendMessage()
    {
        publishThread = new Thread(new Runnable() {
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
                            if(queue.size() > 0) {
                                message = queue.takeFirst();
                                try {
                                    channel.basicPublish("", QUEUE_NAME_REQUEST, null, message.getBytes("UTF-8"));
                                    channel.waitForConfirmsOrDie();
                                } catch (Exception e) {
                                    queue.putFirst(message);
                                    e.printStackTrace();
                                }
                            }

                       }

                    }
                    catch(Exception e)
                    {
                        Log.d("", "Connection broken: " + e.getClass().getName());

                    }
                }
            }
        });
        publishThread.start();
    }

    private void setupConnectionFactory(String uri)
    {
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
}
