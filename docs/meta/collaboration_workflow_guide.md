# collaboration_workflow_guide.md

## 文档定位

本文档用于说明 **yiyi、Web 端 AI、Claude Code** 三者在项目中的协作方式、动作触发规则与流转关系，帮助 yiyi 理解如何通过文档驱动方式推进项目。

推荐路径：`/docs/meta/collaboration_workflow_guide.md`。

本文档主要回答以下问题：

- 3 者在项目中的分工分别是什么
- 项目推进过程中，哪些动作由谁发起
- 哪些动作 Claude Code 会默认做
- 哪些动作必须由 yiyi 明确告诉 Claude Code，它才会做
- 哪些动作可以由 Claude Code 自动衍生执行，但前提是什么
- `/CLAUDE.md` 应该承接哪些项目级执行规则

本文档是 **协作说明文档**，不是执行真相文档。  
项目实际执行仍以 `/TODO.md`、阶段目标文档、实现约束文档、需求文档、Bug 文档等正式执行文档为准。

---

## 1. 三方角色分工

### 1.1 yiyi

yiyi 是项目 owner、任务发起者、边界决定者和最终验收者。

yiyi 的核心职责包括：

- 提出项目目标、需求、Bug、阶段方向
- 决定哪些内容进入当前阶段，哪些延后
- 决定是否开始某一轮执行
- 确认存在不清楚之处时需要先停下来澄清
- 决定是否结束当前阶段
- 对 Claude Code 的执行结果进行人工验收
- 决定哪些自动化行为应被写入 `/CLAUDE.md`

yiyi 不需要自己维护所有过程文档，但需要负责**触发关键动作**与**确认关键边界**。

---

### 1.2 Web 端 AI

Web 端 AI 负责规划、分析、整理、起草。

它的核心职责包括：

- 根据 yiyi 提供的信息起草项目定义文档
- 起草实现约束文档
- 起草阶段目标文档
- 起草需求补充文档
- 在阶段交接时，基于已有文档重新整理下一阶段目标

Web 端 AI 不默认拥有项目历史上下文。  
除非 yiyi 提供相关文档，否则它的输出只应视为分析、草案和建议，而不直接视为项目内结论。

---

### 1.3 Claude Code

Claude Code 负责实现、修改、测试配合、任务维护、归档配合。

它的核心职责包括：

- 按正式文档执行开发与修复
- 维护 `/TODO.md`
- 维护测试说明等执行辅助文档
- 在授权条件满足时，执行阶段总结、归档、交接辅助动作

Claude Code 是**文档驱动执行者**，不是项目方向决定者。  
它不应自行决定项目目标、阶段边界、需求是否纳入当前阶段。

---

## 2. 协作基本原则

### 2.1 总纲负责“文档体系”，本文负责“协作动作”

总纲只定义文档分层、权限和职责；  
本文档负责解释这些文档在真实协作中如何被使用。

### 2.2 正式文档优先于对话

对话可以提出想法，但只有当内容进入正式文档后，才应作为项目内结论继续流转。

但 yiyi 在当前会话中的**明确执行指令、停止指令、文档更新指令与边界指令**立即生效。
若这些指令会长期影响阶段边界、需求范围或项目规则，应再同步回正式文档。

### 2.3 Claude Code 不自行开工

Claude Code 不因为“看到了某份文档”就自动开始执行。  
除默认规则外，多数执行动作必须由 yiyi 明确触发。

### 2.4 自动动作必须先被授权

Claude Code 若要在主任务之外自动继续做后续动作，必须满足两个条件：

- yiyi 已经明确发起该轮主任务
- 对应自动动作已事先写入 `/CLAUDE.md`

### 2.5 `/TODO.md` 是执行真相，但不是阶段边界真相

当前执行顺序、任务状态、待验收项以 `/TODO.md` 为准；  
当前阶段做什么、不做什么，仍以 `/docs/stages/stage_XX_goal.md` 为准；  
技术约束以 `/docs/project/implementation_constraints.md` 为准。

### 2.6 不确定先确认

若 Claude Code 对任务边界、文档含义、阶段归属、归档方式或下一步动作存在不清楚之处，必须先与 yiyi 确认，再继续执行；不得基于猜测自行补全。

---

## 3. 动作触发模型

为了让协作边界清晰，所有动作分为 3 类：

### 3.1 默认动作

默认动作指 Claude Code 在每次执行代码相关任务前都会先做的动作，不需要 yiyi 每次重复说明。

目前默认动作如下：

- Claude Code 在每次开始实现、修改、修复、测试、归档等代码相关任务前，默认先读取 `/CLAUDE.md`
- 若 `/CLAUDE.md` 中定义了固定读取顺序，则 Claude Code 继续按其中要求读取其他文档

这是 Claude Code 的固定前置行为，不需要 yiyi 每次重复提醒。

---

### 3.2 必须由 yiyi 明确触发的动作

以下动作必须由 yiyi 明确告诉 Claude Code，它才应执行：

- 根据 `/docs/stages/stage_XX_goal.md` 与 `/docs/project/implementation_constraints.md` 生成 `/TODO.md`
- 根据当前阶段文档重整 `/TODO.md`
- 开始推进某一阶段开发
- 开始处理某个 `/docs/bugs/open/BUG_*.md`
- 将某个 `/docs/changes/REQ_*.md` 并入某个 `/docs/stages/stage_XX_goal.md`，并更新 `/TODO.md`
- 修改 `/docs/stages/stage_XX_goal.md` 的其他正式内容
- 发起阶段收尾
- 发起阶段交接
- 发起 `/TODO.md` 归档
- 发起某轮正式测试整理
- 任何未在 `/CLAUDE.md` 中写明可自动处理的正式文档更新动作

这些动作会改变执行计划、阶段边界、正式文档内容或归档状态，因此必须由 yiyi 触发。

---

### 3.3 可自动衍生执行的动作

可自动衍生执行的动作，是指 yiyi 已经发起主任务后，Claude Code 可以继续自动完成的后续动作。

但必须同时满足两个条件：

- 主任务已由 yiyi 明确触发
- 自动规则已写入 `/CLAUDE.md`

如果少任一条件，Claude Code 都不应擅自继续做。

可被写入 `/CLAUDE.md` 的自动动作示例包括：

- 执行过程中自动维护 `/TODO.md` 状态
- 自动更新 `/docs/testing/stage_XX_manual_test.md`
- 对已触发的 bug 修复任务，自动读取对应 `/docs/bugs/open/BUG_*.md`，分析原因、拆解任务并写入 `/TODO.md`
- 在已触发的主任务内，自行执行必要的测试，并对当前任务直接相关的失败项继续修复与验证
- 当 yiyi 明确确认当前阶段任务已完成后，自动生成 `/docs/handoffs/stage_XX_summary.md`
- 当 yiyi 明确确认某个 Bug 修复通过验收后，自动将对应 `open/BUG_*.md` **move** 到 `closed/BUG_*.md`
- 阶段收尾时自动生成 `/TODO.md` 快照
- 在 yiyi 已明确指示将某个 `REQ_*.md` 并入某个 `stage_XX_goal.md` 并更新 `/TODO.md` 后，完成对应文档更新

---

## 4. 项目推进的标准协作方式

### 4.1 项目规划阶段

#### 目的

把想法整理成正式项目定义和第一阶段目标。

#### 协作方式

1. yiyi 提出项目想法、目标、限制、预期结果
2. Web 端 AI 起草 `/docs/project/project_brief.md`
3. 如需要，再起草 `/docs/project/architecture_overview.md`
4. Web 端 AI 起草 `/docs/project/implementation_constraints.md`
5. Web 端 AI 起草 `/docs/stages/stage_01_goal.md`
6. yiyi 审阅并确认这些文档
7. 项目进入可执行状态

#### 这一阶段的关键点

- Web 端 AI 负责“整理为文档”
- yiyi 负责“确认哪些内容成立”
- Claude Code 不自动参与项目规划

---

### 4.2 阶段执行阶段

#### 目的

把阶段目标转成具体实现、测试与验收流程。

#### 协作方式

1. yiyi 明确告诉 Claude Code 开始当前阶段执行
2. Claude Code 默认先读取 `/CLAUDE.md`
3. Claude Code 按 `/CLAUDE.md` 指定顺序读取：
   - `/docs/stages/stage_XX_goal.md`
   - `/docs/project/implementation_constraints.md`
   - 必要时读取 `/docs/project/project_brief.md` 等背景文档
4. yiyi 若明确要求“生成 TODO”或“重整 TODO”，Claude Code 才生成或重整 `/TODO.md`
5. Claude Code 按 `/TODO.md` 推进开发、测试与文档更新
6. Claude Code 按授权自动维护状态类文档
7. yiyi 做人工验收
8. Claude Code 根据验收结果更新状态

#### 这一阶段的关键点

- “开始执行”要由 yiyi 触发
- “生成 TODO”也要由 yiyi 触发
- Claude Code 一旦被触发执行，可以在 `/CLAUDE.md` 授权范围内自动做后续机械动作

---

### 4.3 阶段收尾与交接阶段

#### 目的

在阶段结束后沉淀结果，并为下一阶段或新的 Web 端 AI 提供上下文。

#### 协作方式

1. yiyi 明确告诉 Claude Code 当前阶段已完成，或要求进行阶段收尾
2. Claude Code 默认先读取 `/CLAUDE.md`
3. 若 `/CLAUDE.md` 已定义收尾规则，Claude Code 自动执行：
   - 生成 `/docs/handoffs/stage_XX_summary.md`
   - 备份 `/docs/TODO_backup/TODO_YYYYMMDD_HH.md`
   - 整理待交接信息
4. yiyi 将阶段总结、项目背景文档、TODO 快照交给新的 Web 端 AI
5. 新的 Web 端 AI 基于这些材料生成下一阶段 `/docs/stages/stage_XX_goal.md`

#### 这一阶段的关键点

- “阶段结束”由 yiyi 判定
- “收尾动作”可由 Claude 自动衍生执行，但要先写入 `/CLAUDE.md`

---

### 4.4 缺陷修复阶段

#### 目的

把 Bug 修复纳入正式执行体系，而不是停留在口头描述里。

#### 协作方式

1. yiyi 创建 `/docs/bugs/open/BUG_YYYYMMDD_xxx.md`
2. yiyi 明确告诉 Claude Code 开始处理该 Bug
3. Claude Code 默认先读取 `/CLAUDE.md`
4. Claude Code 读取 Bug 文档及当前执行依据
5. Claude Code 读取并理解该 Bug 文档后，应将修复任务拆解写入 `/TODO.md`，再按 `/TODO.md` 推进修复、测试与状态更新
6. Claude Code 完成修复与测试
7. yiyi 验收修复结果
8. 若 `/CLAUDE.md` 已定义自动归档规则，则 Claude Code 在验收通过后自动将该 Bug 归档到 `closed/`

#### 这一阶段的关键点

- Claude Code 不因“看见 open bug 文档”就自己开始修
- yiyi 必须明确发起修复
- 一旦 yiyi 明确发起某个 bug 修复，Claude Code 应自动读取对应 bug 文档、分析原因、写入 `/TODO.md` 并继续推进
- 归档动作若想自动发生，必须提前写入 `/CLAUDE.md`

---

### 4.5 需求补充阶段

#### 目的

把新增需求规范地纳入项目，而不是直接插入执行过程。

#### 协作方式

1. yiyi 向 Web 端 AI 提出新增需求
2. Web 端 AI 起草 `/docs/changes/REQ_YYYYMMDD_xxx.md`
3. yiyi 确认补充内容
4. yiyi 决定该需求是否纳入当前阶段
5. 只有当 yiyi 明确指示“将某个 `/docs/changes/REQ_*.md` 并入某个 `/docs/stages/stage_XX_goal.md`，并更新 `/TODO.md`”时，Claude Code 才开始后续动作
6. Claude Code 默认先读取 `/CLAUDE.md`
7. Claude Code 按授权规则更新阶段文档与 `/TODO.md`
8. Claude Code 完成文档更新后，应先停止并等待 yiyi 确认更新结果
9. 只有当 yiyi 在确认文档更新结果后，再明确发出继续执行指令时，Claude Code 才继续开发、测试与状态更新

#### 这一阶段的关键点

- `/docs/changes/REQ_*.md` 是需求输入文档，不是自动执行指令
- 是否纳入当前阶段，以及并入哪个阶段文档并如何更新 `/TODO.md`，必须由 yiyi 明确决定
- 文档更新与后续执行是两个动作；文档更新完成后，若未收到继续执行指令，Claude Code 应停止等待

---

## 5. yiyi 在协作中的关键职责

为了让 3 者协作稳定，yiyi 主要要做的不是“亲自维护所有文档”，而是做好以下几类决策：

### 5.1 发起类决策

决定什么时候：

- 开始项目规划
- 开始当前阶段执行
- 生成或重整 `/TODO.md`
- 开始处理某个 Bug
- 开始处理某个新增需求
- 结束当前阶段

### 5.2 边界类决策

决定：

- 某需求是否进入当前阶段
- 当前阶段范围是否变更
- 某 Bug 是当前修还是后面修
- 某结论是否进入正式文档

### 5.3 验收类决策

决定：

- 功能是否算完成
- 修复是否通过
- 阶段是否可收尾
- 是否允许 Claude Code 执行下一步归档/交接动作

### 5.4 规则类决策

决定：

- 哪些动作以后可以让 Claude Code 自动做
- 哪些动作必须每次自己明确指令
- 这些规则如何写入 `/CLAUDE.md`

---

## 6. 本文档与 `/CLAUDE.md` 的关系

本文档不是 `/CLAUDE.md`，但它是后续生成 `/CLAUDE.md` 的上位说明依据之一。

两者关系如下：

### 本文档负责说明

- 三方怎么协作
- 动作如何被触发
- 哪些动作是默认动作
- 哪些动作必须由 yiyi 明确触发
- 哪些动作可以被授权为自动动作

### `/CLAUDE.md` 负责落地

- Claude Code 每次执行前的读取顺序
- Claude Code 的权威文档清单
- Claude Code 的默认执行规则
- Claude Code 可自动衍生执行的动作清单
- Claude Code 的文档更新范围
- Claude Code 的测试与归档规则

也就是说：

> 本文档回答“协作制度是什么”；  
> `/CLAUDE.md` 回答“Claude Code 在项目里具体怎么执行这些制度”。

---

## 7. 后续生成 `/CLAUDE.md` 时应从本文提取的内容

后续编写 `/CLAUDE.md` 时，至少应从本文抽取并固化以下内容：

### 7.1 默认读取规则

例如：

- 每次执行代码前默认读取 `/CLAUDE.md`
- 再按固定顺序读取阶段文档、实现约束文档、必要背景文档

### 7.2 主任务触发规则

例如：

- 未收到 yiyi 明确指令时，不自动生成或重整 `/TODO.md`
- 未收到 yiyi 明确指令时，不自动开始某个 Bug 修复
- 未收到 yiyi 明确指令时，不自动发起阶段收尾

### 7.3 自动衍生规则

例如：

- 主任务开始后自动维护 `/TODO.md`
- 已触发的 bug 修复任务，自动读取对应 bug 文档、拆解写入 `/TODO.md` 并继续推进修复与测试
- 验收通过后自动更新状态
- 阶段完成后自动生成 summary 和 TODO 快照
- Bug 验收通过后自动归档

### 7.4 停止规则

例如：

- 若自动动作未写入 `/CLAUDE.md`，则 Claude Code 在完成当前明确任务后停止，等待 yiyi 下一步指令

---

## 8. 一句话协作模型

整个项目协作可概括为：

> yiyi 负责发起、定边界、做验收；  
> Web 端 AI 负责规划、整理、起草；  
> Claude Code 负责按文档执行；  
> Claude Code 默认先读 `/CLAUDE.md`，只执行 yiyi 明确发起的主任务，并只在 `/CLAUDE.md` 授权范围内自动完成后续动作。

---

## 9. 本文档不负责定义的内容

本文档不负责定义以下内容：

- `/TODO.md` 的具体模板
- `/docs/stages/stage_XX_goal.md` 的具体模板
- `/docs/changes/REQ_*.md`、`/docs/bugs/open/BUG_*.md` 的具体模板
- `/CLAUDE.md` 的最终正文
- Claude Code 的具体提示词写法

这些内容应在后续文档中分别定义。
