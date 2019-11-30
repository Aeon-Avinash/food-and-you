import React, { Component } from "react";
import { Navigate } from "react-big-calendar";
// import Agenda from "react-big-calendar/lib/Agenda";
import Agenda from "../../src_rbc_components/Agenda/Agenda";
import moment from "moment";
import * as dates from "date-arithmetic";

class CustomAgendaView extends Component {
  static defaultProps = {
    length: 0
  };

  render() {
    return (
      <Agenda
        {...this.props}
        events={this.props.events}
        date={new Date(moment(this.props.date).set("hour", 0))}
        length={0}
        customHeader
      />
    );
  }
}

CustomAgendaView.navigate = (
  date,
  action
  // { length = CustomAgendaView.defaultProps.length }
) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return dates.add((date, -1, "day"));
    case Navigate.NEXT:
      return dates.add((date, 1, "day"));
    default:
      return date;
  }
};

CustomAgendaView.title = date => {
  return `Today's Tracker Entries: ${date.toLocaleDateString()}`;
};

export default CustomAgendaView;
