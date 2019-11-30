import React, { Component } from "react";
import { Navigate } from "react-big-calendar";
// import TimeGrid from "react-big-calendar/lib/TimeGrid";
import TimeGrid from "../../src_rbc_components/TimeGrid/TimeGrid";
import moment from "moment";
import * as dates from "date-arithmetic";

class CustomDayView extends Component {
  render() {
    let { date } = this.props;
    const startDate = typeof date !== "object" ? new Date(moment(date)) : date;
    let range = CustomDayView.range(startDate);

    return (
      <TimeGrid {...this.props} range={range} eventOffset={15} hideTimeGutter />
    );
  }
}

CustomDayView.range = date => {
  let start = new Date(
    moment(date)
      .hour(0)
      .minutes(0)
      .seconds(1)
  );

  return [start];
};

CustomDayView.navigate = (date, action) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return dates.add((date, -1, "day"));
    case Navigate.NEXT:
      return dates.add((date, 1, "day"));
    default:
      return date;
  }
};

CustomDayView.title = date => {
  return `Today's Tracker Timeline: ${date.toLocaleDateString()}`;
};

export default CustomDayView;
