import React from "react";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
// import * as dateMath from "date-arithmetic";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { resourceTypes } from "../../../helperData/constants";

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: 14,
    marginTop: 0
  }
}));

const TimeSlotWrapper = props => {
  const classes = useStyles();
  let hasCustomInfo, hasTimeLabel;

  //? For labeling only the timeGutter
  let hasResourceUndefined = props.resource === undefined;
  let hasDietEntry = props.resource === resourceTypes.dietEntry;
  let hasMealPlan = props.resource === resourceTypes.mealPlan;

  const today =
    moment(props.value).date() === moment(new Date()).date() &&
    moment(props.value).month() === moment(new Date()).month() &&
    moment(props.value).year() === moment(new Date()).year();

  const hours = props.value ? moment(props.value).hours() : undefined;
  const minutes = props.value ? moment(props.value).minutes() : undefined;
  switch (true) {
    case hours === 8 && minutes === 45:
      hasCustomInfo = "Breakfast";
      break;
    case hours === 12 && minutes === 45:
      hasCustomInfo = "Lunch";
      break;
    case hours === 16 && minutes === 45:
      hasCustomInfo = "Evening Snack";
      break;
    case hours === 20 && minutes === 45:
      hasCustomInfo = "Dinner";
      break;
    case hours === 0 && minutes === 45:
      hasCustomInfo = "Midnight Snack";
      break;
    default:
      hasCustomInfo = null;
  }

  switch (true) {
    case hours === 5 && minutes === 0:
      hasTimeLabel = true;
      break;
    case hours === 9 && minutes === 0:
      hasTimeLabel = true;
      break;
    case hours === 13 && minutes === 0:
      hasTimeLabel = true;
      break;
    case hours === 17 && minutes === 0:
      hasTimeLabel = true;
      break;
    case hours === 21 && minutes === 0:
      hasTimeLabel = true;
      break;
    default:
      hasTimeLabel = null;
  }

  const style = {
    ...props.children.style,
    display: "flex",
    flex: 1,
    paddingLeft: 10,
    backgroundColor: today
      ? "#eaf6ff"
      : hasCustomInfo && hasDietEntry
      ? "rgba(255, 245, 220, 0.96)"
      : hasCustomInfo && hasMealPlan
      ? "rgba(255, 225, 220, 0.96)"
      : "inherit"
  };

  return hasDietEntry || hasMealPlan || hasResourceUndefined ? (
    <div style={style}>
      {hasCustomInfo && (
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {hasCustomInfo}
        </Typography>
      )}
      {hasTimeLabel ? (
        <Typography
          component="div"
          className={classes.title}
          color="textPrimary"
          gutterBottom
        >
          {props.children}
        </Typography>
      ) : (
        props.children
      )}
    </div>
  ) : (
    <div>{props.children}</div>
  );
};
export default TimeSlotWrapper;
