package app.engelsma.almaniac;

import android.graphics.Color;
import android.view.View;
import android.view.Window;
import android.webkit.WebView;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "SystemChrome")
public class SystemChromePlugin extends Plugin {

    @PluginMethod
    public void setColors(PluginCall call) {
        String background = call.getString("background", "#faf9f4");
        boolean lightStatusBarIcons = call.getBoolean("lightStatusBarIcons", false);

        if (getActivity() == null) {
            call.resolve();
            return;
        }

        getActivity().runOnUiThread(() -> {
            try {
                if (getActivity() == null) {
                    return;
                }

                int color = Color.parseColor(background);
                Window window = getActivity().getWindow();
                if (window == null) {
                    return;
                }

                window.setStatusBarColor(color);
                window.setNavigationBarColor(color);
                window.getDecorView().setBackgroundColor(color);

                WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
                controller.setAppearanceLightStatusBars(!lightStatusBarIcons);
                controller.setAppearanceLightNavigationBars(!lightStatusBarIcons);
            } catch (IllegalArgumentException ignored) {
                // Ignore invalid color strings from the web layer.
            } finally {
                call.resolve();
            }
        });
    }

    @PluginMethod
    public void getSafeArea(PluginCall call) {
        if (getActivity() == null) {
            call.resolve(emptyInsets());
            return;
        }

        getActivity().runOnUiThread(() -> {
            try {
                if (getActivity() == null) {
                    call.resolve(emptyInsets());
                    return;
                }

                Window window = getActivity().getWindow();
                if (window == null) {
                    call.resolve(emptyInsets());
                    return;
                }

                View decorView = window.getDecorView();
                WindowInsetsCompat windowInsets = ViewCompat.getRootWindowInsets(decorView);

                if (windowInsets == null) {
                    call.resolve(emptyInsets());
                    return;
                }

                if (getBridge() == null || getBridge().getWebView() == null) {
                    call.resolve(emptyInsets());
                    return;
                }

                Insets systemBars = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars());
                float density = getActivity().getResources().getDisplayMetrics().density;

                WebView webView = getBridge().getWebView();
                int[] location = new int[2];
                webView.getLocationOnScreen(location);

                int webViewTop = location[1];
                int webViewBottom = webViewTop + webView.getHeight();
                int screenHeight = decorView.getHeight();

                int cssTop = webViewTop >= systemBars.top ? 0 : Math.round(systemBars.top / density);
                int cssBottom =
                    webViewBottom <= screenHeight - systemBars.bottom
                        ? 0
                        : Math.round(systemBars.bottom / density);
                int cssLeft = Math.round(systemBars.left / density);
                int cssRight = Math.round(systemBars.right / density);

                JSObject result = new JSObject();
                result.put("top", cssTop);
                result.put("right", cssRight);
                result.put("bottom", cssBottom);
                result.put("left", cssLeft);
                call.resolve(result);
            } catch (RuntimeException exception) {
                call.resolve(emptyInsets());
            }
        });
    }

    private JSObject emptyInsets() {
        JSObject result = new JSObject();
        result.put("top", 0);
        result.put("right", 0);
        result.put("bottom", 0);
        result.put("left", 0);
        return result;
    }
}
