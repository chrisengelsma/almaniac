import SwiftUI
import WidgetKit

@main
struct AlmaniactWidgetBundle: WidgetBundle {
    var body: some Widget {
        if #available(iOS 17.0, *) {
            AlmaniactWidget()
        }
    }
}
