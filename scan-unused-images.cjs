const fs = require("fs");
const path = require("path");

const root = __dirname;
const imageExts = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif", ".ico"]);
const textExts = new Set([
  ".html",
  ".css",
  ".js",
  ".ts",
  ".tsx",
  ".jsx",
  ".vue",
  ".json",
  ".cjs",
  ".mjs",
  ".md",
  ".txt",
  ".xml",
  ".yml",
  ".yaml",
]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function stripQueryAndHash(value) {
  return value.split("#")[0].split("?")[0];
}

function decodeUrl(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function resolveReference(raw, fromFile) {
  let value = decodeUrl(stripQueryAndHash(raw.trim()));
  if (!value || /^(?:data:|https?:|blob:|mailto:)/i.test(value)) return null;
  value = value.replace(/\\/g, "/");
  let absolute;
  if (value.startsWith("/")) {
    absolute = path.resolve(root, "." + value);
  } else {
    absolute = path.resolve(path.dirname(fromFile), value);
  }
  if (!absolute.startsWith(root)) return null;
  return rel(absolute);
}

const files = walk(root);
const imageFiles = files.filter((file) => imageExts.has(path.extname(file).toLowerCase()));
const textFiles = files.filter((file) => {
  const ext = path.extname(file).toLowerCase();
  return textExts.has(ext) || /(^|\.)config\./.test(path.basename(file));
});

const directReferences = new Map();
const basenameMentions = new Map();
const textContents = [];

for (const file of textFiles) {
  let text = "";
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }
  textContents.push({ file, text });

  const patterns = [
    /url\(\s*["']?([^"')]+?\.(?:png|jpe?g|webp|gif|svg|avif|ico)(?:[?#][^"')]+)?)["']?\s*\)/gi,
    /(?:src|href|poster)\s*=\s*["']([^"']+?\.(?:png|jpe?g|webp|gif|svg|avif|ico)(?:[?#][^"']+)?)["']/gi,
    /["'`]([^"'`]+?\.(?:png|jpe?g|webp|gif|svg|avif|ico)(?:[?#][^"'`]+)?)["'`]/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text))) {
      const resolved = resolveReference(match[1], file);
      if (!resolved) continue;
      if (!directReferences.has(resolved)) directReferences.set(resolved, new Set());
      directReferences.get(resolved).add(rel(file));
    }
  }
}

for (const img of imageFiles) {
  const name = path.basename(img);
  for (const { file, text } of textContents) {
    if (text.includes(name)) {
      const imageRel = rel(img);
      if (!basenameMentions.has(imageRel)) basenameMentions.set(imageRel, new Set());
      basenameMentions.get(imageRel).add(rel(file));
    }
  }
}

function imageRecord(file, reason, mentionFiles = []) {
  const stat = fs.statSync(file);
  return {
    path: rel(file),
    fileName: path.basename(file),
    sizeBytes: stat.size,
    sizeKB: Math.round((stat.size / 1024) * 10) / 10,
    format: path.extname(file).slice(1).toUpperCase(),
    reason,
    mentionFiles,
  };
}

const definitelyUnused = [];
const ambiguous = [];
const used = [];

for (const img of imageFiles) {
  const imageRel = rel(img);
  if (directReferences.has(imageRel)) {
    used.push({ path: imageRel, referencedBy: [...directReferences.get(imageRel)].sort() });
  } else if (basenameMentions.has(imageRel)) {
    ambiguous.push(
      imageRecord(
        img,
        "未找到可解析到该文件的直接路径引用，但同名文件在代码中出现；可能是同名资源或动态引用，需要人工确认",
        [...basenameMentions.get(imageRel)].sort()
      )
    );
  } else {
    definitelyUnused.push(
      imageRecord(img, "未在 HTML/CSS/JS/TS/组件/配置文本中找到直接路径引用或文件名引用")
    );
  }
}

const report = {
  root,
  scannedTextFiles: textFiles.length,
  scannedImages: imageFiles.length,
  directlyUsed: used.length,
  definitelyUnused,
  ambiguousNotDirectlyResolved: ambiguous,
};

console.log(JSON.stringify(report, null, 2));
