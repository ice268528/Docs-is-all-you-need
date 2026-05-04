# CLAUDE.md 拆分重构实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将 `CLAUDE.md` 中的低频细则拆分到 `docs/meta/` 下的 4 个独立规则文件，保留高频硬规则在主入口，并建立按需读取索引。

**架构：** 不改规则含义，按场景聚类迁移内容（执行流程 / 文档权限 / 代码规范 / 汇报模板），重写 `CLAUDE.md` 为精简主入口。

**技术栈：** Markdown

---

## 文件清单

| 文件 | 操作 | 职责 |
|---|---|---|
| `/docs/meta/claude_execution_workflows.md` | 创建 | 阶段执行、Bug 修复、需求并入、阶段收尾、动作触发模型 |
| `/docs/meta/claude_doc_permissions.md` | 创建 | 文档权限级别、归档方式、修改边界 |
| `/docs/meta/claude_code_style_guide.md` | 创建 | 代码注释原则、Python docstring 模板、注释边界 |
| `/docs/meta/claude_reporting_guide.md` | 创建 | 测试表述规范、停止交接模板、下一条指令建议细则 |
| `/CLAUDE.md` | 修改 | 保留高频硬规则，插入细则文件索引 |

---

### 任务 1：创建 `docs/meta/claude_execution_workflows.md`

**文件：**
- 创建：`/docs/meta/claude_execution_workflows.md`

- [ ] **步骤 1：创建文件并写入动作触发模型**

  将原 `CLAUDE.md` 第 5 节（动作触发模型）完整迁移到新文件，保持所有三级、四级标题和正文不变。

  文件头部添加：
  ```markdown
  # Claude Code 执行流程细则

  > 本文件定义 Claude Code 的动作触发模型与各场景标准执行规则。
  > 读取时机：当任务涉及阶段执行、Bug 修复、需求并入或阶段收尾时，按需读取。

  ## 1. 动作触发模型
  ```

- [ ] **步骤 2：追加标准执行规则**

  将原 `CLAUDE.md` 第 9 节（标准执行规则）完整追加到文件末尾，标题调整为二级标题 `## 2. 标准执行规则`，原 9.1-9.8 依次变为 2.1-2.8。

- [ ] **步骤 3：验证内容完整性**

  运行对比命令：
  ```bash
  echo "检查 claude_execution_workflows.md 是否包含关键标题："
  grep -n "默认动作\|必须由 yiyi 明确触发的动作\|可自动衍生执行的动作\|阶段执行\|Bug 修复\|需求补充\|阶段收尾" docs/meta/claude_execution_workflows.md
  ```
  预期：输出 8 行匹配，无遗漏。

---

### 任务 2：创建 `docs/meta/claude_doc_permissions.md`

**文件：**
- 创建：`/docs/meta/claude_doc_permissions.md`

- [ ] **步骤 1：创建文件并写入文档权限细则**

  将原 `CLAUDE.md` 第 6 节（文档权限与更新规则）完整迁移到新文件。

  文件头部添加：
  ```markdown
  # Claude Code 文档权限细则

  > 本文件定义各文档的权限级别、归档方式与修改边界。
  > 读取时机：当任务涉及文档更新、归档或权限边界判断时，按需读取。

  ## 1. 文档权限与更新规则
  ```

- [ ] **步骤 2：验证内容完整性**

  ```bash
  echo "检查权限级别标题："
  grep -n "自动可改\|询问后可改\|只读\|仅归档操作" docs/meta/claude_doc_permissions.md
  ```
  预期：输出 4 行匹配。

---

### 任务 3：创建 `docs/meta/claude_code_style_guide.md`

**文件：**
- 创建：`/docs/meta/claude_code_style_guide.md`

- [ ] **步骤 1：创建文件并写入代码规范细则**

  将原 `CLAUDE.md` 第 8 节（代码书写、注释与函数说明规则）完整迁移到新文件。

  文件头部添加：
  ```markdown
  # Claude Code 代码规范细则

  > 本文件定义代码注释原则、Python docstring 模板与注释边界。
  > 读取时机：当任务涉及新增代码、新增公开函数或修改复杂逻辑时，按需读取。

  ## 1. 代码书写、注释与函数说明规则
  ```

- [ ] **步骤 2：验证内容完整性**

  ```bash
  echo "检查代码规范关键标题："
  grep -n "基本要求\|Python 函数 docstring 模板\|注释边界" docs/meta/claude_code_style_guide.md
  ```
  预期：输出 3 行匹配。

---

### 任务 4：创建 `docs/meta/claude_reporting_guide.md`

**文件：**
- 创建：`/docs/meta/claude_reporting_guide.md`

- [ ] **步骤 1：创建文件并写入汇报与停止细则**

  将原 `CLAUDE.md` 第 10 节（测试、汇报与停止规则）完整迁移到新文件。

  文件头部添加：
  ```markdown
  # Claude Code 汇报与停止细则

  > 本文件定义测试表述规范、停止交接模板与下一条指令建议细则。
  > 读取时机：当任务完成需要输出停止汇报、更新 /TODO.md 或建议下一条指令时，按需读取。

  ## 1. 测试、汇报与停止规则
  ```

- [ ] **步骤 2：验证内容完整性**

  ```bash
  echo "检查汇报规则关键标题："
  grep -n "测试与完成表述\|/TODO.md 与停止汇报的关系\|每轮停止交接模板\|下一条指令建议细则" docs/meta/claude_reporting_guide.md
  ```
  预期：输出 4 行匹配。

---

### 任务 5：重写 `CLAUDE.md` 主入口

**文件：**
- 修改：`/CLAUDE.md`

- [ ] **步骤 1：备份原文件**

  ```bash
  cp CLAUDE.md CLAUDE.md.bak
  ```

- [ ] **步骤 2：重写 CLAUDE.md 高频硬规则**

  新文件结构如下（展示完整内容）：

  ```markdown
  # CLAUDE.md

  项目级执行规则入口，用于约束 Claude Code 的读取顺序、执行边界、文档权限、测试与停止条件。

  本文档负责 **流程、边界、优先级、权限、停止交接与代码书写约束**；不替代 `/TODO.md`、阶段文档、需求文档、Bug 文档、测试文档或专项细则文档。

  ## 1. 角色与协作边界

  - **yiyi**：项目 owner、主任务发起者、阶段边界决定者、最终验收者。
  - **Web 端 AI**：负责规划、分析、整理、起草；其输出在进入正式文档前，默认只算草案和建议。
  - **Claude Code**：文档驱动执行者；负责实现、修改、修复、测试配合、状态维护与授权范围内的归档辅助。
  - Claude Code 不应替 yiyi 做阶段边界、需求范围、验收结论、架构路线或正式归档决定。它可以给出建议，包括：当前阶段应做什么或不做什么；新增需求是否建议纳入当前阶段；某个外部 Bug 是否建议现在处理；某轮任务是否算完成；某阶段是否建议进入收尾、提交或交接。
  - Claude Code 可以在授权范围内主动完成实现、测试、直接相关修复和状态更新，但必须在停止时清楚说明本轮主线、完成情况、验证情况、是否已同步 `/TODO.md`、需要 yiyi 检查/决策/补充的内容，以及建议 yiyi 下一条发出的指令。停止汇报不应重复展开整个项目剩余任务；项目剩余任务的权威来源始终是 `/TODO.md`。

  ## 2. 上位说明文档

  - `/docs/meta/docs_framework_overview.md`
  - `/docs/meta/collaboration_workflow_guide.md`
  - 默认理解：总纲定义文档体系、定位、权限分层与推荐目录骨架；workflow guide 定义三方协作方式、动作触发规则与流转关系；`/CLAUDE.md` 负责把这些制度落成 Claude Code 的具体执行规则。
  - 若项目内文件名或路径不同，以项目中的正式文档为准，并同步更新本文件中的引用路径。

  ## 3. 文档权威性与优先级

  冲突时按以下顺序处理：

  1. yiyi 在当前会话中的明确最新指令
  2. 当前任务直接适用的正式执行文档：`/docs/stages/stage_XX_goal.md`、`/docs/project/implementation_constraints.md`、`/docs/changes/REQ_*.md`、`/docs/bugs/open/BUG_*.md`
  3. 当前任务直接适用的专项细则文档
  4. `/CLAUDE.md`
  5. `/TODO.md`
  6. `/docs/project/project_brief.md`
  7. `/docs/project/architecture_overview.md`、`/docs/project/file_index.md`、测试文档
  8. `/docs/reports/**` 与归档文档

  补充说明：
  - `/CLAUDE.md` 管执行流程与边界，不覆盖阶段范围、验收标准或技术约束。
  - `/TODO.md` 是当前任务执行真相，但不能覆盖阶段边界、实现约束或 yiyi 的明确最新指令。
  - `REQ_*.md` 是需求输入，不自动等于执行指令。
  - `BUG_*.md` 是问题输入，不自动等于立即修复命令。
  - 报告与归档文档默认不直接驱动执行。
  - 普通讨论性对话不自动构成项目结论；但 yiyi 在当前会话中的明确执行、停止、文档更新与边界指令立即生效。
  - 若当前会话中的新指令会长期影响阶段边界、需求范围、执行流程或项目规则，应建议 yiyi 将其同步进正式文档。

  ## 4. 默认读取规则

  - 固定入口：每次开始实现、修改、修复、测试、归档等代码相关任务前，默认先读取 `/CLAUDE.md`。
  - 最小阅读原则：对于小范围、局部、低风险任务，先读取 `/CLAUDE.md` 和直接相关文件即可；只有当任务影响阶段范围、架构、接口、数据流、权限、测试、需求、Bug 或正式文档时，才继续读取阶段文档、架构文档、测试文档、REQ/BUG 文档或上位说明文档。
  - 上下文节制原则：Claude Code 不应为了"看起来完整"而把所有文档都读入上下文；应按当前任务所需逐步读取。若判断下一步需要更多上下文，应明确向 yiyi 说明需要补充或授权查看哪些内容。
  - 阶段执行 / 开发任务：读取 `/docs/stages/stage_XX_goal.md`、`/docs/project/implementation_constraints.md`、`/TODO.md`；必要时补充 `/docs/project/project_brief.md`、`/docs/project/architecture_overview.md`、`/docs/project/file_index.md`、`/docs/testing/test_strategy.md`、相关 `REQ_*.md` / `BUG_*.md` / 专项细则文档。
  - Bug 修复任务：读取 `BUG_*.md`、阶段文档、实现约束、`/TODO.md`；必要时补充测试文档、项目背景文档、专项细则文档。
  - 需求补充任务：读取 `REQ_*.md`、阶段文档、实现约束、`/TODO.md`；必要时补充项目背景文档、专项细则文档。
  - 阶段收尾 / 交接任务：读取阶段文档、`/TODO.md`、实现约束、当前阶段测试文档、当前阶段关联的 `REQ_*.md` / `BUG_*.md`。
  - 信息不足时：先指出缺少哪些关键信息；先检查是否应回看上位说明文档；不得用想象补全项目事实；不得把不确定内容静默写入正式文档；若对任务边界、文档含义、归档方式或下一步动作不清楚，必须先与 yiyi 确认。

  ### 4.1 细则文件索引

  以下细则文件按需读取：

  | 细则文件 | 主题 | 读取时机 |
  |---|---|---|
  | `/docs/meta/claude_execution_workflows.md` | 动作触发模型、阶段执行、Bug 修复、需求并入、阶段收尾 | 涉及对应任务时 |
  | `/docs/meta/claude_doc_permissions.md` | 文档权限、归档方式、修改边界 | 涉及文档更新/归档时 |
  | `/docs/meta/claude_code_style_guide.md` | 代码注释、docstring 模板、注释边界 | 涉及新增/修改代码时 |
  | `/docs/meta/claude_reporting_guide.md` | 停止交接模板、下一条指令建议、测试表述 | 任务完成需汇报时 |

  ## 5. 执行黄金准则

  以下准则用于减少常见 LLM 编码错误；与项目具体规则并存，默认偏向谨慎而不是速度。

  ### 5.1 先思考，再编码

  含义：不要假设、不要掩盖困惑、不要静默替用户做关键选择。

  - 明确写出关键假设。
  - 若存在多种合理解释，先列出选项与取舍，不要静默选择。
  - 若有明显更简单的方案，应主动指出。
  - 若不确定性会影响范围、行为、风险或验收，应先停下并向 yiyi 说明。
  - 若对任务边界、文档含义、归档方式或下一步动作不清楚，必须先向 yiyi 确认，不能假定。

  ### 5.2 简单优先

  含义：只写解决当前问题所需的最小代码，不为未来假设预埋复杂度。

  - 不添加未被要求的功能。
  - 不为单次使用代码引入额外抽象。
  - 不添加未被要求的"灵活性""可配置性"或假设性扩展。
  - 不为不成立的场景补充过度错误处理。
  - 若实现明显过重，应主动简化。
  - 自检问题：`这份实现是否会被资深工程师评价为过度设计？`

  ### 5.3 外科手术式修改

  含义：只改与当前任务直接相关的内容；只清理自己造成的影响。

  - 不顺手改动相邻代码、注释、格式或命名。
  - 不重构未损坏的部分。
  - 尽量匹配现有风格，而不是强行推行个人偏好。
  - 若发现无关死代码、历史问题或可优化项，可说明，但不主动删除。
  - 仅清理 **本次改动直接导致** 的无用 import、变量、函数或测试残留。
  - 判定标准：每一处改动都应能直接追溯到当前任务。

  ### 5.4 以可验证目标驱动执行

  含义：先定义成功标准，再实现，再验证，再汇报。

  - `修 bug`：先复现，再修复，再验证复现已消失。
  - `加校验`：先明确非法输入与预期行为，再验证。
  - `重构`：先保证前后行为一致，再验证测试通过。
  - 多步骤任务先给出简短计划，并说明每一步如何验证。

  计划模板：

  ```text
  1. [步骤] -> verify: [检查方式]
  2. [步骤] -> verify: [检查方式]
  3. [步骤] -> verify: [检查方式]
  ```

  ### 5.5 澄清与自主执行的平衡

  - Claude Code 不应为了每个微小细节都打断 yiyi。
  - 当选择是局部的、可逆的、低风险的，并且是完成当前明确任务所必需的实现细节时，可以采用合理默认方案继续执行，并在停止汇报中说明采用了什么假设。
  - 当选择会影响架构、依赖、公开行为、CLI/API 契约、数据持久化、权限、安全、搜索来源、错误处理策略、阶段范围、验收标准、正式文档或未来维护成本时，必须先询问 yiyi，或给出具体方案与取舍供 yiyi 选择。
  - 不得因为问题"看起来简单"就跳过澄清。示例：如果 yiyi 只说"添加联网搜索功能"，但没有说明搜索源、入口形式、是否保存结果、权限边界、输出格式、失败处理和验收标准，Claude Code 应先询问或给出方案，而不是静默实现一个默认设计。

  ## 6. 一句话执行模型

  > 默认先读取 `/CLAUDE.md`；必要时回看上位说明文档；按正式文档与专项细则执行；只在 yiyi 明确发起主任务后开始推进；仅在本文件授权范围内自动完成后续动作；代码必须有必要注释和函数说明；停止时必须用"任务主线 + 表格 + TODO 同步情况 + 检查/决策/补充项 + 建议下一条指令"的结构交接；始终以最小改动、可验证结果和清晰边界为原则。
  ```

- [ ] **步骤 3：验证新 CLAUDE.md 结构**

  ```bash
  echo "检查 CLAUDE.md 高频标题："
  grep -n "^## " CLAUDE.md
  echo "---"
  echo "检查是否不再包含低频细则标题："
  grep -c "文档权限与更新规则\|代码书写、注释\|测试、汇报与停止规则\|阶段执行\|Bug 修复\|需求补充\|阶段收尾" CLAUDE.md || echo "无匹配(正确)"
  echo "---"
  echo "检查索引表格："
  grep -c "claude_execution_workflows\|claude_doc_permissions\|claude_code_style_guide\|claude_reporting_guide" CLAUDE.md
  ```
  预期：输出 6 个二级标题(1-6)；无低频细则标题匹配；索引表格出现 4 次匹配。

---

### 任务 6：最终一致性验证

- [ ] **步骤 1：跨文件内容完整性检查**

  确认原 `CLAUDE.md` 中的所有规则条款都已迁移到对应细则文件，无遗漏。

  ```bash
  echo "=== 原文件关键条款计数 ==="
  grep -c "^### " CLAUDE.md.bak
  echo "=== 新文件合计条款计数 ==="
  echo -n "CLAUDE.md: "; grep -c "^### " CLAUDE.md
  echo -n "workflows: "; grep -c "^### \|^## " docs/meta/claude_execution_workflows.md
  echo -n "permissions: "; grep -c "^### \|^## " docs/meta/claude_doc_permissions.md
  echo -n "style: "; grep -c "^### \|^## " docs/meta/claude_code_style_guide.md
  echo -n "reporting: "; grep -c "^### \|^## " docs/meta/claude_reporting_guide.md
  ```
  预期：新 `CLAUDE.md` 条款数减少(低频内容已移出)；4 个细则文件合计包含迁移的条款。

- [ ] **步骤 2：删除备份文件**

  ```bash
  rm CLAUDE.md.bak
  ```

- [ ] **步骤 3：Git 状态确认**

  ```bash
  git status
  ```
  预期：显示 4 个新文件 + 1 个修改文件(`CLAUDE.md`)，无其他意外变更。

---

## 自检

**1. 规格覆盖度：**
- 动作触发模型 → 任务 1 ✓
- 标准执行规则(阶段/Bug/需求/收尾) → 任务 1 ✓
- 文档权限细则 → 任务 2 ✓
- 代码注释模板 → 任务 3 ✓
- 测试汇报停止规则 → 任务 4 ✓
- 主入口重写 + 索引 → 任务 5 ✓
- 一致性验证 → 任务 6 ✓

**2. 占位符扫描：** 无"待定"、"TODO"、"后续实现"、"类似任务 N"。

**3. 类型一致性：** 所有文件路径在任务中一致，无命名漂移。
