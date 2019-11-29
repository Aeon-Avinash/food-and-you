const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    resourceId: {
      type: String,
      enum: ["dietEntry", "mealPlan"],
      default: "dietEntry"
    },
    className: String,
    start: Date,
    end: Date,
    mealSlot: String,
    recipeTags: [{ type: String }],
    title: {
      type: String
    },
    originalQuery: {
      type: String
    },
    parsedQuery: {
      type: String
    },
    ENERC_KCAL: {
      type: Number
    },
    percentProtein: {
      type: Number
    },
    percentFat: {
      type: Number
    },
    percentCarbs: {
      type: Number
    },
    weightPerServing: mongoose.Schema.Types.Mixed,
    completeNutrition: mongoose.Schema.Types.Mixed,
    metaInfo: Object,
    rawNutritionData: Object,
    nutrition: Object,
    vegetarian: Boolean,
    vegan: Boolean,
    glutenFree: Boolean,
    diaryFree: Boolean,
    veryHealthy: Boolean,
    veryPopular: Boolean,
    sustainable: Boolean,
    lowFodMap: Boolean,
    ketogenic: Boolean,
    whole30: Boolean,
    gaps: String,
    weightWatcherSmartPoints: Number,
    preparationMinutes: Number,
    cookingMinutes: Number,
    readyInMinutes: Number,
    sourceUrl: String,
    spoonacularSourceUrl: String,
    spoonacularScore: Number,
    aggregateLikes: Number,
    healthScore: Number,
    creditsText: String,
    sourceName: String,
    pricePerServing: Number,
    servings: Number,
    image: String,
    imageType: String,
    cuisines: [{ type: String }],
    dishTypes: [{ type: String }],
    diets: [{ type: String }],
    occasions: [{ type: String }],
    winePairing: Object,
    instructions: String,
    analyzedInstructions: [{ type: Object }]
  },
  { timestamps: true }
);

const Entry = mongoose.model("entry", entrySchema);

module.exports = Entry;

// completeNutrition: {
//   Calories: {
//     label: {
//       type: String,
//       default: "Calories"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "kcal"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   PROCNT: {
//     label: {
//       type: String,
//       default: "Protien"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "g"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   CHOCDF: {
//     label: {
//       type: String,
//       default: "Carbohydrates"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "g"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   FAT: {
//     label: {
//       type: String,
//       default: "Fat"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "g"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   SUGAR: {
//     label: {
//       type: String,
//       default: "Sugars"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "g"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   FASAT: {
//     label: {
//       type: String,
//       default: "Saturated"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "g"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   FAPU: {
//     label: {
//       type: String,
//       default: "Polyunsaturated"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "g"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   FAMS: {
//     label: {
//       type: String,
//       default: "Monounsaturated"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "g"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   FATRN: {
//     label: {
//       type: String,
//       default: "Trans"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "g"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   CHOLE: {
//     label: {
//       type: String,
//       default: "Cholesterol"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "mg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   FIBTG: {
//     label: {
//       type: String,
//       default: "Fiber"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "g"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   FOLATE: {
//     label: {
//       type: String,
//       default: "Folate (B9)"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "µg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   CA: {
//     label: {
//       type: String,
//       default: "Calcium"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "mg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   FE: {
//     label: {
//       type: String,
//       default: "Iron"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "mg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   NA: {
//     label: {
//       type: String,
//       default: "Sodium"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "mg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   K: {
//     label: {
//       type: String,
//       default: "Potassium"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "mg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   MG: {
//     label: {
//       type: String,
//       default: "Magnesium"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "mg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   P: {
//     label: {
//       type: String,
//       default: "Phosphorus"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "mg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   MN: {
//     label: {
//       type: String,
//       default: "Manganese"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "µg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   CU: {
//     label: {
//       type: String,
//       default: "Copper"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "µg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   ZN: {
//     label: {
//       type: String,
//       default: "Zinc"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "mg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   IO: {
//     label: {
//       type: String,
//       default: "Iodine"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "µg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   SL: {
//     label: {
//       type: String,
//       default: "Selenium"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "µg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   CL: {
//     label: {
//       type: String,
//       default: "Chloride"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "mg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   VITA_RAE: {
//     label: {
//       type: String,
//       default: "Vitamin A"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "IU"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   VITD: {
//     label: {
//       type: String,
//       default: "Vitamin D"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "IU"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   VITE: {
//     label: {
//       type: String,
//       default: "Vitamin E"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "IU"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   VITC: {
//     label: {
//       type: String,
//       default: "Vitamin C"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "mg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   VITK1: {
//     label: {
//       type: String,
//       default: "Vitamin K"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "µg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   VITB12: {
//     label: {
//       type: String,
//       default: "Vitamin B12"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "µg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   VITB6A: {
//     label: {
//       type: String,
//       default: "Vitamin B6"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "mg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   THIA: {
//     label: {
//       type: String,
//       default: "Thiamin (B1)"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "µg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   RIBF: {
//     label: {
//       type: String,
//       default: "Riboflavin (B2)"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "µg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   },
//   NIA: {
//     label: {
//       type: String,
//       default: "Niacin (B3)"
//     },
//     amount: {
//       type: Number
//     },
//     unit: {
//       type: String,
//       default: "µg"
//     },
//     percentOfDailyNeeds: {
//       type: Number
//     }
//   }
// },
