import React from "react";
import { connect } from "react-redux";
import { uiStateActions, trackerActions } from "../../../store/actions";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import moment from "moment";
import Chip from "@material-ui/core/Chip";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
// import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
// import SelectionDetailSnippet from "../../tracker_components/SelectionDetailSnippet/SelectionDetailSnippet";
import NutriSnippet from "../../nutrition_components/NutriSnippet/NutriSnippet";
import DateTimePicker from "../../tracker_components/DateTimePicker/DateTimePicker";
import {
  resourceIdAccessor,
  resourceTypes
} from "../../../helperData/constants";

const useStyles = makeStyles(theme => ({
  card: {
    width: "100%",
    height: "100%",
    padding: 20,
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    zIndex: "100 !important",
    transition: "0.2s ease-out",
    "&:hover": {
      backgroundColor: "rgba(232, 223, 224, 0.96)",
      zIndex: "1 !important"
    }
  },
  cardContent: {
    paddingTop: 2,
    paddingBottom: 0,
    marginBottom: 0
  },
  title: {
    fontSize: 14,
    marginTop: 0
  },
  resourceTypeChip: {
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.87)",
    marginBottom: 10,
    marginRight: 10
  },
  convertChip: {
    color: "rgba(0, 0, 0, 0.87)",
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    marginBottom: 10,
    marginRight: 10
  },
  dietEntryStyle: {
    backgroundColor: "#3174ad"
  },
  mealPlanStyle: {
    backgroundColor: "#455a64"
  },
  dietEntryHoverStyle: {
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    "&:hover": {
      color: "#fff",
      backgroundColor: "#3174ad"
    }
  },
  mealPlanHoverStyle: {
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    "&:hover": {
      color: "#fff",
      backgroundColor: "#455a64"
    }
  },
  cardActions: {
    paddingTop: 0,
    marginTop: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center"
  },
  button: {
    marginLeft: 10,
    marginRight: 10
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  dangerButton: {
    "&:hover": {
      color: "crimson"
    }
  },
  cardLabel: {
    padding: 10,
    backgroundColor: "rgba(232, 223, 224, 0.64)"
  },
  dateTimePickerButton: {
    backgroundColor: "rgba(232, 223, 224, 0.64)"
  }
}));

const mapPropsEvent = state => ({
  entries: state.appData.tracker.selectedTracker.timelineSnippets.ENTRIES
});

export const EntriesEvent = connect(mapPropsEvent)(props => {
  const classes = useStyles();
  const { event, entries } = props;

  const requestNutritionDetailEntry = e => {
    props.setSnippetId(event._id);
    props.setSnippetType("ENTRIES");
    props.setSnippetData(entries.find(entry => entry._id === event._id));
    props.setCurrentTimelineRecipeDetail();
    props.showDetailsModal();
  };

  const requestRecipeDetailEntry = e => {
    props.setCurrentTimelineRecipeDetail({ recipeDetail: event });
    props.showRecipeModal();
  };

  const requestRemoveEntry = () => {
    props.removeTrackerEntry(event);
  };

  const isEventConvertible =
    moment(event.start).dayOfYear() ===
      moment(new Date())
        .subtract(1, "day")
        .dayOfYear() ||
    moment(event.start).dayOfYear() === moment(new Date()).dayOfYear();

  const requestConvertEntryResourceType = () => {
    let newResourceType =
      event[resourceIdAccessor] === resourceTypes.mealPlan
        ? resourceTypes.dietEntry
        : resourceTypes.mealPlan;
    let updatedEvent = {
      ...event,
      resourceId: newResourceType,
      className: newResourceType
    };
    // console.log({ updatedEvent });
    props.editTrackerEntry(updatedEvent);
  };

  return (
    <>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Chip
            label={
              event[resourceIdAccessor] === resourceTypes.mealPlan
                ? "Planned Meal"
                : "Diet Entry"
            }
            className={clsx(
              classes.resourceTypeChip,
              event[resourceIdAccessor] === resourceTypes.mealPlan
                ? classes.mealPlanStyle
                : classes.dietEntryStyle
            )}
          />
          {isEventConvertible ? (
            <Chip
              label={
                event[resourceIdAccessor] !== resourceTypes.mealPlan
                  ? "Convert to Planned Meal"
                  : "Convert to Diet Entry"
              }
              className={clsx(
                classes.convertChip,
                event[resourceIdAccessor] !== resourceTypes.mealPlan
                  ? classes.mealPlanHoverStyle
                  : classes.dietEntryHoverStyle
              )}
              onClick={requestConvertEntryResourceType}
            />
          ) : null}
          <Typography variant="h4" gutterBottom>
            {event.title}
          </Typography>
          <NutriSnippet entryData={event} />
        </CardContent>
        <CardActions className={classes.cardActions}>
          <div className={classes.buttonGroup}>
            {event[resourceIdAccessor] === resourceTypes.mealPlan ? (
              <Button
                className={classes.button}
                variant="outlined"
                color="default"
                onClick={requestRecipeDetailEntry}
              >
                View Detailed Recipe
              </Button>
            ) : null}
            <Button
              className={classes.button}
              variant="outlined"
              color="default"
              onClick={requestNutritionDetailEntry}
            >
              View Detailed Nutrition Analysis
            </Button>
            <Button
              className={clsx(classes.button, classes.dangerButton)}
              variant="outlined"
              color="default"
              onClick={requestRemoveEntry}
            >
              Delete Entry
            </Button>
          </div>
        </CardActions>
      </Card>
      {/* //* SelectionDetailModal Now handled by parent Timeline component */}
      {/* //* RecipeDetail Now handled by parent Timeline component */}
    </>
  );
});

export const EntriesDate = props => {
  const classes = useStyles();
  const { label } = props;
  return (
    <Card className={classes.cardLabel}>
      <CardContent className={classes.cardContent}>
        <Typography variant="h6" gutterBottom>
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
};
export const EntriesTime = props => {
  const classes = useStyles();
  const { label } = props;
  return (
    <Card className={classes.cardLabel}>
      <CardContent className={classes.cardContent}>
        <Typography variant="h6" gutterBottom>
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
};

const mapStateToProps = state => ({
  entries: state.appData.tracker.selectedTracker.timelineSnippets.ENTRIES,
  selectedSnippetId: state.appData.tracker.targetTimeline.selectedSnippetId,
  currentTimelineDate: state.appData.tracker.currentTimeline.displayDate,
  dateTimePickerVisibility: state.uiState.uiStateHelperTwo.isVisible
});

export const EntriesDateTimePicker = connect(mapStateToProps, {
  editTrackerEntry: trackerActions.editTrackerEntry,
  setSelectedSnippetId: trackerActions.setSelectedSnippetId,
  setCurrentTimelineDate: trackerActions.setCurrentTimelineDate,
  setDateTimePickerVisibility: uiStateActions.setHelperTwoVisibility
})(props => {
  const { event, entries } = props;

  const entry = entries.find(entry => entry._id === event._id);

  const initiateTimeSlotChange = () => {
    props.setSelectedSnippetId(entry._id);
    props.setDateTimePickerVisibility(true);
  };

  const requestUpdateEntryToTracker = (finalEntry, entryDate) => {
    // console.log({ ...entry, ...finalEntry });
    props.editTrackerEntry({ ...entry, ...finalEntry });
    props.setDateTimePickerVisibility(false);
    props.setSelectedSnippetId(undefined);
    if (!moment(entryDate).isSame(props.currentTimelineDate)) {
      props.setCurrentTimelineDate(entryDate);
    }
  };

  const classes = useStyles();
  const isMealPlanner = entry[resourceIdAccessor] === resourceTypes.mealPlan;

  return (
    <>
      {props.selectedSnippetId !== event._id ? (
        <Button
          className={classes.dateTimePickerButton}
          variant="outlined"
          color="default"
          onClick={initiateTimeSlotChange}
          fullWidth
        >
          Change Time Slot
        </Button>
      ) : !props.dateTimePickerVisibility ? (
        <Button
          className={classes.dateTimePickerButton}
          variant="outlined"
          color="default"
          onClick={initiateTimeSlotChange}
          fullWidth
        >
          Change Time Slot
        </Button>
      ) : (
        <DateTimePicker
          targetEntrySlot={{ start: entry.start, end: entry.end }}
          setDateTimePickerVisibility={props.setDateTimePickerVisibility}
          requestAddEntryToTracker={requestUpdateEntryToTracker}
          isMealPlanner={isMealPlanner}
          setSelectedSnippetId={props.setSelectedSnippetId}
        />
      )}
    </>
  );
});
