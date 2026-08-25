import fs from "node:fs";
const s = fs.readFileSync(
  "c:/Users/anton/Desktop/gucci_classic_child/tmp-remote/theme.min.js",
  "utf8"
);
console.log("end:", s.slice(-250));
console.log("includes add modern single:", s.includes("add('modern'"));
console.log("includes add modern double:", s.includes('add("modern"'));
