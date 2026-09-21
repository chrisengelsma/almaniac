package app.engelsma.almaniac.widget;

public final class WidgetVariantKeys {
    private WidgetVariantKeys() {}

    public static String forCalendar(String calendarId, WidgetCalendarOptions options) {
        switch (calendarId) {
            case "islamic":
                return options.islamicCalendarMode + ":" + options.islamicDayAdjustment;
            case "julian":
                return options.julianCalendarMode;
            case "maya":
                return options.mayaUseHieroglyphs ? "hieroglyphs" : "latin";
            case "frc":
                return options.frcUseRomanNumerals ? "roman" : "arabic";
            case "julianDay":
                return options.useModifiedJulianDay ? "modified" : "standard";
            default:
                return "default";
        }
    }

    public static final class WidgetCalendarOptions {
        public String islamicCalendarMode = "tabular";
        public int islamicDayAdjustment = 0;
        public String julianCalendarMode = "julian";
        public boolean mayaUseHieroglyphs = true;
        public boolean frcUseRomanNumerals = true;
        public boolean useModifiedJulianDay = false;
    }
}
