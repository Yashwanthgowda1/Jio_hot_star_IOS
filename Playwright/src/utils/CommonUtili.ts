
import { Locator } from "@playwright/test";
import type { ActionType } from "../pages/BasePage";

class CommonUtili {

    static async mouseactions(locator: Locator, actiontype: ActionType = "hover"): Promise<void> {
        const map={
            "hover": ()=> locator.hover(),
            "click": ()=> locator.click(),
            "doubleclick": ()=> locator.dblclick(),
            "rightclick": ()=> locator.click({button: "right"})

        }

        await map[actiontype]();
    }
}

export default CommonUtili;
