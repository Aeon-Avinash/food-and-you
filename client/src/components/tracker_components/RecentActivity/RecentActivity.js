import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
// import CardActions from "@material-ui/core/CardActions";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { TrackerBarChart, TrackerPieChart } from "../TrackerChart/TrackerChart";

import {
  views,
  resourceIdAccessor,
  resourceTypes
} from "../../../helperData/constants";

const useStyles = makeStyles(theme => ({
  root: {
    margin: 0,
    padding: 0,
    paddingTop: 20,
    maxWidth: "100%",
    overflow: "visible"
  },
  card: {
    width: "100%",
    height: "100%",
    padding: 0,
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    transition: "0.2s ease-out",
    "&:hover": {
      backgroundColor: "rgba(232, 223, 224, 0.96)"
    }
  },
  cardContent: {
    paddingTop: 2,
    paddingBottom: 4,
    marginBottom: 0
  },
  cardContentPieCharts: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  chart: {
    maxWidth: "60%"
  },
  list: {
    width: "400px"
  },
  title: {
    fontSize: 14,
    marginTop: 0
  },
  cardActions: {
    paddingTop: 0,
    marginTop: 0
  },
  button: {
    marginLeft: 10,
    marginRight: 10,
    textTransform: "capitalize"
  }
}));

const RecentActivity = props => {
  const classes = useStyles();
  const {
    trackerData,
    history,
    setCurrentTimelineView,
    setCurrentTimelineDate
  } = props;
  let recentDietEntries = [],
    recentMealPlans = [];
  let lastDayDietEntries = [],
    todaysDietEntries = [],
    todaysMealPlans = [],
    nextDayMealPlans = [];

  if (
    trackerData &&
    trackerData.timelineSnippets &&
    trackerData.timelineSnippets.ENTRIES &&
    trackerData.timelineSnippets.DAYS
  ) {
    recentDietEntries = trackerData.timelineSnippets.ENTRIES.filter(
      entry => entry[resourceIdAccessor] === resourceTypes.dietEntry
    )
      //? Sorted by latest diet entries
      .sort((a, b) => a.start < b.start)
      .filter((entry, index) => index <= 5);
    recentMealPlans = trackerData.timelineSnippets.ENTRIES.filter(
      entry => entry[resourceIdAccessor] === resourceTypes.mealPlan
    )
      //? Showing by upcoming meal plans
      .sort((a, b) => a.start > b.start)
      .filter((entry, index) => index <= 5);

    lastDayDietEntries = trackerData.timelineSnippets.DAYS.filter(
      entry => entry[resourceIdAccessor] === resourceTypes.dietEntry
    ).find(
      d =>
        moment(d.date).dayOfYear() ===
        moment(new Date())
          .subtract(1, "day")
          .dayOfYear()
    );

    todaysDietEntries = trackerData.timelineSnippets.DAYS.filter(
      entry => entry[resourceIdAccessor] === resourceTypes.dietEntry
    ).find(d => moment(d.date).dayOfYear() === moment(new Date()).dayOfYear());

    todaysMealPlans = trackerData.timelineSnippets.DAYS.filter(
      entry => entry[resourceIdAccessor] === resourceTypes.mealPlan
    ).find(d => moment(d.date).dayOfYear() === moment(new Date()).dayOfYear());

    nextDayMealPlans = trackerData.timelineSnippets.DAYS.filter(
      entry => entry[resourceIdAccessor] === resourceTypes.mealPlan
    ).find(
      d =>
        moment(d.date).dayOfYear() ===
        moment(new Date())
          .add(1, "day")
          .dayOfYear()
    );
  }

  const shiftViewToTimelineEntries = start => {
    history.push("/tracker/timeline");
    setCurrentTimelineView(views.AGENDA);
    setCurrentTimelineDate(start);
  };

  const pushHistoryToStartSelectTracker = () => {
    history.push("/tracker/startSelectTracker");
  };

  const pushHistoryToTimeline = () => {
    history.push("/tracker/timeline");
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" gutterBottom>
        Recent Tracker Activity
      </Typography>
      {trackerData &&
      trackerData._id &&
      trackerData.timelineSnippets.ENTRIES.length > 0 &&
      trackerData.timelineSnippets.DAYS.length > 0 ? (
        <Grid container spacing={3} justify="space-around">
          {lastDayDietEntries ? (
            <Grid item xs={12} md={3}>
              <Card className={clsx(classes.card)} raised>
                <CardHeader
                  title={"Chart for yesterday's Diet Entries summary"}
                  subheader={`What had you eaten yesterday`}
                />
                <CardContent className={classes.cardContentPieCharts}>
                  <Typography variant="body2" gutterBottom>
                    {lastDayDietEntries.numEntries}{" "}
                    {lastDayDietEntries.numEntries !== 1 ? "Entries" : "Entry"}
                  </Typography>
                  <TrackerPieChart
                    className={classes.chart}
                    data={lastDayDietEntries}
                    chartType="PIE"
                    width={500}
                  />
                </CardContent>
              </Card>
            </Grid>
          ) : null}
          {todaysDietEntries ? (
            <Grid item xs={12} md={3}>
              <Card className={clsx(classes.card)} raised>
                <CardHeader
                  title={"Chart for today's Diet Entries summary"}
                  subheader={`What have you eaten today`}
                />
                <CardContent className={classes.cardContentPieCharts}>
                  <Typography variant="body2" gutterBottom>
                    {todaysDietEntries.numEntries}{" "}
                    {todaysDietEntries.numEntries !== 1 ? "Entries" : "Entry"}
                  </Typography>
                  <TrackerPieChart
                    className={classes.chart}
                    data={todaysDietEntries}
                    chartType="PIE"
                    width={500}
                  />
                </CardContent>
              </Card>
            </Grid>
          ) : null}
          {todaysMealPlans ? (
            <Grid item xs={12} md={3}>
              <Card className={clsx(classes.card)} raised>
                <CardHeader
                  title={"Chart for today's Meal Plan summary"}
                  subheader={`What have you planned to eat today`}
                />
                <CardContent className={classes.cardContentPieCharts}>
                  <Typography variant="body2" gutterBottom>
                    {todaysMealPlans.numEntries}{" "}
                    {todaysMealPlans.numEntries !== 1 ? "Entries" : "Entry"}
                  </Typography>
                  <TrackerPieChart
                    className={classes.chart}
                    data={todaysMealPlans}
                    chartType="PIE"
                    width={500}
                  />
                </CardContent>
              </Card>
            </Grid>
          ) : null}
          {nextDayMealPlans ? (
            <Grid item xs={12} md={3}>
              <Card className={clsx(classes.card)} raised>
                <CardHeader
                  title={"Chart for tomorrow's Meal Plan summary"}
                  subheader={`What have you planned to eat tomorrow`}
                />
                <CardContent className={classes.cardContentPieCharts}>
                  <Typography variant="body2" gutterBottom>
                    {nextDayMealPlans.numEntries}{" "}
                    {nextDayMealPlans.numEntries !== 1 ? "Entries" : "Entry"}
                  </Typography>
                  <TrackerPieChart
                    className={classes.chart}
                    data={nextDayMealPlans}
                    chartType="PIE"
                    width={500}
                  />
                </CardContent>
              </Card>
            </Grid>
          ) : null}
          <Grid item xs={12} md={6}>
            <Card className={clsx(classes.card)} raised>
              <CardHeader
                title={"Chart for Last 7 days Diet Entries"}
                subheader={`What have you lately eaten`}
              />
              <CardContent className={classes.CardContent}>
                <TrackerBarChart
                  className={classes.chart}
                  data={trackerData.timelineSnippets.DAYS.filter(
                    entry =>
                      entry[resourceIdAccessor] === resourceTypes.dietEntry
                  ).filter(
                    d =>
                      moment(d.date).dayOfYear() >=
                        moment(new Date())
                          .subtract(5, "days")
                          .dayOfYear() &&
                      moment(d.date).dayOfYear() <=
                        moment(new Date()).dayOfYear()
                  )}
                  chartType="BAR"
                  width={500}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card className={classes.card} raised>
              <CardHeader
                title={"Recent Diet Entries"}
                subheader={`What have you lately eaten`}
              />
              <CardContent className={classes.CardContent}>
                <List component="div" className={classes.list}>
                  {recentDietEntries.map(entry => (
                    <ListItem
                      key={entry._id}
                      className={classes.genericItem}
                      divider
                    >
                      <Button
                        variant="text"
                        onClick={shiftViewToTimelineEntries.bind(
                          this,
                          entry.start
                        )}
                        className={classes.button}
                      >
                        <Typography variant="body2">
                          {entry.title} -{" "}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                          {moment(entry.start).format("ddd, hA")}
                        </Typography>
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className={clsx(classes.card)} raised>
              <CardHeader
                title={"Chart for Next 7 days Meal Plans"}
                subheader={`What have you planned to eat`}
              />
              <CardContent className={classes.CardContent}>
                <TrackerBarChart
                  className={classes.chart}
                  data={trackerData.timelineSnippets.DAYS.filter(
                    entry =>
                      entry[resourceIdAccessor] === resourceTypes.mealPlan
                  ).filter(
                    d =>
                      moment(d.date).dayOfYear() >=
                        moment(new Date()).dayOfYear() &&
                      moment(d.date).dayOfYear() <=
                        moment(new Date())
                          .add(5, "days")
                          .dayOfYear()
                  )}
                  chartType="BAR"
                  width={500}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card className={classes.card} raised>
              <CardHeader
                title={"Recent Meal Plans"}
                subheader={`What have you planned to eat`}
              />
              <CardContent className={classes.CardContent}>
                <List component="div" className={classes.list}>
                  {recentMealPlans.map(entry => (
                    <ListItem
                      key={entry._id}
                      className={classes.genericItem}
                      divider
                    >
                      <Button
                        variant="text"
                        onClick={shiftViewToTimelineEntries.bind(
                          this,
                          entry.start
                        )}
                        className={classes.button}
                      >
                        <Typography variant="body2">
                          {entry.title} -{" "}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                          {moment(entry.start).format("ddd, hA")}
                        </Typography>
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : trackerData &&
        trackerData._id &&
        trackerData.timelineSnippets.ENTRIES.length === 0 &&
        trackerData.timelineSnippets.DAYS.length === 0 ? (
        <div>
          <Typography variant="body2" gutterBottom>
            {" "}
            No entries have been made to your selected tracker.
          </Typography>
          <Button
            variant="contained"
            onClick={
              props.redirectToAddDietEntry
                ? props.redirectToAddDietEntry
                : pushHistoryToTimeline
            }
            className={classes.button}
          >
            {" "}
            Add a new Diet Entry{" "}
          </Button>
          <Button
            variant="contained"
            onClick={
              props.redirectToAddMealPlan
                ? props.redirectToAddMealPlan
                : pushHistoryToTimeline
            }
            className={classes.button}
          >
            {" "}
            Add a new Meal Plan{" "}
          </Button>
        </div>
      ) : (
        <div>
          <Typography variant="body2" gutterBottom>
            {" "}
            Default tracker has not been set. Please select one of your existing
            trackers or create a new one.
          </Typography>
          <Button
            variant="contained"
            onClick={pushHistoryToStartSelectTracker}
            className={classes.button}
          >
            {" "}
            Start/Select Tracker{" "}
          </Button>
        </div>
      )}
    </Paper>
  );
};

export default RecentActivity;
