import SwiftUI
import WidgetKit

struct AlmaniacWidgetEntry: TimelineEntry {
    let date: Date
    let calendarId: String
    let calendarName: String
    let displayDate: String
    let colorTheme: String
}

struct AlmaniacWidgetProvider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> AlmaniacWidgetEntry {
        AlmaniacWidgetEntry(
            date: Date(),
            calendarId: "gregorian",
            calendarName: "Gregorian Calendar",
            displayDate: "August 5, 2026",
            colorTheme: "distinct"
        )
    }

    func snapshot(for configuration: SelectCalendarIntent, in context: Context) async -> AlmaniacWidgetEntry {
        entry(for: configuration)
    }

    func timeline(for configuration: SelectCalendarIntent, in context: Context) async -> Timeline<AlmaniacWidgetEntry> {
        let currentEntry = entry(for: configuration)
        let nextRefresh = Calendar.current.startOfDay(for: Date().addingTimeInterval(86_400))
        return Timeline(entries: [currentEntry], policy: .after(nextRefresh))
    }

    private func entry(for configuration: SelectCalendarIntent) -> AlmaniacWidgetEntry {
        let calendarId = configuration.calendar?.id ?? "gregorian"
        let useTransliteration = configuration.transliterateToEnglish

        if let data = WidgetDataStore.calendarData(for: calendarId) {
            let displayDate = useTransliteration
                ? (data.dateTransliterated ?? data.date)
                : data.date

            return AlmaniacWidgetEntry(
                date: Date(),
                calendarId: calendarId,
                calendarName: data.calendarName,
                displayDate: displayDate,
                colorTheme: configuration.colorTheme.rawValue
            )
        }

        return AlmaniacWidgetEntry(
            date: Date(),
            calendarId: calendarId,
            calendarName: "Almaniac",
            displayDate: "Open Almaniac to refresh",
            colorTheme: configuration.colorTheme.rawValue
        )
    }
}

private enum WidgetColorParser {
    static func color(from hex: String, fallback: Color = Color(red: 0.89, green: 0.92, blue: 0.72)) -> Color {
        var sanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        if sanitized.hasPrefix("#") {
            sanitized.removeFirst()
        }

        guard sanitized.count == 6, let value = UInt64(sanitized, radix: 16) else {
            return fallback
        }

        let red = Double((value >> 16) & 0xFF) / 255.0
        let green = Double((value >> 8) & 0xFF) / 255.0
        let blue = Double(value & 0xFF) / 255.0
        return Color(red: red, green: green, blue: blue)
    }

    static func normalizedHex(_ hex: String) -> String {
        var sanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        if sanitized.hasPrefix("#") {
            sanitized.removeFirst()
        }
        return sanitized
    }

    static func relativeLuminance(for hex: String) -> Double {
        let sanitized = normalizedHex(hex)
        guard sanitized.count == 6, let value = UInt64(sanitized, radix: 16) else {
            return 0.5
        }

        let red = Double((value >> 16) & 0xFF) / 255.0
        let green = Double((value >> 8) & 0xFF) / 255.0
        let blue = Double(value & 0xFF) / 255.0
        return 0.299 * red + 0.587 * green + 0.114 * blue
    }

    static func contrastingText(for backgroundHex: String, proposedTextHex: String) -> String {
        if normalizedHex(backgroundHex) == normalizedHex(proposedTextHex) {
            return relativeLuminance(for: backgroundHex) > 0.55 ? "#263238" : "#f5f5f5"
        }
        return proposedTextHex
    }

    static func themeColors(
        for entry: AlmaniacWidgetEntry,
        colorScheme: ColorScheme
    ) -> (background: String, text: String) {
        guard let data = WidgetDataStore.calendarData(for: entry.calendarId) else {
            return ("#e3eab8", "#263238")
        }

        let colors = WidgetDataStore.themeColors(
            for: data,
            colorTheme: entry.colorTheme,
            isDark: colorScheme == .dark
        )
        return (
            colors.background,
            contrastingText(for: colors.background, proposedTextHex: colors.text)
        )
    }
}

struct AlmaniacWidgetEntryView: View {
    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.widgetFamily) private var family
    @Environment(\.widgetRenderingMode) private var renderingMode
    var entry: AlmaniacWidgetProvider.Entry

    private var resolvedThemeColors: (background: String, text: String) {
        WidgetColorParser.themeColors(for: entry, colorScheme: colorScheme)
    }

    private var textColor: Color {
        WidgetColorParser.color(from: resolvedThemeColors.text, fallback: Color(red: 0.15, green: 0.2, blue: 0.22))
    }

    private var usesAccentedRendering: Bool {
        renderingMode == .accented
    }

    private var displayDateText: String {
        let trimmed = entry.displayDate.trimmingCharacters(in: .whitespacesAndNewlines)
        return trimmed.isEmpty ? "Open Almaniac to refresh" : trimmed
    }

    private var calendarNameText: String {
        let trimmed = entry.calendarName.trimmingCharacters(in: .whitespacesAndNewlines)
        return trimmed.isEmpty ? "Almaniac" : trimmed
    }

    private var dateFont: Font {
        switch family {
        case .systemExtraLarge, .systemLarge:
            return .largeTitle
        case .systemMedium:
            return .title2
        default:
            return .headline
        }
    }

    private var calendarNameFont: Font {
        switch family {
        case .systemExtraLarge, .systemLarge:
            return .title3
        case .systemMedium:
            return .subheadline
        default:
            return .caption
        }
    }

    private var contentPadding: CGFloat {
        switch family {
        case .systemExtraLarge, .systemLarge:
            return 20
        case .systemMedium:
            return 16
        default:
            return 12
        }
    }

    var body: some View {
        ZStack {
            Text(displayDateText)
                .font(dateFont)
                .fontWeight(.bold)
                .foregroundStyle(usesAccentedRendering ? Color.primary : textColor)
                .widgetAccentable(usesAccentedRendering)
                .multilineTextAlignment(.center)
                .minimumScaleFactor(0.6)
                .lineLimit(family == .systemSmall ? 3 : 4)
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)

            VStack {
                Text(calendarNameText)
                    .font(calendarNameFont)
                    .fontWeight(.semibold)
                    .foregroundStyle(usesAccentedRendering ? Color.secondary : textColor.opacity(0.8))
                    .widgetAccentable(usesAccentedRendering)
                    .multilineTextAlignment(.center)
                    .lineLimit(family == .systemSmall ? 2 : 3)
                    .minimumScaleFactor(0.75)
                    .frame(maxWidth: .infinity)

                Spacer(minLength: 0)
            }
        }
        .padding(contentPadding)
    }
}

struct WidgetThemeBackground: View {
    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.widgetRenderingMode) private var renderingMode
    let entry: AlmaniacWidgetEntry

    private var resolvedThemeColors: (background: String, text: String) {
        WidgetColorParser.themeColors(for: entry, colorScheme: colorScheme)
    }

    var body: some View {
        WidgetColorParser.color(from: resolvedThemeColors.background)
            .opacity(renderingMode == .accented ? 0.28 : 1)
    }
}

struct AlmaniacWidget: Widget {
    let kind = "AlmaniacWidget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: SelectCalendarIntent.self, provider: AlmaniacWidgetProvider()) { entry in
            AlmaniacWidgetEntryView(entry: entry)
                .containerBackground(for: .widget) {
                    WidgetThemeBackground(entry: entry)
                }
        }
        .configurationDisplayName("Almaniac Calendar")
        .description("Today's date in a calendar of your choice.")
        .supportedFamilies([
            .systemSmall,
            .systemMedium,
            .systemLarge,
            .systemExtraLarge,
        ])
        .contentMarginsDisabled()
    }
}
