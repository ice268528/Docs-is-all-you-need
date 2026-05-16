# 项目文档协作总纲

> 适用于 Owner / Planning AI / Coding Agent 的 agent-entry-file-first 文档脚手架。

## 1. 文档定位

本文档定义项目文档体系的分层、职责、权限与协作方式，供人类 Owner、规划型 AI
和依赖仓库入口文件的 coding agent 共用。默认入口文件名是 `AGENTS.md`；使用其他 agent 时，
可按工具约定改为 `CLAUDE.md` 或其他对应名称。

本文档回答 4 个问题：

- 项目文档怎么分层。
- 每类文档分别负责什么。
- 哪些文档是执行真相，哪些文档是辅助文档。
- Coding Agent 对不同文档拥有什么权限。

本文档不替代当前 agent entry file、`TODO.md`、阶段目标、需求、缺陷、测试或交接文档。

## 2. 角色定义

- **Owner**：项目负责人、最终决策者、最终验收者。
- **Planning AI**：负责规划、分析、比较、起草、整理；输出进入正式文档前只算草案。
- **Coding Agent**：读取当前 agent entry file 与正式任务文档后，负责实现、修改、测试、状态维护和授权范围内的归档辅助。

## 3. 核心原则

### 3.1 Agent entry file 是 agent 轻量入口

Agent entry file 是 Coding Agent 的着陆页，负责让新 agent 快速知道项目是什么、怎么运行、
怎么验证，以及哪些全局硬约束不能越过。默认可命名为 `AGENTS.md`；使用 Claude Code 时可改为
`CLAUDE.md`。它不需要包含全部信息，也不应成为巨型知识库。

详细执行流程、文档权限、汇报格式、阶段状态、任务状态、执行日志和 Owner 决策，应放在
`docs/**` 的对应文档中，并由 agent entry file 链接过去。每条入口规则都应有明确使用场景；
如果删掉某条规则不影响 Agent 的决策质量，就不应保留在入口文件中。

### 3.1.1 知识靠近代码

模块相关知识应优先靠近模块，而不是集中塞进根目录 agent entry file。例如：

- API 端点认证规则应放在 API 模块目录附近。
- 数据库操作硬约束应放在 DB 模块目录附近。
- 某个 provider 的特殊约束应放在对应 provider 模块附近。

当模块规则存在且会影响 Agent 决策时，模块目录可以放简短文档，例如 `ARCHITECTURE.md`、
`CONSTRAINTS.md` 或 `README.md`，说明模块职责、对外接口、特殊约束和重要实现边界。
这不是强制所有项目创建模块文档；只有当模块知识会影响修改、验证或风险判断时才需要。

代码变更若影响模块职责、接口、约束或验证方式，应同步更新对应模块文档。
agent entry file 只指向这些文档，不复制模块细节。

### 3.1.2 Repository as System of Record

仓库是跨会话协作的唯一事实来源。长期有效的项目目标、阶段范围、实现约束、任务状态、
验证标准、Owner 决策和关键证据，必须沉淀到仓库正式文档中。

聊天记录、口头说明、临时总结不应作为长期事实来源。若 Coding Agent 发现关键规则只存在于对话中，
应建议同步到合适的正式文档。

### 3.2 `TODO.md` 是当前任务看板

当前阶段的任务拆解、执行顺序、进行中状态、待测试项、已验收项，以 `TODO.md` 的当前看板为准。
阶段范围与验收边界仍以 `stage_XX_goal.md` 为准；技术与实现约束仍以
`implementation_constraints.md` 为准。

`TODO.md` 应保持当前看板职责，避免膨胀成完整执行日志。必要的执行细节进入 worklog，
待 Owner 决策、授权或验收的问题进入 owner_questions 或 OwnerGate 交接。

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

### 3.6.1 Template files 与 active instance files 分离

`docs/templates/**` 统一存放通用模板文件。模板文件只提供结构和占位示例，不代表当前项目事实，
也不直接驱动执行。

实际使用时，应将模板复制到对应 stage / batch / handoff 目录或项目约定位置，形成 active instance files。
Coding Agent 执行时读取和维护 active instance files，而不是把 `docs/templates/**` 当作当前状态。

### 3.7 不确定先确认

若 Coding Agent 对任务边界、文档含义、需求归属、阶段范围、技术约束、验收标准、
归档方式或下一步动作不清楚，必须先与 Owner 确认，不得基于猜测静默选择。

若缺失信息影响执行，应触发 OwnerGate；若只是局部命名、文件放置、测试样例数量等低风险细节，
可先采用默认实现，但必须在 worklog 或停止交接中记录判断。

## 4. Agent 权限级别

- **自动可改**：Coding Agent 可直接更新正文。
- **询问后可改**：Coding Agent 可生成初稿或提出修改；若文档已被 Owner 确认，后续修改前应先说明范围并等待确认。
- **只读**：Coding Agent 可读取、引用、提出建议，但不改正文。
- **仅归档操作**：Coding Agent 可在明确触发后创建快照、移动归档或保存历史副本，不把归档文档当作活文档继续维护。

具体权限见 `docs/meta/agent_doc_permissions.md`。

## 5. 推荐目录骨架

```text
/AGENTS.md                  # 默认 agent entry file；可按 agent 改为 CLAUDE.md 等
/TODO.md
/src/
  api/
    ARCHITECTURE.md        # 可选：API 层职责、接口与认证约束
  db/
    CONSTRAINTS.md         # 可选：数据库操作硬约束
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
    stage_XX/                 # 推荐实例化目录，可按项目约定创建
      batches/
        B-XX-YY.md
      task_board.md
      worklog.md
      owner_questions.md
  changes/
    REQ_YYYYMMDD_xxx.md
  testing/
    test_strategy.md
    manual_test_template.md
    stage_XX_manual_test.md   # active instance，按阶段创建
  bugs/
    open/
      BUG_YYYYMMDD_xxx.md
    closed/
      BUG_YYYYMMDD_xxx.md
  handoffs/
    stage_summary_template.md
    stage_XX_summary.md       # active instance，阶段或 Batch 收尾时创建
  templates/
    batch_template.md
    task_board_template.md
    worklog_template.md
    owner_questions_template.md
    cold_start_check_template.md
    clean_state_check_template.md
  TODO_backup/
    TODO_YYYYMMDD_HH.md
  reports/
    analysis/
    comparison/
    survey/
    summary/
```

说明：

- Agent entry file 是入口：项目概览、运行命令、验证方式、全局硬约束和索引。
- `docs/**` 保存项目级、阶段级、任务级、验证和交接文档。
- `docs/templates/**` 保存通用空模板；复制到 stage / batch / handoff 目录或项目约定位置后才成为 active instance。
- 模块目录下的 `ARCHITECTURE.md` / `CONSTRAINTS.md` / `README.md` 保存靠近代码的模块级知识。

## 6. 文档清单

| 文档 | 作用 | 作者/维护方式 | 目标对象 | Agent 权限 |
|---|---|---|---|---|
| Agent entry file | Coding Agent 轻量入口和索引，例如 `AGENTS.md` / `CLAUDE.md` | Owner 主导，agent 可建议 | Coding Agent | 询问后可改 |
| `TODO.md` | 当前任务看板和最小状态摘要 | Coding Agent 维护 | Owner、Coding Agent | 自动可改 |
| `docs/meta/docs_framework_overview.md` | 文档体系总纲 | Owner 主导 | Owner、Planning AI、Coding Agent | 询问后可改 |
| `docs/meta/collaboration_workflow_guide.md` | 协作动作说明 | Owner 主导 | Owner、Planning AI、Coding Agent | 询问后可改 |
| `docs/meta/agent_execution_workflows.md` | agent 执行流程细则 | Owner 主导，agent 可建议 | Coding Agent | 询问后可改 |
| `docs/meta/agent_doc_permissions.md` | 文档权限细则 | Owner 主导 | Coding Agent | 询问后可改 |
| `docs/meta/agent_code_style_guide.md` | 代码书写与修改边界 | Owner 主导 | Coding Agent | 询问后可改 |
| `docs/meta/agent_reporting_guide.md` | 停止交接与测试表述 | Owner 主导 | Coding Agent | 询问后可改 |
| `docs/project/project_brief.md` | 项目目标与范围 | Planning AI 起草，Owner 定稿 | Owner、Planning AI、Coding Agent | 只读 |
| `docs/project/implementation_constraints.md` | 技术与实现约束 | Planning AI 起草，Owner 定稿 | Coding Agent | 只读 |
| `docs/stages/stage_XX_goal.md` | 阶段目标与边界 | Planning AI 起草，Owner 定稿 | Owner、Coding Agent | 询问后可改 |
| `docs/changes/REQ_*.md` | 新增需求输入 | Planning AI 起草，Owner 确认 | Owner、Coding Agent | 只读 |
| `docs/bugs/open/BUG_*.md` | Bug 输入与验收依据 | Owner 主导 | Owner、Coding Agent | 只读 |
| `docs/testing/test_strategy.md` | 测试策略 | Owner 主导 | Owner、Coding Agent | 询问后可改 |
| `docs/testing/manual_test_template.md` | 手动验收模板 | Owner 主导，agent 可建议 | Owner、Coding Agent | 询问后可改 |
| `docs/testing/stage_XX_manual_test.md` | 手动测试说明 active instance | Coding Agent 生成维护 | Owner | 自动可改 |
| `docs/handoffs/stage_summary_template.md` | 阶段或 Batch 交接模板 | Owner 主导，agent 可建议 | Owner、Coding Agent | 询问后可改 |
| `docs/handoffs/stage_XX_summary.md` | 阶段交接摘要 active instance | Coding Agent 初稿，Owner 确认 | Owner、后续 agent | 询问后可改 |
| `docs/templates/**` | 通用模板体系，不是当前项目实例 | Owner 主导，agent 可建议 | Owner、Planning AI、Coding Agent | 询问后可改 |
| `docs/reports/**` | 分析、对比、调查、总结 | 按任务生成 | Owner、Planning AI | 询问后可改 |

## 7. 最小可用集合

一个新项目至少需要：

- agent entry file，例如 `AGENTS.md` / `CLAUDE.md`
- `TODO.md`
- `docs/project/project_brief.md`
- `docs/project/implementation_constraints.md`
- `docs/stages/stage_01_goal.md`
- `docs/testing/test_strategy.md`

其他文档按需求、Bug、阶段收尾和复盘需要逐步补齐。
