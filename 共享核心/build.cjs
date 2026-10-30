"use strict";

const fs = require("node:fs");
const path = require("node:path");
const root = path.dirname(__dirname);
const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, "myclash-catalog.json"), "utf8"));
const core = fs.readFileSync(path.join(__dirname, "mobile-core.js"), "utf8");
if (core.split("function main(input)").length !== 2) throw new Error("Expected one shared main(input) entrypoint");
const header = `/*
 * Mobile full-service rules, based on AIsouler/MyClash (MIT).
 * Copyright (c) 2026 AIsouler; mobile-proxy-rules contributors.
 * Upstream: 0c7a93ae424aefda5c44d781a05607490ed3dca1
 * Service catalog only; upstream node/DNS/TUN rewrite functions are not used.
 * No subscription credentials belong in this file. See LICENSE and README.md.
 */\n`;
for (const client of ["Bettbox", "FlClash"]) {
  const clientCore = client === "FlClash" ? core.replace("function main(input)", "function buildMobileConfig(input)") : core;
  const clientLayout = client === "FlClash" ? "\n" + fs.readFileSync(path.join(root, client, "group-layout.js"), "utf8") : "";
  const output = header + `const MOBILE_CLIENT = ${JSON.stringify(client)};\n` +
    `const CATALOG = ${JSON.stringify(catalog)};\n` + clientCore + clientLayout;
  const destination = path.join(root, client, "mobile-full.js");
  fs.writeFileSync(destination, output);
  console.log(client + ": " + Buffer.byteLength(output) + " bytes");
}
