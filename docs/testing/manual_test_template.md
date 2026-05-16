---
文档定位: "阶段级或 Batch 级手动验收说明。"
作者: "Coding Agent"
目标对象:
  - "Owner"
Agent权限: "自动可改"
当前操作者提醒:
  - "本文件提供给 Owner 的端到端、阶段级、高风险、真实 provider / 外部服务 smoke 或架构 / contract 接受验收步骤。"
  - "Owner 不应逐项手测每个小 TODO；低风险任务由自动测试、本地验证、mock run、schema validation、lint/typecheck 兜底。"
  - "多个 auto_verified 任务组成完整用户路径后，才进入 ready_for_e2e。"
  - "若某项失败需要进入正式修复流程，请转为 BUG 文档。"
---

<!-- 另存为 /docs/testing/stage_XX_manual_test.md -->
# stage_XX_manual_test

## 1. 测试基本信息

- 对应阶段：`<stage_XX>`
- 对应 Batch：`<B-XX-YY / 阶段级>`
- 适用版本 / 分支 / 提交：`<此处填写>`
- 测试环境：`<此处填写>`
- 测试时间建议：`<此处填写>`
- 测试人：`Owner`
- 关联 TODO：`/TODO.md`
- 关联阶段文档：`/docs/stages/<stage_XX_goal.md>`
- Worklog：`<此处填写 evidence 记录位置>`
- Owner Questions：`<此处填写；无则写 无>`

## 2. 手动验收适用范围

Owner 只需要重点验收：

- 端到端用户路径验收。
- 阶段级验收。
- 高风险变更验收。
- 真实 provider / 外部服务 smoke 结果判断。
- 架构 / contract 接受验收。

不建议 Owner 逐项手测每个小 TODO。低风险任务应由 Coding Agent 通过自动测试、本地校验、mock run、schema validation、lint/typecheck 等方式完成，并在 worklog 中记录 evidence。

## 3. 执行前准备

- 测试账号：`<此处填写>`
- 测试数据：`<此处填写>`
- 环境准备：`<此处填写>`
- 已知限制：`<无 / 此处填写>`
- 已达到 `ready_for_e2e` 的依据：`<auto_verified 任务与 evidence 摘要>`

## 4. 执行说明

- 结果标记：`pass / fail / blocked`
- 失败反馈方式：`<创建 BUG 文档 / 回复 OwnerGate / 直接记录到 owner_questions>`
- 证据建议：`<截图 / 录屏 / 控制台日志 / 网络请求信息 / smoke 输出>`
- 如遇阻塞：`<先记录在哪一步、缺什么条件、是否需要 OwnerGate>`

## 5. 验收总表

| ID | 验收类型 | 用户路径 / 判断点 | 包含任务 | 入口 | 预期结果 |
|---|---|---|---|---|---|
| `MT-01` | `<E2E / 阶段级 / 高风险 / provider smoke / contract>` | `<此处填写>` | `<T-001, T-002>` | `<页面 / 命令 / 环境>` | `<此处填写>` |

## 6. 详细验收项

### MT-01 `<验收项名称>`

- 验收类型：`<E2E / 阶段级 / 高风险 / provider smoke / contract>`
- 目标：`<为什么需要 Owner 人工判断>`
- 已自动验证摘要：`<auto_verified evidence 摘要>`
- 前置条件：`<此处填写>`
- 验收步骤：
  1. `<步骤 1>`
  2. `<步骤 2>`
  3. `<步骤 3>`
- 预期结果：`<此处填写>`
- 实际结果：`<Owner 填写>`
- 结果：
  - [ ] `pass`
  - [ ] `fail`
  - [ ] `blocked`
- 备注 / 证据：`<Owner 填写>`

## 7. 失败反馈模板

```text
验收项：
失败步骤：
实际结果：
预期结果：
证据：
是否可稳定复现：
是否阻塞 accepted：
补充说明：
```

