export const // UI State modifying actions
  // -- -- set current ui state
  SET_UI_STATE_HELPER_ONE = "SET_UI_STATE_HELPER_ONE",
  // -- -- set visibility of current ui state
  SET_VISIBILITY_HELPER_ONE = "SET_VISIBILITY_HELPER_ONE",
  // -- -- set secondary ui state
  SET_UI_STATE_HELPER_TWO = "SET_UI_STATE_HELPER_TWO",
  // -- -- set visibility of secondary ui state
  SET_VISIBILITY_HELPER_TWO = "SET_VISIBILITY_HELPER_TWO",
  // -- -- set secondary ui state
  SET_UI_STATE_NUTRI_HELPER = "SET_UI_STATE_NUTRI_HELPER",
  // -- -- set visibility of secondary ui state
  SET_VISIBILITY_NUTRI_HELPER = "SET_VISIBILITY_NUTRI_HELPER",
  // -- -- set secondary ui state
  SET_UI_STATE_MEALPLAN_HELPER = "SET_UI_STATE_MEALPLAN_HELPER",
  // -- -- set visibility of secondary ui state
  SET_VISIBILITY_MEALPLAN_HELPER = "SET_VISIBILITY_MEALPLAN_HELPER",
  // -- -- set ui modal state
  SET_MODAL_ONE_STATE = "SET_MODAL_ONE_STATE",
  // -- -- set visibility of modal state
  SET_VISIBILITY_MODAL_ONE = "SET_VISIBILITY_MODAL_ONE",
  // -- -- set ui modal state
  SET_MODAL_TWO_STATE = "SET_MODAL_TWO_STATE",
  // -- -- set visibility of modal state
  SET_VISIBILITY_MODAL_TWO = "SET_VISIBILITY_MODAL_TWO",
  // -- -- set ui modal state
  SET_MODAL_THREE_STATE = "SET_MODAL_THREE_STATE",
  // -- -- set visibility of modal state
  SET_VISIBILITY_MODAL_THREE = "SET_VISIBILITY_MODAL_THREE",
  // -- -- set ui modal state
  SET_NUTRI_MODAL_STATE = "SET_NUTRI_MODAL_STATE",
  // -- -- set visibility of modal state
  SET_VISIBILITY_NUTRI_MODAL = "SET_VISIBILITY_NUTRI_MODAL",
  // -- -- set loader state
  SET_LOADER_STATE = "SET_LOADER_STATE",
  // Client App State modifying actions
  // -- -- set primary app state
  SET_APP_STATE_PRIMARY = "SET_APP_STATE_PRIMARY",
  // -- -- confirmation along with success Data
  CONFIRM_SUCCESS_PRIMARY = "CONFIRM_SUCCESS_PRIMARY",
  // -- -- error Message for primary app state
  REPORT_ERROR_PRIMARY = "REPORT_ERROR_PRIMARY",
  // -- -- clear primary app state
  CLEAR_APP_STATE_PRIMARY = "CLEAR_APP_STATE_PRIMARY",
  // -- -- set secondary app state
  SET_APP_STATE_SECONDARY = "SET_APP_STATE_SECONDARY",
  // -- -- confirmation along with success Data
  CONFIRM_SUCCESS_SECONDARY = "CONFIRM_SUCCESS_SECONDARY",
  // -- -- error Message for secondary app state
  REPORT_ERROR_SECONDARY = "REPORT_ERROR_SECONDARY",
  // -- -- clear secondary app state
  CLEAR_APP_STATE_SECONDARY = "CLEAR_APP_STATE_SECONDARY",
  // -- -- set server sync app state
  SET_APP_STATE_SERVER_SYNC = "SET_APP_STATE_SERVER_SYNC",
  // -- -- confirmation along with success Data
  CONFIRM_SUCCESS_SERVER_SYNC = "CONFIRM_SUCCESS_SERVER_SYNC",
  // -- -- error Message for server sync app state
  REPORT_ERROR_SERVER_SYNC = "REPORT_ERROR_SERVER_SYNC",
  // -- -- clear server sync app state
  CLEAR_APP_STATE_SERVER_SYNC = "CLEAR_APP_STATE_SERVER_SYNC",
  // -- -- set server sync app state
  SET_APP_STATE_SYNC_NUTRITION = "SET_APP_STATE_SYNC_NUTRITION",
  // -- -- confirmation along with success Data
  CONFIRM_SUCCESS_SYNC_NUTRITION = "CONFIRM_SUCCESS_SYNC_NUTRITION",
  // -- -- error Message for server sync app state
  REPORT_ERROR_SYNC_NUTRITION = "REPORT_ERROR_SYNC_NUTRITION",
  // -- -- clear server sync app state
  CLEAR_APP_STATE_SYNC_NUTRITION = "CLEAR_APP_STATE_SYNC_NUTRITION",
  // -- -- set server sync app state
  SET_APP_STATE_SYNC_RECIPES = "SET_APP_STATE_SYNC_RECIPES",
  // -- -- confirmation along with success Data
  CONFIRM_SUCCESS_SYNC_RECIPES = "CONFIRM_SUCCESS_SYNC_RECIPES",
  // -- -- error Message for server sync app state
  REPORT_ERROR_SYNC_RECIPES = "REPORT_ERROR_SYNC_RECIPES",
  // -- -- clear server sync app state
  CLEAR_APP_STATE_SYNC_RECIPES = "CLEAR_APP_STATE_SYNC_RECIPES",
  // -- -- set server sync app state
  SET_APP_STATE_SYNC_SETTINGS = "SET_APP_STATE_SYNC_SETTINGS",
  // -- -- confirmation along with success Data
  CONFIRM_SUCCESS_SYNC_SETTINGS = "CONFIRM_SUCCESS_SYNC_SETTINGS",
  // -- -- error Message for server sync app state
  REPORT_ERROR_SYNC_SETTINGS = "REPORT_ERROR_SYNC_SETTINGS",
  // -- -- clear server sync app state
  CLEAR_APP_STATE_SYNC_SETTINGS = "CLEAR_APP_STATE_SYNC_SETTINGS",
  // -- -- set server sync app state
  SET_APP_STATE_SYNC_TRACKER = "SET_APP_STATE_SYNC_TRACKER",
  // -- -- confirmation along with success Data
  CONFIRM_SUCCESS_SYNC_TRACKER = "CONFIRM_SUCCESS_SYNC_TRACKER",
  // -- -- error Message for server sync app state
  REPORT_ERROR_SYNC_TRACKER = "REPORT_ERROR_SYNC_TRACKER",
  // -- -- clear server sync app state
  CLEAR_APP_STATE_SYNC_TRACKER = "CLEAR_APP_STATE_SYNC_TRACKER",
  // -- -- clear all app state (primary, secondary & server sync)
  CLEAR_APP_STATE_ALL = "CLEAR_APP_STATE_ALL",
  // Food And You App Data State modifying actions
  // --auth
  // -- --oAuth with Google
  OAUTH_GOOGLE = "OAUTH_GOOGLE",
  // -- --oAuth with Github
  OAUTH_GITHUB = "OAUTH_GITHUB",
  // -- --signup with Username, Email, Password
  SIGNUP_EMAIL = "SIGNUP_EMAIL",
  // -- --login with Email, Password
  LOGIN_EMAIL = "LOGIN_EMAIL",
  // -- --logout
  LOGOUT = "LOGOUT",
  // -- --logout from all devices
  LOGOUT_ALL_DEVICES = "LOGOUT_ALL_DEVICES",
  // -- --request to change password
  REQUEST_RESET_PASSWORD = "REQUEST_RESET_PASSWORD",
  // -- --update with new password
  PASSWORD_RESET_CONFIRM = "PASSWORD_RESET_CONFIRM",
  // -- --show Auth Error
  SHOW_AUTH_ERROR = "SHOW_AUTH_ERROR",
  // --user profile
  // -- --fetch preferences
  GET_USER_SETTINGS = "GET_USER_SETTINGS",
  // -- --set / update preferences
  EDIT_USER_SETTINGS = "EDIT_USER_SETTINGS",
  // -- --change password
  RESET_PASSWORD = "RESET_PASSWORD",
  // -- --store user meta data
  GET_USER_META = "GET_USER_META",
  // -- --edit user meta data
  EDIT_USER_META = "EDIT_USER_META",
  // -- --store user preferences
  GET_PREFERENCES = "GET_PREFERENCES",
  // -- --edit user preferences
  EDIT_PREFERENCES = "EDIT_PREFERENCES",
  // -- --store user global settings
  GET_GLOBAL_SETTINGS = "GET_GLOBAL_SETTINGS",
  // -- --edit user global settings
  EDIT_GLOBAL_SETTINGS = "EDIT_GLOBAL_SETTINGS",
  // -- --edit user saved recipes
  GET_USER_SAVED_RECIPES = "GET_USER_SAVED_RECIPES",
  // -- --edit user saved nutrition
  GET_USER_SAVED_NUTRITION = "GET_USER_SAVED_NUTRITION",
  // --tracker
  // -- --fetch all user trackers
  GET_ALL_TRACKERS = "GET_ALL_TRACKERS",
  // -- --set default tracker
  SET_DEFAULT_TRACKER = "SET_DEFAULT_TRACKER",
  // -- --fetch tracker data
  GET_TRACKER = "GET_TRACKER",
  // -- --create new tracker
  CREATE_TRACKER = "CREATE_TRACKER",
  // -- --add new entry into tracker
  ADD_TRACKER_ENTRY = "ADD_TRACKER_ENTRY",
  // -- --edit tracker entry
  EDIT_TRACKER_ENTRY = "EDIT_TRACKER_ENTRY",
  // -- --remove tracker entry
  REMOVE_TRACKER_ENTRY = "REMOVE_TRACKER_ENTRY",
  // -- --change timeline selection
  SET_CURRENT_TIMELINE_VIEW = "SET_CURRENT_TIMELINE_VIEW",
  // -- --change timeline display date
  SET_CURRENT_TIMELINE_DATE = "SET_CURRENT_TIMELINE_DATE",
  // -- --set selected snippet Id
  SET_SELECTION_SNIPPET_ID = "SET_SELECTION_SNIPPET_ID",
  // -- --set selected snippet Type
  SET_SELECTION_SNIPPET_TYPE = "SET_SELECTION_SNIPPET_TYPE",
  // -- --set selected snippet Data
  SET_SELECTION_SNIPPET_DATA = "SET_SELECTION_SNIPPET_DATA",
  // -- --set confirmTimeSLotSelection
  SET_CONFIRM_TIME_SLOT_SELECTION_TIMELINE_ENTRY =
    "SET_CONFIRM_TIME_SLOT_SELECTION_TIMELINE_ENTRY",
  // -- --set confirmTimeSLotSelection
  SET_CONFIRM_TIME_SLOT_SELECTION_DIET_ENTRY =
    "SET_CONFIRM_TIME_SLOT_SELECTION_DIET_ENTRY",
  // -- --set confirmTimeSLotSelection
  SET_CONFIRM_TIME_SLOT_SELECTION_MEAL_PLAN =
    "SET_CONFIRM_TIME_SLOT_SELECTION_MEAL_PLAN",
  // -- --set target timeline Entry Slot
  SET_TARGET_ENTRY_SLOT = "SET_TARGET_ENTRY_SLOT",
  // -- --set target timeline Date
  SET_TARGET_TIMELINE_DATE = "SET_TARGET_TIMELINE_DATE",
  // -- --add the day's summary to the tracker
  ADD_TRACKER_DAY_SUMMARY = "ADD_TRACKER_DAY_SUMMARY",
  // -- --add the week's summary to the tracker
  ADD_TRACKER_WEEK_SUMMARY = "ADD_TRACKER_WEEK_SUMMARY",
  // -- --add the month's summary to the tracker
  ADD_TRACKER_MONTH_SUMMARY = "ADD_TRACKER_MONTH_SUMMARY",
  // -- --edit tracker preferences
  EDIT_TRACKER_PREFERENCES = "EDIT_TRACKER_PREFERENCES",
  // --nutritional search
  // -- --send nutritional search request
  GET_NUTRITION = "GET_NUTRITION",
  // -- --save parsed search request
  SAVE_NUTRITION_ANALYSIS = "SAVE_NUTRITION_ANALYSIS",
  // -- --update recent nutrition query list
  UPDATE_RECENT_QUERY_LIST = "UPDATE_RECENT_QUERY_LIST",
  // -- --show nutrition detail
  SET_SHOW_NUTRITION_DETAIL = "SET_SHOW_NUTRITION_DETAIL",
  // -- --show recipe detail
  SET_SHOW_RECIPE_DETAIL = "SET_SHOW_RECIPE_DETAIL",
  // -- --clear current nutrition data
  CLEAR_CURRENT_NUTRITION_DATA = "CLEAR_CURRENT_NUTRITION_DATA",
  // -- --add Entry to user Tracker
  // ADD_TRACKER_ENTRY = "ADD_TRACKER_ENTRY",
  // -- --show error for nutrition query
  ERR_NUTRITION_QRY = "ERR_NUTRITION_QRY",
  // --recipe search
  // -- --set search query string
  SET_SEARCH_QUERY = "SET_SEARCH_QUERY",
  // -- --send autocomplete query string
  GET_RECIPE_QRY_AUTOCOMPLETE = "GET_RECIPE_QRY_AUTOCOMPLETE",
  // -- --send recipe search request
  GET_RECIPES = "GET_RECIPES",
  // -- --fetch detailed recipe
  GET_RECIPE_DETAIL = "GET_RECIPE_DETAIL",
  // -- --update recent recipe search list
  UPDATE_RECENT_SEARCH_LIST = "UPDATE_RECENT_SEARCH_LIST",
  // -- --update recent recipes list
  UPDATE_RECENT_RECIPES = "UPDATE_RECENT_RECIPES",
  // -- --save recipe
  SAVE_RECIPE = "SAVE_RECIPE",
  // -- --set current recipes detail
  SET_CURRENT_RECIPES_DETAIL = "SET_CURRENT_RECIPES_DETAIL",
  // -- --set current timeline recipes detail
  SET_CURRENT_TIMELINE_RECIPES_DETAIL = "SET_CURRENT_TIMELINE_RECIPES_DETAIL",
  // -- --clear current recipes data
  CLEAR_CURRENT_RECIPES_DATA = "CLEAR_CURRENT_RECIPES_DATA";
