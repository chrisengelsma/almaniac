import SwiftUI
import WidgetKit

@main
struct AlmanacWidgetBundle: WidgetBundle {
    var body: some Widget {
        if #available(iOS 17.0, *) {
            AlmanacWidget()
        }
    }
}
