const Tracker = require("../models/tracker");
const Entry = require("../models/entry");
const {
  updateObjProp,
  updateObjAddToArr,
  updateArrInObjAddOrReplaceByAccessor,
  updateObjRemoveFromArrByAccessor
} = require("../utils/updateObjHelpers");
const {
  checkUserCalendarEvents,
  getUserCalendarEvents,
  addCalendarEvents,
  editCalendarEvents,
  deleteCalendarEvents
} = require("../utils/utils_googleOauth/googleServices_utils");

const { createDaySummary } = require("../utils/calc_tracker");

exports.getAllTrackers = async (req, res, next) => {
  try {
    const trackers = await Tracker.find({ user: req.user._id });

    console.log(trackers);

    res.status(200).json({
      message: "User Trackers",
      trackers: trackers,
      allTrackersById: trackers.map(tracker => ({
        _id: tracker._id,
        title: tracker.preferences.tracker_title
      })),
      lastUsedDefaultTracker: req.user.lastUsedDefaultTracker
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};

exports.getTracker = async (req, res, next) => {
  try {
    const { trackerId } = req.params;
    const tracker = await Tracker.findOne().and([
      { user: req.user._id },
      { _id: trackerId }
    ]);

    res.status(200).json({
      message: "Current Tracker",
      tracker: tracker
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};

exports.createTracker = async (req, res, next) => {
  try {
    const { trackerPreferences } = req.body;
    const tracker = new Tracker({
      user: req.user._id,
      preferences: trackerPreferences
    });
    await tracker.save();

    req.user.trackers.push(tracker._id);
    await req.user.save();

    console.log(tracker);

    const trackers = await Tracker.find({ user: req.user._id });
    //? also sending back list of all trackers of the user
    res.status(200).json({
      message: "New Tracker",
      tracker: tracker,
      allTrackersById: trackers.map(tracker => ({
        _id: tracker._id,
        title: tracker.preferences.tracker_title
      }))
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};

exports.updateTrackerPreferences = async (req, res, next) => {
  //? add new entry into the tracker
  try {
    const { trackerId } = req.params;
    let tracker = await Tracker.findOne().and([
      { user: req.user._id },
      { _id: trackerId }
    ]);

    const { preferences } = req.body;
    // const { preferences, userMetaInfo, calculations, insights } = req.body;

    tracker.preferences = preferences;

    await tracker.save();

    console.log(tracker);

    res.status(200).json({
      message: "Updated Tracker",
      tracker: tracker
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};

exports.deleteTracker = async (req, res, next) => {
  try {
    const { trackerId } = req.params;
    await Tracker.findOneAndRemove().and([
      { user: req.user._id },
      { _id: trackerId }
    ]);

    res.status(200).json({
      message: "Deleted Tracker"
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};

exports.addTrackerEntry = async (req, res, next) => {
  //? add new entry into the tracker
  try {
    const { trackerId } = req.params;
    let tracker = await Tracker.findOne().and([
      { user: req.user._id },
      { _id: trackerId }
    ]);

    const { token, user, gDrive, gCalendar } = req;

    const { entry } = req.body;

    const newEntry = new Entry({
      ...entry
    });

    await newEntry.save();

    console.log("ENTRIES.length", tracker.timelineSnippets.ENTRIES.length);

    tracker.timelineSnippets = updateObjAddToArr(
      tracker.timelineSnippets,
      newEntry,
      "ENTRIES"
    );

    await tracker.save();

    const [
      selectedResourceDaySummary,
      otherResourceDaySummary
    ] = createDaySummary(null, entry, tracker.timelineSnippets.ENTRIES);

    tracker.timelineSnippets = updateArrInObjAddOrReplaceByAccessor(
      tracker.timelineSnippets,
      selectedResourceDaySummary,
      "id",
      "DAYS"
    );
    await tracker.save();

    tracker.timelineSnippets = updateArrInObjAddOrReplaceByAccessor(
      tracker.timelineSnippets,
      otherResourceDaySummary,
      "id",
      "DAYS"
    );

    await tracker.save();

    console.log("ENTRIES.length", tracker.timelineSnippets.ENTRIES.length);
    console.log("DAYS.length", tracker.timelineSnippets.DAYS.length);

    //* adding entry to the gCalendar
    await addCalendarEvents({
      gCalendar,
      user,
      token,
      event: { ...entry.googleCalendarEntry, id: newEntry._id }
    });

    res.status(200).json({
      message: "Added Tracker Entry",
      tracker: tracker,
      entry: newEntry,
      daySummary: [selectedResourceDaySummary, otherResourceDaySummary]
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};

exports.editTrackerEntry = async (req, res, next) => {
  //? edit specific entry of the tracker
  try {
    const { trackerId } = req.params;
    let tracker = await Tracker.findOne().and([
      { user: req.user._id },
      { _id: trackerId }
    ]);

    const { token, user, gDrive, gCalendar } = req;

    const { entry } = req.body;
    console.log(entry._id);
    let prevEntry = await Entry.findOne({ _id: entry._id });
    let updateEntry = await Entry.findOne({ _id: entry._id });

    updateEntry.start = entry.start;
    updateEntry.end = entry.end;
    updateEntry.mealSlot = entry.mealSlot;
    updateEntry.className = entry.className;
    updateEntry.resourceId = entry.resourceId;
    // updateEntry.servings = entry.servings;

    await updateEntry.save();

    console.log("ENTRIES.length", tracker.timelineSnippets.ENTRIES.length);

    tracker.timelineSnippets = updateArrInObjAddOrReplaceByAccessor(
      tracker.timelineSnippets,
      updateEntry,
      "_id",
      "ENTRIES"
    );

    await tracker.save();

    console.log("ENTRIES.length", tracker.timelineSnippets.ENTRIES.length);

    const [
      selectedResourceDaySummary,
      otherResourceDaySummary
    ] = createDaySummary(
      prevEntry,
      updateEntry,
      tracker.timelineSnippets.ENTRIES
    );

    // console.log({ selectedResourceDaySummary, otherResourceDaySummary });

    tracker.timelineSnippets = updateArrInObjAddOrReplaceByAccessor(
      tracker.timelineSnippets,
      selectedResourceDaySummary,
      "id",
      "DAYS"
    );
    // console.log(tracker.timelineSnippets);

    await tracker.save();

    tracker.timelineSnippets = updateArrInObjAddOrReplaceByAccessor(
      tracker.timelineSnippets,
      otherResourceDaySummary,
      "id",
      "DAYS"
    );
    await tracker.save();

    console.log("ENTRIES.length", tracker.timelineSnippets.ENTRIES.length);
    console.log("DAYS.length", tracker.timelineSnippets.DAYS.length);

    console.log(entry.googleCalendarEntry);
    //* updating entry to the gCalendar
    await editCalendarEvents({
      gCalendar,
      user,
      token,
      eventId: entry._id,
      event: entry.googleCalendarEntry
    });

    res.status(200).json({
      message: "Edited Tracker Entry",
      tracker: tracker,
      entry: updateEntry,
      daySummary: [selectedResourceDaySummary, otherResourceDaySummary]
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};

exports.deleteTrackerEntry = async (req, res, next) => {
  //? delete entry from the tracker
  try {
    const { trackerId } = req.params;
    let tracker = await Tracker.findOne().and([
      { user: req.user._id },
      { _id: trackerId }
    ]);

    const { token, user, gDrive, gCalendar } = req;

    const { entryId } = req.params;
    console.log({ entryId });

    const entry = await Entry.findOne({ _id: entryId });

    await Entry.findOneAndRemove().and([
      { user: req.user._id },
      { _id: entryId }
    ]);

    console.log("ENTRIES.length", tracker.timelineSnippets.ENTRIES.length);

    tracker.timelineSnippets = updateObjRemoveFromArrByAccessor(
      tracker.timelineSnippets,
      entry,
      "_id",
      "ENTRIES"
    );

    await tracker.save();

    const [
      selectedResourceDaySummary,
      otherResourceDaySummary
    ] = createDaySummary(entry, null, tracker.timelineSnippets.ENTRIES);

    tracker.timelineSnippets = updateArrInObjAddOrReplaceByAccessor(
      tracker.timelineSnippets,
      selectedResourceDaySummary,
      "id",
      "DAYS"
    );
    await tracker.save();

    tracker.timelineSnippets = updateArrInObjAddOrReplaceByAccessor(
      tracker.timelineSnippets,
      otherResourceDaySummary,
      "id",
      "DAYS"
    );

    await tracker.save();

    console.log("ENTRIES.length", tracker.timelineSnippets.ENTRIES.length);
    console.log("DAYS.length", tracker.timelineSnippets.DAYS.length);

    //* deleting entry from the gCalendar
    await deleteCalendarEvents({
      gCalendar,
      user,
      token,
      eventId: entryId
    });

    res.status(200).json({
      message: "Deleted Tracker Entry",
      tracker: tracker,
      daySummary: [selectedResourceDaySummary, otherResourceDaySummary]
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.statusCode = err.statusCode || 500;
    next(error);
  }
};
