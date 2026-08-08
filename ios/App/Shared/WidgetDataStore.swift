import Foundation

enum WidgetConstants {
    static let appGroupId = "group.app.engelsma.almaniac"
    static let snapshotKey = "almaniac.widget.snapshot.v1"
}

struct WidgetThemeColors: Codable {
    let backgroundColor: String
    let textColor: String
}

struct WidgetThemeVariants: Codable {
    let light: WidgetThemeColors
    let dark: WidgetThemeColors
}

struct WidgetCalendarData: Codable {
    let label: String
    let calendarName: String
    let weekday: String
    let date: String
    let dateTransliterated: String?
    let themes: [String: WidgetThemeVariants]?
}

struct WidgetSnapshot: Codable {
    let version: Int
    let gregorianDate: String
    let updatedAt: String
    let calendars: [String: WidgetCalendarData]
}

enum WidgetDataStore {
    static var defaults: UserDefaults? {
        UserDefaults(suiteName: WidgetConstants.appGroupId)
    }

    static func saveSnapshotJSON(_ json: String) {
        defaults?.set(json, forKey: WidgetConstants.snapshotKey)
    }

    static func loadSnapshot() -> WidgetSnapshot? {
        guard let raw = defaults?.string(forKey: WidgetConstants.snapshotKey),
              let data = raw.data(using: .utf8) else {
            return nil
        }

        return try? JSONDecoder().decode(WidgetSnapshot.self, from: data)
    }

    static func calendarData(for calendarId: String) -> WidgetCalendarData? {
        loadSnapshot()?.calendars[calendarId]
    }

    static func themeColors(
        for data: WidgetCalendarData,
        colorTheme: String,
        isDark: Bool
    ) -> (background: String, text: String) {
        if let themes = data.themes,
           let variants = themes[colorTheme] {
            let colors = isDark ? variants.dark : variants.light
            return (colors.backgroundColor, colors.textColor)
        }

        return ("#e3eab8", "#263238")
    }
}
