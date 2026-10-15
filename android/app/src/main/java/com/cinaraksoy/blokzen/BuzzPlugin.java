package com.cinaraksoy.blokzen;

import android.content.Context;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Vibration waveforms with strength. The stock Haptics plugin only knows three fixed taps (light, medium, heavy); the game
 * wants a clear to hit harder with every line and combo step. wave() takes alternating off/on segments (timings, in ms)
 * and a strength 0..255 for each; phones without amplitude control get the same rhythm at full strength.
 */
@CapacitorPlugin(name = "Buzz")
public class BuzzPlugin extends Plugin {

    private Vibrator vibrator() {
        Context c = getContext();
        if (Build.VERSION.SDK_INT >= 31) {
            VibratorManager m = (VibratorManager) c.getSystemService(Context.VIBRATOR_MANAGER_SERVICE);
            return m != null ? m.getDefaultVibrator() : null;
        }
        return (Vibrator) c.getSystemService(Context.VIBRATOR_SERVICE);
    }

    @PluginMethod
    public void info(PluginCall call) {
        Vibrator v = vibrator();
        JSObject r = new JSObject();
        r.put("vibrator", v != null && v.hasVibrator());
        r.put("amplitude", v != null && Build.VERSION.SDK_INT >= 26 && v.hasAmplitudeControl());
        call.resolve(r);
    }

    @PluginMethod
    public void wave(PluginCall call) {
        JSArray t = call.getArray("timings"), a = call.getArray("amplitudes");
        try {
            Vibrator v = vibrator();
            if (t == null || t.length() == 0 || v == null || !v.hasVibrator()) { call.resolve(); return; }
            long[] timings = new long[t.length()];
            int[] amps = new int[timings.length];
            for (int i = 0; i < timings.length; i++) {
                timings[i] = Math.max(0, t.getLong(i));
                amps[i] = a != null && i < a.length() ? Math.max(0, Math.min(255, a.getInt(i))) : (i % 2 == 1 ? 255 : 0);
            }
            v.cancel(); // a new move cuts the tail of the last one short instead of queueing behind it
            if (Build.VERSION.SDK_INT >= 26) {
                if (v.hasAmplitudeControl()) v.vibrate(VibrationEffect.createWaveform(timings, amps, -1));
                else v.vibrate(VibrationEffect.createWaveform(timings, -1)); // even segments are off, odd ones on
            } else {
                v.vibrate(timings, -1);
            }
            call.resolve();
        } catch (Exception e) {
            call.reject("vibrate failed: " + e.getMessage());
        }
    }
}
