import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import moment from "moment";
import Card from "@material-ui/core/Card";
// import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
// import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import DialogModal from "../../../ui/DialogModal/DialogModal";
import NutriSnippet from "../../nutrition_components/NutriSnippet/NutriSnippet";
import { views, resourceTypes } from "../../../helperData/constants";
import MealPlanSnippet from "../../mealPlan_components/MealPlanSnippet/MealPlanSnippet";

const styles = theme => ({
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
  dialogMessage: {
    textAlign: "center",
    paddingTop: 20
  }
});

class DaySummarySnippet extends Component {
  handleNavigateToTargetDate = () => {
    if (this.props.targetDate) {
      this.props.setCurrentTimelineView(views.DAY);
      this.props.setCurrentTimelineDate(this.props.targetDate);
      this.props.hideEntryModal();
      // console.log(
      //   `Redirected to day ${this.props.targetDate.getDate()} Day view`
      // );
    }
  };

  handleRequestSelectionDetails = () => {
    this.props.showDetailsModal();
    this.props.setSelectedSnippetData(this.props.selectionData);
  };

  handleAddEntryToTargetSlot = () => {
    this.props.hideEntryModal("targetSlots");
    this.props.addEntryToTargetSlot(this.props.targetSlots);
    // console.log(
    //   `Redirected to Add new Entry Form with ${this.props.targetSlots}`
    // );
  };

  render() {
    const {
      classes,
      openEntryModal,
      showEntryModal,
      hideEntryModal,
      targetDate,
      // targetSlots
      selectionData,
      entryModalState
    } = this.props;
    const isMealPlanner = entryModalState === resourceTypes.mealPlan;
    console.log({ selectionData });
    return (
      <DialogModal
        openDialogModal={openEntryModal}
        showDialogModal={showEntryModal}
        hideDialogModal={hideEntryModal}
        DialogTitleChildren={() => (
          <>
            <Typography gutterBottom className={classes.dialogTitle}>
              {moment(targetDate).format("Do MMM")}{" "}
              {!isMealPlanner ? "Nutrition Summary" : "Meal Planner"}
            </Typography>
          </>
        )}
        DialogContentChildren={() => (
          <div className={classes.rootDialogContent}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                {selectionData ? (
                  <>
                    <Typography variant="h4" gutterBottom>
                      {!isMealPlanner
                        ? `Summary of ${selectionData.numEntries} Entries`
                        : `Summary of ${selectionData.numEntries} planned meals`}{" "}
                      for {moment(targetDate).format("Do MMM YYYY")}
                    </Typography>
                    {!isMealPlanner ? (
                      <NutriSnippet entryData={selectionData} />
                    ) : (
                      <MealPlanSnippet entryData={selectionData} daySummary />
                    )}
                  </>
                ) : (
                  <Typography gutterBottom className={classes.dialogMessage}>
                    {!isMealPlanner
                      ? "No entries found for the day."
                      : "No Meals are planned for the day."}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        DialogActionChildren={() => (
          <>
            <Button onClick={this.handleNavigateToTargetDate} color="primary">
              Go to the Day View
            </Button>
            <Button
              onClick={this.handleRequestSelectionDetails}
              color="primary"
            >
              {!isMealPlanner
                ? "View Detail Nutrition Report"
                : "View Detail Nutrition Report"}
            </Button>
            <Button onClick={this.handleAddEntryToTargetSlot} color="primary">
              {!isMealPlanner ? "Add new Entry" : "Add new Meal Plan"}
            </Button>
          </>
        )}
      />
    );
  }
}

export default withStyles(styles)(DaySummarySnippet);
