const _this = this;

exports.navigate = {
  PREVIOUS: "PREV",
  NEXT: "NEXT",
  TODAY: "TODAY",
  DATE: "DATE"
};

exports.views = {
  MONTH: "month",
  WEEK: "week",
  DAY: "day",
  AGENDA: "agenda"
};

exports.resourceIdAccessor = "resourceId";
exports.resourceTitleAccessor = "resourceTitle";

exports.resourceTypes = {
  mealPlan: "mealPlan",
  dietEntry: "dietEntry"
};

exports.resourceMap = [
  {
    [_this.resourceIdAccessor]: _this.resourceTypes.mealPlan,
    [_this.resourceTitleAccessor]: "Meal Plans"
  },
  {
    [_this.resourceIdAccessor]: _this.resourceTypes.dietEntry,
    [_this.resourceTitleAccessor]: "Diet Entries"
  }
];
