package app.engelsma.almaniac.widget;

import android.appwidget.AppWidgetManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;

public class WidgetMidnightReceiver extends BroadcastReceiver {
    static final String ACTION_REFRESH = "app.engelsma.almaniac.widget.ACTION_MIDNIGHT_REFRESH";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null || !ACTION_REFRESH.equals(intent.getAction())) {
            return;
        }

        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        ComponentName provider = new ComponentName(context, CalendarWidgetProvider.class);
        int[] widgetIds = manager.getAppWidgetIds(provider);
        if (widgetIds.length > 0) {
            CalendarWidgetProvider.updateWidgets(context, manager, widgetIds);
        }

        WidgetUpdateScheduler.scheduleNextMidnightRefresh(context);
    }
}
