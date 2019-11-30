import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import moment from "moment";
import Chip from "@material-ui/core/Chip";
import Card from "@material-ui/core/Card";
// import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DialogModal from "../../../ui/DialogModal/DialogModal";
import {
  resourceIdAccessor,
  resourceTypes
} from "../../../helperData/constants";
import NutriSnippet from "../../nutrition_components/NutriSnippet/NutriSnippet";
import MealPlanSnippet from "../../mealPlan_components/MealPlanSnippet/MealPlanSnippet";
import DateTimePicker from "../../tracker_components/DateTimePicker/DateTimePicker";

const useStyles = makeStyles(theme => ({
  rootDialogContent: {
    margin: 0,
    padding: theme.spacing(2)
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
    marginRight: 10
  },
  dangerButton: {
    "&:hover": {
      color: "crimson"
    }
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
    color: "#3174ad",
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    "&:hover": {
      color: "#fff",
      backgroundColor: "#3174ad"
    }
  },
  mealPlanHoverStyle: {
    color: "#455a64",
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    "&:hover": {
      color: "#fff",
      backgroundColor: "#455a64"
    }
  }
}));

const EntrySummarySnippet = props => {
  const classes = useStyles();
  const {
    openEntryModal,
    showEntryModal,
    hideEntryModal,
    entry,
    // entryModalState,
    dateTimePickerVisibility,
    setDateTimePickerVisibility
  } = props;
  const isMealPlanner =
    entry && entry[resourceIdAccessor] === resourceTypes.mealPlan;

  const handleRequestEntryDetails = () => {
    // console.log(`Request Detailed Entry for ${props.entry.title}`);
    props.showDetailsModal();
    props.setSelectedSnippetData(props.entry);
  };

  const requestRecipeDetailEntry = e => {
    props.setCurrentTimelineRecipeDetail({ recipeDetail: props.entry });
    props.showRecipeModal();
  };

  const requestRemoveEntry = () => {
    props.removeTrackerEntry(props.entry);
    props.hideEntryModal();
  };

  const initiateTimeSlotChange = () => {
    props.setDateTimePickerVisibility(true);
  };

  const requestUpdateEntryToTracker = (finalEntry, entryDate) => {
    // console.log({ ...entry, ...finalEntry });
    props.editTrackerEntry({ ...entry, ...finalEntry });
    // props.setConfirmTimeSlotSelection(false);
    props.setDateTimePickerVisibility(false);
    if (!moment(entryDate).isSame(props.currentTimelineDate)) {
      props.setCurrentTimelineDate(entryDate);
    }
  };

  const isEventConvertible =
    (entry &&
      moment(entry.start).dayOfYear() ===
        moment(new Date())
          .subtract(1, "day")
          .dayOfYear()) ||
    (entry &&
      moment(entry.start).dayOfYear() === moment(new Date()).dayOfYear());

  const requestConvertEntryResourceType = () => {
    let newResourceType =
      entry[resourceIdAccessor] === resourceTypes.mealPlan
        ? resourceTypes.dietEntry
        : resourceTypes.mealPlan;
    let updatedEvent = {
      ...entry,
      resourceId: newResourceType,
      className: newResourceType
    };
    // console.log({ updatedEvent });
    props.editTrackerEntry(updatedEvent);
  };

  return (
    <DialogModal
      openDialogModal={openEntryModal}
      showDialogModal={showEntryModal}
      hideDialogModal={hideEntryModal}
      DialogTitleChildren={() =>
        entry ? (
          <>
            <Chip
              label={
                entry[resourceIdAccessor] === resourceTypes.mealPlan
                  ? "Meal Plan"
                  : "Diet Entry"
              }
              className={clsx(
                classes.resourceTypeChip,
                entry[resourceIdAccessor] === resourceTypes.mealPlan
                  ? classes.mealPlanStyle
                  : classes.dietEntryStyle
              )}
            />
            {isEventConvertible ? (
              <Chip
                label={
                  entry[resourceIdAccessor] !== resourceTypes.mealPlan
                    ? "Convert to Meal Plan"
                    : "Convert to Diet Entry"
                }
                className={clsx(
                  classes.convertChip,
                  entry[resourceIdAccessor] !== resourceTypes.mealPlan
                    ? classes.mealPlanHoverStyle
                    : classes.dietEntryHoverStyle
                )}
                onClick={requestConvertEntryResourceType}
              />
            ) : null}
          </>
        ) : null
      }
      DialogContentChildren={() =>
        entry ? (
          <div className={classes.rootDialogContent}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography variant="h4" gutterBottom>
                  {entry.title}
                </Typography>
                {!isMealPlanner ? (
                  <NutriSnippet entryData={entry} />
                ) : (
                  <MealPlanSnippet entryData={entry} />
                )}
                <Paper>
                  {!dateTimePickerVisibility ? (
                    <Button
                      className={classes.button}
                      variant="text"
                      color="default"
                      onClick={initiateTimeSlotChange}
                      fullWidth
                    >
                      Change Time Slot
                    </Button>
                  ) : (
                    <DateTimePicker
                      targetEntrySlot={{ start: entry.start, end: entry.end }}
                      // dateTimePickerVisibility={dateTimePickerVisibility}
                      setDateTimePickerVisibility={setDateTimePickerVisibility}
                      requestAddEntryToTracker={requestUpdateEntryToTracker}
                      // confirmTimeSlotSelection={confirmTimeSlotSelection}
                      isMealPlanner={isMealPlanner}
                    />
                  )}
                </Paper>
              </CardContent>
            </Card>
          </div>
        ) : null
      }
      DialogActionChildren={() =>
        entry ? (
          <>
            {entry[resourceIdAccessor] === resourceTypes.mealPlan ? (
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
              variant="contained"
              color="default"
              onClick={handleRequestEntryDetails}
            >
              {!isMealPlanner
                ? "View Detailed Nutrition For Diet Entry"
                : "View Detailed Nutrition For Meal Plan"}
            </Button>
            <Button
              className={clsx(classes.button, classes.dangerButton)}
              variant="outlined"
              color="default"
              onClick={requestRemoveEntry}
            >
              Delete Entry
            </Button>
          </>
        ) : null
      }
    />
  );
};

export default EntrySummarySnippet;
