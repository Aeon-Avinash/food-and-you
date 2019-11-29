const mongoose = require("mongoose");

const trackerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    userMetaInfo: {},
    entries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Entry"
      }
    ],
    preferences: {
      tracker_title: String,
      tracker_goal: String,
      tracked_meals: [{ type: String }], //? multi select with custom select
      trackedMealsOptions: {
        type: Array,
        default: [
          "all",
          "breakfast",
          "lunch",
          "evening snack",
          "dinner",
          "midnight snack"
        ].map(meal => ({
          value: meal,
          label: meal,
          name: "tracked_meals",
          key: meal
        }))
      },
      tracker_lengthValue: { type: Number, default: 30 }, //? single select
      tracker_lengthUnit: { type: String, default: "days" }, //? single select
      reminders: [
        {
          type: Date
        }
      ]
    },
    timelineSnippets: {
      ENTRIES: {
        type: Array,
        default: []
      },
      DAYS: {
        type: Array,
        default: []
      },
      WEEKS: {
        type: Array,
        default: []
      },
      MONTHS: {
        type: Array,
        default: []
      },
      QUATER: {
        type: Array,
        default: []
      },
      YEAR: {
        type: Array,
        default: []
      }
    },
    calculations: {
      today: {},
      lastOneDay: {},
      days: {
        type: Array,
        default: []
      },
      lastOneWeek: {},
      weeks: {
        type: Array,
        default: []
      },
      lastOneMonth: {},
      months: {
        type: Array,
        default: []
      }
    },
    insights: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

const Tracker = mongoose.model("tracker", trackerSchema);

module.exports = Tracker;
