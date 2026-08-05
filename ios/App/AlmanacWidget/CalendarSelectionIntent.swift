import AppIntents
import WidgetKit

@available(iOS 17.0, *)
struct CalendarChoice: AppEntity, Identifiable {
    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "Calendar")
    static var defaultQuery = CalendarChoiceQuery()

    let id: String
    let label: String

    var displayRepresentation: DisplayRepresentation {
        DisplayRepresentation(title: "\(label)")
    }
}

@available(iOS 17.0, *)
struct CalendarChoiceQuery: EntityQuery {
    func entities(for identifiers: [CalendarChoice.ID]) async throws -> [CalendarChoice] {
        allChoices().filter { identifiers.contains($0.id) }
    }

    func suggestedEntities() async throws -> [CalendarChoice] {
        allChoices()
    }

    private func allChoices() -> [CalendarChoice] {
        if let snapshot = WidgetDataStore.loadSnapshot() {
            return snapshot.calendars
                .map { CalendarChoice(id: $0.key, label: $0.value.label) }
                .sorted { $0.label < $1.label }
        }

        return [
            CalendarChoice(id: "gregorian", label: "Gregorian"),
            CalendarChoice(id: "julian", label: "Julian"),
            CalendarChoice(id: "ethiopian", label: "Ethiopian"),
            CalendarChoice(id: "coptic", label: "Coptic"),
            CalendarChoice(id: "chinese", label: "Chinese"),
            CalendarChoice(id: "soviet", label: "Soviet"),
            CalendarChoice(id: "frc", label: "FRC"),
            CalendarChoice(id: "maya", label: "Maya"),
            CalendarChoice(id: "islamic", label: "Islamic"),
            CalendarChoice(id: "hebrew", label: "Hebrew"),
            CalendarChoice(id: "persian", label: "Persian"),
            CalendarChoice(id: "bahai", label: "Baháʼí"),
            CalendarChoice(id: "indianCivil", label: "Indian Civil"),
            CalendarChoice(id: "julianDay", label: "Julian Day"),
        ]
    }
}

@available(iOS 17.0, *)
struct SelectCalendarIntent: WidgetConfigurationIntent {
    static var title: LocalizedStringResource = "Calendar"
    static var description = IntentDescription("Choose which calendar to display.")

    @Parameter(title: "Calendar")
    var calendar: CalendarChoice?

    init() {
        calendar = CalendarChoice(id: "gregorian", label: "Gregorian")
    }

    init(calendar: CalendarChoice) {
        self.calendar = calendar
    }
}
