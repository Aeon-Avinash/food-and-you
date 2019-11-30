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
  // -- -- set secondary ui state
  SET_UI_STATE_NUTRI_HELPER,
  // -- -- set visibility of secondary ui state
  SET_VISIBILITY_NUTRI_HELPER,
  // -- -- set secondary ui state
  SET_UI_STATE_MEALPLAN_HELPER,
  // -- -- set visibility of secondary ui state
  SET_VISIBILITY_MEALPLAN_HELPER,
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
  SET_VISIBILITY_NUTRI_MODAL
} from "./actionTypes.js";

export const setUIStateHelperOne = uiState => async dispatch => {
  //? request to update UI state in the Food And You client
  //* uiState.setVisibilityTimeout
  //? check if setVisibilityTimeout is set then invoke a timeout before dispatching
  //? Or else dispatch immediately

  //! ui state is NOT persisted for UI Helper 1

  dispatch({
    type: SET_UI_STATE_HELPER_ONE,
    payload: uiState
  });
};

export const setHelperOneVisibility = isVisible => ({
  type: SET_VISIBILITY_HELPER_ONE,
  payload: isVisible
});

export const setUIStateHelperTwo = uiState => async dispatch => {
  //? request to update UI state in the Food And You client
  //* uiState.setVisibilityTimeout
  //? check if setVisibilityTimeout is set then invoke a timeout before dispatching
  //? Or else dispatch immediately

  //? ui state is persisted for UI Helper 2

  dispatch({
    type: SET_UI_STATE_HELPER_TWO,
    payload: uiState,
    persistInLocalStorage: true
  });
};

export const setHelperTwoVisibility = isVisible => ({
  type: SET_VISIBILITY_HELPER_TWO,
  payload: isVisible,
  persistInLocalStorage: true
});

export const setUIStateNutriHelper = uiState => async dispatch => {
  //? request to update UI state in the Food And You client
  //* uiState.setVisibilityTimeout
  //? check if setVisibilityTimeout is set then invoke a timeout before dispatching
  //? Or else dispatch immediately

  //? ui state is persisted for UI Nutri Helper

  dispatch({
    type: SET_UI_STATE_NUTRI_HELPER,
    payload: uiState,
    persistInLocalStorage: true
  });
};

export const setNutriHelperVisibility = isVisible => ({
  type: SET_VISIBILITY_NUTRI_HELPER,
  payload: isVisible,
  persistInLocalStorage: true
});

export const setUIStateMealplanHelper = uiState => async dispatch => {
  //? request to update UI state in the Food And You client
  //* uiState.setVisibilityTimeout
  //? check if setVisibilityTimeout is set then invoke a timeout before dispatching
  //? Or else dispatch immediately

  //? ui state is persisted for UI Mealplan Helper

  dispatch({
    type: SET_UI_STATE_MEALPLAN_HELPER,
    payload: uiState,
    persistInLocalStorage: true
  });
};

export const setMealplanHelperVisibility = isVisible => ({
  type: SET_VISIBILITY_MEALPLAN_HELPER,
  payload: isVisible,
  persistInLocalStorage: true
});

export const setModalOneState = uiState => async dispatch => {
  //? request to update UI Modal One state in the Food And You client
  //* uiState.setVisibilityTimeout
  //? check if setVisibilityTimeout is set then invoke a timeout before dispatching
  //? Or else dispatch immediately

  dispatch({
    type: SET_MODAL_ONE_STATE,
    payload: uiState,
    persistInLocalStorage: true
  });
};

export const setModalOneVisibility = isVisible => {
  return {
    type: SET_VISIBILITY_MODAL_ONE,
    payload: isVisible,
    persistInLocalStorage: true
  };
};

export const setModalTwoState = uiState => async dispatch => {
  //? request to update UI Modal Two state in the Food And You client
  //* uiState.setVisibilityTimeout
  //? check if setVisibilityTimeout is set then invoke a timeout before dispatching
  //? Or else dispatch immediately

  dispatch({
    type: SET_MODAL_TWO_STATE,
    payload: uiState,
    persistInLocalStorage: true
  });
};

export const setModalTwoVisibility = isVisible => {
  return {
    type: SET_VISIBILITY_MODAL_TWO,
    payload: isVisible,
    persistInLocalStorage: true
  };
};

export const setModalThreeState = uiState => async dispatch => {
  //? request to update UI Modal Three state in the Food And You client
  //* uiState.setVisibilityTimeout
  //? check if setVisibilityTimeout is set then invoke a timeout before dispatching
  //? Or else dispatch immediately

  dispatch({
    type: SET_MODAL_THREE_STATE,
    payload: uiState,
    persistInLocalStorage: true
  });
};

export const setModalThreeVisibility = isVisible => {
  return {
    type: SET_VISIBILITY_MODAL_THREE,
    payload: isVisible,
    persistInLocalStorage: true
  };
};

export const setNutriModalState = uiState => async dispatch => {
  //? request to update UI Modal Three state in the Food And You client
  //* uiState.setVisibilityTimeout
  //? check if setVisibilityTimeout is set then invoke a timeout before dispatching
  //? Or else dispatch immediately

  dispatch({
    type: SET_NUTRI_MODAL_STATE,
    payload: uiState,
    persistInLocalStorage: true
  });
};

export const setNutriModalVisibility = isVisible => {
  return {
    type: SET_VISIBILITY_NUTRI_MODAL,
    payload: isVisible,
    persistInLocalStorage: true
  };
};
