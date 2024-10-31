const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Compile TypeScript files
execSync("tsc", { stdio: "inherit" });

// Define paths
const sourcePath = path.join(__dirname, "dist", "app.js"); // Path to compiled JavaScript
const outputPath = path.join(__dirname, "api", "index.js"); // Path for output file

// Read the compiled JavaScript file
const content = fs.readFileSync(sourcePath, "utf-8");

// Write to ./api/index.js
fs.writeFileSync(outputPath, content);
console.log(`Generated ${outputPath}`);
