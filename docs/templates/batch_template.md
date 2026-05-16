---
文档定位: "通用 Batch 模板。"
模板说明:
  - "这是通用模板，不是当前项目实例。"
  - "实际项目应复制到对应 stage / batch 目录后再填写。"
  - "模板内的 stage_XX、B-XX-YY、T-001 等只是占位示例，不代表真实任务。"
---

# B-XX-YY：<Batch 标题>

## 1. Batch 目标

`<此处填写 Owner 一次授权 Coding Agent 连续推进的任务包目标>`

## 2. 背景与关联文档

- 阶段目标：`/docs/stages/<stage_XX_goal.md>`
- 任务看板：`/TODO.md`
- 实现约束：`/docs/project/implementation_constraints.md`
- 测试策略：`/docs/testing/test_strategy.md`
- Owner Questions：`<owner_questions 实例路径；无则写 无>`
- Worklog：`<worklog 实例路径；无则写 无>`

## 3. 允许 Coding Agent 自动做

- `<此处填写可自动实现、修改、验证或修复的范围>`
- `<此处填写可自动同步的 TODO / worklog / handoff 范围>`
- `<此处填写可自动修复的直接相关失败>`

## 4. 不允许 Coding Agent 自动做

- `<此处填写需要 OwnerGate 的范围>`
- `<此处填写不能修改的 contract / schema / API / 目录结构>`
- `<此处填写不能调用的真实外部服务、secret 或不可逆操作>`

## 5. 自动验收标准

- `<此处填写自动测试、lint、typecheck、构建或本地验证方式>`
- `<此处填写 behavior / expected outcome>`
- `<此处填写 evidence 记录位置>`

## 6. OwnerGate 条件

- `<此处填写触发 Owner 决策、授权、验收或澄清的条件>`
- `<此处填写自动验证无法覆盖的判断>`
- `<此处填写影响后续扩展成本的路线选择>`

## 7. Owner E2E 验收点

- `<此处填写完整用户路径>`
- `<此处填写高风险变更验收点>`
- `<此处填写真实 provider / 外部服务 smoke 判断点>`

## 8. 完成后应更新的文件

- `/TODO.md`
- `worklog`
- `handoff`
- `owner_questions`，如有新增决策点

## 9. 不应更新的文件

- 只读项目约束文档，除非 Owner 明确授权。
- 与当前 Batch 无关的业务代码。
- 与当前 Batch 无关的模板或历史归档。

## 10. 收尾要求

- verification 已执行或说明无法执行原因。
- evidence 已记录。
- TODO 状态已同步。
- worklog 已同步。
- handoff 已同步。
- Owner 未明确验收前，不标记为 `accepted`。
- 无未解释的大规模改动。
