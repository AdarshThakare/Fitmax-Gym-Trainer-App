package com.fitmax.app;

import android.Manifest;
import android.content.pm.PackageManager;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static final int MIC_PERMISSION_REQUEST_CODE = 1001;
    private PermissionRequest pendingWebRTCPermissionRequest;

    @Override
    public void onStart() {
        super.onStart();
        // Forward WebRTC permission requests from the WebView to the native OS
        bridge.getWebView().setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                pendingWebRTCPermissionRequest = request;

                boolean hasMic = ContextCompat.checkSelfPermission(
                        MainActivity.this, Manifest.permission.RECORD_AUDIO
                ) == PackageManager.PERMISSION_GRANTED;

                if (hasMic) {
                    // Already granted — hand it directly to the WebView
                    request.grant(request.getResources());
                    pendingWebRTCPermissionRequest = null;
                } else {
                    // Ask the OS — result handled in onRequestPermissionsResult
                    ActivityCompat.requestPermissions(
                            MainActivity.this,
                            new String[]{
                                    Manifest.permission.RECORD_AUDIO,
                                    Manifest.permission.MODIFY_AUDIO_SETTINGS
                            },
                            MIC_PERMISSION_REQUEST_CODE
                    );
                }
            }
        });
    }

    @Override
    public void onRequestPermissionsResult(
            int requestCode,
            String[] permissions,
            int[] grantResults
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == MIC_PERMISSION_REQUEST_CODE && pendingWebRTCPermissionRequest != null) {
            boolean granted = grantResults.length > 0
                    && grantResults[0] == PackageManager.PERMISSION_GRANTED;

            if (granted) {
                pendingWebRTCPermissionRequest.grant(pendingWebRTCPermissionRequest.getResources());
            } else {
                pendingWebRTCPermissionRequest.deny();
            }
            pendingWebRTCPermissionRequest = null;
        }
    }
}
