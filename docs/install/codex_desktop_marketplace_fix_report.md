# Codex Desktop Marketplace 修复报告

## 问题现象

Owner 在 Codex Desktop 中可以添加 `diayn-local-alpha` marketplace，但在
插件列表中搜索不到可安装的 `diayn` 插件。技能页能看到 DIAYN skills，但这些
来自目标项目的 `.codex/skills` project-local 安装，不证明 Codex plugin 已经
安装成功。

## 已确认原因

Codex Desktop 当前环境没有可用的 Codex CLI，因此本次判断以 Codex Desktop 配置、
缓存目录和仓库结构为准。

检查结果显示：

- Codex 配置中只有 `marketplaces.diayn-local-alpha`，没有
  `plugins."diayn@diayn-local-alpha"`，说明 marketplace 被添加了，但插件未安装。
- Codex marketplace 缓存中出现的是仓库里的 Claude marketplace material，例如
  `.claude-plugin/marketplace.json`，而不是 Codex 专用 candidate。
- 旧 Codex candidate 使用 `.agents/plugins/marketplace.json` 指向
  `plugins/diayn/`。这个布局对 Codex Desktop 的“稀疏路径”不友好：如果稀疏路径
  只取 `.agents/plugins`，Codex 只能看到 marketplace manifest，看不到插件
  payload；如果取仓库根目录，Codex 又可能先发现 Claude marketplace material。

因此，旧布局会造成“marketplace 可添加，但插件列表无法解析出 diayn 插件”的状态。

## 修复方案

新增并采用 Codex Desktop 专用 marketplace root：

```text
plugins/codex/
```

该目录现在同时包含 marketplace manifest 和 plugin payload：

```text
plugins/codex/marketplace.json
plugins/codex/plugins/diayn/
plugins/codex/plugins/diayn/.codex-plugin/plugin.json
plugins/codex/plugins/diayn/skills/
```

`plugins/codex/marketplace.json` 中的插件入口保持 Codex marketplace 规范：

```json
{
  "name": "diayn",
  "source": {
    "source": "local",
    "path": "./plugins/diayn"
  }
}
```

这样当 Codex Desktop 使用 `Sparse path: plugins/codex` 时，`./plugins/diayn`
就在同一个 sparse checkout 内，可被解析和安装。

## 未改动的 Claude 功能

本次修复不修改 Claude Code 的核心路径：

```text
.claude-plugin/
.claude/commands/
plugins/docs-is-all-you-need/.claude-plugin/
packages/claude-project-local/
```

旧的 Claude marketplace/plugin 功能不应因本次 Codex 专用 marketplace root 调整而
改变。

## 修复后的 Codex Desktop 测试方式

如果旧的 `diayn-local-alpha` marketplace 已经被添加，需要先删除旧 marketplace
记录并清理旧缓存，否则 Codex Desktop 可能继续使用旧 checkout。

重新添加 marketplace 时使用：

```text
来源：git@github.com:ice268528/Docs-is-all-you-need.git
Git 引用：main
稀疏路径：plugins/codex
```

如果 SSH 不可用，可以使用 HTTPS：

```text
来源：https://github.com/ice268528/Docs-is-all-you-need.git
Git 引用：main
稀疏路径：plugins/codex
```

添加后在插件页把筛选器从 `Built by OpenAI` 切到全部或对应 marketplace，再搜索
`diayn`。预期插件身份是：

```text
diayn@diayn-local-alpha
```

## 当前声明边界

这次修复解决的是 Codex Desktop marketplace candidate 的仓库布局问题。由于本环境
没有 Codex CLI，也不能替 Owner 在 Codex Desktop UI 中完成真实安装，本次不能声明：

- Codex Desktop plugin runtime 已验证；
- `/diayn-*` 在 Codex Desktop 中已经直接可用；
- dependency skills 在 Codex Desktop plugin 模式下已经完成 native invocation。

这些仍需要 Owner 在 Codex Desktop 中重新添加 marketplace、安装插件，并在新会话中
记录发现和调用证据。
