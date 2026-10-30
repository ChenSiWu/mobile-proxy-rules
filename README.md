# 手机代理全量分流

以 [MyClash 全量版](https://github.com/AIsouler/MyClash/blob/0c7a93ae424aefda5c44d781a05607490ed3dca1/Script/mihomoScript.js) 的服务目录为基础，复用规则数据，只增加必要的手机订阅和客户端适配。不是直接运行上游重建整份配置的 `main()`，也不是单独维护一份越来越长的静态域名表。

## 使用文件

- Bettbox：`Bettbox/mobile-full.js`，一个全局脚本，根据原配置结构识别订阅。
- FlClash：`FlClash/mobile-full.js`，按订阅绑定同一份脚本。
- `共享核心/`：共同分流逻辑与服务目录；`FlClash/group-layout.js` 只整理 FlClash 的选择入口。修改后运行 `node 共享核心/build.cjs`，不直接改生成文件。FlClash 布局改动不进入 Bettbox 发布文件。

脚本接口为 `main(config)`。未知订阅透传，不猜测它的主组、不覆盖其原规则。当前识别 MNKCloud、Ikuuu 及具有原始四个节点分类的 Qianlink 配置。识别失效时应检查服务商是否改了结构，不以网页能打开冒充增强仍生效。

## 三套远程脚本

两个客户端可以保留以下三项，使用时只选择一项，不串联执行：

| 手机中的名称 | 远程来源 | 用途 |
| --- | --- | --- |
| `Mobile-Full-Custom` | 本仓库的 [Bettbox 版](https://raw.githubusercontent.com/ChenSiWu/mobile-proxy-rules/main/Bettbox/mobile-full.js) / [FlClash 版](https://raw.githubusercontent.com/ChenSiWu/mobile-proxy-rules/main/FlClash/mobile-full.js) | 手机适配版，作为日常主用 |
| `MyClash-Lite-Official` | [MyClash 官方精简版](https://raw.githubusercontent.com/AIsouler/MyClash/main/Script/Script.js) | 保留官方原始代码，作为备选 |
| `MyClash-Full-Official` | [MyClash 官方全量版](https://raw.githubusercontent.com/AIsouler/MyClash/main/Script/mihomoScript.js) | 保留官方原始代码，作为备选 |

官方两项直接跟随上游地址，不在本仓库复制维护，也不套用我们的订阅适配。远程脚本下载后由客户端保存在内部；普通订阅刷新不等于更新脚本，更新脚本应使用其菜单中的“同步”。不能把“远程”理解成已经启用自动定时更新。

- **Bettbox 切换**：配置 → 覆写脚本，选择需要的一项。它是全局脚本，影响开启“使用全局脚本覆写”的订阅；需要原样保留规则的订阅可单独关闭该选项。
- **FlClash 切换**：配置 → 对应订阅的菜单 → 扩展 → 脚本，选择三项之一。选择按订阅保存，不会自动改变其他订阅的绑定。
- **同步不等于兼容验收**：官方脚本会重建分组、处理节点名称并调整 DNS/TUN；含 `proxy-providers` 的输入会被官方原版拒绝。不能保证换回后当前手选、DNS 行为或所有订阅例外原样沿用。切换后先核对主组、节点、国内/海外规则与真实 DNS，再长期使用；上游也要求关闭客户端 DNS 覆写。
- 官方原版可能生成 Steam 等分组，这是上游自身行为；不应把我们的手机裁剪逻辑描述成官方版也有。

## 分组和规则

- 保留原节点名和参数，节点及套餐提示动态读取，不跨订阅混池。
- 主组可直接手选，另有全节点自动选择和真正的 `fallback` 故障转移；提示不参加自动测速。
- 业务组默认跟随主组，可独立选地区或单个节点。Bettbox 保留已有的“默认代理 / 手动选择”路径，避免重置已有有效手选。
- FlClash 主组本身就是手动选择器，同时可选择自动、故障转移、地区及单节点。不再额外生成“手动选择”和高/低倍率组；业务组保留跟随主组、地区、单节点及直连，不重复列出全局手动、自动或故障转移入口。AI 子组仍可跟随 AI 父组。
- FlClash 套餐提示在订阅页查看，不作为主组/业务组的可选出口；节点原名、倍率和参数不改。若原订阅规则、DNS、拨号链或特殊组确实引用旧组，则仅保留隐藏的兼容组，不新增可选入口。
- FlClash 从旧布局升级时，先读取客户端实际选择；如果业务当前选中了将移除的入口，须迁移到同一有效出口并复核，不能靠重排候选自动猜测。未使用旧入口的选择应保持不变。此布局优化不改规则、rule-provider、DNS、VPN 或订阅内容。
- 复用全量版 21 个非 Steam 服务分类，另细分 ChatGPT / Codex、Claude、Gemini、Grok、Perplexity。AI 子组跟随 AI 组，保留 AI 组独立出口的作用。
- 国内及私有网络直连；具体服务域名优先于宽泛 IP 规则，最后只有一个 MATCH。
- Ikuuu 的旧通用海外、国内和广告大列表由统一 provider 替换；原哔哩哔哩、动画疯、OneDrive、学术等专门例外保留。不叠加两套完整规则。
- 不新增桌面游戏、macOS 进程或 Apple 接力修复。订阅本来已有的特定业务组不会仅为外观统一而删除。
- 广告组新增时默认 PASS（继续后续规则），不擅自开启拦截。FlClash 已有的 Ikuuu 广告组继续保留自身选项和有效选择。
- 不增加负载均衡或地区自动辅助组；不动态改组名，不为显示最终节点而修改客户端。

## DNS 和 Android

不覆盖客户端管理的端口、VPN/TUN、IPv6、LAN 或嗅探开关，保留订阅 hosts 和私有 DNS policy。Bettbox 的后置覆写、FlClash 的选定字段 DNS 覆写仍可能影响最终结果，须检查实际运行配置。

仅对已识别的 MNKCloud `redir-host` 源配置及本脚本的旧 DNS 输出做窄适配：采用 Fake-IP，保留 IPv6、原加密国内 DNS、加密节点引导、私有 policy 与 hosts，不新增公网明文 DNS 或关闭证书校验。海外使用 Quad9 无拦截版与 AdGuard 不过滤版 DoH，并显式绑定本订阅主组；两条上游是并发竞速，不是先后回退。

- FlClash 使用 `https://dns10.quad9.net/dns-query` 和 `https://unfiltered.adguard-dns.com/dns-query`。
- Bettbox 使用对应的 `https://9.9.9.10/dns-query` 和 `https://94.140.14.140/dns-query`，保留正常 IP SAN 证书校验。实测当前 AnyTLS 节点的域名目标路径返回不匹配证书，而相同 DNS SNI 下仅把代理目的地址换为 IP 即正常；不能据此笼统归因客户端 DNS、bootstrap 或外层 TLS。不能通过跳过证书校验解决此类错误。
- 已知默认监听 `127.0.0.1:1053` 在 Bettbox 改为 `127.0.0.1:10053`，FlClash 保持 `127.0.0.1:1053`。暂停的客户端仍可能持有 DNS socket，需避免抢占。自定义监听地址、其他订阅 DNS 与两个官方脚本不强制改写，不能保证任意两份配置都能同时启动。
- `lan/local/localhost/home.arpa` 仍交给系统处理，属于局域网例外，可能使用本地网络的未加密 DNS；不把它描述成所有 DNS 都已加密。Android VPN 的 DNS 接管、真实海外解析与 Fake-IP 应答必须分别实测；加密 DNS 不等于全应用、全网络无泄漏保证。

2026-10-30 的修订替代此前仅在部分节点成功的 DoQ/DoT 方案。不自动关闭 UDP、不照搬桌面参数，也不为修复不可用节点而把海外 DNS 改走直连。

Qianlink 的原节点分类和 WiFi Call 例外不强加给其他订阅；本脚本不擅自改其原 DNS。无有效订阅或节点到期时，仅能验证配置结构。

## 更新

1. **节点**：按各客户端原订阅地址和周期更新；每次重新渲染时动态读取新节点。不要把订阅 YAML 改成脚本生成的固定节点清单。
2. **规则数据**：HTTP MRS provider 使用上游地址，`interval: 86400`。已有可用缓存或 Bettbox 内置规则不代表本轮已经成功下载最新版。
3. **脚本逻辑**：维护者对比上游 revision，合并需要的目录或兼容改动，重新生成、验证后发布。手机在脚本菜单选择“同步”；不能假定客户端支持定时更新脚本。
4. 使用本仓库对应客户端的稳定 raw 链接，不用 MyClash 原版链接覆盖定制脚本。不把带 commit SHA 的固定版本链接当作自动跟进链接。

## 回退与隐私

原始订阅不改。解除 FlClash 的脚本绑定或关闭 Bettbox 全局脚本，可恢复原订阅架构；原主组与增强组名不同时，还应核对其有效选择。要使用 Bettbox Lite，应选择保留的 `MyClash-Lite-Official`，而非用整包覆盖客户端数据。远程同步后的上游代码可能已变化；精确回退应使用已经核验的版本，不能假定当前上游永远等于此前版本。

仓库只收录维护代码、生成脚本和公开使用说明。订阅 URL、密码、UUID、完整配置、设备记录、运行截图及本地回退资料禁止上传；不使用第三方订阅转换站。

## 上游

MyClash 服务目录锁定于 `0c7a93ae424aefda5c44d781a05607490ed3dca1`，MIT。MRS 来自上游公开的 bett-rules / Emby 规则地址。服务数据的覆盖范围和下载可用性由相应上游维护，不以规则数量评价效果。
