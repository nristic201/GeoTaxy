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

/**
 * Created by Milica on 10-Jan-19.
 */

public class TaxiReplyDialog extends AppCompatDialogFragment {

    private String response;
    private DialogListener listener;

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {

        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());

        LayoutInflater inflater = getActivity().getLayoutInflater();
        final View view = inflater.inflate(R.layout.taxi_reply_dialog, null);

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

        return builder.create();
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

        try {
            listener = (DialogListener) context;
        } catch (ClassCastException e) {
            e.printStackTrace();
        }
    }

    public interface DialogListener {

        void applyReply(String minutes);
    }


}
