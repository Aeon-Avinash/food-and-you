import React, { Component } from "react";
import moment from "moment";
import DatePicker from "react-date-picker";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  rootPaper: {
    // height: "100px",
    marginTop: 20,
    marginBottom: 10
  },
  nutritionSummary: {
    marginBottom: 10
  },
  dateTimePickerRoot: {
    padding: 10,
    position: "relative",
    backgroundColor: "rgba(232, 223, 224, 0.64)"
  },
  dateTimePickerButtonGroup: {
    padding: 10
  },
  dateTimePickerCloseButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  button: {
    margin: 10,
    marginLeft: 0
  }
});

class DateTimePicker extends Component {
  state = {
    entryDate: undefined,
    entryTime: undefined
  };

  componentDidMount = () => {
    console.log("updating from DateTimePicker CDM!");
    this.setNewEntryDataDateTime();
  };

  getSnapshotBeforeUpdate = prevProps => {
    // console.log({
    //   "prevProps.confirmTimeSlotSelection": prevProps.confirmTimeSlotSelection,
    //   "this.props.confirmTimeSlotSelection": this.props.confirmTimeSlotSelection
    // });
    return {
      slotConfirmed:
        prevProps.confirmTimeSlotSelection !==
          this.props.confirmTimeSlotSelection &&
        this.props.confirmTimeSlotSelection
    };
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    // console.log({ snapshot });
    if (snapshot.slotConfirmed || this.props.confirmTimeSlotSelection) {
      this.onConfirmSlotSelection();
    }
  };

  componentWillUnmount() {
    this.props.setConfirmTimeSlotSelection &&
      this.props.setConfirmTimeSlotSelection(false);
    this.props.setSelectedSnippetId &&
      this.props.setSelectedSnippetId(undefined);
    // console.log("unmounting DateTimePicker!");
  }

  setNewEntryDataDateTime = () => {
    console.log(this.props.targetEntrySlot);
    const { entryDate, entryTime } =
      this.props.targetEntrySlot && this.props.targetEntrySlot.start
        ? this.setInitialEntryDateTime(
            this.props.targetEntrySlot.start,
            this.props.targetEntrySlot.end
          )
        : this.setInitialEntryDateTime(
            new Date(moment(new Date()).set("hour", 10)),
            new Date(
              moment(new Date())
                .set("hour", 10)
                .add(15, "minutes")
            )
          );
    // : this.setInitialEntryDateTime(
    //     new Date(),
    //     new Date(moment(new Date()).add(15, "minutes"))
    //   );

    this.setState({
      entryDate,
      entryTime
    });
  };

  setInitialEntryDateTime = (startVal, endVal) => {
    const start =
      typeof startVal === "string" ? new Date(moment(startVal)) : startVal;
    const end =
      typeof startVal === "string" ? new Date(moment(endVal)) : endVal;

    let startTime = `${String(moment(start).hours()).padStart(2, "0")}:${String(
      moment(start).minutes()
    ).padStart(2, "0")}`;
    let endTime;
    if (
      end &&
      end.getTime() > start.getTime() &&
      moment(end).isAfter(moment(start), "minutes") >= 15
    ) {
      endTime = `${String(moment(end).hours()).padStart(2, "0")}:${String(
        moment(end).minutes()
      ).padStart(2, "0")}`;
    } else {
      let end = moment(start).add(15, "minutes");
      endTime = `${String(moment(end).hours()).padStart(2, "0")}:${String(
        moment(end).minutes()
      ).padStart(2, "0")}`;
    }

    return {
      entryDate: start,
      entryTime: [startTime, endTime]
      // entryTime: ["00:00", "00:15"]
    };
  };

  handleDateTimePickerClose = () => {
    this.props.setDateTimePickerVisibility(false);
  };

  handleChangeDatePicker = date => {
    this.setState({
      entryDate: date
    });
  };

  handleChangeTimeRangePicker = ([startTime, endTime]) => {
    let start = this.timeStringToMilliSeconds(startTime);
    let end = this.timeStringToMilliSeconds(endTime);
    let prevStart = this.state.entryTime[0];
    // let prevEnd = this.state.entryTime[1];

    if (start >= end || end - start > 6 * 60 * 60 * 1000) {
      if (startTime === prevStart) {
        start = end - 15 * 60 * 1000;
      } else {
        end = start + 15 * 60 * 1000;
      }
    }
    let newStart = this.milliSecondstoTimeString(start);
    let newEnd = this.milliSecondstoTimeString(end);
    newEnd = newEnd === "24:00" ? "23:59" : newEnd;
    this.setState({
      entryTime: [newStart, newEnd]
    });
  };

  timeStringToMilliSeconds = timeString => {
    return (
      +timeString.split(":")[0] * 60 * 60 * 1000 +
      +timeString.split(":")[1] * 60 * 1000
    );
  };

  milliSecondstoTimeString = timeMS => {
    let totalM = Math.round(timeMS / (1000 * 60));
    let timeM = String(Math.floor(totalM % 60)).padStart(2, "0");
    let timeH = String(Math.floor(totalM / 60)).padStart(2, "0");
    return `${timeH}:${timeM}`;
  };

  onConfirmSlotSelection = () => {
    const { entryDate, entryTime } = this.state;
    let start = new Date(
      moment(entryDate).set({
        hour: entryTime[0].split(":")[0],
        minute: entryTime[0].split(":")[1]
      })
    );
    let end = new Date(
      moment(entryDate).set({
        hour: entryTime[1].split(":")[0],
        minute: entryTime[1].split(":")[1]
      })
    );
    const finalEntry = { start, end, mealSlot: "now" };
    console.log({ finalEntry, entryDate });
    this.props.requestAddEntryToTracker(finalEntry, entryDate);
  };

  render() {
    const { classes } = this.props;
    // console.log("this.state :", this.state);

    return (
      <Paper className={classes.dateTimePickerRoot}>
        <>
          <IconButton
            aria-label="close"
            className={classes.dateTimePickerCloseButton}
            onClick={this.handleDateTimePickerClose}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            Select time slot for the Entry
          </Typography>
          <div>
            <DatePicker
              onChange={this.handleChangeDatePicker}
              value={this.state.entryDate}
              maxDate={!this.props.isMealPlanner ? new Date() : null}
              minDate={this.props.isMealPlanner ? new Date() : null}
            />
            <TimeRangePicker
              onChange={this.handleChangeTimeRangePicker}
              value={this.state.entryTime}
            />
          </div>
          <Button
            className={classes.button}
            variant="text"
            color="default"
            onClick={this.onConfirmSlotSelection}
            fullWidth
          >
            Confirm new Slot
          </Button>
        </>
      </Paper>
    );
  }
}

export default withStyles(styles)(DateTimePicker);
