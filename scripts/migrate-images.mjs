/**
 * BDA Image Migration Script
 * Downloads images from old Sanity CDN (8m33196t) and uploads to new project (dq09sslz).
 * Updates each agency document to use the native Sanity image asset instead of external URL.
 *
 * Run from the bda-site folder:
 *   SANITY_TOKEN=skXXX node scripts/migrate-images.mjs
 */

import { createClient } from "@sanity/client";
import https from "https";
import { Buffer } from "buffer";

const client = createClient({
  projectId: "dq09sslz",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

if (!process.env.SANITY_TOKEN) {
  console.error(
    "Missing SANITY_TOKEN env var.\n" +
      "Create one at: https://www.sanity.io/manage/project/dq09sslz/api#tokens\n" +
      "Grant it Editor permissions, then run:\n" +
      "  SANITY_TOKEN=skXXX node migrate-images.mjs"
  );
  process.exit(1);
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

function getContentType(url) {
  const ext = url.split(".").pop().split("?")[0].toLowerCase();
  const map = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", svg: "image/svg+xml", webp: "image/webp", gif: "image/gif" };
  return map[ext] || "image/png";
}

async function main() {
  const agencies = await client.fetch(
    `*[_type == "agency" && defined(imageUrl)]{_id, name, imageUrl}`
  );

  console.log(`Found ${agencies.length} agencies with imageUrl to migrate.\n`);

  let success = 0;
  let failed = 0;

  for (const agency of agencies) {
    try {
      process.stdout.write(`[${success + failed + 1}/${agencies.length}] ${agency.name}...`);

      const buf = await fetchBuffer(agency.imageUrl);
      const contentType = getContentType(agency.imageUrl);

      const asset = await client.assets.upload("image", buf, {
        filename: agency.imageUrl.split("/").pop(),
        contentType,
      });

      await client
        .patch(agency._id)
        .set({
          image: {
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
          },
        })
        .unset(["imageUrl"])
        .commit();

      console.log(" OK");
      success++;
    } catch (err) {
      console.log(` FAILED - ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${success} migrated, ${failed} failed.`);

  if (success > 0) {
    console.log(
      "\nNext steps:\n" +
        "1. Update sanity.ts: replace imageUrl with image asset query\n" +
        "2. Update index.astro: use the Sanity image URL from the asset\n" +
        "3. Push and rebuild"
    );
  }
}

main();
