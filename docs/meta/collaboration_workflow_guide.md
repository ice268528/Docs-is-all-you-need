# collaboration_workflow_guide.md

## 文档定位

本文档说明 **Owner、Planning AI、Coding Agent** 三者在 agent-entry-file-first 项目中的协作方式、
动作触发规则与流转关系。

本文档是协作说明文档，不是执行真相文档。实际执行以当前 agent entry file、`TODO.md`、
阶段目标文档、实现约束文档、需求文档和 Bug 文档为准。

## 1. 三方角色分工

### 1.1 Owner

Owner 是项目负责人、任务发起者、边界决定者和最终验收者。

核心职责：

- 提出项目目标、需求、Bug、阶段方向。
- 决定哪些内容进入当前阶段，哪些延后。
- 决定何时开始某一轮执行。
- 决定是否结束当前阶段。
- 对 Coding Agent 的执行结果进行人工验收。
- 决定哪些自动化行为应进入正式规则文档。

Owner 不需要亲自维护所有过程文档，但需要负责触发关键动作和确认关键边界。

### 1.2 Planning AI

Planning AI 负责规划、分析、比较、整理、起草。

核心职责：

- 根据 Owner 提供的信息起草项目定义文档。
- 起草实现约束、阶段目标、需求补充、分析报告。
- 在阶段交接时基于已有文档整理下一阶段建议。

Planning AI 默认不拥有项目长期上下文。除非 Owner 提供相关文档，否则其输出只视为草案和建议。

### 1.3 Coding Agent

Coding Agent 负责实现、修改、测试配合、任务维护和归档辅助。

核心职责：

- 按当前 agent entry file 和正式文档执行开发与修复。
- 维护 `TODO.md`。
- 维护手动测试说明等执行辅助文档。
- 在授权条件满足时，执行阶段总结、归档、交接辅助动作。

Coding Agent 是文档驱动执行者，不自行决定项目目标、阶段边界或需求是否纳入当前阶段。

## 2. 协作基本原则

### 2.1 Agent entry file 是协作入口

总纲定义文档体系，本文解释协作动作，agent entry file 只负责给 Coding Agent 提供轻量入口和索引。
具体执行流程、自动动作边界和停止条件，以 `docs/meta/agent_execution_workflows.md` 等细则为准。

### 2.2 正式文档优先于对话

对话可以提出想法，但只有进入正式文档后，才应作为项目结论继续流转。
Owner 在当前会话中的明确执行、停止、文档更新和边界指令立即生效。

跨会话协作以仓库为唯一事实来源。长期有效的规则、边界、状态、验证标准、Owner 决策和关键证据，
应同步到对应正式文档；聊天总结只服务当前沟通，不替代仓库记录。

### 2.3 Coding Agent 不自行开工

Coding Agent 不因为“看到某份文档”就自动开始执行。除默认读取、最小检查和已授权衍生动作外，
多数执行动作必须由 Owner 明确触发。

### 2.4 自动动作必须先被授权

Coding Agent 若要在主任务之外自动继续做后续动作，必须满足两个条件：

- Owner 已经明确发起该轮主任务。
- 对应自动动作已写入 `docs/meta/agent_execution_workflows.md` 或当前已授权 Batch 文档。

### 2.5 `TODO.md` 是当前看板，但不是阶段边界真相

当前执行顺序、任务状态、待验收项以 `TODO.md` 为准；当前阶段做什么、不做什么，
仍以 `docs/stages/stage_XX_goal.md` 为准；技术约束以
`docs/project/implementation_constraints.md` 为准。

### 2.6 Batch 授权与 WIP=1

Stage 定义阶段目标，Batch 表示 Owner 一次授权 Coding Agent 连续推进的任务包，Task 是具体执行项。
OwnerGate 是必须停下来问人的决策点。详细规则见 `docs/meta/agent_execution_workflows.md`。

协作中默认遵守 WIP=1：任意时刻只允许一个 Batch 或一个 Task 处于 `doing`。
若 TODO 中出现多个 `doing`，Coding Agent 应先收敛状态，再继续实现。

### 2.7 Template files 与 active instance files

`docs/templates/**` 只存放通用模板，不记录当前项目事实，也不直接驱动执行。
实际使用时，Owner、Planning AI 或 Coding Agent 应按项目约定把模板复制到对应 stage / batch / handoff
目录，形成 active instance files。

Coding Agent 执行时读取 active instance files，例如实际 Batch 文档、task board、worklog、
owner_questions 和 handoff；不要把模板文件当作当前任务状态。

## 3. 动作触发模型

### 3.1 默认动作

Coding Agent 在每次代码或文档维护任务前默认：

- 读取当前 agent entry file。
- 读取当前任务所需的最小必要文档。
- 执行轻量 Cold Start Check，确认当前阶段、Batch/Task、状态、权威输入、验证方式和未决问题。
- 若任务已开始，维护与本轮任务直接相关的状态、验证和待验收信息。
- 停止时说明主线、完成情况、验证情况、TODO 同步情况和下一步建议。

### 3.2 必须由 Owner 明确触发的动作

以下动作必须由 Owner 明确发起：

- 根据阶段文档生成或重整 `TODO.md`。
- 开始推进某一阶段开发。
- 批准一个 Batch。
- 开始处理某个 `BUG_*.md`。
- 将某个 `REQ_*.md` 并入某个 `stage_XX_goal.md` 并更新 `TODO.md`。
- 修改阶段目标、验收标准、实现约束或项目边界。
- 发起阶段收尾、阶段交接、TODO 归档、正式测试整理。
- 创建下一阶段正式文档。
- 执行 Git commit、删除文件、移动归档文件、发布版本或其他不可轻易回滚的仓库操作。
- 修改任何未被授权自动维护的正式文档。

### 3.3 可自动衍生执行的动作

主任务已被 Owner 明确触发后，Coding Agent 可自动完成：

- 维护 `TODO.md` 状态。
- 在已授权 Batch 内连续推进任务、自动验证、修复直接相关失败。
- 记录必要 worklog，并将待决策、授权、澄清或验收的问题写入 owner_questions。
- 更新当前阶段手动测试说明。
- 将实现过程产生的待测项、待验收项写入 `TODO.md`。
- 对已触发的 Bug 修复任务执行复现、分析、修复、验证。
- 对已触发的需求并入任务更新指定阶段文档与 `TODO.md`。
- 执行必要的测试、构建、类型检查、lint 和运行验证。
- 对当前任务直接相关的失败项继续修复并再次验证。
- 在阶段收尾任务已触发后生成阶段总结初稿与 TODO 快照。

若某个动作未被授权为自动衍生动作，Coding Agent 完成当前明确任务后应停止等待。

触发 OwnerGate 时，Coding Agent 不继续实现，只按 `docs/meta/agent_execution_workflows.md`
给出原因、影响、可选方案、推荐默认方案和 Owner 可回复的明确指令。

## 4. 标准协作流程

### 4.1 项目规划

1. Owner 提出项目想法、目标、限制和预期结果。
2. Planning AI 起草 `docs/project/project_brief.md`。
3. Planning AI 起草 `docs/project/implementation_constraints.md`。
4. 必要时补充 `docs/project/architecture_overview.md`。
5. Planning AI 起草 `docs/stages/stage_01_goal.md`。
6. Owner 审阅并确认这些文档。
7. 项目进入可执行状态。

### 4.2 阶段执行

1. Owner 明确要求 Coding Agent 开始当前阶段执行。
2. Coding Agent 读取当前 agent entry file 与阶段相关文档。
3. 若 Owner 要求生成或重整 `TODO.md`，Coding Agent 先完成该动作。
4. Owner 可批准一个 Batch，或要求 Coding Agent 只推进单个 Task。
5. Coding Agent 按 WIP=1 推进当前 Batch / Task，实现、测试和状态维护。
6. 每轮结束后，Coding Agent 汇报完成内容、验证结果、TODO / worklog / owner_questions 同步情况、clean state 和待 Owner 决策项。

### 4.3 需求补充

1. Owner 或 Planning AI 起草 `REQ_*.md`。
2. Owner 决定是否纳入当前阶段。
3. 只有当 Owner 明确指示并入时，Coding Agent 才更新阶段文档与 `TODO.md`。
4. 文档更新完成后，若未收到继续执行指令，Coding Agent 停止等待。

### 4.4 Bug 修复

1. Owner 创建或确认 `docs/bugs/open/BUG_*.md`。
2. Owner 明确要求处理该 Bug。
3. Coding Agent 读取 Bug 文档、阶段文档、实现约束和 `TODO.md`。
4. Coding Agent 先复现，再修复，再验证。
5. 修复完成后记录验证结果、待手测项和待验收项。

### 4.5 阶段收尾

1. Owner 明确要求收尾或确认阶段已完成。
2. Coding Agent 检查 `TODO.md` 中的未完成项、阻塞项、待验收项。
3. Coding Agent 生成阶段总结初稿和 TODO 快照。
4. 需要移动 Bug 到 `closed/` 时，必须确认已通过 Owner 验收并获得明确触发。
5. Coding Agent 汇报遗留项、风险点和下一阶段建议关注点。

## 5. 一句话协作模型

> Owner 负责发起、定边界、做验收；Planning AI 负责规划、整理、起草；Coding Agent 负责按
> 当前 agent entry file 和正式文档执行，并只在授权范围内自动完成后续动作。
