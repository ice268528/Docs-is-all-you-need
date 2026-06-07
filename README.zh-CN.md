# Docs-is-all-you-need

[English](README.md)

Docs-is-all-you-need，简称 DIAYN，是一个面向多会话 coding agent 协作的文档驱动 workflow skill pack。它帮助 Owner 和多个 coding-agent 会话围绕需求、计划、分工、审查、同步、集成和最终验收协作，避免项目事实在多轮对话里漂移。

## 快速开始

### Claude Code 插件安装

这是推荐的 Claude Code 安装路径。

把下面两行复制到 Claude Code 里执行：

```text
/plugin marketplace add ice268528/Docs-is-all-you-need
/plugin install diayn@diayn-local-alpha
```

初始化项目，或让 agent 帮你澄清一个模糊想法：

```text
/diayn:init
```

插件安装使用 `diayn` 命名空间，所以命令形式是 `/diayn:<command>`。

这个 plugin 安装会注册 12 个 DIAYN workflow skills，也会注册内置的
DIAYN-managed `agent-skills` dependency skills。用户主入口是 12 个
`/diayn:*` commands；workflow skills 保持后台 native-callable，但在 plugin
模式下不作为裸 `/diayn-*` 用户入口显示。在 Claude Code 里，`/diayn:init`
会创建或更新 `CLAUDE.md`，不默认创建 `AGENTS.md`。
`CLAUDE.md` 和 `AGENTS.md` 是不同平台的平级入口文件，不是互相 wrapper
的关系。

### Claude Project-Local Fallback

只有当你明确需要在目标项目里使用裸 `/diayn-*` 命令时，才使用这条路径。

从克隆下来的 DIAYN 仓库或 release package，把 fallback package 复制到目标项目：

```powershell
$target = "E:\path\to\target-project"
Copy-Item -Path .\packages\claude-project-local\.claude -Destination $target -Recurse -Force
Copy-Item -Path .\packages\claude-project-local\.diayn -Destination $target -Recurse -Force
```

然后从这个命令开始：

```text
/diayn-init
```

这条 fallback 路径同样按 Claude Code 处理，所以 `/diayn-init` 会创建或更新
`CLAUDE.md`。不要把 fallback 成功当成 plugin path 成功的证据。

fallback package 生成在：

```text
packages/claude-project-local/
```

Claude 安装细节见 [docs/install/claude-code.md](docs/install/claude-code.md)。

### Codex

Codex 现在有 package/install 验证，但 Codex Desktop 里的运行时命令发现仍需要单独人工证据。

在本仓库根目录先 dry-run：

```powershell
node maintainers\scripts\install_codex_project_local_package.js --target-codex-home $env:USERPROFILE\.codex
```

确认后执行安装：

```powershell
node maintainers\scripts\install_codex_project_local_package.js --target-codex-home $env:USERPROFILE\.codex --execute
```

Codex init 使用 `AGENTS.md`，不默认创建 `CLAUDE.md`。
`AGENTS.md` 是 Codex / OpenCode / generic 入口文件，不是对 `CLAUDE.md` 的
包装。

## 命令

| Workflow | Claude plugin | Project-local fallback | 底层 skill |
| --- | --- | --- | --- |
| 初始化 / 改造 | `/diayn:init` | `/diayn-init` | `diayn-init` |
| 计划 | `/diayn:plan` | `/diayn-plan` | `diayn-plan` |
| worktree 准备 | `/diayn:worktrees` | `/diayn-worktrees` | `diayn-worktrees` |
| 后端 lane | `/diayn:backend` | `/diayn-backend` | `diayn-backend` |
| 前端 lane | `/diayn:frontend` | `/diayn-frontend` | `diayn-frontend` |
| 后端审查 | `/diayn:review-backend` | `/diayn-review-backend` | `diayn-review-backend` |
| 前端审查 | `/diayn:review-frontend` | `/diayn-review-frontend` | `diayn-review-frontend` |
| 文档/状态同步 | `/diayn:sync` | `/diayn-sync` | `diayn-sync` |
| 集成 | `/diayn:integration` | `/diayn-integration` | `diayn-integration` |
| bug 分流 | `/diayn:bug` | `/diayn-bug` | `diayn-bug` |
| 新阶段 | `/diayn:new` | `/diayn-new` | `diayn-new` |
| HTML 报告 | `/diayn:html` | `/diayn-html` | `diayn-html` |

## 标准流程

```text
/diayn:init
  -> /diayn:plan
  -> /diayn:worktrees
  -> /diayn:backend 和 /diayn:frontend
  -> /diayn:review-backend 和 /diayn:review-frontend
  -> /diayn:sync
  -> /diayn:integration
  -> Owner acceptance
```

Project-local fallback 使用同一套流程，但命令是 `/diayn-init`、`/diayn-plan` 这种裸命令。

## DIAYN 会安装什么

DIAYN 只暴露 12 个公开 workflow skills。它还携带锁定版本的 DIAYN-managed `agent-skills` 依赖，用于在合适场景路由到第三方 specialist skill。这些 dependency skills 不是额外的 DIAYN 公开命令。
这些 dependency skills 是随 DIAYN 安装的 native-callable skills，不是纯文本 routing notes。

`/diayn:init` 会在目标项目里写入 `.diayn/dependency-routing/upstream-routing-map.md`，后续 workflow commands 可以通过这份项目内 routing map 路由到随 DIAYN 安装的 dependency skills，不需要 Owner 另外安装 `agent-skills`。

## 当前状态

| Surface | 状态 |
| --- | --- |
| Claude Code plugin | 主要安装路径。预期命令形式是 `/diayn:<command>`。支持静态 plugin validation；运行时验收请按 QA checklist 验证。 |
| Claude project-local fallback | 保留裸 `/diayn-*` 命令，适合明确需要项目本地命令的场景。它和 plugin install 是分开的。 |
| Codex package/install | 已有 package 形态和安装脚本。还不声明 Codex Desktop 运行时命令发现已经通过。 |
| OpenCode | 延后，直到能证明直接 DIAYN workflow skill invocation。 |

## 维护者文档

| 需要 | 文件 |
| --- | --- |
| 安装真相和支持边界 | [docs/install/README.md](docs/install/README.md) |
| Claude Code 细节 | [docs/install/claude-code.md](docs/install/claude-code.md) |
| 运行时 QA checklist | [docs/qa/claude-plugin-runtime-acceptance.md](docs/qa/claude-plugin-runtime-acceptance.md) |
| 命令行为 | [docs/meta/diayn_command_reference.md](docs/meta/diayn_command_reference.md) |
| 实施计划 | [docs/meta/diayn_v1_implementation_plan.md](docs/meta/diayn_v1_implementation_plan.md) |
