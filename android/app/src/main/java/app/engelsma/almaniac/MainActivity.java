package app.engelsma.almaniac;

import android.content.res.Configuration;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewTreeObserver;
import android.webkit.WebSettings;
import android.webkit.WebView;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private ViewTreeObserver.OnGlobalLayoutListener webViewLayoutListener;
    private boolean viewportDebugBridgeAttached;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WidgetBridgePlugin.class);
        registerPlugin(AppIconPlugin.class);
        super.onCreate(savedInstanceState);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
    }

    @Override
    public void onResume() {
        super.onResume();
        configureWebView();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        configureWebView();
    }

    @Override
    public boolean dispatchTouchEvent(MotionEvent event) {
        // Chromium maps pointer events using the WebView scroll offset. Keep it pinned.
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            if (webView.getScrollX() != 0 || webView.getScrollY() != 0) {
                webView.scrollTo(0, 0);
            }
        }

        return super.dispatchTouchEvent(event);
    }

    private void configureWebView() {
        if (getBridge() == null || getBridge().getWebView() == null) {
            return;
        }

        WebView webView = getBridge().getWebView();
        WebSettings settings = webView.getSettings();
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(false);
        settings.setTextZoom(100);
        settings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.NORMAL);

        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);
        webView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        if (!viewportDebugBridgeAttached) {
            webView.addJavascriptInterface(new ViewportDebugBridge(webView), "AlmaniacViewportDebug");
            viewportDebugBridgeAttached = true;
        }

        attachScrollLockListener(webView);
        webView.post(this::resetWebViewScroll);
    }

    private void attachScrollLockListener(WebView webView) {
        if (webViewLayoutListener != null) {
            webView.getViewTreeObserver().removeOnGlobalLayoutListener(webViewLayoutListener);
        }

        webViewLayoutListener = () -> resetWebViewScroll();
        webView.getViewTreeObserver().addOnGlobalLayoutListener(webViewLayoutListener);
    }

    private void resetWebViewScroll() {
        if (getBridge() == null || getBridge().getWebView() == null) {
            return;
        }

        WebView webView = getBridge().getWebView();
        webView.scrollTo(0, 0);
        webView.evaluateJavascript("window.dispatchEvent(new Event('resize'));", null);
    }
}
