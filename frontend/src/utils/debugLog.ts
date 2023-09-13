import { IS_PROD } from 'src/configs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function debugLog(message?: any, ...optionalParams: any[]) {
  if (!IS_PROD) {
    console.log(message, ...optionalParams);
  }
}
