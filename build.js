const fs = require("fs");
const path = require("path");

const root = __dirname;
const output = path.join(root, "dist");
const headerPath = path.join(root, "components", "header.html");
const footerPath = path.join(root, "components", "footer.html");

const excludedTopLevel = new Set([
  ".git",
  ".github",
  "components",
  "dist",
  "node_modules",
  "functions"
]);

function removeOutputDirectory() {
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });
}

function copyDirectory(source, destination, relative = "") {
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (!relative && excludedTopLevel.has(entry.name)) continue;
    if (!relative && ["build.js", "package.json", "package-lock.json"].includes(entry.name)) continue;

    const sourcePath = path.join(source, entry.name);
    const relativePath = path.join(relative, entry.name);
    const destinationPath = path.join(destination, relativePath);

    if (entry.isDirectory()) {
      fs.mkdirSync(destinationPath, { recursive: true });
      copyDirectory(sourcePath, destination, relativePath);
    } else {
      fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

function replaceSharedLayout(filePath, header, footer) {
  let html = fs.readFileSync(filePath, "utf8");

  const headerPattern = /<header\b[^>]*class=["'][^"']*\bsite-header\b[^"']*["'][^>]*>[\s\S]*?<\/header>/i;
  const footerPattern = /<footer\b[^>]*class=["'][^"']*\bfooter\b[^"']*["'][^>]*>[\s\S]*?<\/footer>/i;

  if (headerPattern.test(html)) {
    html = html.replace(headerPattern, header.trim());
  }

  if (footerPattern.test(html)) {
    html = html.replace(footerPattern, footer.trim());
  }

  fs.writeFileSync(filePath, html);
}

function processHtmlFiles(directory, header, footer) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      processHtmlFiles(fullPath, header, footer);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      replaceSharedLayout(fullPath, header, footer);
    }
  }
}

function main() {
  if (!fs.existsSync(headerPath) || !fs.existsSync(footerPath)) {
    throw new Error("Missing components/header.html or components/footer.html");
  }

  const header = fs.readFileSync(headerPath, "utf8");
  const footer = fs.readFileSync(footerPath, "utf8");

  removeOutputDirectory();
  copyDirectory(root, output);
  processHtmlFiles(output, header, footer);

  console.log("TWG site built successfully in dist/");
}

main();
