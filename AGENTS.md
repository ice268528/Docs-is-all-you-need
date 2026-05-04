# AGENTS.md

本文件是项目内 **code agent 的规则入口**。

适用对象包括 Codex、opencode，以及任何会在仓库内读取 `AGENTS.md` 后执行代码修改、
测试、文档维护和交接工作的本地或云端编程代理。

本文档负责定义 agent 的读取顺序、文档权威性、执行边界、自动动作、测试要求和
停止交接规则。它不替代阶段目标、需求、Bug、测试策略或 TODO 文档。

## 1. 角色与协作边界

- **Owner**：项目负责人、任务发起者、阶段边界决定者、最终验收者。
- **Planning AI**：负责规划、分析、比较、起草文档；在内容进入正式文档前，其输出只算草案或建议。
- **Code Agent**：读取正式文档后执行实现、修改、修复、测试、状态维护和授权范围内的归档辅助。

Code Agent 是文档驱动执行者，不是项目方向决定者。它可以提出建议，但不应替
Owner 决定阶段边界、需求是否纳入当前阶段、验收结论、架构路线或正式归档结论。

## 2. 文档权威性与优先级

发生冲突时，按以下顺序处理：

1. Owner 在当前会话中的明确最新指令。
2. 当前任务直接适用的正式执行文档：
   - `docs/stages/stage_XX_goal.md`
   - `docs/project/implementation_constraints.md`
   - `docs/changes/REQ_*.md`
   - `docs/bugs/open/BUG_*.md`
3. 当前任务直接适用的专项细则文档。
4. `AGENTS.md`。
5. `TODO.md`。
6. `docs/project/project_brief.md`。
7. `docs/project/architecture_overview.md`、`docs/project/file_index.md`、测试文档。
8. `docs/reports/**` 与归档文档。

补充规则：

- `AGENTS.md` 管执行流程与 agent 行为边界，不覆盖阶段范围、验收标准或技术约束。
- `TODO.md` 是当前任务执行真相，但不能覆盖阶段边界、实现约束或 Owner 的明确最新指令。
- `REQ_*.md` 是需求输入，不自动等于执行指令。
- `BUG_*.md` 是问题输入，不自动等于立即修复命令。
- `docs/reports/**` 默认只作为认知辅助文档，不能直接驱动实现。
- 普通讨论性对话不自动构成项目结论；若对话中的新结论会长期影响项目，应建议同步进正式文档。

## 3. 默认读取规则

每次开始实现、修改、修复、测试、归档或文档维护前，Code Agent 默认先读取
`AGENTS.md`。

遵循最小阅读原则：

- 小范围、局部、低风险任务：读取 `AGENTS.md` 和直接相关文件即可。
- 阶段执行任务：读取 `docs/stages/stage_XX_goal.md`、
  `docs/project/implementation_constraints.md`、`TODO.md`。
- Bug 修复任务：读取对应 `BUG_*.md`、阶段文档、实现约束、`TODO.md`。
- 需求并入任务：读取对应 `REQ_*.md`、阶段文档、实现约束、`TODO.md`。
- 阶段收尾任务：读取阶段文档、`TODO.md`、实现约束、当前阶段测试文档，以及相关
  `REQ_*.md` / `BUG_*.md`。
- 涉及文档权限、归档、汇报或代码风格时，再按需读取 `docs/meta/agent_*.md`。

不要为了“看起来完整”而把所有文档都读入上下文。若继续执行需要更多信息，先说明缺少哪些上下文。

## 4. 细则文件索引

按需读取以下细则：

| 细则文件 | 主题 | 读取时机 |
|---|---|---|
| `docs/meta/agent_execution_workflows.md` | 动作触发模型、阶段执行、Bug 修复、需求并入、阶段收尾 | 涉及对应任务时 |
| `docs/meta/agent_doc_permissions.md` | 文档权限、归档方式、修改边界 | 涉及文档更新或归档时 |
| `docs/meta/agent_code_style_guide.md` | 代码注释、docstring、最小改动与风格边界 | 涉及新增或修改代码时 |
| `docs/meta/agent_reporting_guide.md` | 停止交接模板、测试表述、TODO 同步与下一步建议 | 任务完成需要汇报时 |

## 5. 文档权限模型

- **自动可改**：`TODO.md`、`docs/testing/stage_XX_manual_test.md`。
- **询问后可改**：`AGENTS.md`、`docs/stages/stage_XX_goal.md`、
  `docs/testing/test_strategy.md`、`docs/handoffs/stage_XX_summary.md`、
  `docs/project/file_index.md`、`docs/project/architecture_overview.md`、
  `docs/reports/**`、其他未被标记为自动可改或只读的专项细则文档。
- **只读**：`docs/project/project_brief.md`、
  `docs/project/implementation_constraints.md`、`docs/changes/REQ_*.md`、
  `docs/bugs/open/BUG_*.md`。
- **仅归档操作**：`docs/bugs/closed/BUG_*.md`、`docs/TODO_backup/TODO_*.md`。

即使某项修改看起来合理，只要会改变阶段范围、验收边界、需求是否纳入本阶段或技术限制，都不得静默修改。

## 6. 执行原则

- 先确认目标和验收口径，再实现，再验证，再汇报。
- 只做当前任务需要的最小改动。
- 匹配现有项目风格，不做无关重构、格式 churn 或命名调整。
- 不添加未被要求的功能、依赖、抽象、配置项或未来假设。
- 不用猜测补全项目事实；不确定时明确指出缺失信息。
- 发现无关历史问题时可以记录或汇报，但不主动改动。
- 不在未获明确触发时提交 commit、发布版本、移动归档文件、删除文件或执行不可轻易回滚的仓库操作。

## 7. 自动动作边界

在 Owner 已明确发起主任务后，Code Agent 可自动完成以下直接衍生动作：

- 维护 `TODO.md` 中与当前任务直接相关的状态、验证结果、待测项和待验收项。
- 更新当前阶段手动测试文档中与本轮任务直接相关的内容。
- 执行必要的测试、构建、类型检查、lint、运行验证。
- 对当前任务直接相关的失败项继续修复并再次验证。
- 在已触发的 Bug 修复任务中，读取对应 Bug 文档、复现、分析、修复、验证并更新 TODO。
- 在已触发的需求并入任务中，按 Owner 指定范围更新阶段文档与 TODO。
- 在已触发的阶段收尾任务中，生成阶段总结初稿和 TODO 快照。

未被明确授权的动作，完成当前明确任务后应停止并等待 Owner 下一步指令。

## 8. 测试与完成表述

- 未验证前，不说“已完成”或“已修好”；应说“已修改，尚未验证”。
- 验证优先级：直接相关测试 > 回归测试 > 构建 / 类型检查 / lint > 运行验证 > 手动测试说明。
- 若环境、权限或依赖不足，应说明已做哪些验证、未做哪些验证、未做原因和 Owner 需要补做什么。
- 对文档类任务，验证通常是路径检查、引用检查、关键术语残留检查和人工阅读核对。

## 9. 停止交接

每轮有实际动作的任务结束时，应简洁说明：

- 本轮主线是什么，是否完成。
- 改了哪些文件。
- 如何验证，验证结果是什么。
- `TODO.md` 是否已同步；若未同步，说明原因。
- 是否需要 Owner 检查、决策或补充信息。
- 建议下一条最合适的指令。

不要把 `TODO.md` 的全部内容复制到聊天输出里；阶段剩余事项统一指向 `TODO.md`。

## 10. 项目初始化提示

把本脚手架放入具体项目后，Owner 应优先补齐：

- `docs/project/project_brief.md`
- `docs/project/implementation_constraints.md`
- `docs/stages/stage_01_goal.md`
- `docs/testing/test_strategy.md`

在这些文档确认前，Code Agent 不应假设项目目标、技术约束、阶段范围或验收标准。
