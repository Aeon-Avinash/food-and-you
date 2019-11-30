import React from "react";
// import { Calendar, Views } from "react-big-calendar";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Fab from "@material-ui/core/Fab";
import AddDietEntryIcon from "@material-ui/icons/PostAddTwoTone";
import AddMealPlanIcon from "@material-ui/icons/FeaturedPlayListTwoTone";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeftTwoTone";
import ChevronRightIcon from "@material-ui/icons/ChevronRightTwoTone";
import Grid from "@material-ui/core/Grid";
import { views } from "../../../helperData/constants";
// import { add } from "date-arithmetic";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    width: "100%",
    minHeight: 75
  },
  toolbar_container: {
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center"
  },
  navigation_container: {
    justifyContent: "flex-start"
  },
  filter_container: {
    justifyContent: "flex-end"
  },
  labelDate: {
    fontSize: "1rem"
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    textTransform: "capitalize",
    fontSize: "1rem"
  },
  labelFilterButton: {
    textTransform: "capitalize",
    fontSize: "1rem"
  },
  button_active: {
    backgroundColor: "#BBB"
  },
  add_dietEntry_fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    left: theme.spacing(2)
  },
  add_mealPlan_fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

const CustomToolbar = (toolbar, currentTimelineView) => {
  const goToEntriesView = () => {
    toolbar.updateCalendarView(views.AGENDA);
    toolbar.onView(views.AGENDA);
  };
  const goToDayView = () => {
    toolbar.updateCalendarView(views.DAY);
    toolbar.onView(views.DAY);
  };
  const goToWeekView = () => {
    toolbar.updateCalendarView(views.WEEK);
    toolbar.onView(views.WEEK);
  };
  const goToMonthView = () => {
    toolbar.updateCalendarView(views.MONTH);
    toolbar.onView(views.MONTH);
  };
  const goToBack = () => {
    let calDate = toolbar.date;
    switch (toolbar.view) {
      case views.AGENDA:
      case views.DAY:
        toolbar.date.setDate(calDate.getDate() - 1);
        break;
      case views.WEEK:
        toolbar.date.setDate(calDate.getDate() - 7);
        break;
      case views.MONTH:
      default:
        toolbar.date.setYear(calDate.getFullYear());
        toolbar.date.setMonth(calDate.getMonth() - 1);
        toolbar.date.setDate(1);
    }

    // toolbar.onNavigate("PREV");
    toolbar.onNavigate("prev");
    toolbar.updateCalendarDate(toolbar.date);
  };
  const goToNext = () => {
    let calDate = toolbar.date;
    switch (toolbar.view) {
      case views.AGENDA:
      case views.DAY:
        toolbar.date.setDate(calDate.getDate() + 1);
        break;
      case views.WEEK:
        toolbar.date.setDate(calDate.getDate() + 7);
        break;
      case views.MONTH:
      default:
        toolbar.date.setYear(calDate.getFullYear());
        toolbar.date.setMonth(calDate.getMonth() + 1);
        toolbar.date.setDate(1);
    }

    // toolbar.onNavigate("NEXT");
    toolbar.onNavigate("next");
    toolbar.updateCalendarDate(toolbar.date);
  };
  const goToCurrent = () => {
    toolbar.onNavigate("TODAY");
    toolbar.updateCalendarDate(new Date());
  };

  const label = () => {
    const date = moment(toolbar.date);
    return (
      <span>
        <b>{date.format("MMMM")}</b>
        {toolbar.view === views.DAY || toolbar.view === views.AGENDA ? (
          <span> {date.format("Do")},</span>
        ) : null}
        <span> {date.format("YYYY")}</span>
      </span>
    );
  };

  const classes = useStyles();

  let NavLabel = { prev: "", current: "Today", next: "" };
  switch (toolbar.view) {
    case views.AGENDA:
    case views.DAY:
      NavLabel = {
        prev: `${moment(moment(toolbar.date).subtract(1, "day")).format("Do")}`,
        current: "Today",
        next: `${moment(moment(toolbar.date).add(1, "day")).format("Do")}`
      };
      break;
    case views.WEEK:
      NavLabel = {
        prev: `${moment(moment(toolbar.date).subtract(1, "week")).format(
          "Wo"
        )} wk`,
        current: "This Week",
        next: `${moment(moment(toolbar.date).add(1, "week")).format("Wo")} wk`
      };
      break;
    case views.MONTH:
      NavLabel = {
        prev: `${moment(moment(toolbar.date).subtract(1, "month")).format(
          "MMM"
        )}`,
        current: "This Month",
        next: `${moment(moment(toolbar.date).add(1, "month")).format("MMM")}`
      };
      break;
    default:
      NavLabel = {
        prev: "",
        current: "Today",
        next: ""
      };
    // NavLabel = { prev: "&#8249;", current: "Today", next: "&#8250;" };
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={2} className={classes.toolbar_container}>
        <Grid item xs={8} sm={5} className={classes.navigation_container}>
          <ButtonGroup aria-label="contained default button group">
            <Button
              variant="contained"
              className={classes.button}
              onClick={goToBack}
            >
              <ChevronLeftIcon /> {NavLabel.prev}
            </Button>
            <Button
              variant="contained"
              className={classes.button}
              onClick={goToCurrent}
            >
              {NavLabel.current}
            </Button>
            <Button
              variant="contained"
              className={classes.button}
              onClick={goToNext}
            >
              {NavLabel.next} <ChevronRightIcon />
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={4} sm={2} className={classes.label}>
          <label className={classes.labelDate}>{label()}</label>
        </Grid>
        <Grid xs={12} sm={5} item className={classes.filter_container}>
          <ButtonGroup aria-label="contained default button group">
            <Button
              variant="contained"
              className={
                classes.button && toolbar.view === views.AGENDA
                  ? classes.button_active
                  : null
              }
              onClick={goToEntriesView}
            >
              <span className={classes.labelFilterButton}>Entries</span>
            </Button>
            <Button
              variant="contained"
              className={
                classes.button && toolbar.view === views.DAY
                  ? classes.button_active
                  : null
              }
              onClick={goToDayView}
            >
              <span className={classes.labelFilterButton}>Day</span>
            </Button>
            <Button
              variant="contained"
              className={
                classes.button && toolbar.view === views.WEEK
                  ? classes.button_active
                  : null
              }
              onClick={goToWeekView}
            >
              <span className={classes.labelFilterButton}>Week</span>
            </Button>
            <Button
              variant="contained"
              className={
                classes.button && toolbar.view === views.MONTH
                  ? classes.button_active
                  : null
              }
              onClick={goToMonthView}
            >
              <span className={classes.labelFilterButton}>Month</span>
            </Button>
          </ButtonGroup>
        </Grid>
        <Fab
          aria-label="add entry"
          className={classes.add_dietEntry_fab}
          color="default"
          onClick={toolbar.showAddDietEntryForm}
        >
          <AddDietEntryIcon color="primary" />
        </Fab>
        <Fab
          aria-label="add entry"
          className={classes.add_mealPlan_fab}
          color="default"
          onClick={toolbar.showAddMealPlanForm}
        >
          <AddMealPlanIcon color="primary" />
        </Fab>
      </Grid>
    </div>
  );
};

export default CustomToolbar;
