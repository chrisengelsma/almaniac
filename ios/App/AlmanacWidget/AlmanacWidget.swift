import SwiftUI
import WidgetKit

struct AlmanacWidgetEntry: TimelineEntry {
    let date: Date
    let calendarId: String
    let calendarName: String
    let weekday: String
    let displayDate: String
    let backgroundColor: Color
}

struct AlmanacWidgetProvider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> AlmanacWidgetEntry {
        AlmanacWidgetEntry(
            date: Date(),
            calendarId: "gregorian",
            calendarName: "Gregorian Calendar",
            weekday: "Wednesday",
            displayDate: "August 5, 2026",
            backgroundColor: Color(red: 0.89, green: 0.92, blue: 0.72)
        )
    }

    func snapshot(for configuration: SelectCalendarIntent, in context: Context) async -> AlmanacWidgetEntry {
        entry(for: configuration)
    }

    func timeline(for configuration: SelectCalendarIntent, in context: Context) async -> Timeline<AlmanacWidgetEntry> {
        let currentEntry = entry(for: configuration)
        let nextRefresh = Calendar.current.startOfDay(for: Date().addingTimeInterval(86_400))
        return Timeline(entries: [currentEntry], policy: .after(nextRefresh))
    }

    private func entry(for configuration: SelectCalendarIntent) -> AlmanacWidgetEntry {
        let calendarId = configuration.calendar?.id ?? "gregorian"
        if let data = WidgetDataStore.calendarData(for: calendarId) {
            return AlmanacWidgetEntry(
                date: Date(),
                calendarId: calendarId,
                calendarName: data.calendarName,
                weekday: data.weekday,
                displayDate: data.date,
                backgroundColor: color(from: data.backgroundColor)
            )
        }

        return AlmanacWidgetEntry(
            date: Date(),
            calendarId: calendarId,
            calendarName: "Almaniac",
            weekday: "",
            displayDate: "Open Almaniac to refresh",
            backgroundColor: Color(red: 0.89, green: 0.92, blue: 0.72)
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

struct AlmanacWidgetEntryView: View {
    var entry: AlmanacWidgetProvider.Entry

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(entry.calendarName)
                .font(.caption)
                .fontWeight(.semibold)
                .foregroundStyle(Color(red: 0.12, green: 0.16, blue: 0.20))

            if !entry.weekday.isEmpty {
                Text(entry.weekday)
                    .font(.subheadline)
                    .foregroundStyle(Color(red: 0.20, green: 0.26, blue: 0.33))
            }

            Text(entry.displayDate)
                .font(.headline)
                .fontWeight(.bold)
                .foregroundStyle(Color(red: 0.06, green: 0.09, blue: 0.16))
                .minimumScaleFactor(0.7)
                .lineLimit(2)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        .padding(16)
        .background(entry.backgroundColor)
    }
}

@available(iOS 17.0, *)
struct AlmanacWidget: Widget {
    let kind = "AlmanacWidget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: SelectCalendarIntent.self, provider: AlmanacWidgetProvider()) { entry in
            AlmanacWidgetEntryView(entry: entry)
                .containerBackground(for: .widget) {
                    entry.backgroundColor
                }
        }
        .configurationDisplayName("Almaniac Calendar")
        .description("Today's date in a calendar of your choice.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
