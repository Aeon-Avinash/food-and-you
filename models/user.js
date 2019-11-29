const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const userSchema = new mongoose.Schema({
  authType: {
    type: String,
    enum: ["GOOGLE", "GITHUB", "EMAIL"],
    default: "EMAIL"
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  tokens: {
    type: Object,
    default: {}
  },
  trackers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tracker"
    }
  ],
  lastUsedDefaultTracker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tracker"
  },
  settings: {
    metaData: {
      name: String,
      age: Number,
      weight: Number,
      weightUnit: {
        type: String,
        enum: ["kgs", "pounds"],
        default: "kgs"
      },
      height: Number,
      heightUnit: {
        type: String,
        enum: ["inches", "cms"],
        default: "cms"
      },
      country: String,
      lastUpdated: Date
    },
    globalSettings: {
      units: {
        type: String,
        enum: ["si", "imperial"],
        default: "si"
      },
      doNotDisturb: {
        type: Boolean,
        default: false
      },
      dataBackupSync: {
        lastSynced: {
          type: Date
        },
        syncFrequency: {
          type: String,
          enum: ["hour", "day", "week"],
          default: "day"
        }
      }
    },
    preferences: {
      cuisine: {
        type: String,
        default: ""
      },
      diet: {
        type: String,
        default: ""
      },
      intolerances: {
        type: String,
        default: ""
      },
      excludeIngredients: {
        type: String,
        default: ""
      }
    }
  },
  nutrition: {
    saved: {
      recentSearches: {
        type: Array,
        default: []
      },
      savedAnalysis: {
        type: Array,
        default: []
      }
    }
  },
  recipes: {
    saved: {
      recentSearches: {
        type: Array,
        default: []
      },
      recentRecipes: {
        type: Array,
        default: []
      },
      favoriteRecipes: {
        type: Array,
        default: []
      }
    }
  },
  passwordResetTokenValidity: Date
});

userSchema.methods.generateJWToken = async function() {
  try {
    console.log("generating auth tokens!");
    const user = this;
    const accessToken = await jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1000"
      }
    );
    const refreshToken = await jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "1d"
      }
    );

    const tokenObj = {
      accessToken,
      refreshToken,
      refreshTokenExpiry: moment(new Date())
        .add(1, "day")
        .toDate(),
      accessTokenExpiry: moment(new Date())
        .add(1, "minute")
        .toDate(),
      status: "Logged In"
    };

    user.tokens[refreshToken] = tokenObj;
    await user.save();

    return tokenObj;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

userSchema.methods.generateNewAccessToken = async function() {
  try {
    const user = this;
    const accessToken = await jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1000"
      }
    );
    return accessToken;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

userSchema.methods.toJSON = function() {
  const user = this;
  const userProfile = user.toObject();
  delete userProfile.password;
  delete userProfile.token;
  return userProfile;
};

const User = mongoose.model("user", userSchema);

module.exports = User;

/* 

cuisineState: [
        {
          type: Array,
          default: [
            "African",
            "American",
            "British",
            "Cajun",
            "Caribbean",
            "Chinese",
            "Eastern European",
            "European",
            "French",
            "German",
            "Greek",
            "Indian",
            "Irish",
            "Italian",
            "Japanese",
            "Jewish",
            "Korean",
            "Latin American",
            "Mediterranean",
            "Mexican",
            "Middle Eastern",
            "Nordic",
            "Southern",
            "Spanish",
            "Thai",
            "Vietnamese"
          ].map(cuisine => ({
            checked: {
              type: Boolean,
              default: false
            },
            value: {
              type: String,
              default: cuisine
            }
          }))
        }
      ],
      dietState: [
        {
          type: Array,
          default: [
            "Gluten Free",
            "Ketogenic",
            "Vegetarian",
            "Lacto-Vegetarian",
            "Ovo-Vegetarian",
            "Vegan",
            "Pescetarian",
            "Paleo",
            "Primal",
            "Whole30"
          ].map(diet => ({
            checked: {
              type: Boolean,
              default: false
            },
            value: {
              type: String,
              default: diet
            }
          }))
        }
      ],
      intoleranceState: [
        {
          type: Array,
          default: [
            "Dairy",
            "Egg",
            "Gluten",
            "Grain",
            "Peanut",
            "Seafood",
            "Sesame",
            "Shellfish",
            "Soy",
            "Sulfite",
            "Tree Nut",
            "Wheat"
          ].map(intolerance => ({
            checked: {
              type: Boolean,
              default: false
            },
            value: {
              type: String,
              default: intolerance
            }
          }))
        }
      ]

*/
