---
文档定位: "通用 Task Board 模板。"
模板说明:
  - "这是通用模板，不是当前项目实例。"
  - "实际项目应复制到对应 stage / batch 目录后再填写。"
  - "模板内的 stage_XX、B-XX-YY、T-001 等只是占位示例，不代表真实任务。"
---

# Task Board

## 1. 来源

- 阶段：`<stage_XX>`
- Batch：`<B-XX-YY / 无>`
- 关联 TODO：`/TODO.md`
- 关联 Batch 文档：`<此处填写；无则写 无>`
- Worklog：`<此处填写 worklog 实例路径；无则写 无>`
- Owner Questions：`<此处填写 owner_questions 实例路径；无则写 无>`

## 2. WIP=1

- 一个 Batch 内可以有多个 task，但任意时刻只允许一个 task 处于 `doing`。
- 历史细节进入 worklog，不堆到任务看板。

## 3. 任务总表

| id | state | title | behavior / expected outcome | verification | evidence | owner_decision_required | next |
|---|---|---|---|---|---|---|---|
| `T-001` | `<todo>` | `<任务标题>` | `<完成后必须成立的行为或结果>` | `<验证方式>` | `<证据路径或摘要>` | `<true / false>` | `<下一步>` |

## 4. 任务明细

### T-001：<任务标题>

- id：`T-001`
- title：`<任务标题>`
- behavior / expected outcome：`<完成后必须成立的行为或结果>`
- scope：`<范围内事项>`
- out_of_scope：`<明确不做事项>`
- verification：`<自动测试 / lint / typecheck / 构建 / 本地验证 / 手动观察口径>`
- state：`<todo / doing / auto_verified / owner_gate / ready_for_e2e / accepted / blocked / archived / dropped>`
- evidence：`<命令、日志摘要、截图、路径或未执行原因>`
- depends_on：`<无 / T-000 / D-001 / Q-001>`
- owner_decision_required：`<true / false>`
- notes：`<简短备注；详细过程写入 worklog>`

## 5. 状态规则

- 没有 verification plan / 验证方式的任务不能进入 `doing`。
- 没有执行 verification 并记录 evidence 的任务不能进入 `auto_verified`。
- 没有 Owner 明确验收的任务不能进入 `accepted`。
- `owner_decision_required=true` 的任务必须进入 `owner_gate` 或 `blocked`。
- 历史细节进入 worklog，不堆到任务看板。
