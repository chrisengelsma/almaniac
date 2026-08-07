import Capacitor

class MainBridgeViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        super.capacitorDidLoad()
        registerLocalPlugins()
    }

    private func registerLocalPlugins() {
        guard let bridge = self.bridge else { return }

        bridge.registerPluginInstance(AppIconPlugin())
        bridge.registerPluginInstance(WidgetBridgePlugin())
    }
}
