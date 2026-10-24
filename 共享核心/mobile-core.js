"use strict";

// CATALOG and MOBILE_CLIENT are inserted by build.cjs.
const MOBILE_RULES_VERSION = "2026.10.25-4";
const NS = "mobile_full_";
const INFO_NODE = /^(?:剩余流量|已用流量|流量重置|套餐到期|到期时间|过期时间|官网|订阅地址|更新订阅|有效期|距离下次重置|Traffic|Expire|Reset)/i;
const BUILTIN = new Set(["DIRECT", "REJECT", "REJECT-DROP", "PASS", "COMPATIBLE"]);
const DIRECT_TYPES = new Set(["direct", "reject", "reject-drop", "pass", "dns", "compatible"]);
const REGIONS = [
  ["香港", /香港|🇭🇰|\bHK\b|Hong\s*Kong/i],
  ["日本", /日本|东京|大阪|🇯🇵|\bJP\b|Japan/i],
  ["美国", /美国|🇺🇸|\bUS\b|United\s*States|洛杉矶|纽约/i],
  ["新加坡", /新加坡|狮城|🇸🇬|\bSG\b|Singapore/i],
  ["台湾", /台湾|台北|🇹🇼|\bTW\b|Taiwan/i],
];
const AI_SERVICES = [
  ["ChatGPT / Codex", ["openai.com", "chatgpt.com", "oaistatic.com", "oaiusercontent.com", "openai.org", "codex.com"]],
  ["Claude", ["anthropic.com", "claude.ai", "claude.com", "claudeusercontent.com"]],
  ["Gemini", ["gemini.google.com", "aistudio.google.com", "generativelanguage.googleapis.com", "ai.google.dev", "makersuite.google.com"]],
  ["Grok", ["x.ai", "grok.com"]],
  ["Perplexity", ["perplexity.ai", "pplx.ai"]],
];

function main(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Expected a configuration object");
  if (input["x-mobile-full"] === MOBILE_RULES_VERSION) return input;
  const adapter = detectSubscription(input);
  if (!adapter) return input;

  const config = JSON.parse(JSON.stringify(input));
  const originalGroups = config["proxy-groups"] || [];
  const sourceMain = originalGroups.find(g => g.name === adapter.main);
  const mainName = MOBILE_CLIENT === "Bettbox" ? "默认代理" : adapter.main;
  const catchName = MOBILE_CLIENT === "Bettbox" ? "漏网之鱼" : adapter.catchName;
  const nodes = config.proxies || [];
  const nodeNames = new Set(nodes.map(p => p.name));
  if (nodeNames.size !== nodes.length) throw new Error("Duplicate source proxy names; refuse to rename nodes");
  const realNames = nodes.filter(p => !DIRECT_TYPES.has(String(p.type).toLowerCase()) && !INFO_NODE.test(p.name)).map(p => p.name);
  const infoNames = nodes.filter(p => INFO_NODE.test(p.name)).map(p => p.name);
  const providerNames = Object.keys(config["proxy-providers"] || {});
  if (!realNames.length && !providerNames.length) throw new Error("No usable source nodes or proxy-providers");

  const pool = providerNames.length ? { use: providerNames, "exclude-filter": INFO_NODE.source } : {};
  const groups = [];
  const reserved = new Set([mainName, "自动选择", "故障转移", "手动选择", "直连", catchName]);
  const serviceNames = new Set(CATALOG.services.map(s => s.name));
  const adName = MOBILE_CLIENT === "FlClash" && adapter.kind === "ikuuu" ? "🛑 拦截广告" : "AdBlock";
  const categories = originalGroups.filter(g => !reserved.has(g.name) && !serviceNames.has(g.name) &&
    g.name !== adapter.main && g.name !== adapter.catchName && g.name !== "🛑 拦截广告");
  for (const [name, regex] of REGIONS) {
    if (categories.some(g => g.name === name)) continue;
    const members = realNames.filter(n => regex.test(n.replace(/[\u200B\uFEFF]/g, "")));
    if (members.length) categories.push({ name, type: "select", proxies: members });
  }
  for (const [name, regex] of [
    ["低倍率节点", /(?:0\.[0-5]\s*[xX倍×*]|低倍|免费|\bfree\b)/i],
    ["高倍率节点", /(?:^|[^\d.])(?:[2-9]\d*|1\d+)(?:\.\d+)?[xX倍×*]/i],
  ]) {
    if (categories.some(g => g.name === name)) continue;
    const members = realNames.filter(n => regex.test(n));
    if (members.length) categories.push({ name, type: "select", proxies: members });
  }
  const otherNames = realNames.filter(n => !REGIONS.some(([, regex]) => regex.test(n)));
  if (otherNames.length && !categories.some(g => g.name === "其他节点")) {
    categories.push({ name: "其他节点", type: "select", proxies: otherNames });
  }
  // Only pure node selectors can appear inside the main group. Business groups may point back to it.
  const nodeCategoryNames = new Set([...REGIONS.map(([name]) => name), "低倍率节点", "高倍率节点", "其他节点", "WiFi Call", "动态家庭", "静态家庭", "机房", "CNIX专线"]);
  const categoryNames = categories.filter(g => nodeCategoryNames.has(g.name) &&
    (g.proxies || []).every(n => nodeNames.has(n) || BUILTIN.has(n))).map(g => g.name);
  const allChoices = unique(["自动选择", "故障转移", ...infoNames, ...categoryNames, "手动选择", ...realNames, "DIRECT"]);
  groups.push({ ...sourceMain, name: mainName, type: "select", ...pool, proxies: allChoices });
  groups.push(makeProbe("自动选择", "url-test", realNames, pool));
  groups.push(makeProbe("故障转移", "fallback", realNames, pool));
  // Keep the existing Bettbox selection chain without forcing a new node.
  groups.push({ name: "手动选择", type: "select", ...pool, proxies: realNames, hidden: MOBILE_CLIENT !== "Bettbox" });
  if (mainName !== adapter.main) groups.push({ name: adapter.main, type: "select", proxies: [mainName], hidden: true });

  const directNodes = [
    { name: "🇨🇳 直连 | 双栈", type: "direct" },
    { name: "🇨🇳 直连 | IPv4优先", type: "direct", "ip-version": "ipv4-prefer" },
    { name: "🇨🇳 直连 | IPv6优先", type: "direct", "ip-version": "ipv6-prefer" },
    { name: "🇨🇳 直连 | 仅IPv4", type: "direct", "ip-version": "ipv4" },
    { name: "🇨🇳 直连 | 仅IPv6", type: "direct", "ip-version": "ipv6" },
  ];
  for (const p of directNodes) if (!nodeNames.has(p.name)) nodes.push(p);
  groups.push({ name: "直连", type: "select", proxies: [...directNodes.map(p => p.name), "DIRECT"], hidden: true });

  const choices = unique([mainName, "手动选择", "自动选择", "故障转移", ...categoryNames, ...realNames, "DIRECT"]);
  const providers = { ...(config["rule-providers"] || {}) };
  const rules = [];
  const addProvider = (key, definition) => {
    const name = NS + key;
    if (Object.prototype.hasOwnProperty.call(providers, name)) throw new Error("Reserved rule-provider name collision: " + name);
    const provider = { ...definition, path: "./ruleset/" + NS + key + ".mrs" };
    if (MOBILE_CLIENT !== "Bettbox") delete provider["path-in-bundle"];
    providers[name] = provider;
    return name;
  };
  for (const key of ["private", "private_ip", "apple_cn", "microsoft_cn", "geolocation-cn", "geolocation-!cn", "cn_ip"]) {
    addProvider(key, CATALOG.base[key]);
  }
  rules.push("DOMAIN,cdn.jsdmirror.com,DIRECT", "RULE-SET," + NS + "private,DIRECT", "RULE-SET," + NS + "private_ip,DIRECT,no-resolve");

  const preserved = preserveSourceRules(config.rules || [], adapter, mainName, catchName);
  rules.push(...preserved.priority);
  for (const [name, domains] of AI_SERVICES) {
    groups.push({ name, type: "select", ...pool, proxies: unique(["AI", ...choices]) });
    for (const domain of domains) rules.push("DOMAIN-SUFFIX," + domain + "," + name);
  }
  rules.push("RULE-SET," + NS + "apple_cn,DIRECT", "RULE-SET," + NS + "microsoft_cn,DIRECT");

  const serviceRules = [];
  for (const service of CATALOG.services) {
    const isAds = service.name === "AdBlock";
    const name = isAds ? adName : service.name;
    const old = originalGroups.find(g => g.name === name);
    const adDefaults = MOBILE_CLIENT === "FlClash" ? old?.proxies || [] : [];
    groups.push({ ...old, name, type: "select", ...pool,
      proxies: isAds ? unique([...adDefaults, "PASS", "REJECT", ...choices]) : choices,
      icon: service.icon });
    for (const [key, provider] of Object.entries(service.providers)) addProvider(key, provider);
    for (const rule of service.rules) {
      const parts = splitRule(rule);
      if (parts[0] === "RULE-SET") parts[1] = NS + parts[1];
      if (isAds) parts[parts.length - 1] = name;
      serviceRules.push(parts.join(","));
    }
  }
  // Domain service rules precede broad IP ranges; an AI endpoint must not be swallowed by Google IP.
  rules.push(...serviceRules.filter(r => r.includes("," + NS + "category-ads,")));
  rules.push(...serviceRules.filter(r => !/,no-resolve$/.test(r) && !r.includes("," + NS + "category-ads,")));
  rules.push(...serviceRules.filter(r => /,no-resolve$/.test(r)));
  rules.push(...preserved.supplementary);
  rules.push("RULE-SET," + NS + "geolocation-cn,直连");
  rules.push("RULE-SET," + NS + "geolocation-!cn," + mainName);
  rules.push("RULE-SET," + NS + "cn_ip,直连,no-resolve");
  rules.push("MATCH," + catchName);
  groups.push(...categories);
  groups.push({ name: catchName, type: "select", ...pool, proxies: choices });

  const names = new Set([...nodes.map(p => p.name), ...groups.map(g => g.name), ...BUILTIN]);
  if (groups.length !== new Set(groups.map(g => g.name)).size) throw new Error("Duplicate group names");
  for (const group of groups) {
    if (nodeNames.has(group.name)) throw new Error("Source node and generated group have the same name: " + group.name);
    if (group.proxies) group.proxies = unique(group.proxies.filter(n => names.has(n) && n !== group.name));
    if (!group.proxies?.length && !group.use?.length) throw new Error("Empty group: " + group.name);
  }
  config.proxies = nodes;
  config["proxy-groups"] = groups;
  config["rule-providers"] = providers;
  config.rules = uniqueRules(rules);
  adaptMobileDns(config, adapter, mainName);
  config["x-mobile-full"] = MOBILE_RULES_VERSION;
  validateGraph(groups);
  return config;
}

function adaptMobileDns(config, adapter, mainName) {
  const dns = config.dns;
  // DoQ succeeds on the Android path where overseas DoH returns EOF; DoT is an alternate transport.
  // Keep its private policies, hosts, bootstrap, IPv6 and listener; restore mobile Fake-IP handling.
  if (adapter.kind !== "mnk" || !dns?.enable || dns["enhanced-mode"] !== "redir-host") return;
  const domestic = dns["direct-nameserver"];
  if (!Array.isArray(domestic) || !domestic.length) return;
  dns["enhanced-mode"] = "fake-ip";
  dns["fake-ip-range"] = dns["fake-ip-range"] || "198.18.0.1/15";
  dns["fake-ip-filter"] = unique(["rule-set:" + NS + "private", "rule-set:" + NS + "geolocation-cn", ...(dns["fake-ip-filter"] || [])]);
  dns.nameserver = [
    "quic://unfiltered.adguard-dns.com:853#" + mainName,
    "tls://1.1.1.1:853#" + mainName,
  ];
  dns["nameserver-policy"] = { ["rule-set:" + NS + "geolocation-cn"]: domestic, ...(dns["nameserver-policy"] || {}) };
}

function detectSubscription(config) {
  const names = new Set((config["proxy-groups"] || []).map(g => g.name));
  if (names.has("MNKCloud")) return { kind: "mnk", main: "MNKCloud", catchName: "漏网之鱼" };
  if (names.has("🔰 选择节点") && names.has("🌏 爱奇艺&哔哩哔哩")) {
    return { kind: "ikuuu", main: "🔰 选择节点", catchName: "🐟 漏网之鱼" };
  }
  if (["默认", "WiFi Call", "动态家庭", "静态家庭", "机房"].every(n => names.has(n))) {
    return { kind: "qianlink", main: "默认", catchName: "漏网之鱼" };
  }
  return null;
}

function preserveSourceRules(sourceRules, adapter, mainName, catchName) {
  const priority = [], supplementary = [];
  const generic = new Set([adapter.main, "自动选择", "故障转移", adapter.catchName]);
  const replaceable = new Set(["🇨🇳 国内网站", "🛑 拦截广告"]);
  for (const rule of sourceRules) {
    const p = splitRule(rule);
    const type = p[0].toUpperCase();
    if (["MATCH", "FINAL", "GEOIP", "GEOSITE", "PROCESS-NAME", "PROCESS-PATH", "PROCESS-NAME-REGEX"].includes(type)) continue;
    if (type === "DOMAIN-KEYWORD" && p[1] === ".") continue;
    const at = p.length - (p[p.length - 1].toLowerCase() === "no-resolve" ? 2 : 1);
    const target = p[at];
    if (replaceable.has(target)) continue;
    if (generic.has(target)) {
      // Ikuuu's thousands of generic foreign entries are replaced, not stacked.
      if (adapter.kind === "ikuuu") continue;
      p[at] = target === adapter.catchName ? catchName : mainName;
      if (type === "DOMAIN" || (type === "IP-CIDR" && ["1.1.1.1/32", "8.8.8.8/32"].includes(p[1]))) {
        priority.push(p.join(","));
      } else if (adapter.kind === "qianlink") {
        supplementary.push(p.join(","));
      }
    } else {
      priority.push(p.join(","));
    }
  }
  return { priority, supplementary };
}

function makeProbe(name, type, proxies, pool) {
  return { name, type, ...pool, proxies, url: "https://www.gstatic.com/generate_204",
    interval: type === "fallback" ? 1800 : 3600, timeout: 5000, lazy: true,
    ...(type === "url-test" ? { tolerance: 100 } : {}) };
}

function splitRule(rule) {
  const parts = [];
  let depth = 0, start = 0;
  for (let i = 0; i < rule.length; i++) {
    if (rule[i] === "(") depth++;
    if (rule[i] === ")") depth--;
    if (rule[i] === "," && depth === 0) { parts.push(rule.slice(start, i).trim()); start = i + 1; }
  }
  parts.push(rule.slice(start).trim());
  return parts;
}

function unique(values) { return [...new Set(values)]; }

function uniqueRules(rules) {
  const seen = new Set();
  return rules.filter(rule => {
    const p = splitRule(rule), type = p[0].toUpperCase();
    const at = p.length - (p[p.length - 1].toLowerCase() === "no-resolve" ? 2 : 1);
    const key = [type, ...p.slice(1, at).map(s => s.toLowerCase()), ...p.slice(at + 1)].join(",");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function validateGraph(groups) {
  const map = new Map(groups.map(g => [g.name, g.proxies || []]));
  const done = new Set(), active = new Set();
  function visit(name) {
    if (!map.has(name) || done.has(name)) return;
    if (active.has(name)) throw new Error("Group cycle: " + name);
    active.add(name);
    for (const child of map.get(name)) visit(child);
    active.delete(name);
    done.add(name);
  }
  for (const name of map.keys()) visit(name);
}
