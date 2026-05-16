---
文档定位: "项目文件索引。"
作者: "Coding Agent 初稿"
目标对象:
  - "Coding Agent"
  - "Planning AI"
  - "Owner"
Agent权限: "询问后可改"
当前操作者提醒:
  - "本文件只做索引与导航，不解释完整架构，也不承载任务状态。"
  - "模板文件不是当前项目实例；实际状态文件应复制到 stage / batch / handoff 目录或项目约定位置后维护。"
  - "若真实项目目录结构发生明显变化，更新前应说明范围并取得 Owner 确认。"
---

# file_index

## 1. 索引范围

- 索引范围：通用文档脚手架的入口文件、项目级文档、meta 规则、模板、测试、交接和报告目录。
- 不包含：具体业务模块、真实运行入口、真实部署脚本和真实项目状态实例。
- 维护原则：新增或移动重要文档时同步更新；不把执行日志、Owner 决策或阶段详情写进本文件。

## 2. 入口文件

| 路径 | 作用 | 读取时机 | 注意事项 |
|---|---|---|---|
| Agent entry file | Coding Agent 轻量入口和索引，例如 `/AGENTS.md` / `/CLAUDE.md` | 每轮任务冷启动 | 不扩写成长规则正文 |
| `/README.md` | 脚手架定位、使用方式和推荐目录结构 | 初始化或理解工作流时 | 不作为执行规则权威 |
| `/TODO.md` | 当前任务看板和最小状态摘要 | 每轮执行和收尾时 | 不写长篇执行日志 |

## 3. 项目级文档

| 路径 | 作用 | Agent 权限 |
|---|---|---|
| `/docs/project/project_brief.md` | 项目目标、范围、非目标 | 只读 |
| `/docs/project/implementation_constraints.md` | 长期技术与实现硬约束 | 只读 |
| `/docs/project/architecture_overview.md` | 项目级架构概览 | 询问后可改 |
| `/docs/project/file_index.md` | 文件索引与导航 | 询问后可改 |

## 4. 协作规则文档

| 路径 | 权威内容 |
|---|---|
| `/docs/meta/docs_framework_overview.md` | 文档体系分层、职责和总原则 |
| `/docs/meta/collaboration_workflow_guide.md` | Owner / Planning AI / Coding Agent 协作动作 |
| `/docs/meta/agent_execution_workflows.md` | Cold Start、WIP=1、Batch、OwnerGate、状态体系和执行流程 |
| `/docs/meta/agent_doc_permissions.md` | 文档权限、归档方式和禁止静默修改边界 |
| `/docs/meta/agent_code_style_guide.md` | 代码修改风格、注释和最小改动边界 |
| `/docs/meta/agent_reporting_guide.md` | 完成定义、evidence、clean state、停止交接 |

## 5. 阶段、需求和缺陷

| 路径 | 作用 | 注意事项 |
|---|---|---|
| `/docs/stages/stage_XX_goal.md` | 阶段目标、非目标、Batch 建议、阶段级验收 | 不保存执行日志 |
| `/docs/changes/REQ_template.md` | 需求输入模板 | REQ 不自动等于执行指令 |
| `/docs/bugs/open/BUG_template.md` | Bug 输入模板 | Bug 需 Owner 明确触发后处理 |

## 6. 模板库

| 路径 | 模板职责 | 实例化建议 |
|---|---|---|
| `/docs/templates/batch_template.md` | Batch 授权范围模板 | 复制到对应 stage / batch 目录或项目约定位置 |
| `/docs/templates/task_board_template.md` | Task 完整字段、verification、evidence 与状态模板 | 复制为实际 task board |
| `/docs/templates/worklog_template.md` | 详细执行记录、验证记录和 evidence 索引模板 | 复制为 stage 或 Batch worklog |
| `/docs/templates/owner_questions_template.md` | Owner 决策、授权、澄清或验收问题模板 | 复制为 owner_questions |
| `/docs/templates/cold_start_check_template.md` | 冷启动检查模板 | 必要时复制到阶段或 Batch 交接材料 |
| `/docs/templates/clean_state_check_template.md` | 收尾前状态和风险检查模板 | 必要时复制到阶段或 Batch 交接材料 |

## 7. 测试和交接

| 路径 | 作用 | 注意事项 |
|---|---|---|
| `/docs/testing/test_strategy.md` | 自动验证优先、手动验收粒度和验收最低要求 | 不写阶段专属手测脚本 |
| `/docs/testing/manual_test_template.md` | Owner E2E / 阶段级 / 高风险验收模板 | 模板，不是当前验收状态 |
| `/docs/handoffs/stage_summary_template.md` | 阶段或 Batch 交接摘要模板 | 模板，不复制 TODO 全量内容 |

## 8. 报告目录

| 路径 | 作用 | 注意事项 |
|---|---|---|
| `/docs/reports/analysis/` | 分析报告模板或实例 | 默认不直接驱动执行 |
| `/docs/reports/comparison/` | 对比报告模板或实例 | 默认不直接驱动执行 |
| `/docs/reports/survey/` | 调研报告模板或实例 | 默认不直接驱动执行 |
| `/docs/reports/summary/` | 总结报告模板或实例 | 默认不直接驱动执行 |
| `/docs/reports/codex_prompt_handoffs/` | 本脚手架优化过程交接记录 | 历史过程资料，不是当前执行规则权威 |

## 9. 模块级靠近代码的文档

当模块规则会影响 Agent 决策时，优先把模块知识放在对应代码目录附近，例如：

| 推荐位置 | 适用内容 |
|---|---|
| `/src/api/ARCHITECTURE.md` | API 层职责、接口边界、认证规则 |
| `/src/db/CONSTRAINTS.md` | 数据库操作硬约束、迁移边界 |
| `/src/providers/<provider>/README.md` | provider 特殊限制、真实调用注意事项 |

这些文件不是所有项目都必须创建；只有当模块级规则存在且会影响修改判断时才需要。

## 10. 实例化后待补全

- [ ] 实际 Batch 文档路径。
- [ ] 实际 task board / worklog / owner_questions 路径。
- [ ] 实际阶段手动验收文档路径。
- [ ] 实际运行、构建、测试入口。
- [ ] 需要归档时再创建 `docs/TODO_backup/` 或 `docs/bugs/closed/` 等归档目录。
