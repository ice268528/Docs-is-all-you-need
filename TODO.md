---
文档定位: "当前任务看板，记录当前阶段、当前 Batch、当前任务状态、OwnerGate 摘要、ready_for_e2e 与下一步。"
作者: "Coding Agent"
目标对象:
  - "Coding Agent"
  - "Owner"
Agent权限: "自动可改"
当前操作者提醒:
  - "本文件只保留当前看板、简短验证摘要和下一步建议，不定义阶段边界。"
  - "阶段范围以 /docs/stages/stage_XX_goal.md 为准；技术限制以 /docs/project/implementation_constraints.md 为准。"
  - "详细任务字段使用 /docs/templates/task_board_template.md。"
  - "长篇执行过程进入 worklog；决策讨论全文进入 owner_questions；阶段交接进入 handoff。"
---

<!-- 本模板用于现行工作文档；不要在这里重写项目背景、阶段目标正文、长期技术约束或完整执行日志。 -->
# TODO

## 1. 当前执行上下文

- 当前阶段：`<此处填写 stage_XX>`
- 当前 Batch：`<此处填写 B-XX-YY / 无>`
- 当前主线：`<此处填写本轮主线>`
- 当前状态：`<todo / doing / auto_verified / owner_gate / ready_for_e2e / accepted / blocked / archived / dropped>`
- 最近更新时间：`<YYYY-MM-DD HH:mm>`
- 当前维护者：`<Coding Agent / Owner>`

## 2. 关联正式文档

- 项目目标：`/docs/project/project_brief.md`
- 实现约束：`/docs/project/implementation_constraints.md`
- 当前阶段目标：`/docs/stages/<stage_XX_goal.md>`
- 当前 Batch：`<复制自 /docs/templates/batch_template.md 的实际 Batch 文档路径；无则写 无>`
- 测试策略：`/docs/testing/test_strategy.md`
- 手动验收说明：`/docs/testing/<stage_XX_manual_test.md；无则写 无>`
- Handoff：`/docs/handoffs/<stage_XX_summary.md 或 batch handoff；无则写 无>`
- Owner Questions：`<复制自 /docs/templates/owner_questions_template.md 的实际文件路径；无则写 无>`
- Worklog：`<复制自 /docs/templates/worklog_template.md 的实际文件路径；无则写 无>`

## 3. 状态约定

状态语义的权威说明见 `/docs/meta/agent_execution_workflows.md`。本看板只使用状态名：
`todo`、`doing`、`auto_verified`、`owner_gate`、`ready_for_e2e`、`accepted`、`blocked`、
`archived`、`dropped`。

兼容说明：历史项目中的 `waiting_Owner_test` / `waiting_verify` 可保留为迁移前状态，但新任务不应默认使用。已自动验证但不需要 Owner 逐项手测的任务，应使用 `auto_verified`。

## 4. 当前任务看板

<!-- TODO 只保留当前看板和一句话验证摘要；任务完整字段请写入实际 task board。 -->

| ID | 状态 | 类型 | 来源 | 标题 | 当前验证摘要 | 下一步 |
|---|---|---|---|---|---|---|
| `T-001` | `<todo>` | `<feature / bugfix / docs / test / chore>` | `<stage / batch / REQ / BUG>` | `<此处填写>` | `<verification + evidence 一句话摘要>` | `<此处填写>` |

## 5. 当前 OwnerGate

<!-- 详细内容进入 owner_questions。 -->

| ID | 状态 | 问题 | 影响范围 | Owner 需要回复 |
|---|---|---|---|---|
| `Q-001` | `<waiting_owner_decision / answered / archived>` | `<此处填写>` | `<阶段 / Batch / Task / contract / schema / API>` | `<请回复的明确指令>` |

## 6. Ready for E2E

| ID | 用户路径 | 包含任务 | 自动验证摘要 | Owner 验收入口 |
|---|---|---|---|---|
| `E2E-001` | `<此处填写用户路径>` | `<T-001, T-002>` | `<auto_verified evidence 摘要>` | `<页面 / 命令 / 环境 / 步骤>` |

## 7. 本轮摘要

- 已完成：`<简短摘要；无则写 无>`
- 已自动验证：`<命令 / 检查 / evidence 摘要；无则写 无>`
- 进入 OwnerGate：`<Q-001 / 无>`
- 进入 ready_for_e2e：`<E2E-001 / 无>`
- 未完成：`<简短摘要；无则写 无>`
- 下一步建议：`<下一条最合适的指令或动作>`

## 8. TODO 职责边界

TODO 只保留：

- 当前阶段。
- 当前 Batch。
- 当前任务看板。
- 当前 OwnerGate 摘要。
- 当前 `ready_for_e2e`。
- 下一步建议。
- 简短验证摘要。

TODO 不保存：

- 长篇执行过程。
- 多轮命令输出。
- 历史任务全部详情。
- 阶段总结正文。
- 决策讨论全文。
- 已归档任务的完整说明。

这些内容分别进入：

- `worklog`：详细执行记录、验证命令、失败尝试、evidence 索引。
- `owner_questions`：Owner 决策、授权、澄清或验收问题。
- `handoff`：阶段或 Batch 交接。
- `archive` 或 `TODO_backup`：历史快照和已归档任务。
