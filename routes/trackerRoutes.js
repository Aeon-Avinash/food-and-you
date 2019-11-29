const express = require("express");
const router = express.Router();
const trackerController = require("../controllers/trackerControllers");
const jwtAuth = require("../middleware/jwtAuth");

router.get("/", jwtAuth, trackerController.getAllTrackers);
router.get("/:trackerId", jwtAuth, trackerController.getTracker);
router.post("/", jwtAuth, trackerController.createTracker);
router.patch(
  "/:trackerId/preferences",
  jwtAuth,
  trackerController.updateTrackerPreferences
);
router.delete("/:trackerId", jwtAuth, trackerController.deleteTracker);
router.post("/:trackerId/entry", jwtAuth, trackerController.addTrackerEntry);
router.patch(
  "/:trackerId/entry/:entryId",
  jwtAuth,
  trackerController.editTrackerEntry
);
router.delete(
  "/:trackerId/entry/:entryId",
  jwtAuth,
  trackerController.deleteTrackerEntry
);

module.exports = router;
