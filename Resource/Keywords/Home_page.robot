*** Settings ***
Library    sign_in.py
Library    tv_shows_page.py
Library    web_homepage.py
# Library    shared_utils

*** Keywords ***
Launch And Signin Verify Home Page
    appium_run_background    device=device_1
    launch_jio_hotstar_application    device=device_1
    click_continue_and_sigin_to_device    device=device_1
    select_required_ott_languages    device=device_1
    swipe_up_on_device      device=device_1


Launch And Signin Verify Home Page without swipe
    appium_run_background    device=device_1
    launch_jio_hotstar_application    device=device_1
    click_continue_and_sigin_to_device    device=device_1
    select_required_ott_languages    device=device_1


select fav show from Tv options
    verify_and_click_on_tv_show_menu_in_homepage    device=device_1
    verify_tv_show_page_opened    device=device_1
    swipe_page_to_get_fav_option    device=device_1
    swipe_fav_page_left_to_right    device=device_1



lanuh_web_appliaction
    launch_web_appliaction_verify_login_able_to_sigin_invalid_number    device=device1user


close all drivers
    [Arguments]        ${device}=None
    tear_down_devices   device=${device}