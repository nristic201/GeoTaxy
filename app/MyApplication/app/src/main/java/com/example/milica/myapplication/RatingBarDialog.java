package com.example.milica.myapplication;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatDialogFragment;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.RadioButton;
import android.widget.RatingBar;
import android.widget.Toast;

/**
 * Created by Milica on 12-Jan-19.
 */

public class RatingBarDialog extends AppCompatDialogFragment {

    private RatingDialogListener listener;
    private float stars;

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());

        LayoutInflater inflater = getActivity().getLayoutInflater();
        final View view = inflater.inflate(R.layout.rating_dialog, null);
        final RatingBar ratingBar = (RatingBar) view.findViewById(R.id.ratingBarDrive);

        ratingBar.setOnRatingBarChangeListener(new RatingBar.OnRatingBarChangeListener() {
            @Override
            public void onRatingChanged(RatingBar ratingBar, float rating, boolean fromUser) {
                //Toast.makeText(getContext(), "Rate saved", Toast.LENGTH_SHORT).show();
            }
        });

        builder.setView(view)
                .setNegativeButton("No", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        listener.applyReply(null);
                    }
                })
                .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        stars = ratingBar.getRating();
                        listener.applyReply(Float.toString(stars));

                    }
        });

        return builder.create();
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

        try {
            listener = (RatingDialogListener) context;
        } catch (ClassCastException e) {
            e.printStackTrace();
        }
    }

    public interface RatingDialogListener {
        void applyReply(String reply);
    }
}
