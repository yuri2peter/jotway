import { Settings, settingsSchema } from '@local/common';
import { changeStore, getStore } from '..';
import { requestApi } from 'src/utils/request';
import { bingWallpaper } from 'src/api/utils';

export async function openSystemModal() {
  changeStore((d) => {
    d.systemForm.modalOpen = true;
    d.systemForm.tabIndex = 0;
    d.systemForm.settings = d.settings;
  });
}

export async function fetchSettings() {
  const data = await requestApi('settings/get');
  const settings = settingsSchema.parse(data);
  changeStore((d) => {
    d.settings = settings;
  });
  await applySettings();
}

export async function applySettings() {
  const { settings: s } = getStore();
  await updateLocalWallpaper(s);
  updateLocalLangType(s.langType);
}

export async function saveSettingsFromForm(newSettings: Settings) {
  const s = settingsSchema.parse(newSettings);
  await requestApi('settings/set', s);
  await fetchSettings();
}

export async function updateLocalWallpaper({
  wallpaperType,
  customWallpaperUrl,
}: Pick<Settings, 'wallpaperType' | 'customWallpaperUrl'>) {
  if (wallpaperType === 'custom') {
    changeStore((d) => {
      d.appearance.bgImage = customWallpaperUrl;
    });
  } else if (wallpaperType === 'bing') {
    bingWallpaper().then(({ url }) => {
      changeStore((d) => {
        d.appearance.bgImage = url;
      });
    });
  }
}

export function updateLocalLangType(langType: 'zh' | 'en') {
  changeStore((d) => {
    d.appearance.langType = langType;
  });
  localStorage.setItem('langType', langType);
}
