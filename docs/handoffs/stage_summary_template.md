---
文档定位: "阶段或 Batch 交接摘要。"
作者: "Coding Agent 初稿，Owner 确认"
目标对象:
  - "Owner"
  - "Planning AI"
  - "Coding Agent"
Agent权限: "询问后可改"
当前操作者提醒:
  - "本文件总结阶段或 Batch 主线、auto_verified 内容、ready_for_e2e 用户路径、未解决 OwnerGate、风险、下一步建议和关键 evidence。"
  - "这是收尾/交接文档，不再重新定义阶段目标，也不复制 TODO 全量内容。"
  - "若已被 Owner 确认为正式阶段记录，后续修改前应先说明修改原因。"
---

<!-- 另存为 /docs/handoffs/stage_XX_summary.md 或 Batch 交接文件 -->
# stage_XX_summary

## 1. 主线摘要

- 交接类型：`<stage / batch>`
- 阶段编号：`<stage_XX>`
- Batch：`<B-XX-YY / 阶段级>`
- 时间范围：`<此处填写>`
- 关联阶段文档：`/docs/stages/<stage_XX_goal.md>`
- 关联 TODO 快照：`/docs/TODO_backup/<TODO_YYYYMMDD_HH.md>`
- Worklog：`<此处填写 worklog 实例路径>`
- Owner Questions：`<此处填写 owner_questions 实例路径；无则写 无>`
- 一句话总结：`<本阶段或 Batch 实际完成了什么>`

## 2. 已完成且 auto_verified 的内容

| ID | 内容 | verification | evidence | 备注 |
|---|---|---|---|---|
| `<T-001 / B-XX-YY>` | `<此处填写>` | `<命令 / 检查方式>` | `<日志 / 截图 / 路径 / 摘要>` | `<此处填写>` |

## 3. ready_for_e2e 用户路径

| ID | 用户路径 | 包含任务 | 自动验证摘要 | Owner 验收入口 |
|---|---|---|---|---|
| `E2E-001` | `<此处填写>` | `<T-001, T-002>` | `<evidence 摘要>` | `<页面 / 命令 / 环境 / 步骤>` |

## 4. 验证与测试结果

- 自动验证：`<执行了哪些命令、结果如何、evidence 在哪里>`
- 手动验收：`<范围、结果或未完成原因>`
- 未完成验证：`<无 / 此处填写>`
- 当前可确认状态：`<auto_verified / ready_for_e2e / accepted / blocked / owner_gate>`

## 5. 未解决 OwnerGate

| QID | 问题 | 影响范围 | 推荐默认方案 | 下一步 |
|---|---|---|---|---|
| `Q-001` | `<此处填写>` | `<stage / batch / task / contract / schema / API>` | `<此处填写>` | `<等待 Owner 回复 / 已同步>` |

## 6. 风险和默认策略

- 遗留风险：`<无 / 此处填写>`
- 外部阻塞：`<无 / 此处填写>`
- 若 Owner 暂不回复的默认策略：`<不能继续 / 可先做低风险默认实现并记录 / 其他>`

## 7. 需求与缺陷处理结果

### 7.1 REQ 处理情况

| REQ 文档 | 处理结果 | 是否并入本阶段 | 备注 |
|---|---|---|---|
| `<此处填写>` | `<已完成 / 延后 / 未处理>` | `<是 / 否>` | `<此处填写>` |

### 7.2 BUG 处理情况

| BUG 文档 | 处理结果 | 当前状态 | 备注 |
|---|---|---|---|
| `<此处填写>` | `<已修复 / 未修复 / 延后>` | `<open / closed>` | `<此处填写>` |

## 8. 当前代码状态与影响范围

- 本阶段或 Batch 主要改动区域：`<此处填写>`
- 当前稳定区域：`<此处填写>`
- 需要谨慎继续修改的区域：`<此处填写>`
- 未完成但已落地的中间状态：`<无 / 此处填写>`

## 9. 下一步建议

- [ ] `<下一阶段或下一 Batch 建议优先处理的事项>`
- [ ] `<下一条建议指令或 Owner 决策>`

## 10. 交接清单

- [ ] `/TODO.md` 已更新或已说明不适用。
- [ ] `worklog` 已同步。
- [ ] `owner_questions` 已同步或已说明无未决问题。
- [ ] `handoff` 已写入关键 evidence 位置。
- [ ] 无未解释的大规模改动。
- [ ] 未复制 TODO 全量内容到 handoff。

