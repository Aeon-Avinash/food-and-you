import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h4">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    margin: "10px"
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between"
  }
}))(MuiDialogActions);

class DialogModal extends Component {
  render() {
    const {
      openDialogModal,
      showDialogModal,
      hideDialogModal,
      DialogTitleChildren,
      DialogActionChildren,
      DialogContentChildren
    } = this.props;
    return (
      <div>
        <Button
          style={{ display: "none" }}
          variant="outlined"
          color="secondary"
          onClick={showDialogModal}
        >
          Open dialog
        </Button>
        <Dialog
          onClose={hideDialogModal}
          aria-labelledby="customized-dialog-title"
          open={openDialogModal}
          maxWidth="lg"
        >
          <DialogTitle id="customized-dialog-title" onClose={hideDialogModal}>
            <DialogTitleChildren />
          </DialogTitle>
          <DialogContent dividers>
            <DialogContentChildren />
          </DialogContent>
          <DialogActions>
            <DialogActionChildren />
            <Button onClick={hideDialogModal} color="default">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DialogModal;
