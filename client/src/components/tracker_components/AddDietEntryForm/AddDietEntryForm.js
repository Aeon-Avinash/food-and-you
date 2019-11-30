import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import EntryModal from "../../../ui/DialogModal/DialogModal";
import QueryForm from "../../nutrition_components/QueryForm/QueryFormAutoComplete";
import NutriAnalysisComp from "../../nutrition_components/NutriAnalysis/NutriAnalysis";
import { resourceTypes } from "../../../helperData/constants";

const NutriAnalysis = withRouter(NutriAnalysisComp);

const styles = theme => ({
  rootDialogContent: {
    margin: 0,
    padding: theme.spacing(2)
  },
  switchButton: {
    color: "#455a64",
    "&:hover": {
      backgroundColor: "#455a64",
      color: "#fff"
    }
  }
});

class AddDietEntryForm extends Component {
  componentWillUnmount = () => {
    console.log("AddDietEntryForm unmounting!");
  };

  requestSwitchEntryModalState = () => {
    this.props.switchAddEntryForm(
      this.props.targetEntrySlot,
      resourceTypes.mealPlan
    );
    this.props.setEntryModalState(resourceTypes.mealPlan);
  };

  render() {
    const {
      classes,
      openEntryModal,
      showEntryModal,
      hideEntryModal
      // entryModalState,
      // userSettings
    } = this.props;
    return (
      <EntryModal
        openDialogModal={openEntryModal}
        showDialogModal={showEntryModal}
        hideDialogModal={hideEntryModal}
        DialogTitleChildren={() => (
          <>
            <Typography gutterBottom className="dialogTitle">
              Add entry to your Tracker
            </Typography>
          </>
        )}
        DialogContentChildren={() => (
          <div className={classes.rootDialogContent}>
            <QueryForm />
            <NutriAnalysis />
          </div>
        )}
        DialogActionChildren={() => (
          <Button
            className={clsx(classes.button, classes.switchButton)}
            variant="outlined"
            color="default"
            onClick={this.requestSwitchEntryModalState}
          >
            Switch to Meal Planner
          </Button>
        )}
      />
    );
  }
}

export default withStyles(styles)(AddDietEntryForm);
