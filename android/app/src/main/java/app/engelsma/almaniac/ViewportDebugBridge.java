package app.engelsma.almaniac;

import android.webkit.JavascriptInterface;
import android.webkit.WebView;

public class ViewportDebugBridge {
    private final WebView webView;

    ViewportDebugBridge(WebView webView) {
        this.webView = webView;
    }

    @JavascriptInterface
    public int getWebViewWidthPx() {
        return webView.getWidth();
    }

    @JavascriptInterface
    public int getWebViewHeightPx() {
        return webView.getHeight();
    }

    @JavascriptInterface
    public int getScrollXPx() {
        return webView.getScrollX();
    }

    @JavascriptInterface
    public int getScrollYPx() {
        return webView.getScrollY();
    }

    @JavascriptInterface
    public float getScale() {
        // getScale() is deprecated and throws on modern WebView/Chromium builds.
        return 1f;
    }
}
