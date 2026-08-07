import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const configPath = resolve('ios/App/App/capacitor.config.json');
const localPlugins = ['AppIconPlugin', 'WidgetBridgePlugin'];

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const classList = new Set(config.packageClassList ?? []);

for (const plugin of localPlugins) {
  classList.add(plugin);
}

config.packageClassList = [...classList];
writeFileSync(configPath, `${JSON.stringify(config, null, '\t')}\n`);
