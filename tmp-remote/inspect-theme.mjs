import fs from "node:fs";
const s = fs.readFileSync(process.env.TEMP + "/theme.min.js", "utf8");
console.log("len", s.length);
console.log("has ThemeManager", s.includes("ThemeManager"));
console.log("has add(", /add\(["']modern["']/.test(s));
const i = s.indexOf("ThemeManager");
console.log("snippet", s.slice(i, i + 150));
console.log("start", s.slice(0, 200));
