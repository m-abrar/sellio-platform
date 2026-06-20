import Constants from 'expo-constants';
import { NativeModules, Platform } from 'react-native';

function withoutTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function getExpoDevelopmentHost() {
  const expoHost = Constants.expoConfig?.hostUri?.split(':')[0];

  if (expoHost) {
    return expoHost;
  }

  const scriptUrl = NativeModules.SourceCode?.scriptURL as string | undefined;
  const host = scriptUrl?.match(/^https?:\/\/([^/:]+)/)?.[1];

  if (host) {
    return host;
  }

  return Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
}

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

export const API_URL = configuredApiUrl
  ? withoutTrailingSlash(configuredApiUrl)
  : `http://${getExpoDevelopmentHost()}:8000/api`;
