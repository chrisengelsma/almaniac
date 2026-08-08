package app.engelsma.almaniac.widget;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Configuration;
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

    public static boolean getTransliterateToEnglish(Context context, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences(WidgetConstants.PREFS_NAME, Context.MODE_PRIVATE);
        return prefs.getBoolean(WidgetConstants.TRANSLITERATE_PREFIX + appWidgetId, false);
    }

    public static void setTransliterateToEnglish(Context context, int appWidgetId, boolean value) {
        SharedPreferences prefs = context.getSharedPreferences(WidgetConstants.PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putBoolean(WidgetConstants.TRANSLITERATE_PREFIX + appWidgetId, value).apply();
    }

    public static String getColorTheme(Context context, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences(WidgetConstants.PREFS_NAME, Context.MODE_PRIVATE);
        return prefs.getString(WidgetConstants.COLOR_THEME_PREFIX + appWidgetId, "distinct");
    }

    public static void setColorTheme(Context context, int appWidgetId, String colorTheme) {
        SharedPreferences prefs = context.getSharedPreferences(WidgetConstants.PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putString(WidgetConstants.COLOR_THEME_PREFIX + appWidgetId, colorTheme).apply();
    }

    public static void removeCalendarId(Context context, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences(WidgetConstants.PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit()
            .remove(WidgetConstants.CALENDAR_ID_PREFIX + appWidgetId)
            .remove(WidgetConstants.TRANSLITERATE_PREFIX + appWidgetId)
            .remove(WidgetConstants.COLOR_THEME_PREFIX + appWidgetId)
            .apply();
    }

    public static boolean isDarkMode(Context context) {
        int nightMode = context.getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
        return nightMode == Configuration.UI_MODE_NIGHT_YES;
    }

    public static CalendarWidgetData readCalendar(Context context, int appWidgetId) {
        String calendarId = getCalendarId(context, appWidgetId);
        boolean transliterate = getTransliterateToEnglish(context, appWidgetId);
        String colorTheme = getColorTheme(context, appWidgetId);
        boolean isDark = isDarkMode(context);
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
            String nativeDate = calendar.optString("date", "Open Almaniac");
            String transliteratedDate = calendar.optString("dateTransliterated", nativeDate);
            String displayDate = transliterate ? transliteratedDate : nativeDate;
            ThemeColors themeColors = readThemeColors(calendar, colorTheme, isDark);

            return new CalendarWidgetData(
                calendarId,
                calendar.optString("calendarName", "Calendar"),
                displayDate,
                parseColor(themeColors.backgroundColor),
                parseColor(themeColors.textColor)
            );
        } catch (JSONException exception) {
            return CalendarWidgetData.placeholder(calendarId);
        }
    }

    private static ThemeColors readThemeColors(JSONObject calendar, String colorTheme, boolean isDark) {
        JSONObject themes = calendar.optJSONObject("themes");
        if (themes != null && themes.has(colorTheme)) {
            JSONObject theme = themes.optJSONObject(colorTheme);
            if (theme != null) {
                JSONObject scheme = theme.optJSONObject(isDark ? "dark" : "light");
                if (scheme != null) {
                    return new ThemeColors(
                        scheme.optString("backgroundColor", "#e3eab8"),
                        scheme.optString("textColor", "#263238")
                    );
                }
            }
        }

        return new ThemeColors("#e3eab8", "#263238");
    }

    private static int parseColor(String value) {
        try {
            return Color.parseColor(value);
        } catch (IllegalArgumentException exception) {
            return Color.parseColor("#e3eab8");
        }
    }

    private static final class ThemeColors {
        private final String backgroundColor;
        private final String textColor;

        private ThemeColors(String backgroundColor, String textColor) {
            this.backgroundColor = backgroundColor;
            this.textColor = textColor;
        }
    }

    public static final class CalendarWidgetData {
        public final String calendarId;
        public final String calendarName;
        public final String date;
        public final int backgroundColor;
        public final int textColor;

        public CalendarWidgetData(
            String calendarId,
            String calendarName,
            String date,
            int backgroundColor,
            int textColor
        ) {
            this.calendarId = calendarId;
            this.calendarName = calendarName;
            this.date = date;
            this.backgroundColor = backgroundColor;
            this.textColor = textColor;
        }

        public static CalendarWidgetData placeholder(String calendarId) {
            return new CalendarWidgetData(
                calendarId,
                "Almaniac",
                "Open Almaniac to refresh",
                Color.parseColor("#e3eab8"),
                Color.parseColor("#263238")
            );
        }
    }
}
