import PropTypes from "prop-types";
import React from "react";
import {
  add as addDates,
  startOf as startOfDates,
  endOf as endOfDates
} from "date-arithmetic";
import { range as rangeDates } from "../../src_rbc_components/utils/dates";
import { navigate } from "../../../helperData/constants";
// import TimeGrid from './TimeGrid'
import TimeGrid from "../../src_rbc_components/TimeGrid/TimeGrid";

class CustomWeekView extends React.Component {
  render() {
    let { date, ...props } = this.props;
    let range = CustomWeekView.range(date, this.props);

    return <TimeGrid {...props} range={range} eventOffset={15} />;
  }
}

CustomWeekView.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired
};

CustomWeekView.defaultProps = TimeGrid.defaultProps;

CustomWeekView.navigate = (date, action) => {
  switch (action) {
    case navigate.PREVIOUS:
      return addDates(date, -1, "week");

    case navigate.NEXT:
      return addDates(date, 1, "week");

    default:
      return date;
  }
};

CustomWeekView.range = (date, { localizer }) => {
  let firstOfWeek = localizer.startOfWeek();
  let start = startOfDates(date, "week", firstOfWeek);
  let end = endOfDates(date, "week", firstOfWeek);

  return rangeDates(start, end);
};

CustomWeekView.title = (date, { localizer }) => {
  let [start, ...rest] = CustomWeekView.range(date, { localizer });
  return localizer.format({ start, end: rest.pop() }, "dayRangeHeaderFormat");
};

export default CustomWeekView;
