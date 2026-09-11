/**
 * Reads scripts/new-lessons-draft.txt, parses each lesson block, and
 * appends valid ones to src/data/lessons.js — then clears the draft file.
 *
 * No API, no network call, no cost. This just formats plain text you (or
 * Claude, in any free chat) wrote into the JS shape lessons.js needs.
 *
 * Run with:  npm run add-lessons
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const LESSONS_PATH = path.join(ROOT, "src/data/lessons.js");
const DRAFT_PATH = path.join(__dirname, "new-lessons-draft.txt");

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseDraft(text) {
  const blocks = text
    .split(/\n={5,}\n?/)
    .map((b) => b.trim())
    .filter((b) => b && !b.startsWith("Paste lesson drafts") && b !== "Title: Example Lesson Title".slice(0, 0));

  const lessons = [];
  for (const block of blocks) {
    // Skip the instructions block and the example block.
    if (block.includes("Paste lesson drafts below")) continue;
    if (/^Title:\s*Example Lesson Title/m.test(block)) continue;
    if (!/^Title:/m.test(block)) continue;

    const get = (key) => {
      const m = block.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
      return m ? m[1].trim() : null;
    };

    const title = get("Title");
    const category = get("Category");
    const readTime = get("ReadTime");
    const summary = get("Summary");
    const toolLabel = get("ToolLabel");
    const toolTo = get("ToolTo");

    const bodyMatch = block.match(/^Body:\s*\n([\s\S]*)$/m);
    if (!title || !category || !readTime || !summary || !toolLabel || !toolTo || !bodyMatch) {
      console.warn(`Skipping a block — missing a required field: "${title || "(no title)"}"`);
      continue;
    }

    const body = bodyMatch[1]
      .split(/\n###\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (body.length < 3) {
      console.warn(`Skipping "${title}" — expected at least 3 body paragraphs, found ${body.length}`);
      continue;
    }

    lessons.push({
      slug: slugify(title),
      title,
      category,
      readTime,
      summary,
      body,
      relatedTool: { label: toolLabel, to: toolTo },
    });
  }
  return lessons;
}

function toJsObjectLiteral(lesson) {
  const bodyLines = lesson.body.map((line) => `      ${JSON.stringify(line)},`).join("\n");
  return `  {
    slug: ${JSON.stringify(lesson.slug)},
    title: ${JSON.stringify(lesson.title)},
    category: ${JSON.stringify(lesson.category)},
    readTime: ${JSON.stringify(lesson.readTime)},
    summary: ${JSON.stringify(lesson.summary)},
    body: [
${bodyLines}
    ],
    relatedTool: { label: ${JSON.stringify(lesson.relatedTool.label)}, to: ${JSON.stringify(lesson.relatedTool.to)} },
  },`;
}

function main() {
  if (!fs.existsSync(DRAFT_PATH)) {
    console.log("No draft file found at scripts/new-lessons-draft.txt — nothing to do.");
    return;
  }

  const draftText = fs.readFileSync(DRAFT_PATH, "utf8");
  const lessons = parseDraft(draftText);

  if (lessons.length === 0) {
    console.log("No complete lesson blocks found in the draft file. Nothing added.");
    return;
  }

  const source = fs.readFileSync(LESSONS_PATH, "utf8");
  const existingSlugs = new Set([...source.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]));

  const marker = "\n];";
  const idx = source.indexOf(marker);
  if (idx === -1) throw new Error("Could not find the end of the LESSONS array in lessons.js");

  let updatedSource = source;
  let added = 0;
  let insertPoint = updatedSource.indexOf(marker);

  for (const lesson of lessons) {
    if (existingSlugs.has(lesson.slug)) {
      console.warn(`Skipping "${lesson.title}" — slug "${lesson.slug}" already exists.`);
      continue;
    }
    const objectLiteral = toJsObjectLiteral(lesson);
    updatedSource = updatedSource.slice(0, insertPoint) + "\n" + objectLiteral + updatedSource.slice(insertPoint);
    insertPoint += ("\n" + objectLiteral).length;
    existingSlugs.add(lesson.slug);
    added += 1;
    console.log(`Added: "${lesson.title}" (slug: ${lesson.slug})`);
  }

  if (added > 0) {
    fs.writeFileSync(LESSONS_PATH, updatedSource);
    // Reset the draft file to just the template/instructions, ready for next time.
    const templateOnly = draftText.split(/\n={5,}\n?/)[0] + "\n";
    fs.writeFileSync(
      DRAFT_PATH,
      templateOnly +
        "\n=====\nTitle: Example Lesson Title\nCategory: Foundations\nReadTime: 4 min\nSummary: One sentence, under 20 words, in the site's voice.\nToolLabel: Try the SIP Calculator\nToolTo: /sip-calculator\nBody:\nFirst paragraph...\n###\nSecond paragraph...\n###\nThird paragraph...\n###\nFourth paragraph...\n=====\n"
    );
  }

  console.log(`\nDone. ${added} lesson(s) added to src/data/lessons.js.`);
}

main();
