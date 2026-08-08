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

struct AlmaniacWidgetEntryView: View {
    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.widgetFamily) private var family
    var entry: AlmaniacWidgetProvider.Entry

    private var backgroundColor: Color {
        color(from: resolvedThemeColors.background)
    }

    private var textColor: Color {
        color(from: resolvedThemeColors.text)
    }

    private var resolvedThemeColors: (background: String, text: String) {
        guard let data = WidgetDataStore.calendarData(for: entry.calendarId) else {
            return ("#e3eab8", "#263238")
        }

        return WidgetDataStore.themeColors(
            for: data,
            colorTheme: entry.colorTheme,
            isDark: colorScheme == .dark
        )
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
            Text(entry.displayDate)
                .font(dateFont)
                .fontWeight(.bold)
                .foregroundStyle(textColor)
                .multilineTextAlignment(.center)
                .minimumScaleFactor(0.6)
                .lineLimit(family == .systemSmall ? 3 : 4)
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)

            VStack {
                Text(entry.calendarName)
                    .font(calendarNameFont)
                    .fontWeight(.semibold)
                    .foregroundStyle(textColor.opacity(0.8))
                    .multilineTextAlignment(.center)
                    .lineLimit(family == .systemSmall ? 2 : 3)
                    .minimumScaleFactor(0.75)
                    .frame(maxWidth: .infinity)

                Spacer(minLength: 0)
            }
        }
        .padding(contentPadding)
        .background(backgroundColor)
    }

    private func color(from hex: String) -> Color {
        var sanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        if sanitized.hasPrefix("#") {
            sanitized.removeFirst()
        }

        guard sanitized.count == 6, let value = UInt64(sanitized, radix: 16) else {
            return Color(red: 0.89, green: 0.92, blue: 0.72)
        }

        let red = Double((value >> 16) & 0xFF) / 255.0
        let green = Double((value >> 8) & 0xFF) / 255.0
        let blue = Double(value & 0xFF) / 255.0
        return Color(red: red, green: green, blue: blue)
    }
}

struct WidgetThemeBackground: View {
    @Environment(\.colorScheme) private var colorScheme
    let entry: AlmaniacWidgetEntry

    var body: some View {
        color(from: resolvedThemeColors.background)
    }

    private var resolvedThemeColors: (background: String, text: String) {
        guard let data = WidgetDataStore.calendarData(for: entry.calendarId) else {
            return ("#e3eab8", "#263238")
        }

        return WidgetDataStore.themeColors(
            for: data,
            colorTheme: entry.colorTheme,
            isDark: colorScheme == .dark
        )
    }

    private func color(from hex: String) -> Color {
        var sanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        if sanitized.hasPrefix("#") {
            sanitized.removeFirst()
        }

        guard sanitized.count == 6, let value = UInt64(sanitized, radix: 16) else {
            return Color(red: 0.89, green: 0.92, blue: 0.72)
        }

        let red = Double((value >> 16) & 0xFF) / 255.0
        let green = Double((value >> 8) & 0xFF) / 255.0
        let blue = Double(value & 0xFF) / 255.0
        return Color(red: red, green: green, blue: blue)
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
