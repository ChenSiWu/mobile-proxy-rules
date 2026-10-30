"use strict";

const FLCLASH_LAYOUT_VERSION = "2026.10.30-1";
const FLCLASH_REDUNDANT_GROUPS = new Set(["手动选择", "低倍率节点", "高倍率节点"]);

function main(input) {
  const base = buildMobileConfig(input);
  if (base["x-mobile-full"] !== MOBILE_RULES_VERSION || base["x-flclash-layout"] === FLCLASH_LAYOUT_VERSION) return base;

  const config = JSON.parse(JSON.stringify(base));
  const adapter = detectSubscription(config);
  if (!adapter) return config;
  const catchName = adapter.catchName;
  const adName = adapter.kind === "ikuuu" ? "🛑 拦截广告" : "AdBlock";
  const businessNames = new Set([
    ...CATALOG.services.map(service => service.name === "AdBlock" ? adName : service.name),
    ...AI_SERVICES.map(([name]) => name),
    catchName,
  ]);
  const managedNames = new Set([adapter.main, ...businessNames]);
  const infoNames = new Set(config.proxies.filter(proxy => INFO_NODE.test(proxy.name)).map(proxy => proxy.name));
  const required = requiredLegacyGroups(config, managedNames);

  config["proxy-groups"] = config["proxy-groups"].filter(group => {
    if (!FLCLASH_REDUNDANT_GROUPS.has(group.name)) return true;
    if (!required.has(group.name)) return false;
    group.hidden = true;
    return true;
  });
  for (const group of config["proxy-groups"]) {
    if (!managedNames.has(group.name)) continue;
    group.proxies = group.proxies.filter(name =>
      !FLCLASH_REDUNDANT_GROUPS.has(name) && !infoNames.has(name) &&
      !(businessNames.has(group.name) && (name === "自动选择" || name === "故障转移")));
    if (!group.proxies.length && !group.use?.length) throw new Error("Empty FlClash group: " + group.name);
  }
  config["x-flclash-layout"] = FLCLASH_LAYOUT_VERSION;
  validateGraph(config["proxy-groups"]);
  return config;
}

function requiredLegacyGroups(config, managedNames) {
  const required = new Set();
  const retain = name => {
    if (FLCLASH_REDUNDANT_GROUPS.has(name)) required.add(name);
  };
  for (const rule of config.rules) {
    const parts = splitRule(rule);
    retain(parts[parts.length - (parts[parts.length - 1].toLowerCase() === "no-resolve" ? 2 : 1)]);
  }
  // Native exception groups and DNS/dialer references must not lose their targets.
  for (const group of config["proxy-groups"]) {
    if (!managedNames.has(group.name)) for (const name of group.proxies || []) retain(name);
  }
  function visit(value) {
    if (typeof value === "string") {
      retain(value);
      if (value.includes("#")) for (const option of value.slice(value.indexOf("#") + 1).split("&")) retain(option);
    } else if (Array.isArray(value)) {
      for (const item of value) visit(item);
    } else if (value && typeof value === "object") {
      for (const item of Object.values(value)) visit(item);
    }
  }
  for (const [key, value] of Object.entries(config)) if (key !== "proxy-groups" && key !== "rules") visit(value);
  return required;
}
