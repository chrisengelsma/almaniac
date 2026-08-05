import Foundation

enum WidgetConstants {
    static let appGroupId = "group.app.engelsma.almaniac"
    static let snapshotKey = "almaniac.widget.snapshot.v1"
}

struct WidgetCalendarData: Codable {
    let label: String
    let calendarName: String
    let weekday: String
    let date: String
    let backgroundColor: String
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
}
