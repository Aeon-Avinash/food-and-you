import {
  // UI State modifying actions
  // -- -- set current ui state
  SET_UI_STATE_HELPER_ONE,
  // -- -- set visibility of current ui state
  SET_VISIBILITY_HELPER_ONE,
  // -- -- set secondary ui state
  SET_UI_STATE_HELPER_TWO,
  // -- -- set visibility of secondary ui state
  SET_VISIBILITY_HELPER_TWO,
  // -- -- set ui modal state
  SET_MODAL_ONE_STATE,
  // -- -- set visibility of modal state
  SET_VISIBILITY_MODAL_ONE,
  // -- -- set ui modal state
  SET_MODAL_TWO_STATE,
  // -- -- set visibility of modal state
  SET_VISIBILITY_MODAL_TWO,
  // -- -- set ui modal state
  SET_MODAL_THREE_STATE,
  // -- -- set visibility of modal state
  SET_VISIBILITY_MODAL_THREE,
  // -- -- set ui modal state
  SET_NUTRI_MODAL_STATE,
  // -- -- set visibility of modal state
  SET_VISIBILITY_NUTRI_MODAL,
  SET_UI_STATE_NUTRI_HELPER,
  SET_VISIBILITY_NUTRI_HELPER,
  SET_UI_STATE_MEALPLAN_HELPER,
  SET_VISIBILITY_MEALPLAN_HELPER
} from "../actions/actionTypes";

import {
  updateObjProp
  // updateObjAddToArr,
  // updateObjRemoveFromArrByAccessor,
  // updateArrInObjAddOrReplaceByAccessor
} from "../../utils/updateObjHelpers";

export const INIT_STATE = {
  uiStateHelperOne: {
    uiState: undefined,
    isVisible: undefined,
    setVisibiltyTimeout: undefined
  },
  uiStateHelperTwo: {
    uiState: undefined,
    isVisible: undefined,
    setVisibiltyTimeout: undefined
  },
  uiStateNutriHelper: {
    uiState: undefined,
    isVisible: undefined,
    setVisibiltyTimeout: undefined
  },
  uiStateMealplanHelper: {
    uiState: undefined,
    isVisible: undefined,
    setVisibiltyTimeout: undefined
  },
  uiModalOneHelper: {
    uiState: undefined,
    isVisible: false,
    setVisibiltyTimeout: undefined
  },
  uiModalTwoHelper: {
    uiState: undefined,
    isVisible: false,
    setVisibiltyTimeout: undefined
  },
  uiModalThreeHelper: {
    uiState: undefined,
    isVisible: false,
    setVisibiltyTimeout: undefined
  },
  uiNutriModalHelper: {
    uiState: undefined,
    isVisible: false,
    setVisibiltyTimeout: undefined
  }
};

const uiStateReducer = (state = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_UI_STATE_HELPER_ONE:
      if (payload) {
        return updateObjProp(state, payload, "uiStateHelperOne", "uiState");
      } else {
        return updateObjProp(
          state,
          INIT_STATE.uiStateHelperOne,
          "uiStateHelperOne"
        );
      }
    case SET_VISIBILITY_HELPER_ONE:
      return updateObjProp(state, payload, "uiStateHelperOne", "isVisible");
    case SET_UI_STATE_HELPER_TWO:
      if (payload) {
        return updateObjProp(state, payload, "uiStateHelperTwo", "uiState");
      } else {
        return updateObjProp(
          state,
          INIT_STATE.uiStateHelperTwo,
          "uiStateHelperTwo"
        );
      }
    case SET_VISIBILITY_HELPER_TWO:
      return updateObjProp(state, payload, "uiStateHelperTwo", "isVisible");
    case SET_UI_STATE_NUTRI_HELPER:
      if (payload) {
        return updateObjProp(state, payload, "uiStateNutriHelper", "uiState");
      } else {
        return updateObjProp(
          state,
          INIT_STATE.uiStateNutriHelper,
          "uiStateNutriHelper"
        );
      }
    case SET_VISIBILITY_NUTRI_HELPER:
      return updateObjProp(state, payload, "uiStateNutriHelper", "isVisible");
    case SET_UI_STATE_MEALPLAN_HELPER:
      if (payload) {
        return updateObjProp(
          state,
          payload,
          "uiStateMealplanHelper",
          "uiState"
        );
      } else {
        return updateObjProp(
          state,
          INIT_STATE.uiStateMealplanHelper,
          "uiStateMealplanHelper"
        );
      }
    case SET_VISIBILITY_MEALPLAN_HELPER:
      return updateObjProp(
        state,
        payload,
        "uiStateMealplanHelper",
        "isVisible"
      );
    case SET_MODAL_ONE_STATE:
      if (payload) {
        return updateObjProp(state, payload, "uiModalOneHelper", "uiState");
      } else {
        return updateObjProp(
          state,
          INIT_STATE.uiModalOneHelper,
          "uiModalOneHelper"
        );
      }
    case SET_VISIBILITY_MODAL_ONE:
      return updateObjProp(state, payload, "uiModalOneHelper", "isVisible");
    case SET_MODAL_TWO_STATE:
      if (payload) {
        return updateObjProp(state, payload, "uiModalTwoHelper", "uiState");
      } else {
        return updateObjProp(
          state,
          INIT_STATE.uiModalTwoHelper,
          "uiModalTwoHelper"
        );
      }
    case SET_VISIBILITY_MODAL_TWO:
      return updateObjProp(state, payload, "uiModalTwoHelper", "isVisible");
    case SET_MODAL_THREE_STATE:
      if (payload) {
        return updateObjProp(state, payload, "uiModalThreeHelper", "uiState");
      } else {
        return updateObjProp(
          state,
          INIT_STATE.uiModalThreeHelper,
          "uiModalThreeHelper"
        );
      }
    case SET_VISIBILITY_MODAL_THREE:
      return updateObjProp(state, payload, "uiModalThreeHelper", "isVisible");
    case SET_NUTRI_MODAL_STATE:
      if (payload) {
        return updateObjProp(state, payload, "uiNutriModalHelper", "uiState");
      } else {
        return updateObjProp(
          state,
          INIT_STATE.uiNutriModalHelper,
          "uiNutriModalHelper"
        );
      }
    case SET_VISIBILITY_NUTRI_MODAL:
      return updateObjProp(state, payload, "uiNutriModalHelper", "isVisible");
    default:
      return state;
  }
};

export default uiStateReducer;
