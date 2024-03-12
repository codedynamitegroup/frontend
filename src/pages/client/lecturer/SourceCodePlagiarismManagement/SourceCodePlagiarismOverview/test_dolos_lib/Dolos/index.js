import { Dolos } from "@dodona/dolos-lib";
import { writeFile } from "fs/promises";

const files = [
  "./sample.js",
  "./copied_function.js",
  "./another_copied_function.js",
  "./copy_of_sample.js"
];

const dolos = new Dolos();
dolos.analyzePaths(files).then((report) => {
  // console.log("Report:", JSON.stringify(report, null, 2));

  // Write the report to a file
  writeFile("report.json", JSON.stringify(report, null, 2));

  const matches = [];
  for (const pair of report.allPairs()) {
    console.log(
      pair.leftFile.path,
      pair.rightFile.path,
      pair.similarity,
      pair.longest,
      pair.overlap
    );
    for (const fragment of pair.buildFragments()) {
      const left = fragment.leftSelection;
      const right = fragment.rightSelection;
      // console.log(
      //   `${pair.leftFile.path}:{${left.startRow},${left.startCol} -> ${left.endRow},${left.endCol}} matches with ${pair.rightFile.path}:{${right.startRow},${right.startCol} -> ${right.endRow},${right.endCol}}`
      // );
      matches.push(
        `${pair.leftFile.path}:{${left.startRow},${left.startCol} -> ${left.endRow},${left.endCol}} matches with ${pair.rightFile.path}:{${right.startRow},${right.startCol} -> ${right.endRow},${right.endCol}}`
      );
    }
  }
  writeFile("matches.txt", matches.join("\n"));
});
