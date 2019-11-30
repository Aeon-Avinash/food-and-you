import React, { PureComponent } from "react";
import { withSnackbar } from "notistack";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  trackerActions,
  uiStateActions,
  appStateActions,
  recipesActions
} from "../../../store/actions";
import { Calendar as BasicCalendar, momentLocalizer } from "react-big-calendar";
// import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import withDragAndDrop from "../../src_rbc_components/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import moment from "moment";
import * as dates from "date-arithmetic";
import Paper from "@material-ui/core/Paper";
import CustomToolbar from "../../timeline_components/CustomToolbar/CustomToolbar";
import DayView from "../../timeline_components/DayView/DayView";
import WeekView from "../../timeline_components/WeekView/WeekView";
import EntriesView from "../../timeline_components/EntriesView/EntriesView";
import {
  EntriesEvent,
  EntriesDate,
  EntriesTime
} from "../../timeline_components/EntriesComponents/EntriesComponents";
import {
  DateCellWrapper,
  MonthDateCellWrapper
} from "../../timeline_components/DateCellWrapper/DateCellWrapper";
import TimeSlotWrapper from "../../timeline_components/TimeSlotWrapper/TimeSlotWrapper";
import {
  TimeGutterHeader,
  CustomHeaderWeekDay,
  CustomHeaderMonth,
  DateHeaderMonth,
  CustomHeaderEntries
} from "../../timeline_components/CustomHeader/CustomHeader";
import {
  customDayPropGetter,
  customSlotPropGetter,
  eventPropGetterEntries,
  eventPropGetterWeek,
  eventPropGetterMonth
} from "../../timeline_components/customPropGetters/propGetters";
import {
  views,
  resourceIdAccessor,
  resourceTitleAccessor,
  resourceTypes,
  resourceMap
} from "../../../helperData/constants";
import AddDietEntryForm from "../AddDietEntryForm/AddDietEntryForm";
import AddMealPlanForm from "../AddMealPlanForm/AddMealPlanForm";
import EntrySummarySnippet from "../EntrySummarySnippet/EntrySummarySnippet";
import DaySummarySnippet from "../DaySummarySnippet/DaySummarySnippet";
import SelectionDetailSnippet from "../SelectionDetailSnippet/SelectionDetailSnippet";
import RecipeTimelineSnippet from "../RecipeTimelineSnippet/RecipeTimelineSnippet";
import "./Timeline.css";

const localizer = momentLocalizer(moment);
const Calendar = withDragAndDrop(BasicCalendar);

const styles = theme => ({
  root: {
    marginTop: 20
  }
});

class Timeline extends PureComponent {
  componentDidMount() {
    if (!this.props.trackerData || !this.props.trackerData._id) {
      this.props.history.push("/tracker/startSelectTracker");
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      !this.props.trackerData ||
      (!this.props.trackerData._id &&
        this.props.location.pathname === "/tracker/timeline")
    ) {
      this.props.history.push("/tracker/startSelectTracker");
    }
  };

  handleEventMove = ({ event, start, end, resourceId: targetResourceId }) => {
    console.log(event);
    event &&
      console.log({
        targetDate: moment(start).dayOfYear(),
        currentDate: moment(event.start).dayOfYear(),
        today: moment(new Date()).dayOfYear(),
        currentResourceId: event[resourceIdAccessor],
        targetResourceId,
        event
      });
    if (event[resourceIdAccessor] === resourceTypes.mealPlan) {
      if (targetResourceId && targetResourceId !== resourceTypes.mealPlan) {
        //? if targetResource is not mealPlan, restrict it to less than today

        if (moment(start).dayOfYear() > moment(new Date()).dayOfYear()) {
          this.props.enqueueSnackbar(
            `Meal Plan can be converted to Diet Entry only for today and past dates`,
            { variant: "warning" }
          );
          return;
        }
      } else if (
        !targetResourceId ||
        targetResourceId === resourceTypes.mealPlan
      ) {
        //? if targetResource is undefined (Month view), restrict it to gte today
        //? if targetResource is mealPlan, restrict it to gte today

        if (moment(start).dayOfYear() < moment(new Date()).dayOfYear()) {
          this.props.enqueueSnackbar(
            `Meal Plan cannot be moved to past dates`,
            {
              variant: "warning"
            }
          );
          return;
        }
      }
    } else {
      if (targetResourceId && targetResourceId !== resourceTypes.dietEntry) {
        //? if targetResource is not dietEntry, restrict it to today and last day

        if (
          !moment(start).dayOfYear() ===
            moment(new Date())
              .subtract(1, "day")
              .dayOfYear() ||
          !moment(start).dayOfYear() === moment(new Date()).dayOfYear()
        ) {
          this.props.enqueueSnackbar(
            `Diet Entry can be converted to Meal Plan only for today and yesterday`,
            { variant: "warning" }
          );
          return;
        }
      } else if (
        !targetResourceId ||
        targetResourceId === resourceTypes.mealPlan
      ) {
        //? if targetResource is undefined (Month view), restrict it to lte today
        //? if targetResource is dietEntry, restrict it to lte today

        if (moment(start).dayOfYear() > moment(new Date()).dayOfYear()) {
          this.props.enqueueSnackbar(
            `Diet Entry cannot be moved to future dates`,
            {
              variant: "warning"
            }
          );
          return;
        }
      }
    }

    let newSlotEvent = {
      ...event,
      resourceId: targetResourceId,
      className: targetResourceId || event[resourceIdAccessor]
    };
    const updatedEvent = {
      ...newSlotEvent,
      start,
      end,
      resourceId: targetResourceId || event[resourceIdAccessor]
    };
    // console.log({ updatedEvent });
    this.props.editTrackerEntry(updatedEvent);

    this.props.enqueueSnackbar(
      `Entry moved to ${moment(start).format("ddd, hh:mm A")}`,
      { variant: "success" }
    );
    //* alert with a snackbar message that an event was moved
  };

  handleEventResize = ({ event, start, end }) => {
    let prevStart = moment(event.start);

    if (
      moment(start).isBefore(end) ||
      moment(end).isAfter(moment(start).add(6, "hours"))
    ) {
      if (moment(start).isSame(prevStart)) {
        start = new Date(moment(end).subtract(15, "minutes"));
      } else {
        end = new Date(moment(start).add(15, "minutes"));
      }
    }

    const updatedEvent = { ...event, start, end };
    console.log({ start, end });

    this.props.editTrackerEntry(updatedEvent);

    this.props.enqueueSnackbar(
      `Entry resized to end at ${moment(end).format("ddd, hh:mm A")}`,
      { variant: "success" }
    );
    //* alert with a snackbar message that an event was resized
  };

  handleSlotSelect = props => {
    const view = this.props.currentTimelineView;
    const {
      start
      // end, slots, action
    } = props;
    const startDate =
      typeof start !== "object" ? new Date(moment(start)) : start;
    let newDate;
    if (view === views.DAY) {
      //* Type of new entry derived from which column the slot was selected
      if (props[resourceIdAccessor] === resourceTypes.mealPlan) {
        this.props.setEntryModalState(resourceTypes.mealPlan);
      } else {
        this.props.setEntryModalState(resourceTypes.dietEntry);
      }
      //* Show a new entry form in a popup/modal
      this.props.setEntryModalVisibility(true);
      this.props.setTargetNewEntrySlot(props);
      this.props.setSelectedSnippetType("NEW");

      // console.log(`Add new Entry Form ${view} view`);
    } else if (view === views.WEEK || view === views.MONTH) {
      newDate = new Date(moment(start));
      //* checks for today
      if (startDate.getDate() === new Date().getDate() && view === views.WEEK) {
        //* Type of new entry derived from which column the slot was selected
        if (props[resourceIdAccessor] === resourceTypes.mealPlan) {
          this.props.setEntryModalState(resourceTypes.mealPlan);
          this.props.setSelectedSnippetId(
            `${moment(newDate).format("Do MMM YYYY")}-${
              resourceTypes.mealPlan
            }-summary`
          );
        } else {
          this.props.setEntryModalState(resourceTypes.dietEntry);
          this.props.setSelectedSnippetId(
            `${moment(newDate).format("Do MMM YYYY")}-${
              resourceTypes.dietEntry
            }-summary`
          );
        }
      }
      //? `${moment(newDate).format("Do MMM YYYY")}-${resourceTypes.dietEntry}-summary`
      if (startDate.getTime() > dates.endOf(new Date(), "day")) {
        //* For future dates, Opens a meal planner and diet logger for the past dates
        this.props.setEntryModalState(resourceTypes.mealPlan);
        this.props.setSelectedSnippetId(
          `${moment(newDate).format("Do MMM YYYY")}-${
            resourceTypes.mealPlan
          }-summary`
        );
      } else {
        this.props.setEntryModalState(resourceTypes.dietEntry);
        this.props.setSelectedSnippetId(
          `${moment(newDate).format("Do MMM YYYY")}-${
            resourceTypes.dietEntry
          }-summary`
        );
      }
      //* Show Modal for the Day's Summary with Links to Day View and New Entry Form
      this.props.setEntryModalVisibility(true);
      this.props.setTargetNewEntrySlot(props);
      this.props.setTargetTimelineDate(newDate);
      this.props.setSelectedSnippetType("DAYS");
    }
  };

  handleEventSelect = (event, ...others) => {
    const startDate =
      typeof event.start !== "object"
        ? new Date(moment(event.start))
        : event.start;
    if (startDate.getTime() > dates.endOf(new Date(), "day")) {
      //* For future dates, Opens a meal planner Dialog Modal
      this.props.setEntryModalState(resourceTypes.mealPlan);
    } else {
      this.props.setEntryModalState(resourceTypes.dietEntry);
    }
    //* Show Modal for the Day's Summary with Links to Day View and Detail Entry Views
    this.props.setEntryModalVisibility(true);
    this.props.setSelectedSnippetId(event._id);
    this.props.setSelectedSnippetType("ENTRIES");
  };

  showEntryModal = () => {
    this.props.setEntryModalVisibility(true);
  };

  hideEntryModal = () => {
    if (!this.props.openDetailsModal && !this.props.openRecipeModal) {
      this.props.setEntryModalVisibility(false);

      this.props.setSelectedSnippetId(undefined);
      this.props.setSelectedSnippetType(undefined);
      this.props.setSelectedSnippetData(undefined);
      this.props.setTargetTimelineDate(undefined);
      this.props.setTargetNewEntrySlot(undefined);
      this.props.setConfirmTimeSlotSelection(undefined);

      // this.props.setDateTimePickerState();
      this.props.clearSyncTrackerAppState();
      this.props.clearAllAppState();
    } else {
      this.props.setEntryModalVisibility(false);
    }
  };

  //* Three separate modal actions: EntryModal & DetailsModal & RecipeModal
  //* (setEntryModalState & setDetailsModalState & setRecipeModalState)

  showDetailsModal = () => {
    this.props.setDetailsModalVisibility(true);
  };

  hideDetailsModal = () => {
    this.props.setDetailsModalVisibility(false);
  };

  showRecipeModal = () => {
    this.props.setRecipeModalVisibility(true);
  };

  hideRecipeModal = () => {
    this.props.setRecipeModalVisibility(false);
  };

  //* Opening the new Entry Modal when triggered from the timeline toolbar

  addDietEntryFromToolbar = () => {
    this.props.setTargetNewEntrySlot({
      action: "toolbar",
      start: new Date(moment(this.props.currentTimelineDate)),
      end: new Date(moment(this.props.currentTimelineDate).add(15, "minutes"))
    });
    this.props.setEntryModalState(resourceTypes.dietEntry);
    console.log("Should fire NEW!");
    this.props.setSelectedSnippetType("NEW");
    this.props.setEntryModalVisibility(true);
  };

  addMealPlanFromToolbar = () => {
    this.props.setTargetNewEntrySlot({
      action: "toolbar",
      start: new Date(moment(this.props.currentTimelineDate)),
      end: new Date(moment(this.props.currentTimelineDate).add(15, "minutes"))
    });
    this.props.setEntryModalState(resourceTypes.mealPlan);
    this.props.setSelectedSnippetType("NEW");
    this.props.setEntryModalVisibility(true);
  };

  //* Opening the new Entry Modal with the preSelected target slots

  switchAddEntryForm = (targetSlots, resourceType) => {
    console.log("Timeout for switch to the other resource type");
    setTimeout(() => {
      console.log("Now switching over to the other resource type");
      this.props.setTargetNewEntrySlot(targetSlots);
      this.props.setEntryModalState(resourceType);
      this.props.setSelectedSnippetType("NEW");
      this.props.setEntryModalVisibility(true);
    }, 500);
  };

  addEntryToTargetSlot = targetSlots => {
    this.props.setTargetNewEntrySlot(targetSlots);
    this.props.setSelectedSnippetId(undefined);
    this.props.setSelectedSnippetType("NEW");
    this.props.setEntryModalVisibility(true);
  };

  componentWillUnmount() {
    this.props.setSelectedSnippetId(undefined);
    this.props.setSelectedSnippetType(undefined);
    this.props.setSelectedSnippetData(undefined);
    this.props.setTargetTimelineDate(undefined);
    this.props.setTargetNewEntrySlot(undefined);
    this.props.setConfirmTimeSlotSelection(undefined);

    this.props.setEntryModalVisibility(false);
    this.props.setDetailsModalVisibility(false);
    this.props.setRecipeModalVisibility(false);

    this.props.setEntryModalState();
    this.props.setDetailsModalState();
    this.props.setRecipeModalState();
    this.props.setMouseMoveDateCellState();
    // this.props.setDateTimePickerState();

    this.props.setCurrentTimelineRecipeDetail(undefined);
    this.props.clearCurrentRecipesData();
    this.props.clearSyncTrackerAppState();
    this.props.clearAllAppState();
  }

  render() {
    const { classes } = this.props;

    // console.log({  });

    const entries =
      this.props.trackerData &&
      this.props.trackerData.timelineSnippets &&
      this.props.trackerData.timelineSnippets.ENTRIES &&
      this.props.trackerData.timelineSnippets.ENTRIES.length > 0
        ? this.props.currentTimelineView !== views.MONTH
          ? this.props.trackerData.timelineSnippets.ENTRIES
          : this.props.trackerData.timelineSnippets.ENTRIES.filter(
              entry =>
                !(
                  entry.resourceId === resourceTypes.mealPlan &&
                  moment(entry.start).dayOfYear() <
                    moment(new Date())
                      .subtract(1, "day")
                      .dayOfYear()
                )
            )
        : [];

    return (
      <Paper className={classes.root}>
        <Calendar
          selectable
          popup
          onSelectEvent={this.handleEventSelect}
          onDoubleClickEvent={this.handleEventSelect}
          onSelectSlot={this.handleSlotSelect}
          onEventDrop={this.handleEventMove}
          onEventResize={this.handleEventResize}
          onDragStart={console.log}
          onDragOver={console.log}
          resizable
          onSelecting={console.log}
          longPressThreshold={500}
          drilldownView={"day"}
          //? Event filtering to avoid cluttering past month's date cells with mealPlans
          events={entries}
          step={15}
          timeslots={16}
          min={moment("5:00am", "h:mma").toDate()}
          max={moment("11:59pm", "h:mma").toDate()}
          localizer={localizer}
          date={new Date(moment(this.props.currentTimelineDate))}
          onNavigate={this.props.setCurrentTimelineDate}
          view={this.props.currentTimelineView}
          onView={this.props.setCurrentTimelineView}
          defaultDate={new Date()}
          defaultView={views.WEEK}
          resources={resourceMap}
          resourceAccessor={entry => entry[resourceIdAccessor]}
          resourceIdAccessor={resourceIdAccessor}
          resourceTitleAccessor={resourceTitleAccessor}
          formats={{
            eventTimeRangeFormat: props => moment(props.start).format("hh:mma")
          }}
          eventPropGetter={
            this.props.currentTimelineView !== views.AGENDA
              ? this.props.currentTimelineView === views.MONTH
                ? eventPropGetterMonth
                : eventPropGetterWeek
              : eventPropGetterEntries
          }
          dayPropGetter={customDayPropGetter}
          slotPropGetter={customSlotPropGetter}
          views={{
            agenda: EntriesView,
            day: DayView,
            // day: true,
            week: WeekView,
            // week: true,
            // month: MonthView,
            month: true
          }}
          components={{
            agenda: {
              event: props => (
                <EntriesEvent
                  {...props}
                  // entries={entries}
                  openDetailsModal={this.props.openDetailsModal}
                  showDetailsModal={this.showDetailsModal}
                  hideDetailsModal={this.hideDetailsModal}
                  selectedSnippetId={this.props.selectedSnippetId}
                  setSnippetId={this.props.setSelectedSnippetId}
                  setSnippetType={this.props.setSelectedSnippetType}
                  setSnippetData={this.props.setSelectedSnippetData}
                  showRecipeModal={this.showRecipeModal}
                  setCurrentTimelineRecipeDetail={
                    this.props.setCurrentTimelineRecipeDetail
                  }
                  editTrackerEntry={this.props.editTrackerEntry}
                  removeTrackerEntry={this.props.removeTrackerEntry}
                  successDataTrackerSync={this.props.successDataTrackerSync}
                  errorMessageTrackerSync={this.props.errorMessageTrackerSync}
                />
              ),

              date: props => <EntriesDate {...props} />,
              time: props => <EntriesTime {...props} />,
              header: props => <CustomHeaderEntries {...props} />
            },
            day: {
              header: props => (
                <CustomHeaderWeekDay {...props} events={entries} />
              )
            },
            week: {
              header: props => (
                <CustomHeaderWeekDay {...props} events={entries} />
              )
            },
            month: {
              header: props => <CustomHeaderMonth {...props} />,
              dateHeader: props => (
                <DateHeaderMonth {...props} events={entries} />
              ),
              dateCellWrapper: props => (
                <MonthDateCellWrapper {...props} events={entries} />
              )
              // eventWrapper: props => <EventWrapperMonth {...props} />
            },
            toolbar: props => (
              <CustomToolbar
                view={this.props.currentTimelineView}
                date={this.props.currentTimelineDate}
                updateCalendarView={this.props.setCurrentTimelineView}
                updateCalendarDate={this.props.setCurrentTimelineDate}
                showAddDietEntryForm={this.addDietEntryFromToolbar}
                showAddMealPlanForm={this.addMealPlanFromToolbar}
                //? Important: pass toolbar props at the end,
                //? so as to ensure that new view & date values are passed
                {...props}
              />
            ),
            timeGutterHeader: props => <TimeGutterHeader {...props} />,
            timeSlotWrapper: props => <TimeSlotWrapper {...props} />,
            eventContainerWrapper: props => (
              <div style={{ backgroundColor: "salmon" }}>{props.children}</div>
            ),
            dateCellWrapper: props => <DateCellWrapper {...props} />
          }}
          style={{ height: "100vh" }}
        />
        {this.props.openEntryModal &&
        !this.props.targetEntrySlot &&
        this.props.selectedSnippetId &&
        this.props.selectedSnippetType === "ENTRIES" ? (
          <EntrySummarySnippet
            openEntryModal={this.props.openEntryModal}
            entryModalState={this.props.entryModalState}
            //* filter and pass the entry summary from the trackerData
            entry={entries.find(
              entry => entry._id === this.props.selectedSnippetId
            )}
            showEntryModal={this.showEntryModal}
            hideEntryModal={this.hideEntryModal}
            showDetailsModal={this.showDetailsModal}
            setSelectedSnippetData={this.props.setSelectedSnippetData}
            setCurrentTimelineRecipeDetail={
              this.props.setCurrentTimelineRecipeDetail
            }
            showRecipeModal={this.showRecipeModal}
            currentTimelineDate={this.props.currentTimelineDate}
            setCurrentTimelineDate={this.props.setCurrentTimelineDate}
            removeTrackerEntry={this.props.removeTrackerEntry}
            editTrackerEntry={this.props.editTrackerEntry}
            confirmTimeSlotSelection={this.props.confirmTimeSlotSelection}
            setConfirmTimeSlotSelection={this.props.setConfirmTimeSlotSelection}
            dateTimePickerVisibility={this.props.dateTimePickerVisibility}
            setDateTimePickerVisibility={this.props.setDateTimePickerVisibility}
            successDataTrackerSync={this.props.successDataTrackerSync}
            errorMessageTrackerSync={this.props.errorMessageTrackerSync}
          />
        ) : null}
        {this.props.openEntryModal &&
        this.props.targetEntrySlot &&
        this.props.selectedSnippetType === "NEW" ? (
          this.props.entryModalState === resourceTypes.dietEntry ? (
            <AddDietEntryForm
              openEntryModal={this.props.openEntryModal}
              entryModalState={this.props.entryModalState}
              targetEntrySlot={this.props.targetEntrySlot}
              showEntryModal={this.showEntryModal}
              hideEntryModal={this.hideEntryModal}
              switchAddEntryForm={this.switchAddEntryForm}
              setEntryModalState={this.props.setEntryModalState}
            />
          ) : (
            <AddMealPlanForm
              openEntryModal={this.props.openEntryModal}
              entryModalState={this.props.entryModalState}
              targetEntrySlot={this.props.targetEntrySlot}
              showEntryModal={this.showEntryModal}
              hideEntryModal={this.hideEntryModal}
              switchAddEntryForm={this.switchAddEntryForm}
              setEntryModalState={this.props.setEntryModalState}
            />
          )
        ) : null}
        {this.props.openEntryModal &&
        this.props.targetEntrySlot &&
        this.props.targetTimelineDate &&
        this.props.selectedSnippetId &&
        this.props.selectedSnippetType === "DAYS" ? (
          <DaySummarySnippet
            openEntryModal={this.props.openEntryModal}
            targetDate={this.props.targetTimelineDate}
            entryModalState={this.props.entryModalState}
            targetSlots={this.props.targetEntrySlot}
            //* filter and pass the day summary from the trackerData
            selectionData={
              this.props.selectedSnippetType &&
              this.props.selectedSnippetId &&
              this.props.trackerData.timelineSnippets[
                this.props.selectedSnippetType
              ].find(summary => {
                return (
                  summary.resourceId === this.props.entryModalState &&
                  (summary._id === this.props.selectedSnippetId ||
                    summary.id === this.props.selectedSnippetId)
                );
              })
            }
            setCurrentTimelineView={this.props.setCurrentTimelineView}
            setCurrentTimelineDate={this.props.setCurrentTimelineDate}
            addEntryToTargetSlot={this.addEntryToTargetSlot}
            showEntryModal={this.showEntryModal}
            hideEntryModal={this.hideEntryModal}
            showDetailsModal={this.showDetailsModal}
            setSelectedSnippetData={this.props.setSelectedSnippetData}
          />
        ) : null}

        {this.props.openDetailsModal && this.props.selectedSnippetData ? (
          <SelectionDetailSnippet
            openDetailsModal={this.props.openDetailsModal}
            showDetailsModal={this.showDetailsModal}
            hideDetailsModal={this.hideDetailsModal}
            selectedSnippetType={this.props.selectedSnippetType}
            //* Add a function that filters the selectionSnippetId from viewKey & targetSlot
            selectionData={this.props.selectedSnippetData}
          />
        ) : null}

        {this.props.openRecipeModal &&
        this.props.currentTimelineRecipeDetail ? (
          <RecipeTimelineSnippet
            openRecipeModal={this.props.openRecipeModal}
            entryModalState={this.props.entryModalState}
            showRecipeModal={this.showRecipeModal}
            hideRecipeModal={this.hideRecipeModal}
            currentTimelineRecipeDetail={this.props.currentTimelineRecipeDetail}
            showDetailsModal={this.showDetailsModal}
            setSelectedSnippetData={this.props.setSelectedSnippetData}
          />
        ) : null}
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.appData.auth.token,
  successDataTrackerSync: state.appState.trackerSync.successData,
  errorMessageTrackerSync: state.appState.trackerSync.errorMessage,

  trackerData: state.appData.tracker.selectedTracker,
  currentTimelineView: state.appData.tracker.currentTimeline.viewKey,
  currentTimelineDate: state.appData.tracker.currentTimeline.displayDate,
  targetTimelineDate: state.appData.tracker.targetTimeline.targetDate,
  selectedSnippetId: state.appData.tracker.targetTimeline.selectedSnippetId,
  selectedSnippetType: state.appData.tracker.targetTimeline.selectedSnippetType,
  selectedSnippetData: state.appData.tracker.targetTimeline.selectedSnippetData,
  targetEntrySlot: state.appData.tracker.targetTimeline.targetEntrySlot,
  confirmTimeSlotSelection:
    state.appData.tracker.targetTimeline.confirmTimeSlotSelectionTimelineEntry,

  currentTimelineRecipeDetail:
    state.appData.userData.recipes.current.timelineDetail,

  entryModalState: state.uiState.uiModalOneHelper.uiState,
  openEntryModal: state.uiState.uiModalOneHelper.isVisible,
  detailsModalState: state.uiState.uiModalTwoHelper.uiState,
  openDetailsModal: state.uiState.uiModalTwoHelper.isVisible,
  recipeModalState: state.uiState.uiModalThreeHelper.uiState,
  openRecipeModal: state.uiState.uiModalThreeHelper.isVisible,
  dateTimePickerVisibility: state.uiState.uiStateHelperTwo.isVisible
});

const enhance = compose(
  withStyles(styles),
  withSnackbar,
  connect(mapStateToProps, {
    setCurrentTimelineView: trackerActions.setCurrentTimelineView,
    setCurrentTimelineDate: trackerActions.setCurrentTimelineDate,
    setTargetTimelineDate: trackerActions.setTargetTimelineDate,
    setSelectedSnippetId: trackerActions.setSelectedSnippetId,
    setSelectedSnippetType: trackerActions.setSelectedSnippetType,
    setSelectedSnippetData: trackerActions.setSelectedSnippetData,
    setTargetNewEntrySlot: trackerActions.setTargetNewEntrySlot,
    setConfirmTimeSlotSelection:
      trackerActions.setConfirmTimeSlotSelectionTimelineEntry,
    editTrackerEntry: trackerActions.editTrackerEntry,
    removeTrackerEntry: trackerActions.removeTrackerEntry,

    setEntryModalVisibility: uiStateActions.setModalOneVisibility,
    setEntryModalState: uiStateActions.setModalOneState,
    setDetailsModalVisibility: uiStateActions.setModalTwoVisibility,
    setDetailsModalState: uiStateActions.setModalTwoState,
    setRecipeModalVisibility: uiStateActions.setModalThreeVisibility,
    setRecipeModalState: uiStateActions.setModalThreeState,
    setMouseMoveDateCellState: uiStateActions.setUIStateHelperOne,
    setDateTimePickerState: uiStateActions.setUIStateHelperTwo,
    setDateTimePickerVisibility: uiStateActions.setHelperTwoVisibility,
    setCurrentTimelineRecipeDetail:
      recipesActions.setCurrentTimelineRecipeDetail,

    clearCurrentRecipesData: recipesActions.clearCurrentRecipesData,
    clearSyncTrackerAppState: appStateActions.clearSyncTrackerAppState,
    clearAllAppState: appStateActions.clearAllAppState
  })
);

export default enhance(Timeline);
