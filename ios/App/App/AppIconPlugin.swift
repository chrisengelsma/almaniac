import Foundation
import Capacitor

@objc(AppIconPlugin)
public class AppIconPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "AppIconPlugin"
    public let jsName = "AppIcon"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "setIcon", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getIcon", returnType: CAPPluginReturnPromise)
    ]

    private let darkIconName = "AppIcon-Dark"

    @objc func setIcon(_ call: CAPPluginCall) {
        guard UIApplication.shared.supportsAlternateIcons else {
            call.reject("Alternate icons are not supported on this device")
            return
        }

        let requested = call.getString("icon") ?? "light"
        let targetName: String? = requested == "dark" ? darkIconName : nil
        let resolvedIcon = requested == "dark" ? "dark" : "light"

        if UIApplication.shared.alternateIconName == targetName {
            call.resolve(["icon": resolvedIcon])
            return
        }

        DispatchQueue.main.async {
            UIApplication.shared.setAlternateIconName(targetName) { error in
                if let error {
                    call.reject(error.localizedDescription)
                    return
                }

                call.resolve(["icon": resolvedIcon])
            }
        }
    }

    @objc func getIcon(_ call: CAPPluginCall) {
        let current = UIApplication.shared.alternateIconName
        let icon = current == darkIconName ? "dark" : "light"
        call.resolve(["icon": icon])
    }
}
