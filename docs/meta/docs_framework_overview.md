# 项目文档协作总纲

> 适用于 yiyi / Web 端 AI / Claude Code 的通用 Docs 脚手架。

## 1. 文档定位

本文档用于定义项目文档体系的分层、职责、权限与协作方式，供 yiyi、Web 端 AI、Claude Code 共用。

推荐路径：`/docs/meta/docs_framework_overview.md`。

本文档只回答 4 个问题：
- 项目文档怎么分层。
- 每类文档分别负责什么。
- 哪些文档是执行真相，哪些文档是辅助文档。
- Claude Code 对不同文档拥有什么权限。

本文档**不定义** `CLAUDE.md` 的具体正文内容，也不替代阶段目标、需求、缺陷、测试、TODO 等执行文档。

## 2. 角色定义

- **yiyi**：人类项目 owner、最终决策者、最终验收者。
- **Web 端 AI**：负责规划、分析、审阅、比较、起草。
- **Claude Code**：负责实现、修改、测试配合、过程文档维护。

## 3. 核心原则

### 3.1 总纲与执行说明分离
本文档只定义文档体系，不承载某个执行体的具体行为细则。

### 3.2 `/TODO.md` 是当前任务执行真相
当前阶段的任务拆解、执行顺序、进行中状态、待测试项、已验收项，以 `/TODO.md` 为准。  
阶段范围与验收边界仍以 `stage_XX_goal.md` 为准；技术与实现约束仍以 `implementation_constraints.md` 为准。

### 3.3 报告默认不直接驱动执行
`/docs/reports/` 下的文档默认属于认知辅助文档。若报告结论要进入执行，必须再写入：
- `stage_XX_goal.md`
- `REQ_*.md`
- `BUG_*.md`
- `/TODO.md`

### 3.4 阶段边界显式化
当前阶段做什么、不做什么、交付什么、如何验收，应写清楚在阶段文档中。

### 3.5 现行与归档分离
当前协作依赖现行文档；旧 TODO、已关闭 bug、阶段总结等进入归档或交接目录。

### 3.6 归档方式显式化
不同文档采用不同归档方式，并在项目内保持一致：
- Bug 文档采用 **move**：验收通过后由 `open/` 移动到 `closed/`。
- `TODO.md` 采用 **snapshot**：阶段收尾时生成 `TODO_backup` 快照，`/TODO.md` 继续保留为现行工作文档。
- `REQ_*.md` 默认 **原位保留** 在 `/docs/changes/`，作为需求输入与历史来源记录，不默认移动归档。

### 3.7 Web 端 AI 的上下文约束

Web 端 AI 默认不具备项目背景上下文，不应假设自己已经了解项目历史、阶段状态、实现约束或当前代码情况。 
在需要项目背景时，应由 yiyi 提供对应文档、摘要或文件上传作为补充输入。  
未获得明确文档输入前，Web 端 AI 的输出只作为通用建议、结构化分析或草案，不直接视为项目内结论。

### 3.8 Claude Code 的文档驱动原则

Claude Code 以文档为驱动。执行前先读取相关文档，明确当前阶段目标、约束、任务和验收要求；执行后将任务状态、测试结果、交接信息和归档结果回写到对应文档。  
项目内长期规则、阶段边界、需求结论和验收状态，不应只停留在对话或代码中。

### 3.9 不确定先确认
若 Claude Code 对任务边界、文档含义、需求归属、阶段范围、技术约束、验收标准、归档方式或下一步动作存在不清楚之处，必须先与 yiyi 确认，再继续执行；不得基于猜测、自行补全或静默选择其中一种解释。

## 4. Claude Code 权限级别

- **自动可改**：Claude Code 可直接更新正文。
- **询问后可改**：Claude Code 可生成初稿；若文档已交付 yiyi 审阅、确认或作为阶段记录保存，则后续修改前应先说明修改内容并等待 yiyi 确认。
- **只读**：Claude Code 可读，不改正文。
- **仅归档操作**：Claude Code 可基于源文档创建归档副本或历史快照，并执行复制、移动、重命名、归档；不直接修改源文档正文，也不把归档文档当作持续维护的活文档。

## 5. 推荐目录骨架

```text
/CLAUDE.md
/TODO.md
/docs/
  meta/
    docs_framework_overview.md
    collaboration_workflow_guide.md
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
      ANALYSIS_YYYYMMDD_xxx.md
    comparison/
      COMPARISON_YYYYMMDD_xxx.md
    survey/
      SURVEY_YYYYMMDD_xxx.md
    summary/
      SUMMARY_YYYYMMDD_xxx.md
```

## 6. 推荐文档清单

### 6.1 Meta 说明文档

#### `/docs/meta/docs_framework_overview.md`
- **作用**：定义项目文档体系的分层、职责、权限、目录骨架与归档方式。
- **作者**：yiyi 主导，Web 端 AI 可辅助起草。
- **目标对象**：yiyi、Web 端 AI、Claude Code。
- **Claude 权限**：询问后可改。
- **备注**：本文档是文档体系总纲，不承载 Claude Code 的具体执行细则。

#### `/docs/meta/collaboration_workflow_guide.md`
- **作用**：定义 yiyi、Web 端 AI、Claude Code 三者的协作动作、触发规则与流转关系。
- **作者**：yiyi 主导，Web 端 AI 可辅助起草。
- **目标对象**：yiyi、Claude Code。
- **Claude 权限**：询问后可改。
- **备注**：本文档是协作说明文档，不直接替代正式执行文档。

## 6.2 根目录核心文档

#### `/CLAUDE.md`
- **作用**：Claude Code 的项目级规则入口，承接读取顺序、权威文档、可改范围、测试与归档规则等内容。
- **作者**：yiyi 主导，Web 端 AI 可辅助起草。
- **目标对象**：Claude Code 为主。
- **Claude 权限**：询问后可改。
- **备注**：本文档只定义其定位，不定义其具体正文结构。

#### `/TODO.md`
- **作用**：当前阶段任务执行真相，记录阶段任务、测试任务、等待 yiyi 手动测试的事项、已验收事项。
- **作者**：Claude Code。
- **目标对象**：Claude Code、yiyi。
- **Claude 权限**：自动可改。

### 6.3 项目定义类文档

#### `/docs/project/project_brief.md`
- **作用**：定义项目目标、核心功能、目标用户、使用场景、项目边界、非目标。
- **作者**：Web 端 AI 起草，yiyi 定稿。
- **目标对象**：yiyi、Claude Code、后续新的 Web 端 AI。
- **Claude 权限**：只读。

#### `/docs/project/implementation_constraints.md`
- **作用**：定义技术栈、架构限制、依赖限制、兼容要求、部署要求、性能与安全约束。
- **作者**：Web 端 AI 起草，yiyi 定稿。
- **目标对象**：yiyi、Claude Code、后续新的 Web 端 AI。
- **Claude 权限**：只读。

### 6.4 阶段规划类文档

#### `/docs/stages/stage_XX_goal.md`
- **作用**：定义当前阶段范围、交付项、验收标准、明确不做的内容。
- **作者**：Web 端 AI 起草，yiyi 定稿。
- **目标对象**：yiyi、Claude Code。
- **Claude 权限**：询问后可改。
- **备注**：只有在 yiyi 明确确认后，新增内容才并入当前阶段。

#### `/docs/changes/REQ_YYYYMMDD_xxx.md`
- **作用**：记录阶段内新增需求或功能补充，说明新增内容、原因、预期效果、是否并入当前阶段。
- **作者**：Web 端 AI 起草，yiyi 确认。
- **目标对象**：yiyi、Claude Code。
- **Claude 权限**：只读。
- **备注**：REQ 是需求输入，不自动等于执行指令；默认保留在 `/docs/changes/`，不通过移动目录方式归档。

### 6.5 测试与验收类文档

#### `/docs/testing/stage_XX_manual_test.md`
- **作用**：提供给 yiyi 的手动测试说明，包括测试步骤、预期结果、失败反馈方式。
- **作者**：Claude Code。
- **目标对象**：yiyi。
- **Claude 权限**：自动可改。

#### `/docs/testing/test_strategy.md`
- **作用**：定义自动测试覆盖原则、手动测试与自动测试分工、测试命令与约定。
- **作者**：yiyi 主导，Web 端 AI 可辅助起草。
- **目标对象**：yiyi、Claude Code。
- **Claude 权限**：询问后可改。

### 6.6 缺陷修复类文档

#### `/docs/bugs/open/BUG_YYYYMMDD_xxx.md`
- **作用**：记录 bug 的复现步骤、当前输出、问题描述、预期输出、修复要求、补充测试要求。
- **作者**：yiyi 主导，必要时由 Web 端 AI 协助整理。
- **目标对象**：yiyi、Claude Code。
- **Claude 权限**：只读。
- **备注**：Claude Code 可读取并执行修复，但不直接修改 open 文档正文。

#### `/docs/bugs/closed/BUG_YYYYMMDD_xxx.md`
- **作用**：归档已修复 bug，保留历史记录，供复盘和相似问题排查使用。
- **作者**：由 open bug 文档归档生成。
- **目标对象**：yiyi、Claude Code、必要时给 Web 端 AI。
- **Claude 权限**：仅归档操作。
- **备注**：由 open bug 文档 **move** 到 `closed/`，不作为持续维护的活文档。

### 6.7 阶段交接与归档类文档

#### `/docs/handoffs/stage_XX_summary.md`
- **作用**：总结阶段完成内容、遗留项、当前代码状态、风险点、下一阶段关注点。
- **作者**：Claude Code 初稿，yiyi 审阅确认。
- **目标对象**：yiyi、后续新的 Web 端 AI、Claude Code。
- **Claude 权限**：询问后可改。
- **备注**：Claude Code 可生成初稿；确认后的版本再修改时需先得到 yiyi 确认。

#### `/docs/TODO_backup/TODO_YYYYMMDD_HH.md`
- **作用**：保存阶段完成时的 TODO 历史快照，便于回溯任务顺序与验收过程。
- **作者**：Claude Code 归档生成。
- **目标对象**：yiyi、后续新的 Web 端 AI、Claude Code。
- **Claude 权限**：仅归档操作。
- **备注**：由当前 `TODO.md` 生成快照；快照生成后，`/TODO.md` 继续作为现行工作文档。

### 6.8 报告类文档

#### `/docs/reports/analysis/ANALYSIS_YYYYMMDD_xxx.md`
- **作用**：分析单个方案、模块或技术点的可行性、优点、风险与适用性。
- **作者**：Claude Code。
- **目标对象**：yiyi、Web 端 AI。
- **Claude 权限**：询问后可改。
- **备注**：Claude Code 可生成初稿；若已作为阶段记录或审阅版本保存，后续修改前应先得到 yiyi 确认。

#### `/docs/reports/comparison/COMPARISON_YYYYMMDD_xxx.md`
- **作用**：对比两个方案、两条实现路径或两个项目的差异与取舍条件。
- **作者**：Claude Code。
- **目标对象**：yiyi、Web 端 AI。
- **Claude 权限**：询问后可改。
- **备注**：Claude Code 可生成初稿；若已作为阶段记录或审阅版本保存，后续修改前应先得到 yiyi 确认。

#### `/docs/reports/survey/SURVEY_YYYYMMDD_xxx.md`
- **作用**：盘点某个技术、模块、环境、依赖或现状事实。
- **作者**：Claude Code。
- **目标对象**：yiyi、Web 端 AI。
- **Claude 权限**：询问后可改。
- **备注**：Claude Code 可生成初稿；若已作为阶段记录或审阅版本保存，后续修改前应先得到 yiyi 确认。

#### `/docs/reports/summary/SUMMARY_YYYYMMDD_xxx.md`
- **作用**：沉淀某个 bug、模块或重构的实现思路与复盘结论。
- **作者**：Claude Code。
- **目标对象**：yiyi 为主。
- **Claude 权限**：询问后可改。
- **备注**：Claude Code 可生成初稿；若已作为阶段记录或审阅版本保存，后续修改前应先得到 yiyi 确认。

### 6.9 可选辅助文档

#### `/docs/project/file_index.md`
- **作用**：列出重要目录、关键文件、入口文件、配置文件、测试文件位置。
- **作者**：Claude Code 初稿，yiyi 可补充。
- **目标对象**：Claude Code、Web 端 AI、yiyi。
- **Claude 权限**：询问后可改。

#### `/docs/project/architecture_overview.md`
- **作用**：描述系统架构、模块关系、数据流、页面流、服务边界。
- **作者**：Web 端 AI 起草，yiyi 定稿；Claude Code 可补充建议。
- **目标对象**：yiyi、Claude Code、Web 端 AI。
- **Claude 权限**：询问后可改。

## 7. 快速总表

| 文档 | 作用 | 作者 | 目标对象 | Claude 权限 |
|---|---|---|---|---|
| `/docs/meta/docs_framework_overview.md` | 文档体系总纲 | yiyi 主导 | yiyi、Web 端 AI、Claude Code | 询问后可改 |
| `/docs/meta/collaboration_workflow_guide.md` | 协作动作说明 | yiyi 主导 | yiyi、Claude Code | 询问后可改 |
| `/CLAUDE.md` | Claude Code 项目级规则入口 | yiyi 主导 | Claude Code 为主 | 询问后可改 |
| `/TODO.md` | 当前任务执行真相 | Claude Code | Claude Code、yiyi | 自动可改 |
| `/docs/project/project_brief.md` | 项目目标与范围定义 | Web 端 AI 起草，yiyi 定稿 | yiyi、Claude Code、Web 端 AI | 只读 |
| `/docs/project/implementation_constraints.md` | 技术与实现约束 | Web 端 AI 起草，yiyi 定稿 | yiyi、Claude Code、Web 端 AI | 只读 |
| `/docs/stages/stage_XX_goal.md` | 当前阶段目标与边界 | Web 端 AI 起草，yiyi 定稿 | yiyi、Claude Code | 询问后可改 |
| `/docs/changes/REQ_*.md` | 新增需求补充 | Web 端 AI 起草，yiyi 确认 | yiyi、Claude Code | 只读 |
| `/docs/testing/stage_XX_manual_test.md` | 手动测试说明 | Claude Code | yiyi | 自动可改 |
| `/docs/testing/test_strategy.md` | 测试策略 | yiyi 主导 | yiyi、Claude Code | 询问后可改 |
| `/docs/bugs/open/BUG_*.md` | bug 输入文档 | yiyi 主导 | yiyi、Claude Code | 只读 |
| `/docs/bugs/closed/BUG_*.md` | 已修复 bug 归档 | 归档生成 | yiyi、Claude Code、Web 端 AI | 仅归档操作 |
| `/docs/handoffs/stage_XX_summary.md` | 阶段交接摘要 | Claude Code 初稿，yiyi 确认 | yiyi、Web 端 AI、Claude Code | 询问后可改 |
| `/docs/TODO_backup/TODO_*.md` | 历史 TODO 快照 | Claude Code 归档生成 | yiyi、Web 端 AI、Claude Code | 仅归档操作 |
| `/docs/reports/analysis/*.md` | 单对象分析报告 | Claude Code | yiyi、Web 端 AI | 询问后可改 |
| `/docs/reports/comparison/*.md` | 对比报告 | Claude Code | yiyi、Web 端 AI | 询问后可改 |
| `/docs/reports/survey/*.md` | 现状调查报告 | Claude Code | yiyi、Web 端 AI | 询问后可改 |
| `/docs/reports/summary/*.md` | 复盘总结 | Claude Code | yiyi | 询问后可改 |
| `/docs/project/file_index.md` | 项目文件索引 | Claude Code 初稿 | Claude Code、Web 端 AI、yiyi | 询问后可改 |
| `/docs/project/architecture_overview.md` | 架构总览 | Web 端 AI 起草，yiyi 定稿 | yiyi、Claude Code、Web 端 AI | 询问后可改 |

## 8. 最小可用集合

建议先建立以下文档与目录：
- `/docs/meta/docs_framework_overview.md`
- `/docs/meta/collaboration_workflow_guide.md`
- `/CLAUDE.md`
- `/TODO.md`
- `/docs/project/project_brief.md`
- `/docs/project/implementation_constraints.md`
- `/docs/stages/stage_01_goal.md`
- `/docs/changes/REQ_YYYYMMDD_xxx.md`
- `/docs/testing/stage_01_manual_test.md`
- `/docs/bugs/open/BUG_YYYYMMDD_xxx.md`
- `/docs/bugs/closed/`
- `/docs/handoffs/stage_01_summary.md`
- `/docs/TODO_backup/`
- `/docs/reports/analysis/`
- `/docs/reports/comparison/`
- `/docs/reports/survey/`
- `/docs/reports/summary/`

## 9. 推荐协作流

1. **项目启动**：先形成 `project_brief.md` 与 `implementation_constraints.md`。
2. **阶段开始**：形成 `stage_XX_goal.md`，再由 Claude Code 落入 `/TODO.md`。
3. **执行过程**：Claude Code 持续维护 `/TODO.md` 与 `stage_XX_manual_test.md`。
4. **新增需求**：先进入 `REQ_*.md`，确认纳入当前阶段后再同步到阶段文档与 TODO。
5. **缺陷修复**：先进入 `open/BUG_*.md`。修复完成并确认关闭后，Claude Code 可基于该文档生成或移动到 `closed/BUG_*.md`；是否保留 open 文档、是否加关闭标记，应按项目约定统一执行。
6. **阶段结束**：输出 `stage_XX_summary.md` 与 `TODO_backup` 快照。

## 10. 本文档不定义的内容

- `CLAUDE.md` 的具体正文结构。
- Claude Code 的具体提示词措辞。
- 其他 AI 的专用系统提示或行为细则。
- 各类执行文档的具体模板内容。
