import Capacitor
import UIKit

class MainBridgeViewController: CAPBridgeViewController {
    private let appBackground = UIColor(red: 250 / 255, green: 249 / 255, blue: 244 / 255, alpha: 1)

    override func viewDidLoad() {
        super.viewDidLoad()
        edgesForExtendedLayout = .all
        extendedLayoutIncludesOpaqueBars = true
        additionalSafeAreaInsets = .zero
    }

    override open func capacitorDidLoad() {
        super.capacitorDidLoad()
        registerLocalPlugins()
        configureWebViewAppearance()
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        guard let webView = webView else { return }

        webView.frame = view.bounds
        webView.scrollView.frame = webView.bounds
        syncSafeAreaInsetsToWebView()

        let scrollView = webView.scrollView
        scrollView.isScrollEnabled = false
        scrollView.bounces = false
        scrollView.alwaysBounceVertical = false
        scrollView.contentInset = .zero
        scrollView.scrollIndicatorInsets = .zero
        scrollView.contentInsetAdjustmentBehavior = .never
        if #available(iOS 13.0, *) {
            scrollView.automaticallyAdjustsScrollIndicatorInsets = false
        }
    }

    private func registerLocalPlugins() {
        guard let bridge = self.bridge else { return }

        bridge.registerPluginInstance(AppIconPlugin())
        bridge.registerPluginInstance(WidgetBridgePlugin())
    }

    private func configureWebViewAppearance() {
        webView?.isOpaque = true
        webView?.backgroundColor = appBackground
        webView?.scrollView.backgroundColor = appBackground
        view.backgroundColor = appBackground
    }

    private func syncSafeAreaInsetsToWebView() {
        guard let webView = webView else { return }

        let insets = view.safeAreaInsets
        let script = """
        (function() {
          var root = document.documentElement;
          root.style.setProperty('--safe-area-inset-top', '\(insets.top)px');
          root.style.setProperty('--safe-area-inset-right', '\(insets.right)px');
          root.style.setProperty('--safe-area-inset-bottom', '\(insets.bottom)px');
          root.style.setProperty('--safe-area-inset-left', '\(insets.left)px');
        })();
        """

        webView.evaluateJavaScript(script, completionHandler: nil)
    }
}
