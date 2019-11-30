import React from "react";
import { connect } from "react-redux";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const mapStateToProps = reduxState => ({
  mouseMoveDateCell: reduxState.uiState.uiStateHelperOne.uiState,
  isMonthDateCellWrapper: reduxState.uiState.uiStateHelperOne.isVisible
});

//* Functionality has been moved to EventWrapper and EventCell of the React-big-calendar source code

export const EventWrapperMonth = connect(
  mapStateToProps,
  null
)(props => {
  // console.log(props);

  const { event, isMonthDateCellWrapper, mouseMoveDateCell } = props;

  let eventStart =
    typeof event.start !== "object"
      ? new Date(moment(event.start))
      : event.start;

  const onMouseMoveInDateCell =
    isMonthDateCellWrapper &&
    new Date(moment(mouseMoveDateCell.value)).getDate() ===
      eventStart.getDate();

  const style = {
    padding: "2px",
    transition: "all 0.1s ease-out",
    // visibility: onMouseMoveInDateCell ? "hidden" : "visible",
    display: onMouseMoveInDateCell ? "none" : "block",
    opacity: 1
  };
  return <div style={style}>{props.children}</div>;
});
