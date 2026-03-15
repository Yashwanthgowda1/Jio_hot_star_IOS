from appium.webdriver.common.appiumby import AppiumBy
import time

from Libraries import shared_utils
from Libraries import device_control
from Libraries import device_manager

home_page_dict = shared_utils.load_loctors("Resource\\page_object\\Home_page.json")


class sign_in:
    # Decorator
    def clear_cache_before_launch(func):
        def wrapper(self, device, *args, **kwargs):
            # Clear cache before launching
            device_control.clear_cache_the_app(device)

            # Retry getting driver
            self.driver = self.get_driver_with_retry(device=device)

            # Call the original function
            return func(self, device, *args, **kwargs)
        return wrapper

    # Method to launch app
    @clear_cache_before_launch
    def launch_jio_hotstar_application(self, device):
        print(f"Launching Jio Hotstar app on {device}...")
        shared_utils.sleep_with_msg(
            device, 30, "waiting to load the driver application"
        )

    # Retry getting driver
    def get_driver_with_retry(self, device, retries=3, wait=5):
        for attempt in range(retries):
            try:
                driver = device_manager.get_driver(device)
                return driver
            except Exception as e:
                print(f"Attempt {attempt + 1} failed: {e}")
                time.sleep(wait)
        raise RuntimeError(f"Could not connect to Appium for device {device}")

    def click_continue_and_sigin_to_device(self, device):
        try:
            element = shared_utils.find_element(device, home_page_dict, "continue")
            element.click()
            shared_utils.sleep_with_msg(device, 4, "Clicked Continue button")
        except Exception as e:
            raise Exception(f"[{device}] Error clicking Continue: {e}")

    def select_required_ott_languages(self, device):
        shared_utils.sleep_with_msg(
            device, 5, "waiting to load the continue for location"
        )
        info_allow_access_loc_window = shared_utils.find_element(
            device, home_page_dict, "home_page_location_enable_popups_window"
        )
        copy = info_allow_access_loc_window
        print("the values is clicked ")
        if info_allow_access_loc_window:
            info_allow_access_loc_window.click()
            print("waiting for clicking")
            shared_utils.sleep_with_msg(
                device, 5, "waiting to load the continue for location"
            )
            # shared_utils.find_element(device, home_page_dict, "allow_access").click()
            elmsnt_dialog = shared_utils.find_element(
                device, home_page_dict, "permission_dialog_info"
            )
            if elmsnt_dialog:
                shared_utils.find_element(
                    device, home_page_dict, "only_this_time"
                ).click()

        try:
            element_visible = shared_utils.find_element(
                device, home_page_dict, "verify_bottom_menu_home"
            )

            if element_visible and element_visible.is_displayed():
                print("Language selection successful and Home screen visible.")
                return
        except Exception as e:
            print(f"Error in select_required_ott_languages: {str(e)}")
            raise
