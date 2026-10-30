/*
 * Mobile full-service rules, based on AIsouler/MyClash (MIT).
 * Copyright (c) 2026 AIsouler; mobile-proxy-rules contributors.
 * Upstream: 0c7a93ae424aefda5c44d781a05607490ed3dca1
 * Service catalog only; upstream node/DNS/TUN rewrite functions are not used.
 * No subscription credentials belong in this file. See LICENSE and README.md.
 */
const MOBILE_CLIENT = "FlClash";
const CATALOG = {"services":[{"name":"FCM","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/Fcm.svg","providers":{"googlefcm":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/googlefcm.mrs","path":"./ruleset/googlefcm.mrs","path-in-bundle":"geo/geosite/googlefcm.mrs"}},"rules":["RULE-SET,googlefcm,FCM"]},{"name":"YouTube","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/YouTube.svg","providers":{"youtube":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/youtube.mrs","path":"./ruleset/youtube.mrs","path-in-bundle":"geo/geosite/youtube.mrs"}},"rules":["RULE-SET,youtube,YouTube"]},{"name":"Google","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/Google.svg","providers":{"google":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/google.mrs","path":"./ruleset/google.mrs","path-in-bundle":"geo/geosite/google.mrs"},"google_ip":{"type":"http","format":"mrs","interval":86400,"behavior":"ipcidr","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geoip/google.mrs","path":"./ruleset/google_ip.mrs","path-in-bundle":"geo/geoip/google.mrs"}},"rules":["RULE-SET,google,Google","RULE-SET,google_ip,Google,no-resolve"]},{"name":"AI","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/OpenAI.svg","providers":{"ai":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/category-ai-!cn.mrs","path":"./ruleset/ai.mrs","path-in-bundle":"geo/geosite/category-ai-!cn.mrs"}},"rules":["RULE-SET,ai,AI"]},{"name":"GitHub","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/GitHub.svg","providers":{"github":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/github.mrs","path":"./ruleset/github.mrs","path-in-bundle":"geo/geosite/github.mrs"}},"rules":["RULE-SET,github,GitHub"]},{"name":"Microsoft","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/Microsoft.svg","providers":{"microsoft":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/microsoft.mrs","path":"./ruleset/microsoft.mrs","path-in-bundle":"geo/geosite/microsoft.mrs"},"microsoft_ip":{"type":"http","format":"mrs","interval":86400,"behavior":"ipcidr","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geoip/microsoft.mrs","path":"./ruleset/microsoft_ip.mrs","path-in-bundle":"geo/geoip/microsoft.mrs"}},"rules":["RULE-SET,microsoft,Microsoft","RULE-SET,microsoft_ip,Microsoft,no-resolve"]},{"name":"Apple","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/Apple.svg","providers":{"apple":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/apple.mrs","path":"./ruleset/apple.mrs","path-in-bundle":"geo/geosite/apple.mrs"},"apple_ip":{"type":"http","format":"mrs","interval":86400,"behavior":"ipcidr","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geoip/apple.mrs","path":"./ruleset/apple_ip.mrs","path-in-bundle":"geo/geoip/apple.mrs"}},"rules":["RULE-SET,apple,Apple","RULE-SET,apple_ip,Apple,no-resolve"]},{"name":"Telegram","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/Telegram.svg","providers":{"telegram":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/telegram.mrs","path":"./ruleset/telegram.mrs","path-in-bundle":"geo/geosite/telegram.mrs"},"telegram_ip":{"type":"http","format":"mrs","interval":86400,"behavior":"ipcidr","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geoip/telegram.mrs","path":"./ruleset/telegram_ip.mrs","path-in-bundle":"geo/geoip/telegram.mrs"}},"rules":["RULE-SET,telegram,Telegram","RULE-SET,telegram_ip,Telegram,no-resolve"]},{"name":"TikTok","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/TikTok.svg","providers":{"tiktok":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/tiktok.mrs","path":"./ruleset/tiktok.mrs","path-in-bundle":"geo/geosite/tiktok.mrs"},"tiktok_ip":{"type":"http","format":"mrs","interval":86400,"behavior":"ipcidr","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geoip/tiktok.mrs","path":"./ruleset/tiktok_ip.mrs","path-in-bundle":"geo/geoip/tiktok.mrs"}},"rules":["RULE-SET,tiktok,TikTok","RULE-SET,tiktok_ip,TikTok,no-resolve"]},{"name":"Twitter","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/Twitter.svg","providers":{"twitter":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/twitter.mrs","path":"./ruleset/twitter.mrs","path-in-bundle":"geo/geosite/twitter.mrs"},"twitter_ip":{"type":"http","format":"mrs","interval":86400,"behavior":"ipcidr","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geoip/twitter.mrs","path":"./ruleset/twitter_ip.mrs","path-in-bundle":"geo/geoip/twitter.mrs"}},"rules":["RULE-SET,twitter,Twitter","RULE-SET,twitter_ip,Twitter,no-resolve"]},{"name":"Meta","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/Meta.svg","providers":{"meta":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/meta.mrs","path":"./ruleset/meta.mrs","path-in-bundle":"geo/geosite/meta.mrs"},"facebook_ip":{"type":"http","format":"mrs","interval":86400,"behavior":"ipcidr","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geoip/facebook.mrs","path":"./ruleset/facebook_ip.mrs","path-in-bundle":"geo/geoip/facebook.mrs"}},"rules":["RULE-SET,meta,Meta","RULE-SET,facebook_ip,Meta,no-resolve"]},{"name":"Line","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/Line.svg","providers":{"line":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/line.mrs","path":"./ruleset/line.mrs","path-in-bundle":"geo/geosite/line.mrs"}},"rules":["RULE-SET,line,Line"]},{"name":"Netflix","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/Netflix.svg","providers":{"netflix":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/netflix.mrs","path":"./ruleset/netflix.mrs","path-in-bundle":"geo/geosite/netflix.mrs"},"netflix_ip":{"type":"http","format":"mrs","interval":86400,"behavior":"ipcidr","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geoip/netflix.mrs","path":"./ruleset/netflix_ip.mrs","path-in-bundle":"geo/geoip/netflix.mrs"}},"rules":["RULE-SET,netflix,Netflix","RULE-SET,netflix_ip,Netflix,no-resolve"]},{"name":"Emby","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/Emby.svg","providers":{"emby":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/666OS/rules@release/mihomo/domain/Emby.mrs","path":"./ruleset/emby.mrs","path-in-bundle":"geo/geosite/category-emby.mrs"},"emos":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/binaryu/emos-proxy-rule@main/rules/emos-mihomo.mrs","path":"./ruleset/emos.mrs","path-in-bundle":"geo/geosite/category-emby.mrs"}},"rules":["RULE-SET,emby,Emby","RULE-SET,emos,Emby","DOMAIN-SUFFIX,mb3admin.com,Emby","DOMAIN-SUFFIX,nubebelle.com,Emby","DOMAIN-KEYWORD,emby,Emby"]},{"name":"PikPak","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/PikPak.svg","providers":{"pikpak":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/pikpak.mrs","path":"./ruleset/pikpak.mrs","path-in-bundle":"geo/geosite/pikpak.mrs"}},"rules":["RULE-SET,pikpak,PikPak"]},{"name":"Spotify","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/Spotify.svg","providers":{"spotify":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/spotify.mrs","path":"./ruleset/spotify.mrs","path-in-bundle":"geo/geosite/spotify.mrs"},"spotify_ip":{"type":"http","format":"mrs","interval":86400,"behavior":"ipcidr","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geoip/spotify.mrs","path":"./ruleset/spotify_ip.mrs","path-in-bundle":"geo/geoip/spotify.mrs"}},"rules":["RULE-SET,spotify,Spotify","RULE-SET,spotify_ip,Spotify,no-resolve"]},{"name":"Crypto","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/Bitcoin.svg","providers":{"cryptocurrency":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/category-cryptocurrency.mrs","path":"./ruleset/cryptocurrency.mrs","path-in-bundle":"geo/geosite/category-cryptocurrency.mrs"}},"rules":["RULE-SET,cryptocurrency,Crypto"]},{"name":"PayPal","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/PayPal.svg","providers":{"paypal":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/paypal.mrs","path":"./ruleset/paypal.mrs","path-in-bundle":"geo/geosite/paypal.mrs"}},"rules":["RULE-SET,paypal,PayPal"]},{"name":"Patreon","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/Patreon.svg","providers":{"patreon":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/patreon.mrs","path":"./ruleset/patreon.mrs","path-in-bundle":"geo/geosite/patreon.mrs"}},"rules":["RULE-SET,patreon,Patreon"]},{"name":"EHentai","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/EHentai.svg","providers":{"ehentai":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/ehentai.mrs","path":"./ruleset/ehentai.mrs","path-in-bundle":"geo/geosite/ehentai.mrs"}},"rules":["RULE-SET,ehentai,EHentai"]},{"name":"AdBlock","icon":"https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/AdBlock.svg","providers":{"category-ads":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/category-ads.mrs","path":"./ruleset/category-ads.mrs","path-in-bundle":"geo/geosite/category-ads.mrs"}},"rules":["RULE-SET,category-ads,AdBlock"]}],"base":{"private":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/private.mrs","path":"./ruleset/private.mrs","path-in-bundle":"geo/geosite/private.mrs"},"private_ip":{"type":"http","format":"mrs","interval":86400,"behavior":"ipcidr","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geoip/private.mrs","path":"./ruleset/private_ip.mrs","path-in-bundle":"geo/geoip/private.mrs"},"games_cn":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/category-games@cn.mrs","path":"./ruleset/category-games@cn.mrs","path-in-bundle":"geo/geosite/category-games@cn.mrs"},"epicgames":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/epicgames.mrs","path":"./ruleset/epicgames.mrs","path-in-bundle":"geo/geosite/epicgames.mrs"},"nvidia_cn":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/nvidia@cn.mrs","path":"./ruleset/nvidia@cn.mrs","path-in-bundle":"geo/geosite/nvidia@cn.mrs"},"apple_cn":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/apple@cn.mrs","path":"./ruleset/apple@cn.mrs","path-in-bundle":"geo/geosite/apple@cn.mrs"},"microsoft_cn":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/microsoft@cn.mrs","path":"./ruleset/microsoft@cn.mrs","path-in-bundle":"geo/geosite/microsoft@cn.mrs"},"geolocation-cn":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/geolocation-cn.mrs","path":"./ruleset/geolocation-cn.mrs","path-in-bundle":"geo/geosite/geolocation-cn.mrs"},"cn_ip":{"type":"http","format":"mrs","interval":86400,"behavior":"ipcidr","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geoip/cn.mrs","path":"./ruleset/cn_ip.mrs","path-in-bundle":"geo/geoip/cn.mrs"},"geolocation-!cn":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/geolocation-!cn.mrs","path":"./ruleset/geolocation-!cn.mrs","path-in-bundle":"geo/geosite/geolocation-!cn.mrs"},"fakeip_filter":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/fakeip-filter.mrs","path":"./ruleset/fakeip-filter.mrs","path-in-bundle":"geo/geosite/fakeip-filter.mrs"},"cn_additional":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://static-file-global.353355.xyz/rules/cn-additional-list.mrs","path":"./ruleset/cn-additional-list.mrs","path-in-bundle":"geo/geosite/cn.mrs"},"cn":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/cn.mrs","path":"./ruleset/cn.mrs","path-in-bundle":"geo/geosite/cn.mrs"},"douyin":{"type":"http","format":"mrs","interval":86400,"behavior":"domain","url":"https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/geosite/douyin.mrs","path":"./ruleset/douyin.mrs","path-in-bundle":"geo/geosite/douyin.mrs"}}};
"use strict";

// CATALOG and MOBILE_CLIENT are inserted by build.cjs.
const MOBILE_RULES_VERSION = "2026.10.25-4";
const MOBILE_DNS_VERSION = "2026.10.30-1";
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

function buildMobileConfig(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Expected a configuration object");
  const adapter = detectSubscription(input);
  if (!adapter) return input;

  const config = JSON.parse(JSON.stringify(input));
  if (input["x-mobile-full"] === MOBILE_RULES_VERSION) {
    adaptMobileDns(config, adapter, MOBILE_CLIENT === "Bettbox" ? "默认代理" : adapter.main);
    return config;
  }
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
  if (adapter.kind !== "mnk" || !dns?.enable) return;
  const legacyNameservers = ["quic://unfiltered.adguard-dns.com:853#" + mainName, "tls://1.1.1.1:853#" + mainName];
  const domainNameservers = ["https://dns10.quad9.net/dns-query#" + mainName, "https://unfiltered.adguard-dns.com/dns-query#" + mainName];
  const legacyMobileDns = config["x-mobile-full"] === MOBILE_RULES_VERSION &&
    dns["enhanced-mode"] === "fake-ip" && (JSON.stringify(dns.nameserver) === JSON.stringify(legacyNameservers) ||
      (config["x-mobile-dns"] === MOBILE_DNS_VERSION && JSON.stringify(dns.nameserver) === JSON.stringify(domainNameservers)));
  if (dns["enhanced-mode"] !== "redir-host" && !legacyMobileDns) return;
  const domestic = dns["direct-nameserver"];
  if (!Array.isArray(domestic) || !domestic.length) return;
  // Paused clients keep their DNS sockets; do not let the two apps share this listener.
  if (dns.listen === "127.0.0.1:1053" || (legacyMobileDns && dns.listen === "127.0.0.1:10053")) {
    dns.listen = MOBILE_CLIENT === "Bettbox" ? "127.0.0.1:10053" : "127.0.0.1:1053";
  }
  dns["enhanced-mode"] = "fake-ip";
  dns["fake-ip-range"] = dns["fake-ip-range"] || "198.18.0.1/15";
  dns["fake-ip-filter"] = unique(["rule-set:" + NS + "private", "rule-set:" + NS + "geolocation-cn", ...(dns["fake-ip-filter"] || [])]);
  // Avoid the hostname-target certificate mismatch observed through the Bettbox node.
  // Both IP endpoints retain normal certificate verification against their IP SANs.
  dns.nameserver = MOBILE_CLIENT === "Bettbox" ? [
    "https://9.9.9.10/dns-query#" + mainName,
    "https://94.140.14.140/dns-query#" + mainName,
  ] : domainNameservers;
  dns["nameserver-policy"] = { ["rule-set:" + NS + "geolocation-cn"]: domestic, ...(dns["nameserver-policy"] || {}) };
  config["x-mobile-dns"] = MOBILE_DNS_VERSION;
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
