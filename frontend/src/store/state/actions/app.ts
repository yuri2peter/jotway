import { fetchLinkers } from './linker';
import { fetchSettings } from './settings';

export async function syncFromServer() {
  await fetchSettings();
  await fetchLinkers();
}
