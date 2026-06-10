# Codex Desktop Marketplace 修复报告

## 问题现象

Owner 在 Codex Desktop 中可以把 `diayn-local-alpha` marketplace 加进去，
但插件列表里找不到可安装的 `diayn` 插件。这个现象说明 marketplace 已经被
识别，但插件 candidate 的布局还没有进入 Codex Desktop 的正确发现面。

## 已确认原因

- 旧的 `plugins/codex` sparse-path 方案不成立，Codex Desktop 会把 manifest 留在
  staging 目录外，报 `marketplace root does not contain a supported manifest`。
- 旧的 repository-root `marketplace.json` candidate 也会和 `.claude-plugin/`
  的内容混在一起，容易让 Codex Desktop 误扫到不该扫的 marketplace 文件。
- 当前正确的 Codex candidate 需要同时保留：
  - `.agents/plugins/marketplace.json`
  - `plugins/diayn/`

## 修复内容

- 新增 `.agents/plugins/marketplace.json`。
- 删除了仓库根目录的旧 `marketplace.json`。
- `plugins/diayn/.codex-plugin/plugin.json` 继续作为 Codex plugin payload。
- Codex Desktop 添加 marketplace 时应使用两行 sparse path：

```text
.agents/plugins
plugins/diayn
```

- 插件身份保持为 `diayn@diayn-local-alpha`。

## 未影响的部分

本次修复不修改：

- Claude Code plugin 路径；
- workflow skills；
- dependency skills；
- project-local fallback；
- `CLAUDE.md` / `AGENTS.md` 的入口语义。

## 验证结论

静态 validator 已更新为校验 `.agents/plugins/marketplace.json` + `plugins/diayn/`。
当前本地只能确认 candidate 布局已经改对，但 Codex Desktop runtime discovery /
invocation 仍需要 Owner 重新安装并实际验证。
