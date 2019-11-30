import React from "react";
import { connect } from "react-redux";
import moment from "moment";
// import * as dates from "date-arithmetic";
// import { views } from "../../timeline_components/helpers/constants";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import {
  resourceIdAccessor,
  resourceTitleAccessor,
  resourceMap
} from "../../../helperData/constants";

const useStyles = makeStyles(theme => ({
  card: {
    width: "100%",
    height: "99%",
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    zIndex: "100 !important",
    transition: "0.3s",
    "&:hover": {
      backgroundColor: "rgba(135, 206, 250, 0.26)",
      zIndex: "1 !important"
    }
  },
  cardContent: {
    paddingTop: 2,
    paddingBottom: 4,
    marginBottom: 0,
    height: "100px"
  },
  headerColorDefault: {
    backgroundColor: "default"
  },
  headerColorCustom: {
    backgroundColor: "default"
    // backgroundColor: "rgba(255, 182, 193, 0.16)"
  },
  headerBody: {
    lineHeight: 0.8,
    fontWeight: "normal",
    textTransform: "capitalize"
  },
  headerLabel: {
    marginTop: 0,
    paddingTop: 10
  },
  headerLabelMonth: {
    marginTop: 0
  },
  gutterTitle: {
    paddingTop: 10
  },
  tableHead: {
    "& p": {
      paddingLeft: 10
    }
  },
  dateHeader: {
    cursor: "pointer",
    paddingRight: "2%"
  }
}));

const isSameDayAs = (value, eventStart) => {
  return (
    moment(value).isSame(eventStart, "day") &&
    moment(value).isSame(eventStart, "month") &&
    moment(value).isSame(eventStart, "year")
  );
};

export const TimeGutterHeader = props => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <>
        <CardContent className={classes.cardContent}>
          <Typography
            className={classes.gutterTitle}
            color="textSecondary"
            gutterBottom
          >
            Nutrition Status
          </Typography>
        </CardContent>
      </>
    </Card>
  );
};

const mapStateToProps = state => ({
  trackerEntries:
    state.appData.tracker.selectedTracker.timelineSnippets.ENTRIES,
  trackerDataDays: state.appData.tracker.selectedTracker.timelineSnippets.DAYS
});

export const CustomHeaderWeekDay = connect(mapStateToProps)(props => {
  const { label, date, trackerEntries } = props;
  // const { events, trackerDataDays } = props;
  const classes = useStyles();
  const entries = trackerEntries.filter(event =>
    isSameDayAs(date, event.start)
  );
  const isToday = date.getDate() === new Date().getDate();
  // const numAllEntries = entries.length;
  const resourceEntries = entries.filter(
    entry => entry[resourceIdAccessor] === props[resourceIdAccessor]
  );
  const numResourceEntries = resourceEntries.length;
  const resourceLabel =
    numResourceEntries > 0 &&
    resourceMap.find(
      resource => resource[resourceIdAccessor] === props[resourceIdAccessor]
    )[resourceTitleAccessor];
  const totalCal =
    numResourceEntries > 0 &&
    resourceEntries
      .reduce((acc, entry) => acc + Number(entry.ENERC_KCAL), 0)
      .toFixed(2);

  return (
    <Card className={classes.card}>
      <>
        <CardContent
          className={clsx(
            classes.cardContent,
            numResourceEntries && !isToday
              ? classes.headerColorCustom
              : classes.headerColorDefault
          )}
        >
          <Typography className={classes.headerLabel} color="textPrimary">
            {label}
          </Typography>

          {resourceEntries && numResourceEntries > 0 && (
            <div className={classes.headerBody}>
              <Typography color="textSecondary" gutterBottom>
                {numResourceEntries}{" "}
                {resourceLabel &&
                  resourceLabel.replace(
                    /s$/,
                    numResourceEntries > 1 ? "s" : ""
                  )}
              </Typography>
              <Typography variant="body1" component="h2" gutterBottom>
                {totalCal} KCal
              </Typography>
            </div>
          )}
        </CardContent>
      </>
    </Card>
  );
});

export const CustomHeaderMonth = props => {
  const classes = useStyles();
  return (
    <Typography className={classes.headerLabelMonth} color="textPrimary">
      {props.label}
    </Typography>
  );
};

export const DateHeaderMonth = props => {
  const classes = useStyles();
  const { label, date, onDrillDown, events } = props;
  const entries = events.find(event => moment(date).isSame(event.start, "day"));
  const hasOccured = date < new Date();

  return (
    <div
      onClick={onDrillDown}
      className={clsx(
        classes.dateHeader,
        hasOccured && entries
          ? classes.headerColorCustom
          : classes.headerColorDefault
      )}
    >
      {label}
    </div>
  );
};

export const CustomHeaderEntries = ({
  messages,
  headerRef,
  dateColRef,
  timeColRef
}) => {
  const classes = useStyles();
  const { date, time, event } = messages;
  return (
    <Paper>
      <Table
        className="rbc-agenda-table"
        aria-label="header table"
        ref={headerRef}
      >
        <TableHead>
          <TableRow>
            <TableCell
              className={clsx(classes.tableHead, "rbc-header")}
              align="left"
              ref={dateColRef}
            >
              <Typography color="textSecondary" gutterBottom>
                {date}
              </Typography>
            </TableCell>
            <TableCell
              className={clsx(classes.tableHead, "rbc-header")}
              align="left"
              ref={timeColRef}
            >
              <Typography color="textSecondary" gutterBottom>
                {time}
              </Typography>
            </TableCell>
            <TableCell
              className={clsx(classes.tableHead, "rbc-header")}
              align="left"
            >
              <Typography color="textSecondary" gutterBottom>
                {event}
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </Paper>
  );
};
