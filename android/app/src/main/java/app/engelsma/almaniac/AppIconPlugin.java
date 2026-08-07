package app.engelsma.almaniac;

import android.content.ComponentName;
import android.content.pm.PackageManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AppIcon")
public class AppIconPlugin extends Plugin {
    private static final String ALIAS_LIGHT = ".IconLight";
    private static final String ALIAS_DARK = ".IconDark";

    @PluginMethod
    public void setIcon(PluginCall call) {
        String icon = call.getString("icon", "light");
        boolean useDark = "dark".equals(icon);

        PackageManager manager = getContext().getPackageManager();
        ComponentName light = aliasComponent(ALIAS_LIGHT);
        ComponentName dark = aliasComponent(ALIAS_DARK);

        manager.setComponentEnabledSetting(
            light,
            useDark ? PackageManager.COMPONENT_ENABLED_STATE_DISABLED : PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
            PackageManager.DONT_KILL_APP
        );
        manager.setComponentEnabledSetting(
            dark,
            useDark ? PackageManager.COMPONENT_ENABLED_STATE_ENABLED : PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
            PackageManager.DONT_KILL_APP
        );

        JSObject result = new JSObject();
        result.put("icon", useDark ? "dark" : "light");
        call.resolve(result);
    }

    @PluginMethod
    public void getIcon(PluginCall call) {
        PackageManager manager = getContext().getPackageManager();
        ComponentName dark = aliasComponent(ALIAS_DARK);
        int state = manager.getComponentEnabledSetting(dark);
        boolean isDark = state == PackageManager.COMPONENT_ENABLED_STATE_ENABLED;

        JSObject result = new JSObject();
        result.put("icon", isDark ? "dark" : "light");
        call.resolve(result);
    }

    private ComponentName aliasComponent(String alias) {
        return new ComponentName(getContext(), alias);
    }
}
