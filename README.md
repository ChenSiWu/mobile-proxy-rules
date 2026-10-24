# 手机代理全量分流

以 [MyClash 全量版](https://github.com/AIsouler/MyClash/blob/0c7a93ae424aefda5c44d781a05607490ed3dca1/Script/mihomoScript.js) 的服务目录为基础，复用规则数据，只增加必要的手机订阅和客户端适配。不是直接运行上游重建整份配置的 `main()`，也不是单独维护一份越来越长的静态域名表。

## 使用文件

- Bettbox：`Bettbox/mobile-full.js`，一个全局脚本，根据原配置结构识别订阅。
- FlClash：`FlClash/mobile-full.js`，按订阅绑定同一份脚本。
- `共享核心/`：两份发布文件的唯一维护源。修改后运行 `node 共享核心/build.cjs`，不直接改生成文件。

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
- 复用全量版 21 个非 Steam 服务分类，另细分 ChatGPT / Codex、Claude、Gemini、Grok、Perplexity。AI 子组跟随 AI 组，保留 AI 组独立出口的作用。
- 国内及私有网络直连；具体服务域名优先于宽泛 IP 规则，最后只有一个 MATCH。
- Ikuuu 的旧通用海外、国内和广告大列表由统一 provider 替换；原哔哩哔哩、动画疯、OneDrive、学术等专门例外保留。不叠加两套完整规则。
- 不新增桌面游戏、macOS 进程或 Apple 接力修复。订阅本来已有的特定业务组不会仅为外观统一而删除。
- 广告组新增时默认 PASS（继续后续规则），不擅自开启拦截。FlClash 已有的 Ikuuu 广告组继续保留自身选项和有效选择。
- 不增加负载均衡或地区自动辅助组；不动态改组名，不为显示最终节点而修改客户端。

## DNS 和 Android

不覆盖客户端管理的端口、VPN/TUN、IPv6、LAN 或嗅探开关，保留订阅 hosts 和私有 DNS policy。Bettbox 的后置覆写、FlClash 的选定字段 DNS 覆写仍可能影响最终结果，须检查实际运行配置。

仅对已识别的 MNKCloud `redir-host` 源配置做手机 DNS 适配：保留监听、IPv6、节点引导 DNS、原私有 policy 与 hosts；采用 Fake-IP，国内域名使用原有加密直连 DNS，海外 DoQ 和备用 DoT 绑定本订阅主组。此适配来自 Android 实测的 DoH EOF 问题，不等于保证所有节点和所有网络都支持这些上游。不自动关闭 UDP；海外真实解析与 Fake-IP 应答要分别验收。

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
