# Almaniac release shrinking rules for Capacitor + custom plugins/widgets.

-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Capacitor plugins and annotations
-keep @com.getcapacitor.annotation.CapacitorPlugin public class * {
    @com.getcapacitor.annotation.PermissionCallback <methods>;
    @com.getcapacitor.annotation.ActivityCallback <methods>;
    @com.getcapacitor.annotation.Permission <methods>;
    @com.getcapacitor.PluginMethod public <methods>;
}

-keep public class * extends com.getcapacitor.Plugin { *; }

# Capacitor v2 plugins (deprecated, still used by some Cordova bridges)
-keep @com.getcapacitor.NativePlugin public class * {
    @com.getcapacitor.PluginMethod public <methods>;
}

# Cordova plugins
-keep public class * extends org.apache.cordova.* {
    public <methods>;
    public <fields>;
}

# App entry point, custom Capacitor plugins, and home-screen widget code
-keep class app.engelsma.almaniac.** { *; }

# WebView bridge
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

-keep class com.getcapacitor.** { *; }
-keep class com.getcapacitor.plugin.** { *; }

# Google Play Billing (native purchases plugin)
-keep class com.android.billingclient.** { *; }
-keep class ee.forgr.nativepurchases.** { *; }

# Play In-App Review
-keep class com.google.android.play.core.** { *; }
