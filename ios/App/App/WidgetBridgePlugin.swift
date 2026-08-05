import Foundation
import Capacitor
import WidgetKit

@objc(WidgetBridgePlugin)
public class WidgetBridgePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "WidgetBridgePlugin"
    public let jsName = "WidgetBridge"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "syncSnapshot", returnType: CAPPluginReturnPromise)
    ]

    @objc func syncSnapshot(_ call: CAPPluginCall) {
        guard let snapshot = call.getString("snapshot") else {
            call.reject("snapshot is required")
            return
        }

        WidgetDataStore.saveSnapshotJSON(snapshot)

        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
        }

        call.resolve(["ok": true])
    }
}
