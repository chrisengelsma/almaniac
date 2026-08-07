import SwiftUI
import WidgetKit

struct AlmaniactWidgetEntry: TimelineEntry {
    let date: Date
    let calendarId: String
    let calendarName: String
    let displayDate: String
    let backgroundColor: Color
    let textColor: Color
}

struct AlmaniactWidgetProvider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> AlmaniactWidgetEntry {
        AlmaniactWidgetEntry(
            date: Date(),
            calendarId: "gregorian",
            calendarName: "Gregorian Calendar",
            displayDate: "August 5, 2026",
            backgroundColor: Color(red: 0.89, green: 0.92, blue: 0.72),
            textColor: Color(red: 0.15, green: 0.20, blue: 0.22)
        )
    }

    func snapshot(for configuration: SelectCalendarIntent, in context: Context) async -> AlmaniactWidgetEntry {
        entry(for: configuration)
    }

    func timeline(for configuration: SelectCalendarIntent, in context: Context) async -> Timeline<AlmaniactWidgetEntry> {
        let currentEntry = entry(for: configuration)
        let nextRefresh = Calendar.current.startOfDay(for: Date().addingTimeInterval(86_400))
        return Timeline(entries: [currentEntry], policy: .after(nextRefresh))
    }

    private func entry(for configuration: SelectCalendarIntent) -> AlmaniactWidgetEntry {
        let calendarId = configuration.calendar?.id ?? "gregorian"
        let useTransliteration = configuration.transliterateToEnglish

        if let data = WidgetDataStore.calendarData(for: calendarId) {
            let displayDate = useTransliteration
                ? (data.dateTransliterated ?? data.date)
                : data.date

            return AlmaniactWidgetEntry(
                date: Date(),
                calendarId: calendarId,
                calendarName: data.calendarName,
                displayDate: displayDate,
                backgroundColor: color(from: data.backgroundColor),
                textColor: color(from: data.textColor ?? "#263238")
            )
        }

        return AlmaniactWidgetEntry(
            date: Date(),
            calendarId: calendarId,
            calendarName: "Almaniac",
            displayDate: "Open Almaniac to refresh",
            backgroundColor: Color(red: 0.89, green: 0.92, blue: 0.72),
            textColor: Color(red: 0.15, green: 0.20, blue: 0.22)
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

struct AlmaniactWidgetEntryView: View {
    var entry: AlmaniactWidgetProvider.Entry

    var body: some View {
        Text(entry.displayDate)
            .font(.headline)
            .fontWeight(.bold)
            .foregroundStyle(entry.textColor)
            .multilineTextAlignment(.center)
            .minimumScaleFactor(0.6)
            .lineLimit(3)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
            .padding(12)
            .background(entry.backgroundColor)
    }
}

@available(iOS 17.0, *)
struct AlmaniactWidget: Widget {
    let kind = "AlmaniactWidget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: SelectCalendarIntent.self, provider: AlmaniactWidgetProvider()) { entry in
            AlmaniactWidgetEntryView(entry: entry)
                .containerBackground(for: .widget) {
                    entry.backgroundColor
                }
        }
        .configurationDisplayName("Almaniac Calendar")
        .description("Today's date in a calendar of your choice.")
        .supportedFamilies([.systemSmall])
    }
}
