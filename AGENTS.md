# Agent Entry File

本文件是 coding agent 的轻量着陆页。当前仓库用 `AGENTS.md` 作为默认入口文件名；
实际使用时，请按所用 agent 的约定调整文件名，例如 Claude Code 可改为 `CLAUDE.md`。

入口文件不保存全部项目知识，只帮助新 agent 快速回答：

1. 这是什么项目？
2. 怎么运行？
3. 怎么验证？

详细规则、阶段状态、任务状态、执行日志、Owner 决策和模块级约束，应链接到对应文档，
不要复制进本文件正文。

## 1. 项目概览

- 项目名称：`<project name>`
- 项目目标：见 `docs/project/project_brief.md`
- 当前阶段：见 `docs/stages/stage_XX_goal.md`
- 当前任务看板：见 `TODO.md`
- 长期实现约束：见 `docs/project/implementation_constraints.md`

若以上文档缺失或互相冲突，先说明缺口；若缺口会影响执行边界、验收或验证，应暂停并询问 Owner。

## 2. 安装、运行与验证

请在项目初始化后补齐本节命令。不要让 agent 依赖聊天记录猜测运行方式。

```bash
# install
<install command>

# run
<run command>

# test
<test command>

# lint / typecheck
<lint or typecheck command>
```

验证策略与人工验收分工见 `docs/testing/test_strategy.md`。

## 3. 全局硬约束

- Owner 的当前会话最新明确指令优先。
- 仓库正式文档是长期事实来源；聊天记录不替代正式文档。
- 只做当前任务需要的最小改动，不引入无关功能、依赖、抽象或格式 churn。
- 不自行决定阶段边界、验收结论、需求是否纳入当前阶段或长期架构路线。
- 不静默修改只读文档；文档权限见 `docs/meta/agent_doc_permissions.md`。
- 不在未获明确指令时执行 commit、发布、删除、迁移、真实外部调用或不可轻易回滚的操作。
- 未验证前，不表述为已完成；验证不足时说明已验证什么、未验证什么和原因。

## 4. 必读索引

按任务最小必要原则读取：

| 场景 | 必读文档 |
|---|---|
| 任意任务冷启动 | 当前 agent entry file、`TODO.md`、当前任务直接相关文件 |
| 阶段执行 | `docs/stages/stage_XX_goal.md`、`docs/project/implementation_constraints.md` |
| 需求并入 | 对应 `docs/changes/REQ_*.md`、阶段文档、`TODO.md` |
| Bug 修复 | 对应 `docs/bugs/open/BUG_*.md`、阶段文档、验证文档 |
| 测试或验收 | `docs/testing/test_strategy.md`、相关手动测试文档 |
| 交接或收尾 | `docs/handoffs/**`、worklog、owner_questions、`docs/meta/agent_reporting_guide.md` |
| 执行流程不清 | `docs/meta/agent_execution_workflows.md` |
| 文档能否修改不清 | `docs/meta/agent_doc_permissions.md` |
| 代码风格不清 | `docs/meta/agent_code_style_guide.md` |

`docs/templates/**` 只是 template files，不代表当前项目事实。实际使用时复制到对应 stage /
batch / handoff 目录或项目约定位置，形成 active instance files 后再驱动执行。

## 5. 知识靠近代码

模块相关知识应靠近模块，而不是集中塞进根目录 agent entry file。

- API 端点认证规则优先放在 API 模块目录附近。
- 数据库操作硬约束优先放在 DB 模块目录附近。
- Provider 特殊限制优先放在对应 provider 模块附近。

当模块规则会影响 agent 决策时，可在模块目录放简短文档，例如 `ARCHITECTURE.md`、
`CONSTRAINTS.md` 或 `README.md`，说明模块职责、对外接口、特殊约束和重要实现边界。
不是所有项目都必须创建这些文件；只有当规则存在且会影响修改判断时才需要。

代码变更若影响模块职责、接口、约束或验证方式，应同步更新对应模块文档。
agent entry file 只链接这些文档，不复制其细节。

## 6. 冷启动最小检查

开始实现前，coding agent 应能从仓库中找到：

- 项目目标、当前阶段、当前任务和权威输入。
- 安装、运行、测试和验收方式。
- 当前不能做的事、需要 OwnerGate 的事、未解决问题在哪里。
- 相关模块是否有靠近代码的架构或约束文档。

每条入口规则都应有明确使用场景。若删掉某条规则不影响 agent 的决策质量，就不应保留在
agent entry file 中；但冷启动关键问题必须能在仓库中找到答案。
