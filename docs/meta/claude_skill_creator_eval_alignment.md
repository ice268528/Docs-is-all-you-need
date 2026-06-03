# Claude Skill-Creator Eval Alignment

Date: 2026-06-02

This note records how the DIAYN V1 Claude Code surface maps to the local
Claude `skill-creator` expectations. It is intentionally separate from the
Codex package notes because Claude and Codex skills have different metadata,
installation, and validation rules.

Reference authority:

```text
git@github.com:anthropics/skills.git
```

When this document shows `<claude-skill-creator>` in a command, it means the
local checkout path for that official Anthropic `skills` repository.

## Current Scope

The proven Claude surface is:

```text
packages/claude-project-local/
```

This package exposes:

- 12 project-local bare `/diayn-*` command adapters;
- 12 DIAYN public workflow skills;
- 23 DIAYN-managed vendored `agent-skills` dependency skills;
- `.diayn` dependency routing, references, licenses, and internal role
  references.

The repository-root Claude plugin entrypoint is statically validated, but local
`--plugin-dir` probing observed namespaced plugin commands. The project-local
package is therefore the current Claude alpha surface for bare `/diayn-*`
runtime proof.

## Mapping To Claude Skill-Creator Expectations

| Claude skill-creator expectation | DIAYN status | DIAYN evidence | Boundary |
| --- | --- | --- | --- |
| Skill is a folder with `SKILL.md` | Satisfied for workflow and dependency skills | `validation/phase9_claude_project_local_package.json`; `validation/phase4_alpha_package.json` | Applies to packaged skills, not to command adapters. |
| Frontmatter has `name` and `description` | Satisfied by package validators | `validation/phase2_public_skill_surface.json`; `validation/phase9_claude_project_local_package.json` | Description quality still benefits from future trigger eval runs. |
| `SKILL.md` uses progressive disclosure | Satisfied by structure and workflow references | `skills/*/SKILL.md`; `plugins/docs-is-all-you-need/skills/*/SKILL.md`; package validators | Long protocol details live in `references/`, `assets/`, and `scripts/`. |
| Native skill invocation is proven | Proven for the Claude project-local package | `validation/phase9_claude_project_local_probe.json`; `validation/phase9_claude_project_local_routed_dependency_probe.json` | Plugin-dir namespaced commands are separately documented and are not the bare-command alpha surface. |
| Full workflow behavior is evaluated | Proven for the Claude project-local installed-flow fixture | `validation/phase11_installed_flow_fixture.json`; `validation/phase12_side_scenarios.json` | This is DIAYN's command workflow fixture, not a generic with-skill vs baseline benchmark. |
| Trigger eval set exists | Seed set exists | `validation/claude_skill_creator_trigger_eval_sets.json` | These prompts are ready for future `run_eval.py` or equivalent runs; they are not recorded as executed benchmark results. |
| With-skill vs baseline benchmark | Not complete | No committed `benchmark.json` for this package-level Claude eval | DIAYN must not claim broad automatic trigger superiority from benchmark data yet. |
| Eval viewer / human review loop | Planned, not completed | This document and the trigger eval seed set define the next loop | Use the Claude `eval-viewer/generate_review.py` flow when benchmark outputs exist. |

## Eval Strategy For DIAYN

DIAYN is a multi-command workflow package rather than one isolated skill, so the
Claude skill-creator loop is applied in layers:

1. Trigger evals check whether each workflow skill description and intent are
   distinguishable from adjacent DIAYN commands.
2. Command adapter probes check whether `/diayn-*` enters the intended native
   workflow skill.
3. Dependency probes check whether DIAYN-managed third-party skills are
   platform-visible and invokable through the native Skill tool.
4. Installed-flow fixtures check whether the whole workflow produces the
   expected scaffold, lane, review, sync, integration, Owner acceptance, bug,
   closeout, and next-stage artifacts.
5. Future benchmark runs should compare with-skill and baseline behavior and
   generate a review HTML using the local Claude skill-creator viewer.

## Claims Allowed Today

Allowed:

- Claude Code project-local package is an alpha-supported DIAYN surface.
- Bare `/diayn-*` command entry is proven for the project-local package.
- DIAYN-managed dependency skills are platform-visible in that package.
- A representative routed dependency invocation from `/diayn-init` to
  `idea-refine` is proven.
- The installed-flow fixture completes the full DIAYN V1 command sequence on
  the controlled fixture.

Not allowed:

- A marketplace/plugin install claim for bare `/diayn-*` unless that surface is
  separately proven.
- A claim that all DIAYN workflow skills have completed Claude trigger
  optimization.
- A claim that with-skill vs baseline benchmarks have been run.
- A Codex Desktop app-session runtime claim; the current Codex claim is limited
  to package/install validation and explicitly does not attempt Desktop runtime.

## Next Claude Eval Loop

When the next maintainer run is authorized:

1. Split `validation/claude_skill_creator_trigger_eval_sets.json` into per-skill
   eval sets compatible with the local Claude skill-creator `run_eval.py`.
2. Run trigger evals for the 12 public workflow skills.
3. For workflow behavior, run with-skill and baseline prompts against a clean
   fixture and save outputs under a dedicated eval workspace.
4. Save `eval_metadata.json`, `timing.json`, `grading.json`, and
   `benchmark.json` according to the Claude skill-creator schema.
5. Generate a static review HTML with:

```text
python <claude-skill-creator>/eval-viewer/generate_review.py <workspace>/iteration-N --skill-name "docs-is-all-you-need" --benchmark <workspace>/iteration-N/benchmark.json --static <output.html>
```

Do not update support claims until the generated benchmark and human review are
available as concrete evidence.
