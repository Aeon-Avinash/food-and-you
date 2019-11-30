import React, { Children } from "react";
import { connect } from "react-redux";
import { uiStateActions } from "../../../store/actions";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { resourceTypes } from "../../../helperData/constants";

export const DateCellWrapper = ({ children, range, value }) => {
  let end = new Date();

  return React.cloneElement(Children.only(children), {
    style: {
      ...children.style,
      backgroundColor: value < end ? "#f5f5dc" : "#fff"
    }
  });
};

const useStyles = makeStyles(theme => ({
  rootPaper: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(232, 223, 224, 0.64)"
  },
  card: {
    width: "96%",
    height: "96%",
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    transition: "0.1s ease-out",
    cursor: "pointer",
    opacity: 0.5
  },
  cardHoverStyle: {
    "&:hover": {
      backgroundColor: "rgba(135, 206, 250, 0.26)",
      opacity: 1
    }
  },
  today: {
    border: "solid 1px rgba(56, 142, 60, 0.64)"
  },
  cardContent: {
    paddingTop: 2,
    paddingBottom: 4,
    marginBottom: 0
  },
  text: {
    backfaceVisibility: "hidden !important"
  },
  title: {
    fontSize: 14,
    marginTop: 0,
    textOverflow: "fade",
    whiteSpace: "nowrap",
    [theme.breakpoints.down("lg")]: {
      whiteSpace: "normal"
    }
  },
  pos: {
    marginBottom: 12
  },
  cardActions: {
    paddingTop: 0,
    marginTop: 0
  },
  moreButton: {
    zIndex: 200
  }
}));

const mapStateToProps = state => ({
  trackerEntries:
    state.appData.tracker.selectedTracker.timelineSnippets.ENTRIES,
  trackerDataDays: state.appData.tracker.selectedTracker.timelineSnippets.DAYS
});

export const MonthDateCellWrapper = connect(mapStateToProps, {
  setMouseMoveDateCellState: uiStateActions.setUIStateHelperOne,
  isMonthDateCellWrapper: uiStateActions.setHelperOneVisibility
})(
  ({
    children,
    range,
    value,
    setMouseMoveDateCellState,
    isMonthDateCellWrapper,
    events,
    trackerEntries,
    trackerDataDays
  }) => {
    const classes = useStyles();
    const hasOccured = value < new Date();
    const isSameDayAs = (value, eventStart) => {
      return (
        moment(value).isSame(eventStart, "day") &&
        moment(value).isSame(eventStart, "month") &&
        moment(value).isSame(eventStart, "year")
      );
    };

    const entries = trackerEntries.filter(event => {
      const startDate =
        typeof event.start !== "object"
          ? new Date(moment(event.start))
          : event.start;
      return isSameDayAs(value, startDate);
    });
    const numDietEntries = entries.filter(
      e => e.resourceId === resourceTypes.dietEntry
    ).length;
    const numMealPlans = entries.filter(
      e => e.resourceId === resourceTypes.mealPlan
    ).length;
    //* Gets entries for the day calculations from Tracker-reducer through connect
    const numEntries = entries.length;
    //* const tCal = entries && calculateDay(entries).tCal

    const dayDataDietEntries = trackerDataDays.find(day => {
      return (
        isSameDayAs(value, day.date) &&
        day.resourceId === resourceTypes.dietEntry
      );
    });

    const dayDataMealPlans = trackerDataDays.find(day => {
      return (
        isSameDayAs(value, day.date) &&
        day.resourceId === resourceTypes.mealPlan
      );
    });

    const dayData =
      value.getDate() === new Date().getDate() &&
      numDietEntries === 0 &&
      numMealPlans > 0
        ? dayDataMealPlans
        : hasOccured
        ? dayDataDietEntries
        : dayDataMealPlans;

    const style = {
      display: "flex",
      flex: 1,
      borderLeft: "1px solid #DDD",
      position: "relative"
    };
    return (
      <div style={style}>
        {React.cloneElement(
          children,
          {},
          <Paper className={classes.rootPaper}>
            <Card
              className={clsx(
                classes.card,
                classes.cardHoverStyle,
                isSameDayAs(value, new Date()) ? classes.today : ""
              )}
            >
              {dayData && entries && numEntries > 0 && (
                <>
                  <CardContent className={classes.cardContent}>
                    <Typography
                      className={clsx(classes.title, classes.text)}
                      color="textPrimary"
                      gutterBottom
                    >
                      {dayDataDietEntries && dayDataDietEntries.numEntries > 0
                        ? `${dayDataDietEntries.numEntries} Diet Entries`
                        : null}
                      {dayDataDietEntries && dayDataDietEntries.numEntries > 0
                        ? ", "
                        : ""}
                      {dayDataMealPlans && dayDataMealPlans.numEntries > 0
                        ? `${dayDataMealPlans.numEntries} Meal Plans`
                        : null}
                      {/* {moment(value).format("MMM Do")} */}
                    </Typography>
                    <Typography
                      className={classes.text}
                      variant="h5"
                      component="h2"
                    >
                      {dayData && Number(dayData.ENERC_KCAL).toFixed(2)} KCal
                    </Typography>
                    <Typography
                      className={classes.text}
                      variant="body2"
                      component="p"
                    >
                      {dayData && Number(dayData.percentProtein).toFixed(2)}%
                      Pro, {dayData && Number(dayData.percentCarbs).toFixed(2)}%
                      Crb, {dayData && Number(dayData.percentFat).toFixed(2)}%
                      Fat
                    </Typography>
                    <Typography
                      className={classes.text}
                      variant="body2"
                      component="p"
                    >
                      a day of balanced diet
                    </Typography>
                  </CardContent>
                  <CardActions className={classes.cardActions}>
                    <Button
                      className={classes.moreButton}
                      size="small"
                      fullWidth
                      onMouseOver={() => {
                        setMouseMoveDateCellState({
                          name: "MonthDateCellWrapper",
                          value: value
                        });
                        isMonthDateCellWrapper(true);
                      }}
                      onMouseOut={() => {
                        setMouseMoveDateCellState({
                          name: "MonthDateCellWrapper",
                          value: value
                        });
                        isMonthDateCellWrapper(false);
                      }}
                    >
                      Learn More
                    </Button>
                  </CardActions>
                </>
              )}
            </Card>
          </Paper>
          //? Date Cell with Minimal content
        )}
      </div>
    );
  }
);
