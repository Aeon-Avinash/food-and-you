import {
  // --tracker
  // -- --fetch all user trackers
  GET_ALL_TRACKERS,
  // -- --fetch tracker data
  GET_TRACKER,
  // -- --create new tracker
  CREATE_TRACKER,
  // -- --add new entry into tracker
  ADD_TRACKER_ENTRY,
  // -- --edit tracker entry
  EDIT_TRACKER_ENTRY,
  // -- --remove tracker entry
  REMOVE_TRACKER_ENTRY,
  // -- --set default tracker
  // -- --logout
  LOGOUT,
  // -- --logout from all devices
  // SET_DEFAULT_TRACKER,
  // -- --change timeline selection
  SET_CURRENT_TIMELINE_VIEW,
  // -- --change timeline display date
  SET_CURRENT_TIMELINE_DATE,
  // -- --set selected snippet Id
  SET_SELECTION_SNIPPET_ID,
  // -- --set selected snippet Type
  SET_SELECTION_SNIPPET_TYPE,
  // -- --set selected snippet Type
  SET_SELECTION_SNIPPET_DATA,
  // -- --set confirmTimeSLotSelection
  SET_CONFIRM_TIME_SLOT_SELECTION_TIMELINE_ENTRY,
  // -- --set confirmTimeSLotSelection
  SET_CONFIRM_TIME_SLOT_SELECTION_DIET_ENTRY,
  // -- --set confirmTimeSLotSelection
  SET_CONFIRM_TIME_SLOT_SELECTION_MEAL_PLAN,
  // -- --set target timeline Entry Slot
  SET_TARGET_ENTRY_SLOT,
  // -- --set target timeline Date
  SET_TARGET_TIMELINE_DATE,
  // -- --add the day's summary to the tracker
  ADD_TRACKER_DAY_SUMMARY,
  // -- --add the week's summary to the tracker
  ADD_TRACKER_WEEK_SUMMARY,
  // -- --add the month's summary to the tracker
  ADD_TRACKER_MONTH_SUMMARY,
  // -- --edit tracker preferences
  EDIT_TRACKER_PREFERENCES
} from "../../../actions/actionTypes";
import { views } from "../../../../helperData/constants";
// import {
//   dietEntries,
//   dietEntries_2,
//   dietEntries_0,
//   mealPlans,
//   mealPlans_2,
//   mealPlans_0
// } from "../../../../components/timeline_components/utils/seedEntires/seedEntries";
import // createDaySummary
// createDaysFromAllEntries
"../../../../helperData/trackerCalculations";

import {
  updateObjProp,
  updateObjAddToArr,
  updateObjRemoveFromArrByAccessor,
  updateArrInObjAddOrReplaceByAccessor
} from "../../../../utils/updateObjHelpers";

export const INIT_STATE = {
  userId: undefined,
  allTrackers: undefined,
  lastUsedDefaultTracker: undefined,
  selectedTracker: {
    _id: undefined,
    user: undefined, //? same as userId
    userMetaInfo: {},
    preferences: {
      tracker_title: "",
      tracker_goal: "",
      tracked_meals: ["all"], //? multi select with custom select
      trackedMealsOptions: [
        "all",
        "breakfast",
        "lunch",
        "evening snack",
        "dinner",
        "midnight snack"
      ].map(meal => ({
        value: meal,
        label: meal,
        name: "tracked_meals",
        key: meal
      })),
      tracker_lengthValue: 30, //? single select
      tracker_lengthUnit: "days", //? single select
      reminders: []
    },
    timelineSnippets: {
      ENTRIES: [],
      // ENTRIES: [
      //   ...dietEntries,
      //   ...dietEntries_2,
      //   ...dietEntries_0,
      //   ...mealPlans,
      //   ...mealPlans_2,
      //   ...mealPlans_0
      // ],
      // pre-state For Dev purposes only
      DAYS: [],
      // DAYS: [  ...createDaysFromAllEntries([
      //     ...dietEntries,
      //     ...dietEntries_2,
      //     ...dietEntries_0,
      //     ...mealPlans,
      //     ...mealPlans_2,
      //     ...mealPlans_0
      //   ])
      // ],
      // pre-state For Dev purposes only
      WEEKS: [],
      MONTHS: [],
      QUATER: [],
      YEAR: []
    }, //* formed out of "Entry / Day / Week / Month / Quater / Year"
    calculations: {
      today: {},
      lastOneDay: {},
      days: [],
      lastOneWeek: {},
      weeks: [],
      lastOneMonth: {},
      months: []
    },
    insights: []
  },
  currentTimeline: {
    viewKey: views.DAY, //? ENUM type: timelineSelection ---> {views.AGENDA ("ENTRY") || views.DAY("DAY") || views.WEEK ("WEEK") || views.MONTH ("MONTH") || "QUATER" || "YEAR" }
    displayDate: new Date()
  },
  targetTimeline: {
    selectedSnippetId: undefined,
    selectedSnippetType: undefined, //? type: NEW, ENTRIES, DAYS, WEEKS, MONTHS
    selectedSnippetData: undefined,
    targetEntrySlot: undefined,
    targetDate: undefined,
    confirmTimeSlotSelectionTimelineEntry: undefined,
    confirmTimeSlotSelectionDietEntry: undefined,
    confirmTimeSlotSelectionMealPlan: undefined
  }
};

const trackerReducer = (state = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGOUT:
      return INIT_STATE;
    case GET_ALL_TRACKERS:
      return {
        ...state,
        allTrackers: payload.allTrackersById,
        lastUsedDefaultTracker: payload.lastUsedDefaultTracker
      };
    case GET_TRACKER:
      return {
        ...state,
        selectedTracker: payload,
        lastUsedDefaultTracker: payload._id
      };
    case CREATE_TRACKER:
      return {
        ...state,
        selectedTracker: payload,
        lastUsedDefaultTracker: payload._id,
        allTrackers: [
          ...state.allTrackers,
          { _id: payload._id, title: payload.preferences.tracker_title }
        ]
      };
    case ADD_TRACKER_ENTRY:
      return updateObjAddToArr(
        state,
        payload,
        "selectedTracker",
        "timelineSnippets",
        "ENTRIES"
      );
    case EDIT_TRACKER_ENTRY:
      const updatedTrackerState = updateArrInObjAddOrReplaceByAccessor(
        state,
        payload,
        "_id",
        "selectedTracker",
        "timelineSnippets",
        "ENTRIES"
      );
      return updatedTrackerState;
    case REMOVE_TRACKER_ENTRY:
      return updateObjRemoveFromArrByAccessor(
        state,
        payload,
        "_id",
        "selectedTracker",
        "timelineSnippets",
        "ENTRIES"
      );
    case SET_CURRENT_TIMELINE_VIEW:
      return updateObjProp(state, payload, "currentTimeline", "viewKey");
    case SET_CURRENT_TIMELINE_DATE:
      return updateObjProp(state, payload, "currentTimeline", "displayDate");
    case SET_TARGET_TIMELINE_DATE:
      return updateObjProp(state, payload, "targetTimeline", "targetDate");
    case SET_SELECTION_SNIPPET_ID:
      return updateObjProp(
        state,
        payload,
        "targetTimeline",
        "selectedSnippetId"
      );
    case SET_SELECTION_SNIPPET_TYPE:
      return updateObjProp(
        state,
        payload,
        "targetTimeline",
        "selectedSnippetType"
      );
    case SET_SELECTION_SNIPPET_DATA:
      return updateObjProp(
        state,
        payload,
        "targetTimeline",
        "selectedSnippetData"
      );
    case SET_TARGET_ENTRY_SLOT:
      return updateObjProp(state, payload, "targetTimeline", "targetEntrySlot");
    case SET_CONFIRM_TIME_SLOT_SELECTION_TIMELINE_ENTRY:
      return updateObjProp(
        state,
        payload,
        "targetTimeline",
        "confirmTimeSlotSelectionTimelineEntry"
      );
    case SET_CONFIRM_TIME_SLOT_SELECTION_DIET_ENTRY:
      return updateObjProp(
        state,
        payload,
        "targetTimeline",
        "confirmTimeSlotSelectionDietEntry"
      );
    case SET_CONFIRM_TIME_SLOT_SELECTION_MEAL_PLAN:
      return updateObjProp(
        state,
        payload,
        "targetTimeline",
        "confirmTimeSlotSelectionMealPlan"
      );
    case ADD_TRACKER_DAY_SUMMARY:
      const [
        selectedResourceDaySummaryObj,
        otherResourceDaySummaryObj
      ] = payload.daySummary;
      let firstArrUpdatedState = updateArrInObjAddOrReplaceByAccessor(
        state,
        selectedResourceDaySummaryObj,
        "id",
        "selectedTracker",
        "timelineSnippets",
        "DAYS"
      );
      return updateArrInObjAddOrReplaceByAccessor(
        firstArrUpdatedState,
        otherResourceDaySummaryObj,
        "id",
        "selectedTracker",
        "timelineSnippets",
        "DAYS"
      );
    case ADD_TRACKER_WEEK_SUMMARY:
      return updateObjAddToArr(
        state,
        payload,
        "selectedTracker",
        "timelineSnippets",
        "WEEKS"
      );
    case ADD_TRACKER_MONTH_SUMMARY:
      return updateObjAddToArr(
        state,
        payload,
        "selectedTracker",
        "timelineSnippets",
        "MONTHS"
      );
    case EDIT_TRACKER_PREFERENCES:
      return updateObjProp(state, payload, "selectedTracker", "preferences");
    default:
      return state;
  }
};

export default trackerReducer;
