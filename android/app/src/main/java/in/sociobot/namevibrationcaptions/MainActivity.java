package in.sociobot.namevibrationcaptions;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(LocalSpeechPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
