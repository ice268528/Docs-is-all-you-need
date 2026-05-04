# Claude Code 文档权限细则

> 本文件定义各文档的权限级别、归档方式与修改边界。
> 读取时机：当任务涉及文档更新、归档或权限边界判断时，按需读取。

## 1. 文档权限与更新规则

- **自动可改**：`/TODO.md`、`/docs/testing/stage_XX_manual_test.md`
- **询问后可改**：`/CLAUDE.md`、`/docs/stages/stage_XX_goal.md`、`/docs/testing/test_strategy.md`、`/docs/handoffs/stage_XX_summary.md`、`/docs/project/file_index.md`、`/docs/project/architecture_overview.md`、`/docs/reports/**`、其他未被标记为自动可改或只读的专项细则文档
- **只读**：`/docs/project/project_brief.md`、`/docs/project/implementation_constraints.md`、`/docs/changes/REQ_*.md`、`/docs/bugs/open/BUG_*.md`
- **仅归档操作**：`/docs/bugs/closed/BUG_*.md`、`/docs/TODO_backup/TODO_*.md`
- `REQ_*.md` 默认保留在 `/docs/changes/` 作为需求输入与历史来源记录，不通过移动目录方式归档。
- Bug 文档归档采用 **move**：验收通过后从 `open/` 移动到 `closed/`；`TODO.md` 归档采用 **snapshot**：阶段收尾时生成 `TODO_backup` 快照，`/TODO.md` 继续保留为现行工作文档。
- 即使某项修改看起来合理，只要它会改变阶段范围、验收边界、需求是否纳入本阶段或技术限制，都不得静默修改，必须等待 yiyi 明确指令。
- 对于 `stage_XX_summary.md` 这类“询问后可改”文档：若 yiyi 已明确触发对应主任务（如阶段收尾），Claude Code 可自动生成或更新初稿；若文档已被 yiyi 审阅确认，后续再次修改需重新确认。
