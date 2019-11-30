import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
// import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
// import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import NutriDetails from "../../nutrition_components/NutriDetails/NutriDetails";

import DialogModal from "../../../ui/DialogModal/DialogModal";

const useStyles = makeStyles(theme => ({
  rootDialogContent: {
    margin: 0,
    // padding: theme.spacing(1),
    // width: "450px",
    maxWidth: "450px",
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
  }
}));

const SelectionDetailSnippet = props => {
  const handleRequestEntryDetails = () => {
    console.log(
      `Request to Share Detailed Entry for ${props.selectionData.title}`
    );
  };

  const classes = useStyles();
  const {
    openDetailsModal,
    showDetailsModal,
    hideDetailsModal,
    selectedSnippetType,
    selectionData
  } = props;
  // console.log(selectionData, selectedSnippetType);
  // console.log("details for entryId", selectionData && selectionData.id);
  // console.log(selectionData.title);
  return (
    <DialogModal
      openDialogModal={openDetailsModal}
      showDialogModal={showDetailsModal}
      hideDialogModal={hideDetailsModal}
      DialogTitleChildren={() => (
        <>
          <Typography gutterBottom className="dialogTitle">
            Detail Nutrition Analysis
          </Typography>
        </>
      )}
      DialogContentChildren={() =>
        selectionData ? (
          <div className={classes.rootDialogContent}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography variant="h4" gutterBottom>
                  {selectionData.title}
                </Typography>
                <NutriDetails
                  selectionData={selectionData}
                  selectedSnippetType={selectedSnippetType}
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>No Data Available Currently!</div>
        )
      }
      DialogActionChildren={() =>
        selectionData ? (
          <>
            <Button
              className={classes.button}
              variant="contained"
              color="default"
              onClick={handleRequestEntryDetails}
            >
              Share Detailed Nutrition Analysis
            </Button>
          </>
        ) : null
      }
    />
  );
};

export default SelectionDetailSnippet;
