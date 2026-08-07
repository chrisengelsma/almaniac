package app.engelsma.almaniac.widget;

import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Switch;
import app.engelsma.almaniac.R;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONException;
import org.json.JSONObject;

public class CalendarWidgetConfigureActivity extends Activity {
    public static final String EXTRA_CALENDAR_ID = "calendar_id";
    public static final String EXTRA_CALENDAR_LABEL = "calendar_label";

    private int appWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setResult(RESULT_CANCELED);
        setContentView(R.layout.activity_widget_configure);

        Intent intent = getIntent();
        Bundle extras = intent.getExtras();
        if (extras != null) {
            appWidgetId = extras.getInt(AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID);
        }

        if (appWidgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
            finish();
            return;
        }

        Switch transliterateSwitch = findViewById(R.id.widget_transliterate_switch);
        transliterateSwitch.setChecked(WidgetSnapshotReader.getTransliterateToEnglish(this, appWidgetId));

        List<CalendarOption> options = loadCalendarOptions();
        ListView listView = findViewById(R.id.widget_calendar_list);
        ArrayAdapter<CalendarOption> adapter = new ArrayAdapter<>(
            this,
            android.R.layout.simple_list_item_1,
            options
        );
        listView.setAdapter(adapter);
        listView.setOnItemClickListener((AdapterView<?> parent, View view, int position, long id) -> {
            CalendarOption option = options.get(position);
            WidgetSnapshotReader.setCalendarId(this, appWidgetId, option.id);
            WidgetSnapshotReader.setTransliterateToEnglish(
                this,
                appWidgetId,
                transliterateSwitch.isChecked()
            );

            AppWidgetManager manager = AppWidgetManager.getInstance(this);
            CalendarWidgetProvider.updateWidgets(this, manager, new int[] { appWidgetId });

            Intent result = new Intent();
            result.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
            setResult(RESULT_OK, result);
            finish();
        });
    }

    private List<CalendarOption> loadCalendarOptions() {
        List<CalendarOption> options = new ArrayList<>();
        JSONObject snapshot = WidgetSnapshotReader.readSnapshot(this);
        if (snapshot != null) {
            try {
                JSONObject calendars = snapshot.getJSONObject("calendars");
                String[] ids = {
                    "gregorian",
                    "julian",
                    "ethiopian",
                    "coptic",
                    "chinese",
                    "japanese",
                    "minguo",
                    "soviet",
                    "frc",
                    "maya",
                    "islamic",
                    "hebrew",
                    "persian",
                    "bahai",
                    "thaiBuddhist",
                    "bengali",
                    "isoWeek",
                    "discordian",
                    "indianCivil",
                    "julianDay"
                };
                for (String id : ids) {
                    if (!calendars.has(id)) {
                        continue;
                    }
                    JSONObject calendar = calendars.getJSONObject(id);
                    options.add(new CalendarOption(id, calendar.optString("label", id)));
                }
            } catch (JSONException exception) {
                options.clear();
            }
        }

        if (options.isEmpty()) {
            options.add(new CalendarOption("gregorian", "Gregorian"));
            options.add(new CalendarOption("julian", "Julian"));
            options.add(new CalendarOption("ethiopian", "Ethiopian"));
            options.add(new CalendarOption("coptic", "Coptic"));
            options.add(new CalendarOption("chinese", "Chinese"));
            options.add(new CalendarOption("japanese", "Japanese"));
            options.add(new CalendarOption("minguo", "Minguo"));
            options.add(new CalendarOption("soviet", "Soviet"));
            options.add(new CalendarOption("frc", "FRC"));
            options.add(new CalendarOption("maya", "Maya"));
            options.add(new CalendarOption("islamic", "Islamic"));
            options.add(new CalendarOption("hebrew", "Hebrew"));
            options.add(new CalendarOption("persian", "Persian"));
            options.add(new CalendarOption("bahai", "Baháʼí"));
            options.add(new CalendarOption("thaiBuddhist", "Thai Buddhist"));
            options.add(new CalendarOption("bengali", "Bengali"));
            options.add(new CalendarOption("isoWeek", "ISO Week"));
            options.add(new CalendarOption("discordian", "Discordian"));
            options.add(new CalendarOption("indianCivil", "Indian Civil"));
            options.add(new CalendarOption("julianDay", "Julian Day"));
        }

        return options;
    }

    private static final class CalendarOption {
        public final String id;
        private final String label;

        private CalendarOption(String id, String label) {
            this.id = id;
            this.label = label;
        }

        @Override
        public String toString() {
            return label;
        }
    }
}
