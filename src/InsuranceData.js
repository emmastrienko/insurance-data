const { error } = require("console");
const fs = require("fs");
const { chunk } = require("lodash");
const readline = require("readline");

const readFileContentsLineByLine = (fileName, cb) => {
  let fileContents = [];

  const rl = readline.createInterface({
    input: fs.createReadStream(fileName),
    output: process.stdout,
    terminal: false,
  });

  try {
    rl.on("line", (line) => {
      fileContents.push(line);
    });

    rl.on("close", () => cb(null, fileContents));

    rl.on("error", (err) => {
      throw new Error(`Error while reading file contents line by line: ${err}`);
    });
  } catch (err) {
    cb(err, null);
  }
};

const filterFemaleCandidates = (fileContents, cb) => {
  try {
    let filteredData = fileContents.filter((record) => {
      return record.includes("female") && record.includes("southwest");
    });
    cb(null, filteredData);
  } catch (err) {
    cb(err, null);
  }
};

const writeFilteredDataToFile = (outputFileName, filteredData, cb) => {
  try {
    fs.writeFile(outputFileName, filteredData.join("\n"), (err) => {
      if (err) {
        throw new Error(
          `Error while writing filtered data to ${outputFileName}: ${err}`
        );
      } else {
        cb(null, `Filtered data written to ${outputFileName} successfully.`);
      }
    });
  } catch (err) {
    cb(err.message);
  }
};

const readFileContentsUsingStream = (fileName, cb) => {
  let fileContents = [];

  const readStream = fs.createReadStream(fileName, { encoding: "utf8" });

  readStream.on("error", (err) => {
    console.log(
      "Error while reading contents of file using streams, ERROR::",
      err
    );
    cb(`Encountered error while reading file contents using streams..!`);
  });

  readStream
    .on("data", (chunk) => {
      const lines = chunk.split("\n");
      fileContents.push(...lines.slice(1, -1));
      fileContents[fileContents.length - 1] += lines[lines.length - 1];
    })
    .on("end", () => {
      cb(null, fileContents);
    });
};

const filterDataWithNoChildren = (fileContents, cb) => {
  try {
    let filteredData = fileContents.filter((record) => {
      return record.includes("no");
    });
    cb(null, filteredData);
  } catch (err) {
    cb(err, null);
  }
};

module.exports = {
  readFileContentsLineByLine,
  filterFemaleCandidates,
  readFileContentsUsingStream,
};
