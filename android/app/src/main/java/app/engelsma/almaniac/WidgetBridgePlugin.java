package app.engelsma.almaniac;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import app.engelsma.almaniac.widget.CalendarWidgetProvider;
import app.engelsma.almaniac.widget.WidgetConstants;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WidgetBridge")
public class WidgetBridgePlugin extends Plugin {
    @PluginMethod
    public void syncSnapshot(PluginCall call) {
        String snapshot = call.getString("snapshot");
        if (snapshot == null || snapshot.isEmpty()) {
            call.reject("snapshot is required");
            return;
        }

        Context context = getContext();
        context
            .getSharedPreferences(WidgetConstants.PREFS_NAME, Context.MODE_PRIVATE)
            .edit()
            .putString(WidgetConstants.SNAPSHOT_KEY, snapshot)
            .apply();

        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        int[] widgetIds = manager.getAppWidgetIds(new ComponentName(context, CalendarWidgetProvider.class));
        if (widgetIds.length > 0) {
            CalendarWidgetProvider.updateWidgets(context, manager, widgetIds);
        }

        JSObject result = new JSObject();
        result.put("ok", true);
        call.resolve(result);
    }
}
