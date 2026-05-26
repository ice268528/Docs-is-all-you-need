---
文档定位: "当前阶段目标与边界。"
作者: "Planning AI 起草，Owner 定稿"
目标对象:
  - "Owner"
  - "Coding Agent"
Agent权限: "询问后可改"
当前操作者提醒:
  - "本文件只定义当前阶段目标、非目标、推荐 Batch 拆分、阶段级验收标准和 OwnerGate 条件。"
  - "不要在此重复项目背景；项目级信息请引用 /docs/project/project_brief.md。"
  - "新增需求只有在 Owner 明确决定并入当前阶段后，才应写入本文件。"
  - "具体任务看板、执行过程、Owner 决策记录分别进入 TODO、worklog、owner_questions。"
---

<!-- 本模板建议另存为 /docs/stages/stage_XX_goal.md -->
# stage_XX_goal

## 1. 阶段信息

- 阶段编号：`<stage_XX>`
- 阶段名称：`<此处填写>`
- 当前状态：`<todo / doing / candidate_done / reviewing / done / rejected / owner_gate / ready_for_e2e / owner_accepted / blocked / archived / dropped>`
- 阶段一句话目标：`<此处填写>`
- 关联项目说明：`/docs/project/project_brief.md`
- 关联实现约束：`/docs/project/implementation_constraints.md`
- 关联 TODO：`/TODO.md`
- 相关 REQ：`<已并入或待并入的 REQ；无则写 无>`
- Owner Questions：`<复制自 /docs/templates/owner_questions_template.md 的实际文件路径；无则写 无>`
- Worklog：`<复制自 /docs/templates/worklog_template.md 的实际文件路径；无则写 无>`

## 2. Stage 目标

- [ ] `<此处填写本阶段完成后必须成立的总体结果>`
- [ ] `<此处填写本阶段完成后必须成立的总体结果>`

## 3. 非目标

<!-- 本节用于防止阶段边界漂移。 -->

- [ ] `<此处填写当前阶段明确不做的事项>`
- [ ] `<此处填写当前阶段明确不做的事项>`

## 4. 前置依赖 / 进入条件

- [ ] `<此处填写影响本阶段启动或推进的前提条件>`
- [ ] `<此处填写影响本阶段启动或推进的前提条件>`

## 5. 推荐拆分 Batch

<!-- Batch 实例可从 /docs/templates/batch_template.md 复制后填写。 -->

| Batch ID | Batch 目标 | 允许 Agent 自动做 | 不允许 Agent 自动做 | 验证出口 |
|---|---|---|---|---|
| `B-XX-01` | `<此处填写>` | `<此处填写摘要>` | `<OwnerGate 摘要>` | `<candidate_done 证据 / done 审查结论 / ready_for_e2e 集成条件>` |

## 6. 本阶段交付项

### D-01 `<交付项名称>`

- 目标：`<交付项要解决什么>`
- 范围内：`<包含哪些行为 / 页面 / 接口 / 结果>`
- 明确不含：`<容易混淆但本阶段不做的部分>`
- 建议 Batch：`<B-XX-01 / 待拆分>`
- 前置依赖：`<无 / REQ_xxx / 决策 / 外部条件>`
- 关联文档：`<REQ / 报告 / 设计资料；无则写 无>`

#### 验收标准（Verify）

- [ ] `<功能 / 行为级验收标准>`
- [ ] `<自动验证、构建、类型检查、lint 或观察方式>`
- [ ] `<是否进入 ready_for_e2e，以及 Owner 验收关注点>`

## 7. 阶段级验收标准

| 验收点 | Verify 方式 | Evidence 位置 | 责任人 |
|---|---|---|---|
| `<此处填写>` | `<自动测试 / E2E / 手动验证 / 构建 / 类型检查 / 其他>` | `<worklog / handoff / 日志 / 截图路径>` | `<Coding Agent / Owner>` |

## 8. OwnerGate 条件

<!-- 只写本阶段特有的 OwnerGate；通用 OwnerGate 规则见 /docs/meta/agent_execution_workflows.md。 -->

- [ ] `<改变阶段目标、范围、完成定义或验收标准时必须暂停>`
- [ ] `<改变 contract / schema / API / 目录结构 / 架构路线时必须暂停>`
- [ ] `<涉及真实 provider、secret、成本、外部服务、发布、删除、迁移或不可逆操作时必须暂停>`
- [ ] `<自动测试无法覆盖关键正确性，只能靠 Owner 判断时必须暂停>`

## 9. ready_for_e2e 判断

- 进入条件：`<哪些 Batch / Task 已达到 done，并经过 Controller Integration Review 后可组成完整用户路径>`
- 用户路径：`<此处填写主要端到端路径>`
- Owner 验收入口：`<页面 / 命令 / 环境 / 步骤>`
- 不需要逐项手测的内容：`<此处填写已由自动验证覆盖的低风险任务>`

## 10. 不应由 Agent 擅自改变的边界

- [ ] `<阶段目标或非目标>`
- [ ] `<长期实现约束>`
- [ ] `<contract / schema / API / 目录结构>`
- [ ] `<验收标准或 Owner 决策结论>`

## 11. 需求并入记录

| REQ 文档 | 是否并入当前阶段 | 决定日期 | 备注 |
|---|---|---|---|
| `<docs/changes/REQ_*.md>` | `<是 / 否 / 待定>` | `<YYYY-MM-DD>` | `<此处填写>` |

## 12. 阶段收尾应输出的产物

- [ ] `/docs/handoffs/<stage_XX_summary.md>`
- [ ] `/docs/testing/<stage_XX_manual_test.md>`
- [ ] `/docs/TODO_backup/<TODO_YYYYMMDD_HH.md>`
- [ ] `<worklog 实例路径>`
- [ ] `<owner_questions 实例路径；无则写 无>`
