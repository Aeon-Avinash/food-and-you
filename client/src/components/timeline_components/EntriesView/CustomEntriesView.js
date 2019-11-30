import React, { Component } from "react";
import { Navigate } from "react-big-calendar";
import Agenda from "react-big-calendar/lib/Agenda";
import * as dates from "date-arithmetic";

export function isSelected(event, selected) {
  if (!event || selected == null) return false;
  return [].concat(selected).indexOf(event) !== -1;
}

export function inRange(e, start, end, accessors) {
  let eStart = dates.startOf(accessors.start(e), "day");
  let eEnd = accessors.end(e);

  let startsBeforeEnd = dates.lte(eStart, end, "day");
  // when the event is zero duration we need to handle a bit differently
  let endsAfterStart = !dates.eq(eStart, eEnd, "minutes")
    ? dates.gt(eEnd, start, "minutes")
    : dates.gte(eEnd, start, "minutes");

  return startsBeforeEnd && endsAfterStart;
}

class CustomAgendaView extends Component {
  static defaultProps = {
    length: 30
  };

  render() {
    let { length, date, events, accessors, localizer } = this.props;
    let { messages } = localizer;
    let range = CustomAgendaView.range(date);

    return (
      <div {...this.props} range={range} eventOffset={15}>
        <table ref="header" className="rbc-agenda-table">
          <thead>
            <tr>
              <th className="rbc-header" ref="dateCol">
                {messages.date}
              </th>
              <th className="rbc-header" ref="timeCol">
                {messages.time}
              </th>
              <th className="rbc-header" ref="dateCol">
                Entry Query
              </th>
              <th className="rbc-header" ref="timeCol">
                Entry Analysis Summary
              </th>
            </tr>
          </thead>
        </table>
        <div className="rbc-agenda-content" ref="content">
          <table className="rbc-agenda-table">
            <tbody ref="tbody">
              {range.map((day, idx) => this.renderDay(day, events, idx))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  renderDay = (day, events, dayKey) => {
    let {
      selected,
      getters,
      accessors,
      localizer,
      components: { event: Event, date: AgendaDate }
    } = this.props;

    events = events.filter(e =>
      inRange(e, dates.startOf(day, "day"), dates.endOf(day, "day"), accessors)
    );

    return events.map((event, idx) => {
      let title = accessors.title(event);
      let end = accessors.end(event);
      let start = accessors.start(event);

      const userProps = getters.eventProp(
        event,
        start,
        end,
        isSelected(event, selected)
      );

      let dateLabel = idx === 0 && localizer.format(day, "agendaDateFormat");
      let first =
        idx === 0 ? (
          <td rowSpan={events.length} className="rbc-agenda-date-cell">
            {AgendaDate ? (
              <AgendaDate day={day} label={dateLabel} />
            ) : (
              dateLabel
            )}
          </td>
        ) : (
          false
        );

      return (
        <tr
          key={dayKey + "_" + idx}
          className={userProps.className}
          style={userProps.style}
        >
          {first}
          <td className="rbc-agenda-time-cell">
            {this.timeRangeLabel(day, event)}
          </td>
          <td className="rbc-agenda-event-cell">
            {Event ? <Event event={event} title={title} /> : title}
          </td>
        </tr>
      );
    }, []);
  };

  timeRangeLabel = (day, event) => {
    let { accessors, localizer, components } = this.props;

    let labelClass = "",
      TimeComponent = components.time,
      label = localizer.messages.allDay;

    let end = accessors.end(event);
    let start = accessors.start(event);

    if (!accessors.allDay(event)) {
      if (dates.eq(start, end, "day")) {
        label = localizer.format({ start, end }, "agendaTimeRangeFormat");
      } else if (dates.eq(day, start, "day")) {
        label = localizer.format(start, "agendaTimeFormat");
      } else if (dates.eq(day, end, "day")) {
        label = localizer.format(end, "agendaTimeFormat");
      }
    }

    if (dates.gt(day, start, "day")) labelClass = "rbc-continues-prior";
    if (dates.lt(day, end, "day")) labelClass += " rbc-continues-after";

    return (
      <span className={labelClass.trim()}>
        {TimeComponent ? (
          <TimeComponent event={event} day={day} label={label} />
        ) : (
          label
        )}
      </span>
    );
  };
}

CustomAgendaView.range = date => {
  let end = date;

  return [end];
};

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
