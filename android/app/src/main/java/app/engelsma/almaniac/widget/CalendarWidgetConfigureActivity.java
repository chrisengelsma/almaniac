package app.engelsma.almaniac.widget;

import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.RadioGroup;
import android.widget.Spinner;
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
    private String selectedCalendarId = "gregorian";
    private int selectedCalendarPosition = 0;

    private View islamicOptions;
    private View julianOptions;
    private View mayaOptions;
    private View frcOptions;
    private View julianDayOptions;

    private Spinner islamicModeSpinner;
    private Spinner islamicAdjustmentSpinner;
    private Spinner julianModeSpinner;
    private Switch mayaHieroglyphsSwitch;
    private Switch frcRomanSwitch;
    private Switch modifiedJulianDaySwitch;

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

        RadioGroup themeGroup = findViewById(R.id.widget_color_theme_group);
        String savedTheme = WidgetSnapshotReader.getColorTheme(this, appWidgetId);
        if ("mono".equals(savedTheme)) {
            themeGroup.check(R.id.widget_theme_mono);
        } else if ("sepia".equals(savedTheme)) {
            themeGroup.check(R.id.widget_theme_sepia);
        } else {
            themeGroup.check(R.id.widget_theme_distinct);
        }

        islamicOptions = findViewById(R.id.widget_islamic_options);
        julianOptions = findViewById(R.id.widget_julian_options);
        mayaOptions = findViewById(R.id.widget_maya_options);
        frcOptions = findViewById(R.id.widget_frc_options);
        julianDayOptions = findViewById(R.id.widget_julian_day_options);

        islamicModeSpinner = findViewById(R.id.widget_islamic_mode_spinner);
        islamicAdjustmentSpinner = findViewById(R.id.widget_islamic_adjustment_spinner);
        julianModeSpinner = findViewById(R.id.widget_julian_mode_spinner);
        mayaHieroglyphsSwitch = findViewById(R.id.widget_maya_hieroglyphs_switch);
        frcRomanSwitch = findViewById(R.id.widget_frc_roman_switch);
        modifiedJulianDaySwitch = findViewById(R.id.widget_modified_julian_day_switch);

        bindOptionSpinners();
        loadSavedCalendarOptions();

        selectedCalendarId = WidgetSnapshotReader.getCalendarId(this, appWidgetId);

        List<CalendarOption> options = loadCalendarOptions();
        ListView listView = findViewById(R.id.widget_calendar_list);
        ArrayAdapter<CalendarOption> adapter = new ArrayAdapter<>(
            this,
            android.R.layout.simple_list_item_single_choice,
            options
        );
        listView.setAdapter(adapter);
        listView.setChoiceMode(ListView.CHOICE_MODE_SINGLE);

        for (int index = 0; index < options.size(); index += 1) {
            if (options.get(index).id.equals(selectedCalendarId)) {
                selectedCalendarPosition = index;
                listView.setItemChecked(index, true);
                break;
            }
        }

        updateCalendarOptionPanels(selectedCalendarId);

        listView.setOnItemClickListener((AdapterView<?> parent, View view, int position, long id) -> {
            selectedCalendarPosition = position;
            selectedCalendarId = options.get(position).id;
            updateCalendarOptionPanels(selectedCalendarId);
        });

        Button saveButton = findViewById(R.id.widget_save_button);
        saveButton.setOnClickListener((View view) -> {
            CalendarOption option = options.get(selectedCalendarPosition);
            WidgetSnapshotReader.setCalendarId(this, appWidgetId, option.id);
            WidgetSnapshotReader.setTransliterateToEnglish(
                this,
                appWidgetId,
                transliterateSwitch.isChecked()
            );
            WidgetSnapshotReader.setColorTheme(this, appWidgetId, selectedColorTheme(themeGroup));
            WidgetSnapshotReader.setCalendarOptions(this, appWidgetId, readCalendarOptionsFromUi());

            AppWidgetManager manager = AppWidgetManager.getInstance(this);
            CalendarWidgetProvider.updateWidgets(this, manager, new int[] { appWidgetId });

            Intent result = new Intent();
            result.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
            setResult(RESULT_OK, result);
            finish();
        });
    }

    private void bindOptionSpinners() {
        ArrayAdapter<String> islamicModeAdapter = new ArrayAdapter<>(
            this,
            android.R.layout.simple_spinner_item,
            new String[] {
                getString(R.string.widget_islamic_system_tabular),
                getString(R.string.widget_islamic_system_umm_al_qura),
            }
        );
        islamicModeAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        islamicModeSpinner.setAdapter(islamicModeAdapter);

        ArrayAdapter<String> islamicAdjustmentAdapter = new ArrayAdapter<>(
            this,
            android.R.layout.simple_spinner_item,
            new String[] {
                getString(R.string.widget_islamic_adjustment_minus_one),
                getString(R.string.widget_islamic_adjustment_zero),
                getString(R.string.widget_islamic_adjustment_plus_one),
            }
        );
        islamicAdjustmentAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        islamicAdjustmentSpinner.setAdapter(islamicAdjustmentAdapter);

        ArrayAdapter<String> julianModeAdapter = new ArrayAdapter<>(
            this,
            android.R.layout.simple_spinner_item,
            new String[] {
                getString(R.string.widget_julian_system_julian),
                getString(R.string.widget_julian_system_revised),
            }
        );
        julianModeAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        julianModeSpinner.setAdapter(julianModeAdapter);
    }

    private void loadSavedCalendarOptions() {
        WidgetVariantKeys.WidgetCalendarOptions options = WidgetSnapshotReader.getCalendarOptions(this, appWidgetId);
        islamicModeSpinner.setSelection("ummAlQura".equals(options.islamicCalendarMode) ? 1 : 0);
        if (options.islamicDayAdjustment == -1) {
            islamicAdjustmentSpinner.setSelection(0);
        } else if (options.islamicDayAdjustment == 1) {
            islamicAdjustmentSpinner.setSelection(2);
        } else {
            islamicAdjustmentSpinner.setSelection(1);
        }
        julianModeSpinner.setSelection("revisedJulian".equals(options.julianCalendarMode) ? 1 : 0);
        mayaHieroglyphsSwitch.setChecked(options.mayaUseHieroglyphs);
        frcRomanSwitch.setChecked(options.frcUseRomanNumerals);
        modifiedJulianDaySwitch.setChecked(options.useModifiedJulianDay);
    }

    private WidgetVariantKeys.WidgetCalendarOptions readCalendarOptionsFromUi() {
        WidgetVariantKeys.WidgetCalendarOptions options = new WidgetVariantKeys.WidgetCalendarOptions();
        options.islamicCalendarMode = islamicModeSpinner.getSelectedItemPosition() == 1 ? "ummAlQura" : "tabular";
        switch (islamicAdjustmentSpinner.getSelectedItemPosition()) {
            case 0:
                options.islamicDayAdjustment = -1;
                break;
            case 2:
                options.islamicDayAdjustment = 1;
                break;
            default:
                options.islamicDayAdjustment = 0;
                break;
        }
        options.julianCalendarMode = julianModeSpinner.getSelectedItemPosition() == 1
            ? "revisedJulian"
            : "julian";
        options.mayaUseHieroglyphs = mayaHieroglyphsSwitch.isChecked();
        options.frcUseRomanNumerals = frcRomanSwitch.isChecked();
        options.useModifiedJulianDay = modifiedJulianDaySwitch.isChecked();
        return options;
    }

    private void updateCalendarOptionPanels(String calendarId) {
        islamicOptions.setVisibility("islamic".equals(calendarId) ? View.VISIBLE : View.GONE);
        julianOptions.setVisibility("julian".equals(calendarId) ? View.VISIBLE : View.GONE);
        mayaOptions.setVisibility("maya".equals(calendarId) ? View.VISIBLE : View.GONE);
        frcOptions.setVisibility("frc".equals(calendarId) ? View.VISIBLE : View.GONE);
        julianDayOptions.setVisibility("julianDay".equals(calendarId) ? View.VISIBLE : View.GONE);
    }

    private static String selectedColorTheme(RadioGroup themeGroup) {
        int checkedId = themeGroup.getCheckedRadioButtonId();
        if (checkedId == R.id.widget_theme_mono) {
            return "mono";
        }
        if (checkedId == R.id.widget_theme_sepia) {
            return "sepia";
        }
        return "distinct";
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
                    "shahanshahi",
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
            options.add(new CalendarOption("shahanshahi", "Shahanshahi"));
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
