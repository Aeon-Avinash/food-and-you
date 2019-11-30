import PropTypes from "prop-types";
import React from "react";
// import moment from "moment";
// import { connect } from "react-redux";
import clsx from "clsx";
import * as dates from "../utils/dates";

class EventCell extends React.Component {
  render() {
    let {
      style,
      className,
      event,
      selected,
      isAllDay,
      onSelect,
      onDoubleClick,
      localizer,
      continuesPrior,
      continuesAfter,
      accessors,
      getters,
      children,
      components: { event: Event, eventWrapper: EventWrapper },
      slotStart,
      slotEnd,
      ...props
    } = this.props;

    let title = accessors.title(event);
    let tooltip = accessors.tooltip(event);
    let end = accessors.end(event);
    let start = accessors.start(event);
    let allDay = accessors.allDay(event);

    let showAsAllDay =
      isAllDay ||
      allDay ||
      dates.diff(start, dates.ceil(end, "day"), "day") > 1;

    let userProps = getters.eventProp(event, start, end, selected);

    const content = (
      <div className="rbc-event-content" title={tooltip || undefined}>
        {Event ? (
          <Event
            event={event}
            continuesPrior={continuesPrior}
            continuesAfter={continuesAfter}
            title={title}
            isAllDay={allDay}
            localizer={localizer}
            slotStart={slotStart}
            slotEnd={slotEnd}
          />
        ) : (
          title
        )}
      </div>
    );

    //* Custom event wrapper styles for date-cell mouseover
    // const {
    //   isMonthDateCellWrapper,
    //   mouseMoveDateCell,
    //   ...componentProps
    // } = this.props;
    // // console.log();
    // const {
    //   isMonthDateCellWrapper: tempVal1,
    //   mouseMoveDateCell: tempVal2,
    //   //! removed dispatch becuase react was giving errors about invalid prop types
    //   dispatch,
    //   ...passedDownProps
    // } = props;

    // let eventStart =
    //   typeof event.start !== "object"
    //     ? new Date(moment(event.start))
    //     : event.start;

    // const onMouseMoveInDateCell =
    //   isMonthDateCellWrapper &&
    //   new Date(moment(mouseMoveDateCell.value)).getDate() ===
    //     eventStart.getDate();

    // //* Custom styles added to the eventWrapper

    // const customEventStyle = {
    //   transition: "all 0.1s ease-out",
    //   visibility: onMouseMoveInDateCell ? "hidden" : "visible",
    //   display: onMouseMoveInDateCell ? "none" : "block",
    //   border: "none !important"
    // };

    return (
      <EventWrapper {...this.props} type="date">
        <div
          {...props}
          // dispatch={props.dispatch || (() => {})}
          tabIndex={0}
          style={{ ...userProps.style, ...style }}
          className={clsx(
            "rbc-event",
            event.className,
            className,
            userProps.className,
            {
              "rbc-selected": selected,
              "rbc-event-allday": showAsAllDay,
              "rbc-event-continues-prior": continuesPrior,
              "rbc-event-continues-after": continuesAfter
            }
          )}
          onClick={e => onSelect && onSelect(event, e)}
          onDoubleClick={e => onDoubleClick && onDoubleClick(event, e)}
        >
          {typeof children === "function" ? children(content) : content}
        </div>
      </EventWrapper>
    );
  }
}

EventCell.propTypes = {
  event: PropTypes.object.isRequired,
  slotStart: PropTypes.instanceOf(Date),
  slotEnd: PropTypes.instanceOf(Date),

  selected: PropTypes.bool,
  isAllDay: PropTypes.bool,
  continuesPrior: PropTypes.bool,
  continuesAfter: PropTypes.bool,

  accessors: PropTypes.object.isRequired,
  components: PropTypes.object.isRequired,
  getters: PropTypes.object.isRequired,
  localizer: PropTypes.object,

  onSelect: PropTypes.func,
  onDoubleClick: PropTypes.func
};

// const mapStateToProps = reduxState => ({
//   mouseMoveDateCell: reduxState.uiState.uiStateHelperOne.uiState,
//   isMonthDateCellWrapper: reduxState.uiState.uiStateHelperOne.isVisible
// });

// export default connect(mapStateToProps)(EventCell);

export default EventCell;
