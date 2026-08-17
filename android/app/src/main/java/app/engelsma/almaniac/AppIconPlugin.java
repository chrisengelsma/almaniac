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
    private static final String ALIAS_TEAL = ".IconTeal";

    @PluginMethod
    public void setIcon(PluginCall call) {
        String icon = call.getString("icon", "light");
        String activeAlias;

        switch (icon) {
            case "dark":
                activeAlias = ALIAS_DARK;
                break;
            case "supporter":
                activeAlias = ALIAS_TEAL;
                break;
            default:
                activeAlias = ALIAS_LIGHT;
                icon = "light";
                break;
        }

        setAliasEnabled(ALIAS_LIGHT, ALIAS_LIGHT.equals(activeAlias));
        setAliasEnabled(ALIAS_DARK, ALIAS_DARK.equals(activeAlias));
        setAliasEnabled(ALIAS_TEAL, ALIAS_TEAL.equals(activeAlias));

        JSObject result = new JSObject();
        result.put("icon", icon);
        call.resolve(result);
    }

    @PluginMethod
    public void getIcon(PluginCall call) {
        PackageManager manager = getContext().getPackageManager();

        if (isAliasEnabled(manager, ALIAS_DARK)) {
            JSObject result = new JSObject();
            result.put("icon", "dark");
            call.resolve(result);
            return;
        }

        if (isAliasEnabled(manager, ALIAS_TEAL)) {
            JSObject result = new JSObject();
            result.put("icon", "supporter");
            call.resolve(result);
            return;
        }

        JSObject result = new JSObject();
        result.put("icon", "light");
        call.resolve(result);
    }

    private void setAliasEnabled(String alias, boolean enabled) {
        getContext()
            .getPackageManager()
            .setComponentEnabledSetting(
                aliasComponent(alias),
                enabled
                    ? PackageManager.COMPONENT_ENABLED_STATE_ENABLED
                    : PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP
            );
    }

    private boolean isAliasEnabled(PackageManager manager, String alias) {
        int state = manager.getComponentEnabledSetting(aliasComponent(alias));
        return state == PackageManager.COMPONENT_ENABLED_STATE_ENABLED;
    }

    private ComponentName aliasComponent(String alias) {
        return new ComponentName(getContext(), alias);
    }
}
