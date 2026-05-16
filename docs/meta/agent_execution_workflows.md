# Agent 执行流程细则

> 本文件定义 Coding Agent 的 Cold Start Check、WIP=1、Batch、OwnerGate、状态体系与标准执行规则。

## 1. 默认动作

Coding Agent 在每轮实现、修改、修复、测试、归档或文档维护前，应默认：

- 读取当前 agent entry file。
- 读取当前任务所需的最小必要文档。
- 执行轻量 Cold Start Check。
- 明确任务主线、成功标准和验证方式。
- 确认当前 Batch 或 Task 没有越过授权范围。
- 在已开始的任务内维护必要状态更新。
- 停止时说明主线、完成情况、验证情况、`TODO.md` 同步情况和下一步建议。

## 2. Cold Start Check

新开的 Coding Agent 会话，不依赖聊天历史，只看仓库，应该能回答：

- 这是什么项目？
- 当前阶段是什么？
- 当前 Batch 或当前任务在哪里？
- 当前任务状态是什么？
- 哪些文档是权威输入？
- 怎么安装、运行、测试？
- 哪些事情不能做？
- 哪些事情必须触发 OwnerGate？
- 当前未解决问题在哪里？

Cold Start Check 是执行前的轻量检查，不要求每次输出完整检查表。若缺失信息不影响当前小任务，可以继续并记录假设；若缺失信息会影响执行边界、验收、验证或授权，应暂停并提出 OwnerGate 或补文档建议。

## 3. Stage / Batch / Task / OwnerGate

- **Stage**：阶段目标，定义当前阶段做什么、不做什么、交付什么、如何验收。
- **Batch**：Owner 一次性授权 Coding Agent 连续推进的一组任务。
- **Task**：具体实现项，必须有目标、验证方式和完成证据。
- **OwnerGate**：必须停下来问 Owner 的决策点。

Owner 明确批准 Batch 后，Coding Agent 可以在 Batch 范围内连续推进、自动验证、修复直接相关失败、同步 TODO / worklog / handoff。

Coding Agent 不能越过 Batch 的“不允许 Agent 自动做”范围。触发 OwnerGate 时必须暂停。Batch 完成后应更新看板、worklog、handoff，并给出下一步建议。

## 4. WIP=1

- 任意时刻只允许一个 Task 或一个 Batch 处于 `doing`。
- 当前任务没有进入 `auto_verified`、`owner_gate`、`ready_for_e2e`、`accepted`、`blocked` 之一前，不得开启下一个任务。
- 不得在实现任务 A 时“顺手”实现任务 B。
- 只有当任务 B 明确包含在当前 Batch 的“允许 Agent 自动做”范围内时，才可以一起推进。
- 发现多个任务都被标记为 `doing` 时，应先收敛状态，不继续扩大实现范围。

## 5. 状态体系

新任务应使用以下状态：

- `todo`：已确认、可开始。
- `doing`：正在执行。
- `auto_verified`：实现已完成，并通过自动测试或本地验证；不需要 Owner 逐项手测。
- `owner_gate`：需要 Owner 决策或授权，不是普通测试。
- `ready_for_e2e`：多个 `auto_verified` 任务组成完整用户路径，等待 Owner 做端到端验收。
- `accepted`：Owner 已验收通过。
- `blocked`：被依赖、环境、权限或决策阻塞。
- `archived`：已进入 worklog、handoff 或 snapshot，不再污染当前看板。
- `dropped`：确认不做、移出当前阶段或被替代。

兼容说明：旧模板或旧任务中若仍有 `waiting_verify` 或 `waiting_Owner_test`，应在下一次整理时迁移。新任务不应默认进入 `waiting_Owner_test`；已自动验证且不需要 Owner 逐项手测的任务，应进入 `auto_verified`。

## 6. OwnerGate

Coding Agent 在以下情况必须停止实现，只能提出问题、选项和推荐默认策略，等待 Owner 明确回复：

1. 改变阶段目标、完成定义、验收标准、范围外事项。
2. 改变长期 contract、schema、API、目录结构、架构路线。
3. 引入新依赖、新服务、新 provider、新模型、新数据库、新部署方式。
4. 调用真实外部 API、真实 LLM provider、读取 secret、执行真实 smoke、发布、删除、迁移或不可逆操作。
5. 当前文档之间存在冲突，继续实现会固化某一种解释。
6. 存在两种以上合理实现路线，且选择会影响后续扩展成本。
7. 自动测试无法覆盖关键正确性，只能靠 Owner 判断。
8. 需求表达不清，继续做会导致返工。
9. 当前任务从“如何实现”变成“是否应该继续做”的产品或架构判断。
10. Owner 明确标记为待决策、待验收、待授权的事项。

OwnerGate 输出格式：

```md
## OwnerGate 请求

- 触发原因：
- 影响范围：
- 当前不能继续直接实现的原因：
- 可选方案：
  - A：
  - B：
  - C：
- 推荐默认方案：
- 如果 Owner 同意，请回复的明确指令：
```

## 7. 不确定性分级

### A 类：必须问 Owner

- 需求目标不清。
- 验收标准不清。
- 需要选择长期架构路线。
- 会改变已有 contract、schema、API。
- 涉及真实 provider、secret、成本、外部服务。
- 文档冲突。
- 继续做会导致返工或锁死路线。

### B 类：可以先做默认实现，但必须记录

- 命名细节。
- 文件放置位置有多个合理选择，但不影响架构。
- 测试样例数量。
- 错误提示文案。
- 内部函数拆分。
- 小范围文档组织方式。

### C 类：不需要问

- 格式修复。
- lint 或 typing 修复。
- 补充局部注释。
- 不改变行为的重构。
- 与当前任务直接相关的测试修复。

## 8. Agent 主动建议

Coding Agent 在以下情况必须主动提出建议：

1. 发现当前路线会导致大量文档 churn，但代码闭环收益很小。
2. 发现 TODO 拆分过细，导致 Owner 验收频率过高。
3. 发现某任务其实是架构决策，不是普通实现任务。
4. 发现文档要求和代码现实不一致。
5. 发现继续推进会产生难以回滚的 contract、schema、API 或目录结构。
6. 发现可以用更小的实现闭环验证当前阶段目标。
7. 发现继续增加模板或 artifact，但真实 E2E 价值没有提升。

建议格式：

```md
## Agent 建议

- 我发现的问题：
- 影响：
- 可选方案：
- 推荐默认方案：
- 是否需要 Owner 决策：是/否
- 如果不需要 Owner 决策，我将如何在当前授权范围内处理：
```

## 9. 必须由 Owner 明确触发的动作

- 生成或重整 `TODO.md`。
- 开始推进某一阶段开发。
- 批准一个 Batch。
- 开始处理某个 `BUG_*.md`。
- 将某个 `REQ_*.md` 并入某个 `stage_XX_goal.md` 并更新 `TODO.md`。
- 修改阶段目标、验收标准、项目边界或实现约束。
- 发起阶段收尾、阶段交接、TODO 归档、正式测试整理。
- 创建下一阶段正式文档。
- 执行 Git commit、移动归档文件、删除文件、发布版本或其他不可轻易回滚的仓库操作。
- 修改任何未被授权自动维护的正式文档。

## 10. 可自动衍生执行的动作

仅当主任务或 Batch 已被 Owner 明确触发时，Coding Agent 才可自动继续：

- 维护 `TODO.md` 状态。
- 记录必要 worklog。
- 将待 Owner 决策、授权、澄清或验收的问题写入 owner_questions。
- 更新 `docs/testing/stage_XX_manual_test.md` 中与当前任务直接相关的待测项或测试结果。
- 对已触发的 Bug 修复任务读取对应 `BUG_*.md`，复现、分析、修复、验证。
- 对已触发的需求并入任务，按 Owner 指定范围更新阶段文档与 `TODO.md`。
- 执行必要的测试、构建、类型检查、lint 与运行验证。
- 对当前任务直接相关的失败项继续修复并再次验证。
- 在阶段收尾任务已被触发后生成阶段总结初稿与 TODO 快照。

若某个动作未被明确授权，Coding Agent 在完成当前明确任务后应停止，等待 Owner 下一步指令。

## 11. 标准执行规则

### 11.1 阶段执行

当 Owner 明确要求开始当前阶段执行后，Coding Agent 应：

1. 读取当前 agent entry file、阶段文档、实现约束和 `TODO.md`。
2. 执行 Cold Start Check，确认当前阶段、Batch、Task、状态、验证方式和未决问题。
3. 若 Owner 要求生成或重整 `TODO.md`，先完成该动作。
4. 按 WIP=1 推进当前 Batch 或 Task。
5. 记录自动验证结果、必要 worklog、owner_questions 和 handoff。
6. 必要时更新当前阶段手动测试文档。
7. 汇报完成内容、验证结果、TODO 同步情况、clean state 和需要 Owner 决策的内容。

### 11.2 需求补充

看到 `REQ_*.md` 不等于自动并入当前阶段。只有当 Owner 明确指示“将某个
`REQ_*.md` 并入某个 `stage_XX_goal.md` 并更新 `TODO.md`”时，Coding Agent 才可执行文档更新。

文档更新完成后，若未收到继续执行指令，应停止等待 Owner 确认。

### 11.3 Bug 修复

当 Owner 明确要求处理某个 `BUG_*.md` 时，Coding Agent 应：

1. 读取 Bug 文档与当前执行依据。
2. 尽可能先复现问题。
3. 分析原因并形成简短修复计划。
4. 将修复任务拆解写入 `TODO.md`。
5. 按 WIP=1 推进修复、测试与状态更新。
6. 记录 verification、evidence、待手测项与待验收项。

### 11.4 阶段收尾

当 Owner 明确表达当前阶段已完成或要求收尾时，Coding Agent 可：

- 检查 `TODO.md` 中的未完成项、阻塞项、owner_gate 项、待验收项和多个 `doing`。
- 生成 `docs/handoffs/stage_XX_summary.md` 初稿。
- 生成 `docs/TODO_backup/TODO_YYYYMMDD_HH.md` 快照。
- 在 Bug 已通过 Owner 验收且获得明确触发后，将对应 open Bug 文档移动到 `closed/`。
- 在总结中记录遗留项、风险点、OwnerGate、evidence 和下一阶段建议关注点。

### 11.5 完成与提交

- 未验证前，不应建议提交。
- 阶段主要功能完成、直接相关验证通过、没有明显阻塞时，可建议 Owner 检查后发出提交指令。
- Coding Agent 不应在没有 Owner 明确指令时自行提交。

