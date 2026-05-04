# 项目文档协作总纲

> 适用于 Owner / Planning AI / Code Agent 的 AGENTS.md-first 文档脚手架。

## 1. 文档定位

本文档定义项目文档体系的分层、职责、权限与协作方式，供人类 Owner、规划型 AI
和依赖 `AGENTS.md` 的 code agent 共用。

本文档回答 4 个问题：

- 项目文档怎么分层。
- 每类文档分别负责什么。
- 哪些文档是执行真相，哪些文档是辅助文档。
- Code Agent 对不同文档拥有什么权限。

本文档不替代 `AGENTS.md`、`TODO.md`、阶段目标、需求、缺陷、测试或交接文档。

## 2. 角色定义

- **Owner**：项目负责人、最终决策者、最终验收者。
- **Planning AI**：负责规划、分析、比较、起草、整理；输出进入正式文档前只算草案。
- **Code Agent**：读取 `AGENTS.md` 与正式任务文档后，负责实现、修改、测试、状态维护和授权范围内的归档辅助。

## 3. 核心原则

### 3.1 `AGENTS.md` 是 agent 规则入口

所有 code agent 的项目级执行规则，都应收敛到 `AGENTS.md`。不同工具可以有自己的系统约束，
但在本仓库内的读写顺序、文档权限、测试与交接规则，应以 `AGENTS.md` 为入口。

### 3.2 `TODO.md` 是当前执行真相

当前阶段的任务拆解、执行顺序、进行中状态、待测试项、已验收项，以 `TODO.md` 为准。
阶段范围与验收边界仍以 `stage_XX_goal.md` 为准；技术与实现约束仍以
`implementation_constraints.md` 为准。

### 3.3 正式文档优先于聊天

聊天可以提出想法，但只有进入正式文档后，内容才应作为可持续流转的项目事实。
Owner 在当前会话中的明确最新指令立即生效；若它会长期影响项目规则，应再同步回正式文档。

### 3.4 报告默认不直接驱动执行

`docs/reports/**` 下的文档属于认知辅助文档。若报告结论要进入执行，必须再写入：

- `docs/stages/stage_XX_goal.md`
- `docs/changes/REQ_*.md`
- `docs/bugs/open/BUG_*.md`
- `TODO.md`

### 3.5 阶段边界显式化

当前阶段做什么、不做什么、交付什么、如何验收，应写清楚在阶段文档中。

### 3.6 现行与归档分离

当前协作依赖现行文档；旧 TODO、已关闭 Bug、阶段总结等进入归档或交接目录。

归档方式应显式：

- Bug 文档采用 **move**：验收通过后从 `open/` 移动到 `closed/`。
- `TODO.md` 采用 **snapshot**：阶段收尾时生成 `TODO_backup` 快照，`TODO.md` 继续作为现行文档。
- `REQ_*.md` 默认原位保留在 `docs/changes/`，作为需求输入与历史来源记录。

### 3.7 不确定先确认

若 Code Agent 对任务边界、文档含义、需求归属、阶段范围、技术约束、验收标准、
归档方式或下一步动作不清楚，必须先与 Owner 确认，不得基于猜测静默选择。

## 4. Agent 权限级别

- **自动可改**：Code Agent 可直接更新正文。
- **询问后可改**：Code Agent 可生成初稿或提出修改；若文档已被 Owner 确认，后续修改前应先说明范围并等待确认。
- **只读**：Code Agent 可读取、引用、提出建议，但不改正文。
- **仅归档操作**：Code Agent 可在明确触发后创建快照、移动归档或保存历史副本，不把归档文档当作活文档继续维护。

具体权限见 `docs/meta/agent_doc_permissions.md`。

## 5. 推荐目录骨架

```text
/AGENTS.md
/TODO.md
/docs/
  meta/
    docs_framework_overview.md
    collaboration_workflow_guide.md
    agent_execution_workflows.md
    agent_doc_permissions.md
    agent_code_style_guide.md
    agent_reporting_guide.md
  project/
    project_brief.md
    implementation_constraints.md
    file_index.md
    architecture_overview.md
  stages/
    stage_XX_goal.md
  changes/
    REQ_YYYYMMDD_xxx.md
  testing/
    stage_XX_manual_test.md
    test_strategy.md
  bugs/
    open/
      BUG_YYYYMMDD_xxx.md
    closed/
      BUG_YYYYMMDD_xxx.md
  handoffs/
    stage_XX_summary.md
  TODO_backup/
    TODO_YYYYMMDD_HH.md
  reports/
    analysis/
    comparison/
    survey/
    summary/
```

## 6. 文档清单

| 文档 | 作用 | 作者/维护方式 | 目标对象 | Agent 权限 |
|---|---|---|---|---|
| `AGENTS.md` | code agent 项目级规则入口 | Owner 主导，agent 可建议 | Code Agent | 询问后可改 |
| `TODO.md` | 当前任务执行真相 | Code Agent 维护 | Owner、Code Agent | 自动可改 |
| `docs/meta/docs_framework_overview.md` | 文档体系总纲 | Owner 主导 | Owner、Planning AI、Code Agent | 询问后可改 |
| `docs/meta/collaboration_workflow_guide.md` | 协作动作说明 | Owner 主导 | Owner、Planning AI、Code Agent | 询问后可改 |
| `docs/meta/agent_execution_workflows.md` | agent 执行流程细则 | Owner 主导，agent 可建议 | Code Agent | 询问后可改 |
| `docs/meta/agent_doc_permissions.md` | 文档权限细则 | Owner 主导 | Code Agent | 询问后可改 |
| `docs/meta/agent_code_style_guide.md` | 代码书写与修改边界 | Owner 主导 | Code Agent | 询问后可改 |
| `docs/meta/agent_reporting_guide.md` | 停止交接与测试表述 | Owner 主导 | Code Agent | 询问后可改 |
| `docs/project/project_brief.md` | 项目目标与范围 | Planning AI 起草，Owner 定稿 | Owner、Planning AI、Code Agent | 只读 |
| `docs/project/implementation_constraints.md` | 技术与实现约束 | Planning AI 起草，Owner 定稿 | Code Agent | 只读 |
| `docs/stages/stage_XX_goal.md` | 阶段目标与边界 | Planning AI 起草，Owner 定稿 | Owner、Code Agent | 询问后可改 |
| `docs/changes/REQ_*.md` | 新增需求输入 | Planning AI 起草，Owner 确认 | Owner、Code Agent | 只读 |
| `docs/bugs/open/BUG_*.md` | Bug 输入与验收依据 | Owner 主导 | Owner、Code Agent | 只读 |
| `docs/testing/test_strategy.md` | 测试策略 | Owner 主导 | Owner、Code Agent | 询问后可改 |
| `docs/testing/stage_XX_manual_test.md` | 手动测试说明 | Code Agent 生成维护 | Owner | 自动可改 |
| `docs/handoffs/stage_XX_summary.md` | 阶段交接摘要 | Code Agent 初稿，Owner 确认 | Owner、后续 agent | 询问后可改 |
| `docs/reports/**` | 分析、对比、调查、总结 | 按任务生成 | Owner、Planning AI | 询问后可改 |

## 7. 最小可用集合

一个新项目至少需要：

- `AGENTS.md`
- `TODO.md`
- `docs/project/project_brief.md`
- `docs/project/implementation_constraints.md`
- `docs/stages/stage_01_goal.md`
- `docs/testing/test_strategy.md`

其他文档按需求、Bug、阶段收尾和复盘需要逐步补齐。
