package app.engelsma.almaniac.widget;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import org.json.JSONException;
import org.json.JSONObject;

public final class WidgetSnapshotReader {
    private WidgetSnapshotReader() {}

    public static JSONObject readSnapshot(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(WidgetConstants.PREFS_NAME, Context.MODE_PRIVATE);
        String raw = prefs.getString(WidgetConstants.SNAPSHOT_KEY, null);
        if (raw == null || raw.isEmpty()) {
            return null;
        }

        try {
            return new JSONObject(raw);
        } catch (JSONException exception) {
            return null;
        }
    }

    public static String getCalendarId(Context context, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences(WidgetConstants.PREFS_NAME, Context.MODE_PRIVATE);
        return prefs.getString(WidgetConstants.CALENDAR_ID_PREFIX + appWidgetId, "gregorian");
    }

    public static void setCalendarId(Context context, int appWidgetId, String calendarId) {
        SharedPreferences prefs = context.getSharedPreferences(WidgetConstants.PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putString(WidgetConstants.CALENDAR_ID_PREFIX + appWidgetId, calendarId).apply();
    }

    public static void removeCalendarId(Context context, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences(WidgetConstants.PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().remove(WidgetConstants.CALENDAR_ID_PREFIX + appWidgetId).apply();
    }

    public static CalendarWidgetData readCalendar(Context context, int appWidgetId) {
        String calendarId = getCalendarId(context, appWidgetId);
        JSONObject snapshot = readSnapshot(context);
        if (snapshot == null) {
            return CalendarWidgetData.placeholder(calendarId);
        }

        try {
            JSONObject calendars = snapshot.getJSONObject("calendars");
            if (!calendars.has(calendarId)) {
                return CalendarWidgetData.placeholder(calendarId);
            }

            JSONObject calendar = calendars.getJSONObject(calendarId);
            return new CalendarWidgetData(
                calendarId,
                calendar.optString("calendarName", "Calendar"),
                calendar.optString("weekday", ""),
                calendar.optString("date", "Open Almaniac"),
                parseColor(calendar.optString("backgroundColor", "#e3eab8"))
            );
        } catch (JSONException exception) {
            return CalendarWidgetData.placeholder(calendarId);
        }
    }

    private static int parseColor(String value) {
        try {
            return Color.parseColor(value);
        } catch (IllegalArgumentException exception) {
            return Color.parseColor("#e3eab8");
        }
    }

    public static final class CalendarWidgetData {
        public final String calendarId;
        public final String calendarName;
        public final String weekday;
        public final String date;
        public final int backgroundColor;

        public CalendarWidgetData(
            String calendarId,
            String calendarName,
            String weekday,
            String date,
            int backgroundColor
        ) {
            this.calendarId = calendarId;
            this.calendarName = calendarName;
            this.weekday = weekday;
            this.date = date;
            this.backgroundColor = backgroundColor;
        }

        public static CalendarWidgetData placeholder(String calendarId) {
            return new CalendarWidgetData(
                calendarId,
                "Almaniac",
                "",
                "Open Almaniac to refresh",
                Color.parseColor("#e3eab8")
            );
        }
    }
}
