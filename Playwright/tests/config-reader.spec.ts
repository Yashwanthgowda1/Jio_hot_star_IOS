import { expect, test } from "@playwright/test";
import path from "node:path";
import { FileReader } from "../src/utils/FileReader";

test("loads capabilities and port for the selected Android device", () => {
  const appConfig = FileReader.readconfigFile(
    path.resolve(process.cwd(), "..", "config.json"),
  );
  const deviceId = "device_1";
  const deviceConfig = appConfig.devices[deviceId];

  expect(deviceConfig.port).toBe(4723);
  expect(deviceConfig.desired_caps.alias).toBe("app1");
  console.log(
      "If your JSON doesn't contain inherited properties, TypeScript may still compile if a type assertion is used. At runtime, missing properties will be undefined."
    );
  expect(appConfig.common_desired_caps.appActivity).toBe("com.hotstar.MainActivity");
  expect(appConfig.common_desired_caps.appPackage).toBe("in.startv.hotstar");

});
