import moment from "moment";
import {
  resourceTypes,
  resourceIdAccessor
} from "../../../helperData/constants";

const isSameDayAs = (value, eventStart) => {
  return (
    moment(value).isSame(eventStart, "day") &&
    moment(value).isSame(eventStart, "month") &&
    moment(value).isSame(eventStart, "year")
  );
};

export const customDayPropGetter = date => {
  if (isSameDayAs(new Date(), date))
    return {
      className: "special-today",
      style: {
        border: "solid 2px rgba(56, 142, 60, 0.64)"
      }
    };
  else return {};
};

export const customSlotPropGetter = date => {
  const start = moment(new Date())
    .hours(5)
    .minutes(0)
    .seconds(0);
  const end = moment(new Date())
    .add(1, "day")
    .hours(0)
    .minutes(59)
    .seconds(59);
  if (moment(date).isBetween(start, end))
    return {
      className: "today custom-timeslot",
      style: {
        // backgroundColor: "rgba(224, 255, 255, 0.5)"
      }
    };
  else
    return {
      className: "custom-timeslot"
    };
};

export const eventPropGetterEntries = props => {
  // { event, start, end, isSelected }
  const offHoursSnack = props.start.getHours() < 5;

  return {
    style: {
      backgroundColor:
        props[resourceIdAccessor] === resourceTypes.dietEntry
          ? offHoursSnack
            ? "rgba(255, 182, 193, 0.5)"
            : "rgba(49, 116, 173, 0.2)"
          : "rgba(69, 90, 100, 0.2)",
      boxShadow: "8px 16px 32px 8px rgba(0, 0, 0, 0.2)"
    }
  };
};

export const eventPropGetterWeek = props => {
  // { event, start, end, isSelected }
  const startDate =
    typeof props.start !== "object"
      ? new Date(moment(props.start))
      : props.start;
  const offHoursSnack = startDate.getHours() < 5;

  return {
    style: {
      backgroundColor:
        props[resourceIdAccessor] === resourceTypes.dietEntry
          ? offHoursSnack
            ? "rgba(255, 182, 193, 0.5)"
            : "#3174ad"
          : "#455A64",
      boxShadow: "8px 16px 32px 8px rgba(0, 0, 0, 0.2)"
    }
  };
};

export const eventPropGetterMonth = props => {
  const { start, resourceId } = props;

  //? Event filtering to avoid cluttering past month's date cells with mealPlans
  let showMealPlans = true;
  if (
    resourceId === resourceTypes.mealPlan &&
    moment(start).dayOfYear() <
      moment(new Date())
        .subtract(1, "day")
        .dayOfYear()
  ) {
    showMealPlans = false;
  }

  const startDate = typeof start !== "object" ? new Date(moment(start)) : start;

  const offHoursSnack = startDate.getHours() < 5;

  return {
    style: {
      display: showMealPlans ? "block" : "none",
      backgroundColor:
        props[resourceIdAccessor] === resourceTypes.dietEntry
          ? offHoursSnack
            ? "rgba(255, 182, 193, 0.5)"
            : "#3174ad"
          : "#455A64",
      boxShadow: "8px 16px 32px 8px rgba(0, 0, 0, 0.2)",
      borderRadius: "5px"
    }
  };
};
