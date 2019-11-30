const csv = require("csvtojson");
const converter = csv({
  delimiter: ";",
  noheader: false,
  headers: ["title", "id"],
  downstreamFormat: "array"
});
const readCsvFilePath = require("path").join(
  __dirname,
  ".",
  "top-1k-ingredients.csv"
);
const writeJsonFilePath = require("path").join(
  __dirname,
  ".",
  "top_1K_ingredients.js"
);
const readStream = require("fs").createReadStream(readCsvFilePath);
const writeStream = require("fs").createWriteStream(writeJsonFilePath);
console.log("CVS to JSON");

readStream.pipe(converter).pipe(writeStream);
