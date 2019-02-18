package com.example.milica.myapplication;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatDialogFragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RadioButton;
import android.widget.Toast;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.gson.Gson;

/**
 * Created by Milica on 10-Jan-19.
 */

public class TaxiReplyDialog extends AppCompatDialogFragment implements OnMapReadyCallback {

    private String response;
    private DialogListener listener;
    private GoogleMap mMap;
    private LatLng markerLatLng;
    private View view;
    private SupportMapFragment supportMapFragment;
    private Context context;

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {

        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());

        LayoutInflater inflater = getActivity().getLayoutInflater();
        try {
            view = inflater.inflate(R.layout.taxi_reply_dialog, null);
        }
        catch(Exception e) {
            Toast.makeText(getActivity(), "asd", Toast.LENGTH_SHORT).show();
        }

        try {
            String args = getArguments().getString("marker");
            Gson gson = new Gson();
            markerLatLng = gson.fromJson(args, LatLng.class);
        }
        catch (Exception e) {
            String ex = e.toString();
        }

        builder.setView(view)
        .setNegativeButton("No", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                response = "No";
                listener.applyReply(response);

            }
        })
        .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {

                RadioButton rb1 = (RadioButton) view.findViewById(R.id.radioButton1);
                RadioButton rb2 = (RadioButton) view.findViewById(R.id.radioButton2);
                RadioButton rb3 = (RadioButton) view.findViewById(R.id.radioButton3);
                RadioButton rb5 = (RadioButton) view.findViewById(R.id.radioButton5);
                RadioButton rb10 = (RadioButton) view.findViewById(R.id.radioButton10);

                if(rb1.isChecked()) {
                    response = "1 minute";
                }
                else if(rb2.isChecked()) {
                    response = "2 minutes";
                }
                else if(rb3.isChecked()) {
                    response = "3 minutes";
                }
                else if(rb5.isChecked()) {
                    response = "5 minute5";
                }
                else if(rb10.isChecked()){
                    response = "10 minutes";
                }
                listener.applyReply(response);
            }
        });

       // supportMapFragment = (SupportMapFragment) getActivity().getSupportFragmentManager().findFragmentById(R.id.map_taxi_reply_dialog);
        supportMapFragment = (SupportMapFragment) getChildFragmentManager().findFragmentById(R.id.map_layout);
        if(supportMapFragment == null) {
            supportMapFragment = SupportMapFragment.newInstance();
            getChildFragmentManager().beginTransaction().replace(R.id.map_layout, supportMapFragment).commit()
        }
        supportMapFragment.getMapAsync(this);

        return builder.create();
    }

    /**
     * Called to have the fragment instantiate its user interface view.
     * This is optional, and non-graphical fragments can return null (which
     * is the default implementation).  This will be called between
     * {@link #onCreate(Bundle)} and {@link #onActivityCreated(Bundle)}.
     * <p>
     * <p>If you return a View from here, you will later be called in
     * {@link #onDestroyView} when the view is being released.
     *
     * @param inflater           The LayoutInflater object that can be used to inflate
     *                           any views in the fragment,
     * @param container          If non-null, this is the parent view that the fragment's
     *                           UI should be attached to.  The fragment should not add the view itself,
     *                           but this can be used to generate the LayoutParams of the view.
     * @param savedInstanceState If non-null, this fragment is being re-constructed
     *                           from a previous saved state as given here.
     * @return Return the View for the fragment's UI, or null.
     */
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return super.onCreateView(inflater, container, savedInstanceState);
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

        try {
            listener = (DialogListener) context;
            this.context = context;
        } catch (ClassCastException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {

        mMap = googleMap;
        mMap.addMarker(new MarkerOptions().position(markerLatLng).title("Starting point"));
        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(markerLatLng, 17));
    }

    public interface DialogListener {

        void applyReply(String minutes);
    }

    public static TaxiReplyDialog newInstance(String marker) {

        TaxiReplyDialog trd = new TaxiReplyDialog();
        Bundle bundle = new Bundle();
        bundle.putString("marker", marker);
        trd.setArguments(bundle);

        return trd;
    }

}
