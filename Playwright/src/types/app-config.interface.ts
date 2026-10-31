export interface AppConfig {
  common_desired_caps: AndroidCapabilities;
  devices: Record<string, AndroidDeviceConfig>;
  browsers: BrowserConfig;

}

export interface AndroidCapabilities {
  appActivity: string;
  appPackage: string;
  automationName: string;
  platformName: string;
  deviceName: string;
  newCommandTimeout: number;
  optionalIntentArguments: string;
}

export interface AndroidDeviceConfig extends AndroidCapabilities {
  port: number;
  desired_caps: {
    alias: string;
    udid: string;
  };
}

export interface BrowserConfig {
  web_site: string;
}

export interface Credentials {
  username: string;
  password: string;
}
