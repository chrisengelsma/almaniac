import AppIntents
import WidgetKit

@available(iOS 17.0, *)
enum WidgetColorTheme: String, AppEnum {
    case distinct
    case mono
    case sepia

    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "Color Theme")

    static var caseDisplayRepresentations: [WidgetColorTheme: DisplayRepresentation] = [
        .distinct: "Distinct",
        .mono: "Mono",
        .sepia: "Sepia",
    ]
}

@available(iOS 17.0, *)
enum WidgetIslamicCalendarMode: String, AppEnum {
    case tabular
    case ummAlQura

    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "Islamic System")

    static var caseDisplayRepresentations: [WidgetIslamicCalendarMode: DisplayRepresentation] = [
        .tabular: "Tabular",
        .ummAlQura: "Umm al-Qura",
    ]
}

@available(iOS 17.0, *)
enum WidgetIslamicDayAdjustment: String, AppEnum {
    case minus1
    case zero
    case plus1

    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "Islamic Day Adjustment")

    static var caseDisplayRepresentations: [WidgetIslamicDayAdjustment: DisplayRepresentation] = [
        .minus1: "−1 day",
        .zero: "No adjustment",
        .plus1: "+1 day",
    ]

    var numericValue: Int {
        switch self {
        case .minus1:
            return -1
        case .zero:
            return 0
        case .plus1:
            return 1
        }
    }
}

@available(iOS 17.0, *)
enum WidgetJulianCalendarMode: String, AppEnum {
    case julian
    case revisedJulian

    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "Julian System")

    static var caseDisplayRepresentations: [WidgetJulianCalendarMode: DisplayRepresentation] = [
        .julian: "Julian",
        .revisedJulian: "Revised Julian",
    ]
}

@available(iOS 17.0, *)
struct CalendarChoice: AppEntity, Identifiable, Equatable {
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
                .map { CalendarChoice(id: $0.key, label: $0.value.calendarName) }
                .sorted { $0.label < $1.label }
        }

        return [
            CalendarChoice(id: "gregorian", label: "Gregorian Calendar"),
            CalendarChoice(id: "julian", label: "Julian Calendar"),
            CalendarChoice(id: "ethiopian", label: "Ethiopian Calendar"),
            CalendarChoice(id: "coptic", label: "Coptic Calendar"),
            CalendarChoice(id: "chinese", label: "Chinese Calendar"),
            CalendarChoice(id: "japanese", label: "Japanese Calendar"),
            CalendarChoice(id: "minguo", label: "Minguo Calendar"),
            CalendarChoice(id: "soviet", label: "Soviet Calendar"),
            CalendarChoice(id: "frc", label: "French Republican Calendar"),
            CalendarChoice(id: "maya", label: "Maya Calendar"),
            CalendarChoice(id: "islamic", label: "Islamic Calendar"),
            CalendarChoice(id: "hebrew", label: "Hebrew Calendar"),
            CalendarChoice(id: "persian", label: "Persian Calendar"),
            CalendarChoice(id: "shahanshahi", label: "Shahanshahi Calendar"),
            CalendarChoice(id: "bahai", label: "Baháʼí Calendar"),
            CalendarChoice(id: "thaiBuddhist", label: "Thai Buddhist Calendar"),
            CalendarChoice(id: "bengali", label: "Bengali Calendar"),
            CalendarChoice(id: "isoWeek", label: "ISO Week Calendar"),
            CalendarChoice(id: "discordian", label: "Discordian Calendar"),
            CalendarChoice(id: "indianCivil", label: "Indian Civil Calendar"),
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

    @Parameter(title: "Color Theme", default: .distinct)
    var colorTheme: WidgetColorTheme

    @Parameter(title: "Transliterate to English", default: false)
    var transliterateToEnglish: Bool

    @Parameter(title: "Islamic System", default: .tabular)
    var islamicCalendarMode: WidgetIslamicCalendarMode

    @Parameter(title: "Islamic Day Adjustment", default: .zero)
    var islamicDayAdjustment: WidgetIslamicDayAdjustment

    @Parameter(title: "Julian System", default: .julian)
    var julianCalendarMode: WidgetJulianCalendarMode

    @Parameter(title: "Maya Hieroglyphs", default: true)
    var mayaUseHieroglyphs: Bool

    @Parameter(title: "French Republican Roman Numerals", default: true)
    var frcUseRomanNumerals: Bool

    @Parameter(title: "Modified Julian Day", default: false)
    var useModifiedJulianDay: Bool

    init() {
        calendar = CalendarChoice(id: "gregorian", label: "Gregorian Calendar")
        colorTheme = .distinct
        transliterateToEnglish = false
        islamicCalendarMode = .tabular
        islamicDayAdjustment = .zero
        julianCalendarMode = .julian
        mayaUseHieroglyphs = true
        frcUseRomanNumerals = true
        useModifiedJulianDay = false
    }

    init(
        calendar: CalendarChoice,
        colorTheme: WidgetColorTheme = .distinct,
        transliterateToEnglish: Bool = false,
        islamicCalendarMode: WidgetIslamicCalendarMode = .tabular,
        islamicDayAdjustment: WidgetIslamicDayAdjustment = .zero,
        julianCalendarMode: WidgetJulianCalendarMode = .julian,
        mayaUseHieroglyphs: Bool = true,
        frcUseRomanNumerals: Bool = true,
        useModifiedJulianDay: Bool = false
    ) {
        self.calendar = calendar
        self.colorTheme = colorTheme
        self.transliterateToEnglish = transliterateToEnglish
        self.islamicCalendarMode = islamicCalendarMode
        self.islamicDayAdjustment = islamicDayAdjustment
        self.julianCalendarMode = julianCalendarMode
        self.mayaUseHieroglyphs = mayaUseHieroglyphs
        self.frcUseRomanNumerals = frcUseRomanNumerals
        self.useModifiedJulianDay = useModifiedJulianDay
    }

    func widgetVariantKey(for calendarId: String) -> String {
        switch calendarId {
        case "islamic":
            return "\(islamicCalendarMode.rawValue):\(islamicDayAdjustment.numericValue)"
        case "julian":
            return julianCalendarMode.rawValue
        case "maya":
            return mayaUseHieroglyphs ? "hieroglyphs" : "latin"
        case "frc":
            return frcUseRomanNumerals ? "roman" : "arabic"
        case "julianDay":
            return useModifiedJulianDay ? "modified" : "standard"
        default:
            return "default"
        }
    }
}
