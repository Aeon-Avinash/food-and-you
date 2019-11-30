export let navigate = {
  PREVIOUS: "PREV",
  NEXT: "NEXT",
  TODAY: "TODAY",
  DATE: "DATE"
};

export let views = {
  MONTH: "month",
  WEEK: "week",
  DAY: "day",
  AGENDA: "agenda"
};

export let resourceIdAccessor = "resourceId";
export let resourceTitleAccessor = "resourceTitle";

export let resourceTypes = {
  mealPlan: "mealPlan",
  dietEntry: "dietEntry"
};

export let resourceMap = [
  {
    [resourceIdAccessor]: resourceTypes.mealPlan,
    [resourceTitleAccessor]: "Meal Plans"
  },
  {
    [resourceIdAccessor]: resourceTypes.dietEntry,
    [resourceTitleAccessor]: "Diet Entries"
  }
];
