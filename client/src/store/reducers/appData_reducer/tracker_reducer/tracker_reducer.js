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
  // -- --change timeline selection
  SET_CURRENT_TIMELINE_VIEW,
  // -- --change timeline display date
  SET_CURRENT_TIMELINE_DATE,
  // -- --set target Entry Id
  SET_TARGET_ENTRY_ID,
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
  // -- --add a reminder to a tracker
  ADD_TRACKER_REMINDER,
  // -- --add a reminder to a tracker
  REMOVE_TRACKER_REMINDER
} from "../../../actions/actionTypes";
import { views } from "../../../../components/timeline_components/utils/constants";

import {
  updateObjProp,
  updateObjAddToArr,
  updateObjRemoveFromArr
} from "../../../../utils/updateHelpers";

export const INIT_STATE = {
  userId: undefined,
  allTrackers: [],
  selectedTracker: {
    _id: undefined,
    metaInfo: {
      username: undefined,
      tracker_name: undefined,
      tracker_goal: undefined,
      tracked_meals: "all", // enum: ["all", "breakfast", "lunch", "dinner", "snack", "custom"]
      tracker_timeframe: undefined // select from drop down menu
    },
    timelineSnippets: {
      ENTRIES: [],
      DAYS: [],
      WEEKS: [],
      MONTHS: []
      // QUATER: [],
      // YEAR: []
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
    preferences: {
      reminders: []
    },
    insights: []
  },
  currentTimeline: {
    viewKey: views.DAY, //? ENUM type: timelineSelection ---> {views.AGENDA ("ENTRY") || views.DAY("DAY") || views.WEEK ("WEEK") || views.MONTH ("MONTH") || "QUATER" || "YEAR" }
    displayDate: new Date()
  },
  targetTimeline: {
    targetEntryId: undefined,
    targetEntrySlot: undefined,
    targetDate: undefined
  }
};

//* On clicking back or outside the detail entry panel, the timeline goes back to the state's timelineSelection UI state

const trackerReducer = (state = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_ALL_TRACKERS:
      return { ...state, allTrackers: payload };
    case GET_TRACKER:
      return { ...state, selectedTracker: payload };
    case CREATE_TRACKER:
      return { ...state, selectedTracker: payload };
    case ADD_TRACKER_ENTRY:
      return updateObjAddToArr(
        state,
        payload,
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
    case SET_TARGET_ENTRY_ID:
      return updateObjProp(state, payload, "targetTimeline", "targetEntryId");
    case SET_TARGET_ENTRY_SLOT:
      return updateObjProp(state, payload, "targetTimeline", "targetEntrySlot");
    case ADD_TRACKER_DAY_SUMMARY:
      return updateObjAddToArr(
        state,
        payload,
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
    case ADD_TRACKER_REMINDER:
      return updateObjAddToArr(
        state,
        payload,
        "selectedTracker",
        "preferences",
        "reminders"
      );
    case REMOVE_TRACKER_REMINDER:
      return updateObjRemoveFromArr(
        state,
        payload,
        "selectedTracker",
        "preferences",
        "reminders"
      );
    default:
      return state;
  }
};

export default trackerReducer;
