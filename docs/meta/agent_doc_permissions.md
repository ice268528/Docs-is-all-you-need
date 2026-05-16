# Agent 文档权限细则

> 本文件定义 agent-entry-file-first 项目中各类文档的权限级别、归档方式与修改边界。

## 1. 权限级别

- **自动可改**：Coding Agent 可在当前任务范围内直接更新正文。
- **询问后可改**：Coding Agent 可提出修改或生成初稿；修改已确认版本前，应说明范围并等待 Owner 确认。
- **只读**：Coding Agent 可读取、引用、总结、提出建议，但不得修改正文。
- **仅归档操作**：Coding Agent 只能在明确触发后创建快照、移动归档或保存历史副本。

## 2. 文档权限表

| 文档 | 权限 | 说明 |
|---|---|---|
| Agent entry file | 询问后可改 | 影响所有 agent 后续行为，默认名可为 `AGENTS.md`，也可按工具约定改为 `CLAUDE.md` 等 |
| `TODO.md` | 自动可改 | 当前任务看板，记录当前阶段、Batch、任务状态、OwnerGate 摘要、ready_for_e2e 与下一步 |
| `docs/testing/stage_XX_manual_test.md` | 自动可改 | 与当前阶段直接相关的手动测试说明 |
| active task board / worklog / owner_questions | 自动可改 | 由 `docs/templates/**` 复制到当前已授权 stage / batch / handoff 目录或项目约定位置后的实例文件 |
| `docs/meta/**` | 询问后可改 | 规则类文档，影响长期协作方式 |
| `docs/templates/**` | 询问后可改 | 通用模板体系，影响后续实例化结构 |
| `docs/stages/stage_XX_goal.md` | 询问后可改 | 阶段边界与验收标准，必须保持 Owner 可控 |
| `docs/testing/test_strategy.md` | 询问后可改 | 测试策略与验收最低要求 |
| `docs/handoffs/stage_XX_summary.md` | 询问后可改 | 阶段收尾时可生成初稿，确认后再改需询问 |
| `docs/project/file_index.md` | 询问后可改 | 可由 agent 初稿维护，但结构变化需说明 |
| `docs/project/architecture_overview.md` | 询问后可改 | 架构认知文档，不能静默改变系统边界 |
| `docs/reports/**` | 询问后可改 | 报告是认知辅助，默认不直接驱动执行 |
| `docs/project/project_brief.md` | 只读 | 项目目标、范围、非目标 |
| `docs/project/implementation_constraints.md` | 只读 | 长期技术与实现硬约束 |
| `docs/changes/REQ_*.md` | 只读 | 需求输入，不自动等于执行指令 |
| `docs/bugs/open/BUG_*.md` | 只读 | 缺陷输入和验收依据，不直接修改正文 |
| `docs/bugs/closed/BUG_*.md` | 仅归档操作 | 已关闭 Bug 的历史记录 |
| `docs/TODO_backup/TODO_*.md` | 仅归档操作 | TODO 历史快照 |

## 3. 归档规则

- Bug 文档归档采用 **move**：验收通过后从 `docs/bugs/open/` 移动到 `docs/bugs/closed/`。
- `TODO.md` 归档采用 **snapshot**：阶段收尾时生成 `docs/TODO_backup/TODO_YYYYMMDD_HH.md`。
- `REQ_*.md` 默认原位保留在 `docs/changes/`，作为需求来源记录。

## 4. 禁止静默修改的内容

即使文档处于“询问后可改”，以下内容也必须等待 Owner 明确确认：

- 阶段范围、交付项、验收标准。
- 需求是否纳入当前阶段。
- 技术栈、依赖、架构、安全或部署硬约束。
- 自动动作范围和 agent 权限。
- 是否关闭 Bug、是否阶段收尾、是否进入下一阶段。
