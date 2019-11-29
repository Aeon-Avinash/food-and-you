const moment = require("moment");
const {
  resourceIdAccessor,
  resourceTitleAccessor,
  resourceMap,
  resourceTypes
} = require("./constants");

const _this = this;

exports.getDietEntrySummary = resData => {
  const entrySummary = {
    ENERC_KCAL: 0,
    percentProtein: 0,
    percentFat: 0,
    percentCarbs: 0,
    completeNutrition: {},
    weightPerServing: [],
    metaInfo: {},
    rawNutritionData: {}
  };

  resData.forEach(item => {
    if (item.nutrition) {
      let ENERC_KCAL = item.nutrition.nutrients.find(
        nutrient => nutrient.title === "Calories"
      ).amount;
      if (ENERC_KCAL) {
        if (item.nutrition.caloricBreakdown) {
          Object.keys(entrySummary).forEach(percentKey => {
            if (
              percentKey === "percentProtein" ||
              percentKey === "percentFat" ||
              percentKey === "percentCarbs"
            ) {
              entrySummary[percentKey] = (
                (((entrySummary[percentKey] / 100) * entrySummary.ENERC_KCAL +
                  (item.nutrition.caloricBreakdown[percentKey] / 100) *
                    ENERC_KCAL) /
                  (entrySummary.ENERC_KCAL + ENERC_KCAL)) *
                100
              ).toFixed(2);
            }
          });
        }
        entrySummary.ENERC_KCAL = entrySummary.ENERC_KCAL + ENERC_KCAL;

        if (item.nutrition.nutrients) {
          item.nutrition.nutrients.forEach(nutrient => {
            if (!entrySummary.completeNutrition[nutrient]) {
              entrySummary.completeNutrition[nutrient.title] = {};
            }
            if (entrySummary.completeNutrition[nutrient.title].amount) {
              entrySummary.completeNutrition[nutrient.title].amount =
                entrySummary.completeNutrition[nutrient].amount +
                nutrient.amount;
            } else {
              entrySummary.completeNutrition[nutrient.title].amount =
                nutrient.amount;
              entrySummary.completeNutrition[nutrient.title].unit =
                nutrient.unit;
            }
            if (
              entrySummary.completeNutrition[nutrient.title].percentOfDailyNeeds
            ) {
              entrySummary.completeNutrition[
                nutrient.title
              ].percentOfDailyNeeds =
                entrySummary.completeNutrition[nutrient.title]
                  .percentOfDailyNeeds + nutrient.percentOfDailyNeeds;
            } else {
              entrySummary.completeNutrition[
                nutrient.title
              ].percentOfDailyNeeds = nutrient.percentOfDailyNeeds;
            }
          });
        }
      }

      entrySummary.weightPerServing.push({
        ...item.nutrition.weightPerServing,
        ingredientName: item.name || item.originalName
      });
    }

    let newItemKeyName = item.name || item.originalName;

    Object.keys(item).forEach(itemKey => {
      if (itemKey !== "nutrition") {
        if (!entrySummary.metaInfo[newItemKeyName]) {
          entrySummary.metaInfo[newItemKeyName] = {};
        }
        entrySummary.metaInfo[newItemKeyName][itemKey] = item[itemKey];
      } else {
        entrySummary.rawNutritionData[newItemKeyName] = item[itemKey];
      }
    });
  });

  return entrySummary;
};

exports.getMealPlanSummary = recipeData => {
  const entrySummary = {
    ENERC_KCAL: 0,
    percentProtein: 0,
    percentFat: 0,
    percentCarbs: 0,
    recipeTags: [],
    weightPerServing: {},
    completeNutrition: {},
    metaInfo: {},
    rawNutritionData: {}
  };

  let ENERC_KCAL;

  if (recipeData.nutrition) {
    ENERC_KCAL = recipeData.nutrition.nutrients.find(
      nutrient => nutrient.title === "Calories"
    ).amount;
    if (ENERC_KCAL) {
      entrySummary.ENERC_KCAL = ENERC_KCAL;
      if (recipeData.nutrition.caloricBreakdown) {
        entrySummary.percentProtein =
          recipeData.nutrition.caloricBreakdown.percentProtein;
        entrySummary.percentCarbs =
          recipeData.nutrition.caloricBreakdown.percentCarbs;
        entrySummary.percentFat =
          recipeData.nutrition.caloricBreakdown.percentFat;
      }

      if (recipeData.nutrition.nutrients) {
        recipeData.nutrition.nutrients.forEach(nutrient => {
          if (!entrySummary.completeNutrition[nutrient]) {
            entrySummary.completeNutrition[nutrient.title] = {};
          }
          if (entrySummary.completeNutrition[nutrient.title].amount) {
            entrySummary.completeNutrition[nutrient.title].amount =
              entrySummary.completeNutrition[nutrient].amount + nutrient.amount;
          } else {
            entrySummary.completeNutrition[nutrient.title].amount =
              nutrient.amount;
            entrySummary.completeNutrition[nutrient.title].unit = nutrient.unit;
          }
          if (
            entrySummary.completeNutrition[nutrient.title].percentOfDailyNeeds
          ) {
            entrySummary.completeNutrition[nutrient.title].percentOfDailyNeeds =
              entrySummary.completeNutrition[nutrient.title]
                .percentOfDailyNeeds + nutrient.percentOfDailyNeeds;
          } else {
            entrySummary.completeNutrition[nutrient.title].percentOfDailyNeeds =
              nutrient.percentOfDailyNeeds;
          }
        });
      }
    }

    entrySummary.weightPerServing = recipeData.nutrition.weightPerServing;
  }

  entrySummary.recipeTags = Object.keys(recipeData).filter(
    recipeDataKey => String(recipeData[recipeDataKey]) === "true"
  );

  Object.keys(recipeData).forEach(itemKey => {
    entrySummary[itemKey] = recipeData[itemKey];
  });

  return entrySummary;
};

exports.getDaySummary = dayEntrySummaries => {
  const daySummary = {
    numEntries: 0,
    ENERC_KCAL: 0,
    percentProtein: 0,
    percentFat: 0,
    percentCarbs: 0,
    completeNutrition: {}
  };
  if (dayEntrySummaries.length === 0) {
    return daySummary;
  }

  daySummary.numEntries = dayEntrySummaries.length;
  dayEntrySummaries.forEach(entrySummary => {
    daySummary["percentCarbs"] = +(
      (((daySummary["percentCarbs"] / 100) * daySummary.ENERC_KCAL +
        (entrySummary["percentCarbs"] / 100) * entrySummary.ENERC_KCAL) /
        (daySummary.ENERC_KCAL + entrySummary.ENERC_KCAL)) *
      100
    ).toFixed(2);
    daySummary["percentProtein"] = +(
      (((daySummary["percentProtein"] / 100) * daySummary.ENERC_KCAL +
        (entrySummary["percentProtein"] / 100) * entrySummary.ENERC_KCAL) /
        (daySummary.ENERC_KCAL + entrySummary.ENERC_KCAL)) *
      100
    ).toFixed(2);
    daySummary["percentFat"] = +(
      (((daySummary["percentFat"] / 100) * daySummary.ENERC_KCAL +
        (entrySummary["percentFat"] / 100) * entrySummary.ENERC_KCAL) /
        (daySummary.ENERC_KCAL + entrySummary.ENERC_KCAL)) *
      100
    ).toFixed(2);
    daySummary.ENERC_KCAL += entrySummary.ENERC_KCAL;
  });

  dayEntrySummaries.forEach(entrySummary => {
    if (entrySummary.completeNutrition) {
      Object.keys(entrySummary.completeNutrition).forEach(nutrient => {
        if (
          !entrySummary.completeNutrition.hasOwnProperty(nutrient) ||
          nutrient === "$init"
        ) {
          return;
        }
        if (!daySummary.completeNutrition[nutrient]) {
          daySummary.completeNutrition[nutrient] = {};
        }
        if (daySummary.completeNutrition[nutrient].amount) {
          daySummary.completeNutrition[nutrient].amount = (
            Math.round(+daySummary.completeNutrition[nutrient].amount * 100) /
              100 +
            Math.round(+entrySummary.completeNutrition[nutrient].amount * 100) /
              100
          ).toFixed(2);
        } else {
          daySummary.completeNutrition[nutrient].amount = (
            Math.round(+entrySummary.completeNutrition[nutrient].amount * 100) /
            100
          ).toFixed(2);
          daySummary.completeNutrition[nutrient].unit =
            entrySummary.completeNutrition[nutrient].unit;
        }
        if (daySummary.completeNutrition[nutrient].percentOfDailyNeeds) {
          daySummary.completeNutrition[nutrient].percentOfDailyNeeds = (
            Math.round(
              +daySummary.completeNutrition[nutrient].percentOfDailyNeeds * 100
            ) /
              100 +
            Math.round(
              +entrySummary.completeNutrition[nutrient].percentOfDailyNeeds *
                100
            ) /
              100
          ).toFixed(2);
        } else {
          daySummary.completeNutrition[nutrient].percentOfDailyNeeds = (
            Math.round(
              +entrySummary.completeNutrition[nutrient].percentOfDailyNeeds *
                100
            ) / 100
          ).toFixed(2);
        }
      });
    }
  });

  return daySummary;
};

exports.createDaySummary = (prevEntry, newEntry, entries) => {
  //? newEntry given and null prevEntry indicates addition of entry to the day summaries
  //? null newEntry and prevEntry given indicates deletion of entry from existing day summaries
  //? both newEntry and prevEntry given indicates updation of entry within the day summaries
  //? start dates & resourceId indicate type of update: timeslot change or day change or resource type change

  let selectedResourceType, otherResourceType, date, dayEntries;
  let prevResourceType,
    newResourceType,
    prevDate,
    newDate,
    prevDateEntries,
    newDateEntries;

  if (!newEntry && entries && prevEntry) {
    selectedResourceType = resourceTypes.dietEntry;
    otherResourceType = resourceTypes.mealPlan;
    date = new Date(moment(prevEntry.start));
    dayEntries = entries.filter(entry => {
      let isSame =
        moment(entry.start).isSame(date, "year") &&
        moment(entry.start).isSame(date, "month") &&
        moment(entry.start).isSame(date, "day");
      return isSame ? true : false;
    });
  } else if (newEntry && entries && !prevEntry) {
    selectedResourceType = newEntry[resourceIdAccessor];
    otherResourceType = resourceMap.find(
      resource => resource[resourceIdAccessor] !== selectedResourceType
    )[resourceIdAccessor];
    date = new Date(moment(newEntry.start));
    dayEntries = entries.filter(entry => {
      let isSame =
        moment(entry.start).isSame(date, "year") &&
        moment(entry.start).isSame(date, "month") &&
        moment(entry.start).isSame(date, "day");
      return isSame ? true : false;
    });
  } else if (newEntry && entries && prevEntry) {
    prevResourceType = prevEntry[resourceIdAccessor];
    newResourceType = newEntry[resourceIdAccessor];
    prevDate = new Date(moment(prevEntry.start));
    newDate = new Date(moment(newEntry.start));
    prevDateEntries = entries.filter(entry => {
      let isSame =
        moment(entry.start).isSame(prevDate, "year") &&
        moment(entry.start).isSame(prevDate, "month") &&
        moment(entry.start).isSame(prevDate, "day");
      return isSame ? true : false;
    });
    newDateEntries = entries.filter(entry => {
      let isSame =
        moment(entry.start).isSame(newDate, "year") &&
        moment(entry.start).isSame(newDate, "month") &&
        moment(entry.start).isSame(newDate, "day");
      return isSame ? true : false;
    });
  }

  //* returning daySummary objects for each resourceType

  if (selectedResourceType && otherResourceType && date && dayEntries) {
    let selectedResourceDayEntries = dayEntries.filter(
      entry => entry[resourceIdAccessor] === selectedResourceType
    );

    let id_selected = `${moment(date).format(
      "Do MMM YYYY"
    )}-${selectedResourceType}-summary`;
    let displayDate_selected = moment(date).format("Do MMM YYYY");

    let daySummary_selected = _this.getDaySummary(selectedResourceDayEntries);

    let selectedResourceDaySummaryObj = {
      id: id_selected,
      [resourceIdAccessor]: selectedResourceType,
      dateId: id_selected, //? used to identify and operate on the daySummary objects
      date, //? date object representing a entry's start date of that particular day
      displayDate: displayDate_selected,
      title: `${
        resourceMap.find(
          res => res[resourceIdAccessor] === selectedResourceType
        )[resourceTitleAccessor]
      } Analysis for ${displayDate_selected}`,
      ...daySummary_selected
    };

    let otherResourceDayEntries = dayEntries.filter(
      entry => entry[resourceIdAccessor] === otherResourceType
    );

    let id_other = `${moment(date).format(
      "Do MMM YYYY"
    )}-${otherResourceType}-summary`;
    let displayDate_other = moment(date).format("Do MMM YYYY");

    let daySummary_other = _this.getDaySummary(otherResourceDayEntries);

    let otherResourceDaySummaryObj = {
      id: id_other,
      [resourceIdAccessor]: otherResourceType,
      dateId: id_other, //? used to identify and operate on the daySummary objects
      date, //? date object representing a entry's start date of that particular day
      displayDate: displayDate_other,
      title: `${
        resourceMap.find(res => res[resourceIdAccessor] === otherResourceType)[
          resourceTitleAccessor
        ]
      } Analysis for ${displayDate_other}`,
      ...daySummary_other
    };

    return [selectedResourceDaySummaryObj, otherResourceDaySummaryObj];
  }

  if (
    prevResourceType &&
    newResourceType &&
    prevDate &&
    newDate &&
    prevDateEntries &&
    newDateEntries
  ) {
    let prevDateSelectedResourceEntries = prevDateEntries.filter(
      entry => entry[resourceIdAccessor] === prevResourceType
    );

    let id_prevSlot = `${moment(prevDate).format(
      "Do MMM YYYY"
    )}-${prevResourceType}-summary`;
    let displayDate_prevSlot = moment(prevDate).format("Do MMM YYYY");

    let daySummary_prevSlot = _this.getDaySummary(
      prevDateSelectedResourceEntries
    );

    let prevDateSelectedResourceSummaryObj = {
      id: id_prevSlot,
      [resourceIdAccessor]: prevResourceType,
      dateId: id_prevSlot, //? used to identify and operate on the daySummary objects
      date: prevDate, //? date object representing a entry's start date of that particular day
      displayDate: displayDate_prevSlot,
      title: `${
        resourceMap.find(res => res[resourceIdAccessor] === prevResourceType)[
          resourceTitleAccessor
        ]
      } Analysis for ${displayDate_prevSlot}`,
      ...daySummary_prevSlot
    };

    let otherResourceDayEntries = newDateEntries.filter(
      entry => entry[resourceIdAccessor] === newResourceType
    );

    let id_newSlot = `${moment(newDate).format(
      "Do MMM YYYY"
    )}-${newResourceType}-summary`;
    let displayDate_newSlot = moment(newDate).format("Do MMM YYYY");

    let daySummary_newSlot = _this.getDaySummary(otherResourceDayEntries);

    let newDateSelectedResourceSummaryObj = {
      id: id_newSlot,
      [resourceIdAccessor]: newResourceType,
      dateId: id_newSlot, //? used to identify and operate on the daySummary objects
      date: newDate, //? date object representing a entry's start date of that particular day
      displayDate: displayDate_newSlot,
      title: `${
        resourceMap.find(res => res[resourceIdAccessor] === newResourceType)[
          resourceTitleAccessor
        ]
      } Analysis for ${displayDate_newSlot}`,
      ...daySummary_newSlot
    };

    return [
      prevDateSelectedResourceSummaryObj,
      newDateSelectedResourceSummaryObj
    ];
  }
};

exports.createDaysFromAllEntries = allEntries => {
  let allDaySummaries = [];
  let entries = [...allEntries];
  entries.forEach(entry => {
    let [
      selectedResourceDaySummaryObj,
      otherResourceDaySummaryObj
    ] = _this.createDaySummary(entry, entries);
    !allDaySummaries.find(
      daySum => daySum.id === selectedResourceDaySummaryObj.id
    ) && allDaySummaries.push(selectedResourceDaySummaryObj);
    !allDaySummaries.find(
      daySum => daySum.id === otherResourceDaySummaryObj.id
    ) && allDaySummaries.push(otherResourceDaySummaryObj);
  });
  return allDaySummaries;
};

exports.createEntry = (resData, resourceType) => {
  // const id = uuid();

  let entrySummary = _this.getDietEntrySummary(resData);

  let ifQueryWithAnd = Object.keys(entrySummary.metaInfo).some(metaInfoKey =>
    metaInfoKey.includes("and")
  );
  let parsedQuery = Object.keys(entrySummary.metaInfo).join(
    !ifQueryWithAnd ? ", " : " "
  );
  parsedQuery = parsedQuery.replace(/,([^,]*)$/, " and $1");

  const entryObj = {
    id,
    title: parsedQuery,
    parsedQuery,
    ...entrySummary,
    [resourceIdAccessor]: resourceTypes.dietEntry,
    className: "dietEntry"
  };

  //* Update the tracker with the new EntryObj as well as the database

  return entryObj;
};

exports.createMealPlan = (recipeDetail, resourceType) => {
  // const id = uuid();
  const title = recipeDetail.title;

  const healthScore = recipeDetail.healthScore;
  const weightWatcherSmartPoints = recipeDetail.weightWatcherSmartPoints;
  const recipeTags = Object.keys(recipeDetail).filter(
    recipeDetailKey => String(recipeDetail[recipeDetailKey]) === "true"
  );
  const caloricBreakdown = recipeDetail.nutrition.caloricBreakdown;
  let mealPlanSummary = _this.getMealPlanSummary([recipeDetail]); //! Important: provide an array to getSummary

  const mealPlanEntry = {
    ...mealPlanSummary,
    id,
    title,
    recipeTags,
    healthScore,
    weightWatcherSmartPoints,
    ...caloricBreakdown,
    [resourceIdAccessor]: resourceType || resourceTypes.mealPlan,
    className: "mealPlan"
  };
  return mealPlanEntry;
};
