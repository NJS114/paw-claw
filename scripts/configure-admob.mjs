import { readFileSync, writeFileSync } from 'node:fs';
import { loadEnv } from 'vite';

const target = process.argv[2];
if (target !== 'android' && target !== 'ios') throw new Error('Indiquer android ou ios.');
const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
const live = env.VITE_ADMOB_MODE === 'live' && env.VITE_ADMOB_ENABLED !== 'false';
const prefix = `VITE_ADMOB_${target.toUpperCase()}`;
const demoId = target === 'android' ? 'ca-app-pub-3940256099942544~3347511713' : 'ca-app-pub-3940256099942544~1458002511';
const appId = live ? env[`${prefix}_APP_ID`] : demoId;
if (!/^ca-app-pub-\d{16}~\d{10}$/.test(appId || '')) throw new Error(`${prefix}_APP_ID doit être un identifiant d’application AdMob valide.`);
if (live) {
  for (const kind of ['REWARDED', 'INTERSTITIAL']) {
    const id = env[`${prefix}_${kind}_ID`] || '';
    if (!/^ca-app-pub-\d{16}\/\d{10}$/.test(id) || id.startsWith('ca-app-pub-3940256099942544/')) {
      throw new Error(`${prefix}_${kind}_ID doit être un véritable bloc d’annonce pour le mode live.`);
    }
  }
  if (appId === demoId) throw new Error('Le mode live nécessite ton propre identifiant d’application.');
}
const path = target === 'android' ? 'android/app/src/main/res/values/strings.xml' : 'ios/App/App/Info.plist';
const source = readFileSync(path, 'utf8');
const pattern = target === 'android' ? /(<string name="admob_app_id">)[^<]*(<\/string>)/ : /(<key>GADApplicationIdentifier<\/key>\s*<string>)[^<]*(<\/string>)/;
if (!pattern.test(source)) throw new Error(`Configuration AdMob absente de ${path}.`);
writeFileSync(path, source.replace(pattern, (_, start, end) => `${start}${appId}${end}`));
console.log(`AdMob ${target} configuré en mode ${live ? 'live' : 'test'}.`);
