import PropTypes from "prop-types";
import clsx from "clsx";
import scrollbarSize from "dom-helpers/scrollbarSize";
import React from "react";

import * as dates from "../utils/dates";
// import DateContentRow from "react-big-calendar/lib/DateContentRow";
import DateContentRow from "../DateContentRow/DateContentRow";
import Header from "react-big-calendar/lib/Header";
import ResourceHeader from "../ResourceHeader/ResourceHeader";
// import ResourceHeader from "react-big-calendar/lib/ResourceHeader";
import { notify } from "../utils/helpers";
import Button from "@material-ui/core/Button";

import { resourceIdAccessor } from "../../../helperData/constants";

class TimeGridHeader extends React.Component {
  handleHeaderClick = (date, view, e) => {
    e.preventDefault();
    notify(this.props.onDrillDown, [date, view]);
  };

  renderHeaderCells(range, resourceId) {
    let {
      localizer,
      getDrilldownView,
      getNow,
      getters: { dayProp },
      components: { header: HeaderComponent = Header }
    } = this.props;

    const today = getNow();

    return range.map((date, i) => {
      let drilldownView = getDrilldownView(date);
      let label = localizer.format(date, "dayFormat");

      const { className, style } = dayProp(date);

      const resourceProps = { [resourceIdAccessor]: resourceId };

      let header = (
        <HeaderComponent
          date={date}
          label={label}
          {...resourceProps}
          localizer={localizer}
        />
      );

      //* Custom styling of the regrouped date headers
      return (
        <div
          key={i}
          style={style}
          className={clsx(
            "rbc-header",
            className,
            dates.eq(date, today, "day") && "rbc-today"
          )}
        >
          {drilldownView ? (
            <Button
              variant="text"
              style={{
                margin: 0,
                padding: 0,
                width: "100%",
                boxSizing: "border-box",
                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)"
              }}
              href="#"
              onClick={e => this.handleHeaderClick(date, drilldownView, e)}
            >
              {header}
            </Button>
          ) : (
            <span>{header}</span>
          )}
        </div>
      );
    });
  }
  renderRow = resource => {
    let {
      events,
      rtl,
      selectable,
      getNow,
      range,
      getters,
      localizer,
      accessors,
      components
    } = this.props;

    const resourceId = accessors.resourceId(resource);
    let eventsToDisplay = resource
      ? events.filter(event => accessors.resource(event) === resourceId)
      : events;

    return (
      <DateContentRow
        isAllDay
        rtl={rtl}
        getNow={getNow}
        minRows={2}
        range={range}
        events={eventsToDisplay}
        resourceId={resourceId}
        className="rbc-allday-cell"
        selectable={selectable}
        selected={this.props.selected}
        components={components}
        accessors={accessors}
        getters={getters}
        localizer={localizer}
        onSelect={this.props.onSelectEvent}
        onDoubleClick={this.props.onDoubleClickEvent}
        onSelectSlot={this.props.onSelectSlot}
        longPressThreshold={this.props.longPressThreshold}
      />
    );
  };

  render() {
    let {
      width,
      rtl,
      resources,
      range,
      events,
      getNow,
      accessors,
      selectable,
      components,
      getters,
      scrollRef,
      localizer,
      isOverflowing,
      components: {
        timeGutterHeader: TimeGutterHeader,
        resourceHeader: ResourceHeaderComponent = ResourceHeader
      }
    } = this.props;

    let style = {};
    if (isOverflowing) {
      style[rtl ? "marginLeft" : "marginRight"] = `${scrollbarSize()}px`;
    }

    const groupedEvents = resources.groupEvents(events);

    //* Custom attempt to reverse the day/resource grouping
    return (
      <div
        style={style}
        ref={scrollRef}
        className={clsx("rbc-time-header", isOverflowing && "rbc-overflowing")}
      >
        <div
          className="rbc-label rbc-time-header-gutter"
          style={{ width, minWidth: width, maxWidth: width }}
        >
          {TimeGutterHeader && <TimeGutterHeader />}
        </div>
        {range.map((date, jj) => {
          return resources.map(([id, resource], idx) => (
            <div className="rbc-time-header-content" key={id || idx}>
              <div
                className={`rbc-row rbc-time-header-cell`}
                //* modified 2 --> 1, to display dateContentRow for single day view
                // ${
                //   range.length <= 1 ? " rbc-time-header-cell-single-day" : ""
                // }
                //* passing the resourceId to the Header
              >
                {this.renderHeaderCells([date], id)}
              </div>
              <DateContentRow
                isAllDay
                rtl={rtl}
                getNow={getNow}
                minRows={2}
                range={[date]}
                events={groupedEvents.get(id) || []}
                resourceId={resource && id}
                className="rbc-allday-cell"
                selectable={selectable}
                selected={this.props.selected}
                components={components}
                accessors={accessors}
                getters={getters}
                localizer={localizer}
                onSelect={this.props.onSelectEvent}
                onDoubleClick={this.props.onDoubleClickEvent}
                onSelectSlot={this.props.onSelectSlot}
                longPressThreshold={this.props.longPressThreshold}
              />
              {resource && (
                <div
                  className="rbc-row rbc-row-resource"
                  key={`resource_${idx}`}
                >
                  <div className="rbc-header">
                    <ResourceHeaderComponent
                      index={idx}
                      label={accessors.resourceTitle(resource)}
                      resource={resource}
                    />
                  </div>
                </div>
              )}
            </div>
          ));
        })}
        {/* {resources.map(([id, resource], idx) => (
          <div className="rbc-time-header-content" key={id || idx}>
            {resource && (
              <div className="rbc-row rbc-row-resource" key={`resource_${idx}`}>
                <div className="rbc-header">
                  <ResourceHeaderComponent
                    index={idx}
                    label={accessors.resourceTitle(resource)}
                    resource={resource}
                  />
                </div>
              </div>
            )}
            <div
              className={`rbc-row rbc-time-header-cell${
                range.length <= 1 ? " rbc-time-header-cell-single-day" : ""
              }`}
            >
              {this.renderHeaderCells(range)}
            </div>
            <DateContentRow
              isAllDay
              rtl={rtl}
              getNow={getNow}
              minRows={2}
              range={range}
              events={groupedEvents.get(id) || []}
              resourceId={resource && id}
              className="rbc-allday-cell"
              selectable={selectable}
              selected={this.props.selected}
              components={components}
              accessors={accessors}
              getters={getters}
              localizer={localizer}
              onSelect={this.props.onSelectEvent}
              onDoubleClick={this.props.onDoubleClickEvent}
              onSelectSlot={this.props.onSelectSlot}
              longPressThreshold={this.props.longPressThreshold}
            />
          </div>
        ))} */}
      </div>
    );
  }
}

TimeGridHeader.propTypes = {
  range: PropTypes.array.isRequired,
  events: PropTypes.array.isRequired,
  resources: PropTypes.object,
  getNow: PropTypes.func.isRequired,
  isOverflowing: PropTypes.bool,

  rtl: PropTypes.bool,
  width: PropTypes.number,

  localizer: PropTypes.object.isRequired,
  accessors: PropTypes.object.isRequired,
  components: PropTypes.object.isRequired,
  getters: PropTypes.object.isRequired,

  selected: PropTypes.object,
  selectable: PropTypes.oneOf([true, false, "ignoreEvents"]),
  longPressThreshold: PropTypes.number,

  onSelectSlot: PropTypes.func,
  onSelectEvent: PropTypes.func,
  onDoubleClickEvent: PropTypes.func,
  onDrillDown: PropTypes.func,
  getDrilldownView: PropTypes.func.isRequired,
  scrollRef: PropTypes.any
};

export default TimeGridHeader;
