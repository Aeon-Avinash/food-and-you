import {
  // -- --store user meta data
  GET_USER_META,
  // -- --edit user meta data
  EDIT_USER_META
} from "../../../../actions/actionTypes";

// import { updateObjProp, updateObjAddToArr } from "../../../utils/updateHelpers";

export const INIT_STATE = {
  // name: "",
  // age: "",
  // weight: "",
  // weightUnit: "kgs", // kgs || pounds
  // height: "",
  // heightUnit: "inches", // inches || cms
  // country: "", //countryCurrentResidence
  // lastUpdated: new Date() // recently updated date
};

const metaDataReducer = (metaDataState = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_USER_META:
      return { ...payload };
    case EDIT_USER_META:
      return { ...metaDataState, ...payload };
    default:
      return metaDataState;
  }
};

export default metaDataReducer;
