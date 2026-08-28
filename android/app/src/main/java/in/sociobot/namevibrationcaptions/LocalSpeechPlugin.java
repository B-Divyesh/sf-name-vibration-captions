package in.sociobot.namevibrationcaptions;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;

import androidx.annotation.NonNull;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.util.ArrayList;

/**
 * Android's WebView does not expose a reliable local SpeechRecognition API.
 * This bridge deliberately uses the platform's on-device recognizer only (API 31+),
 * so no conversation audio is sent to a remote recognition service by Name Tap.
 */
@CapacitorPlugin(
    name = "LocalSpeech",
    permissions = { @Permission(alias = "microphone", strings = { Manifest.permission.RECORD_AUDIO }) }
)
public class LocalSpeechPlugin extends Plugin implements RecognitionListener {
    private SpeechRecognizer recognizer;
    private boolean intentionallyStopped = false;
    private boolean sessionActive = false;
    private String language = "en-US";

    @PluginMethod
    public void getStatus(PluginCall call) {
        JSObject result = new JSObject();
        boolean available = onDeviceRecognitionAvailable();
        result.put("available", available);
        if (!available) {
            result.put("reason", "On-device captions need Android 12 or later with an installed offline speech recognizer.");
        }
        call.resolve(result);
    }

    @PluginMethod
    public void start(PluginCall call) {
        if (!onDeviceRecognitionAvailable()) {
            call.reject("On-device captions need Android 12 or later with an installed offline speech recognizer.");
            return;
        }
        if (getPermissionState("microphone") != PermissionState.GRANTED) {
            requestPermissionForAlias("microphone", call, "microphonePermissionResult");
            return;
        }
        startRecognition(call);
    }

    @PermissionCallback
    private void microphonePermissionResult(PluginCall call) {
        if (getPermissionState("microphone") != PermissionState.GRANTED) {
            call.reject("Microphone access was blocked. Allow it in Android settings, then try again.");
            return;
        }
        startRecognition(call);
    }

    private boolean onDeviceRecognitionAvailable() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.S
            && SpeechRecognizer.isOnDeviceRecognitionAvailable(getContext());
    }

    private void startRecognition(PluginCall call) {
        stopRecognizer();
        try {
            recognizer = SpeechRecognizer.createOnDeviceSpeechRecognizer(getContext());
            recognizer.setRecognitionListener(this);
            intentionallyStopped = false;
            sessionActive = true;
            language = call.getString("language", "en-US");
            recognizer.startListening(recognitionIntent());
            call.resolve();
        } catch (Exception exception) {
            stopRecognizer();
            call.reject("Could not start on-device captions.", exception);
        }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        sessionActive = false;
        intentionallyStopped = true;
        stopRecognizer();
        call.resolve();
    }

    @PluginMethod
    public void vibrate(PluginCall call) {
        JSArray pattern = call.getArray("pattern");
        if (pattern == null || pattern.length() == 0) {
            call.reject("A vibration pattern is required.");
            return;
        }
        try {
            long[] waveform = new long[pattern.length() + 1];
            waveform[0] = 0;
            for (int index = 0; index < pattern.length(); index += 1) {
                waveform[index + 1] = Math.max(0, pattern.getLong(index));
            }
            Vibrator vibrator;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                VibratorManager manager = (VibratorManager) getContext().getSystemService(android.content.Context.VIBRATOR_MANAGER_SERVICE);
                vibrator = manager.getDefaultVibrator();
            } else {
                vibrator = (Vibrator) getContext().getSystemService(android.content.Context.VIBRATOR_SERVICE);
            }
            if (vibrator != null && vibrator.hasVibrator()) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) vibrator.vibrate(VibrationEffect.createWaveform(waveform, -1));
                else vibrator.vibrate(waveform, -1);
            }
            call.resolve();
        } catch (Exception exception) {
            call.reject("Could not trigger the vibration cue.", exception);
        }
    }

    private void stopRecognizer() {
        if (recognizer != null) {
            recognizer.stopListening();
            recognizer.destroy();
            recognizer = null;
        }
    }

    private Intent recognitionIntent() {
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, language);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
        intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3);
        intent.putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, true);
        return intent;
    }

    /** SpeechRecognizer completes one utterance at a time; keep the user-started session continuous. */
    private void restartRecognition() {
        if (!sessionActive || intentionallyStopped || recognizer == null) return;
        getActivity().runOnUiThread(() -> {
            if (sessionActive && !intentionallyStopped && recognizer != null) recognizer.startListening(recognitionIntent());
        });
    }

    private void emitCaption(Bundle results, boolean isFinal) {
        if (results == null) return;
        ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
        if (matches == null || matches.isEmpty() || matches.get(0) == null) return;
        JSObject caption = new JSObject();
        caption.put("text", matches.get(0));
        caption.put("final", isFinal);
        notifyListeners("caption", caption);
    }

    private void emitError(String message) {
        JSObject error = new JSObject();
        error.put("message", message);
        notifyListeners("error", error);
    }

    @Override public void onReadyForSpeech(Bundle params) { }
    @Override public void onBeginningOfSpeech() { }
    @Override public void onRmsChanged(float rmsdB) { }
    @Override public void onBufferReceived(byte[] buffer) { }
    @Override public void onEndOfSpeech() { }
    @Override public void onPartialResults(Bundle partialResults) { emitCaption(partialResults, false); }
    @Override public void onResults(Bundle results) { emitCaption(results, true); restartRecognition(); }
    @Override public void onEvent(int eventType, Bundle params) { }

    @Override
    public void onError(int error) {
        if (intentionallyStopped) return;
        switch (error) {
            case SpeechRecognizer.ERROR_AUDIO: emitError("Audio capture failed. Check the microphone and try again."); break;
            case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS: emitError("Microphone access was blocked. Allow it in Android settings, then try again."); break;
            case SpeechRecognizer.ERROR_LANGUAGE_NOT_SUPPORTED:
            case SpeechRecognizer.ERROR_LANGUAGE_UNAVAILABLE: emitError("The selected offline language pack is not installed."); break;
            case SpeechRecognizer.ERROR_NO_MATCH:
            case SpeechRecognizer.ERROR_SPEECH_TIMEOUT: restartRecognition(); break;
            default: emitError("On-device captions stopped. Press start to try again."); break;
        }
    }

    @Override
    protected void handleOnDestroy() {
        sessionActive = false;
        intentionallyStopped = true;
        stopRecognizer();
        super.handleOnDestroy();
    }
}
