#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const workspaceRoot = path.resolve(repoRoot, "..");
const requirementPath = path.join(workspaceRoot, "DDDV8", "diayn_v1_skill_pack_requirements.md");

const expectedCommands = [
  "/diayn-init",
  "/diayn-plan",
  "/diayn-worktrees",
  "/diayn-backend",
  "/diayn-frontend",
  "/diayn-review-backend",
  "/diayn-review-frontend",
  "/diayn-sync",
  "/diayn-integration",
  "/diayn-bug",
  "/diayn-new",
  "/diayn-html",
];

function readJson(errors, relative) {
  const file = path.join(repoRoot, relative);
  if (!fs.existsSync(file)) {
    errors.push(`missing ${relative}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`invalid JSON in ${relative}: ${error.message}`);
    return null;
  }
}

function readText(errors, fileOrRelative, options = {}) {
  const file = options.absolute ? fileOrRelative : path.join(repoRoot, fileOrRelative);
  if (!fs.existsSync(file)) {
    errors.push(`missing ${options.absolute ? file : fileOrRelative}`);
    return "";
  }
  return fs.readFileSync(file, "utf8");
}

function includesAll(list, required) {
  return required.every((item) => list.includes(item));
}

function unique(values) {
  return [...new Set(values)];
}

function statusFromChecks(checks, blockers = []) {
  if (blockers.length) return "blocked";
  if (checks.every(Boolean)) return "proven";
  if (checks.some(Boolean)) return "partial";
  return "missing";
}

function installResidueAccountingOk(record, totalPackageSkillCount) {
  if (!record || !record.target_preflight || !record.installed_result) return false;
  const preflight = record.target_preflight;
  const installed = record.installed_result;
  const expectedPreserved = installed.total_installed_skill_count - totalPackageSkillCount;
  return (
    typeof preflight.existing_skill_count === "number" &&
    typeof preflight.existing_non_package_skill_count === "number" &&
    Array.isArray(preflight.existing_non_package_skills) &&
    preflight.existing_non_package_skills.length === preflight.existing_non_package_skill_count &&
    typeof preflight.existing_legacy_internal_skill_count === "number" &&
    Array.isArray(preflight.existing_legacy_internal_skills) &&
    preflight.existing_legacy_internal_skills.length === preflight.existing_legacy_internal_skill_count &&
    typeof installed.total_installed_skill_count === "number" &&
    installed.preserved_non_package_skill_count === expectedPreserved &&
    Array.isArray(installed.preserved_non_package_skills) &&
    installed.preserved_non_package_skills.length === installed.preserved_non_package_skill_count &&
    typeof installed.preserved_legacy_internal_skill_count === "number" &&
    Array.isArray(installed.preserved_legacy_internal_skills) &&
    installed.preserved_legacy_internal_skills.length === installed.preserved_legacy_internal_skill_count &&
    installed.preserved_legacy_internal_skill_count <= installed.preserved_non_package_skill_count
  );
}

function makeRequirement(id, title, status, evidence, gaps = []) {
  return { id, title, status, evidence, gaps };
}

function main() {
  const outputIndex = process.argv.indexOf("--json");
  const outputPath = outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  if (outputIndex >= 0 && !outputPath) throw new Error("--json requires an output path");

  const errors = [];
  const requirement = readText(errors, requirementPath, { absolute: true });
  const requirementHeadings = unique([...requirement.matchAll(/^## ([0-9]+)\. (.+)$/gm)].map((match) => ({
    section: Number(match[1]),
    title: match[2],
  })));
  const requirementCommands = unique([...requirement.matchAll(/`(\/diayn-[a-z-]+)`/g)].map((match) => match[1]))
    .filter((command) => expectedCommands.includes(command))
    .sort();

  const phase2 = readJson(errors, "validation/phase2_public_skill_surface.json");
  const phase3 = readJson(errors, "validation/phase3_dependency_skills.json");
  const phase4 = readJson(errors, "validation/phase4_alpha_package.json");
  const phase5 = readJson(errors, "validation/phase5_controller_assets.json");
  const phase6 = readJson(errors, "validation/phase6_worktrees.json");
  const phase7 = readJson(errors, "validation/phase7_workflows.json");
  const phase8 = readJson(errors, "validation/phase8_owner_utilities.json");
  const releaseGate = readJson(errors, "validation/phase9_release_gate.json");
  const matrix = readJson(errors, "validation/phase9_capability_matrix.json");
  const phase11Fixture = readJson(errors, "validation/phase11_installed_flow_fixture.json");
  const phase12Side = readJson(errors, "validation/phase12_side_scenarios.json");
  const claudePackage = readJson(errors, "validation/phase9_claude_project_local_package.json");
  const claudeSkillCreatorAlignment = readJson(errors, "validation/phase9_claude_skill_creator_alignment.json");
  const codexPackage = readJson(errors, "validation/phase9_codex_project_local_package.json");
  const codexInstallFixture = readJson(errors, "validation/phase9_codex_project_local_install_fixture.json");
  const codexHomeInstallFixture = readJson(errors, "validation/phase9_codex_home_install_fixture.json");
  const codexExternalRuntimeEvidence = readJson(errors, "validation/phase9_codex_runtime_external_evidence.json");
  const codexExternalRuntimeEvidenceSelftest = readJson(errors, "validation/phase9_codex_runtime_external_evidence_selftest.json");

  const publicSkillCommands = phase2 && Array.isArray(phase2.expected_public_skills)
    ? phase2.expected_public_skills.map((name) => `/${name}`)
    : [];
  const pluginExactSurfaceOk = Boolean(
    phase2 &&
      phase2.ok === true &&
      phase2.plugin_public_skills &&
      phase2.plugin_public_skills.ok === true &&
      includesAll(publicSkillCommands, expectedCommands)
  );
  const rootPublicSurfaceOk = Boolean(
    phase2 &&
      phase2.root_skills &&
      phase2.root_skills.ok === true &&
      includesAll(publicSkillCommands, expectedCommands)
  );
  const alphaPackageOk = Boolean(phase4 && phase4.ok === true && phase4.public_skill_count === 12);
  const claudePackageOk = Boolean(
    claudePackage &&
      claudePackage.ok === true &&
      claudePackage.command_count === 12 &&
      claudePackage.workflow_skill_count === 12 &&
      claudePackage.dependency_skill_count > 0
  );
  const codexStaticPackageOk = Boolean(
    codexPackage &&
      codexPackage.ok === true &&
      codexPackage.workflow_skill_count === 12 &&
      codexPackage.dependency_skill_count === 23 &&
      codexPackage.total_project_local_skill_count === 35 &&
      codexPackage.runtime_validation &&
      codexPackage.runtime_validation.direct_diayn_invocation === "not_attempted_current_scope"
  );
  const codexExternalRuntimeEvidenceOk = Boolean(
    codexExternalRuntimeEvidence &&
      codexExternalRuntimeEvidence.ok === true &&
      codexExternalRuntimeEvidence.runtime_proven === false &&
      codexExternalRuntimeEvidence.blocker_id === "P9-CODEX-001" &&
      Array.isArray(codexExternalRuntimeEvidence.expected_commands) &&
      codexExternalRuntimeEvidence.expected_commands.length === 12 &&
      Array.isArray(codexExternalRuntimeEvidence.gaps) &&
      codexExternalRuntimeEvidence.gaps.length > 0
  );
  const codexExternalRuntimeEvidenceSelftestOk = Boolean(
    codexExternalRuntimeEvidenceSelftest &&
      codexExternalRuntimeEvidenceSelftest.ok === true &&
      codexExternalRuntimeEvidenceSelftest.cases &&
      codexExternalRuntimeEvidenceSelftest.cases.complete_concrete_evidence_clears_blocker === true &&
      codexExternalRuntimeEvidenceSelftest.cases.placeholder_template_remains_blocked === true &&
      codexExternalRuntimeEvidenceSelftest.cases.nonexistent_evidence_refs_remain_blocked === true &&
      codexExternalRuntimeEvidenceSelftest.cases.missing_input_remains_blocked === true &&
      codexExternalRuntimeEvidenceSelftest.gaps_observed &&
      codexExternalRuntimeEvidenceSelftest.gaps_observed.nonexistent_refs > 0 &&
      codexExternalRuntimeEvidenceSelftest.gaps_observed.template > 0 &&
      codexExternalRuntimeEvidenceSelftest.gaps_observed.missing > 0
  );
  const codexInstallFixtureOk = Boolean(
    codexInstallFixture &&
      codexInstallFixture.ok === true &&
      codexInstallFixture.mode === "execute" &&
      codexInstallFixture.fixture_mode === true &&
      codexInstallFixture.installed_result &&
      codexInstallFixture.installed_result.installed_package_visible === true &&
      codexInstallFixture.installed_result.installed_workflow_skill_count === 12 &&
      codexInstallFixture.installed_result.installed_dependency_skill_count === 23 &&
      codexInstallFixture.installed_result.metadata_present === true &&
      codexInstallFixture.installed_result.routing_map_present === true &&
      installResidueAccountingOk(codexInstallFixture, 35)
  );
  const codexHomeInstallFixtureOk = Boolean(
    codexHomeInstallFixture &&
      codexHomeInstallFixture.ok === true &&
      codexHomeInstallFixture.mode === "execute" &&
      codexHomeInstallFixture.fixture_mode === true &&
      codexHomeInstallFixture.install_surface === "codex_home" &&
      codexHomeInstallFixture.installed_result &&
      codexHomeInstallFixture.installed_result.installed_package_visible === true &&
      codexHomeInstallFixture.installed_result.installed_workflow_skill_count === 12 &&
      codexHomeInstallFixture.installed_result.installed_dependency_skill_count === 23 &&
      codexHomeInstallFixture.installed_result.metadata_present === true &&
      codexHomeInstallFixture.installed_result.routing_map_present === true &&
      installResidueAccountingOk(codexHomeInstallFixture, 35)
  );
  const dependencyOk = Boolean(
    phase3 &&
      phase3.ok === true &&
      phase3.vendor_skill_count === phase3.packaged_dependency_skill_count &&
      phase3.manual_upstream_update_report_present === true &&
      phase3.package_size_bytes &&
      phase3.package_size_bytes.vendor_skills > 0 &&
      phase3.package_size_bytes.packaged_dependency_skills > 0
  );
  const sideScenariosOk = Boolean(
    phase12Side &&
      phase12Side.ok === true &&
      phase12Side.side_scenarios &&
      Object.values(phase12Side.side_scenarios).every((value) => value === true)
  );
  const installedFlowOk = Boolean(
    phase11Fixture &&
      phase11Fixture.ok === true &&
      phase11Fixture.installed_flow_complete === true &&
      phase11Fixture.claude &&
      Array.isArray(phase11Fixture.claude.commands_requested) &&
      includesAll(phase11Fixture.claude.commands_requested, expectedCommands) &&
      phase11Fixture.claude.command_execution_ok === true &&
      Array.isArray(phase11Fixture.workflow_errors) &&
      phase11Fixture.workflow_errors.length === 0
  );
  const codexDesktopAppSessionRuntimeNotClaimed = Boolean(
    matrix &&
      matrix.validation_scope &&
      matrix.validation_scope.codex_desktop_app_session_runtime === "not_attempted_current_scope" &&
      matrix.validation_scope.codex_runtime_claim_allowed === false &&
      matrix.surfaces &&
      matrix.surfaces.codex_desktop &&
      matrix.surfaces.codex_desktop.alpha_claim_allowed === false &&
      matrix.surfaces.codex_desktop.package_install_claim_allowed === true &&
      Array.isArray(matrix.warnings) &&
      matrix.warnings.some((item) => item.id === "W9-CODEX-RUNTIME-NOT-ATTEMPTED")
  );
  const codexPackageInstallScopeOk = Boolean(
    codexStaticPackageOk &&
      codexInstallFixtureOk &&
      codexHomeInstallFixtureOk &&
      codexExternalRuntimeEvidenceOk &&
      codexExternalRuntimeEvidenceSelftestOk &&
      codexDesktopAppSessionRuntimeNotClaimed
  );
  const opencodeDeferred = Boolean(
    matrix &&
      matrix.surfaces &&
      matrix.surfaces.opencode_cli &&
      matrix.surfaces.opencode_cli.status === "deferred"
  );
  const releaseGateHonest = Boolean(
    releaseGate &&
      releaseGate.ok === true &&
      releaseGate.release_ready === true &&
      releaseGate.phase12_side_scenarios_ok === true &&
      releaseGate.claude_skill_creator_alignment_ok === true &&
      releaseGate.codex_package_install_scope_ok === true &&
      releaseGate.codex_app_session_runtime_current_scope_boundary_ok === true &&
      Array.isArray(releaseGate.supported_alpha_surfaces) &&
      releaseGate.supported_alpha_surfaces.includes("claude_code_cli_project_local") &&
      releaseGate.supported_alpha_surfaces.includes("codex_package_install") &&
      !releaseGate.supported_alpha_surfaces.includes("codex_desktop") &&
      Array.isArray(releaseGate.blocking_issue_ids) &&
      releaseGate.blocking_issue_ids.length === 0
  );

  if (requirementHeadings.length !== 12) {
    errors.push(`requirement source should have 12 numbered sections, found ${requirementHeadings.length}`);
  }
  if (!includesAll(requirementCommands, expectedCommands)) {
    errors.push("requirement source command list does not contain all 12 expected /diayn-* commands");
  }
  if (!pluginExactSurfaceOk) errors.push("plugin public skill surface is not proven exact");
  if (!dependencyOk) errors.push("dependency skill validation is not strong enough");
  if (!installedFlowOk) errors.push("installed flow is not proven for all 12 commands");
  if (!sideScenariosOk) errors.push("Phase 12 side scenarios are not proven");
  if (!releaseGateHonest) errors.push("release gate is not in the expected Owner-approved package/install ready state");
  const claudeSkillCreatorAlignmentOk = Boolean(
    claudeSkillCreatorAlignment &&
      claudeSkillCreatorAlignment.ok === true &&
      claudeSkillCreatorAlignment.trigger_eval_sets_ready === true &&
      claudeSkillCreatorAlignment.project_local_runtime_evidence_complete === true &&
      claudeSkillCreatorAlignment.benchmark_complete === false &&
      claudeSkillCreatorAlignment.broad_auto_trigger_claim_allowed === false
  );

  const requirements = [
    makeRequirement(
      1,
      "Core Positioning",
      statusFromChecks([pluginExactSurfaceOk, rootPublicSurfaceOk, alphaPackageOk, claudePackageOk, codexPackageInstallScopeOk]),
      [
        "validation/phase2_public_skill_surface.json",
        "validation/phase4_alpha_package.json",
        "validation/phase9_codex_project_local_package.json",
        "validation/phase9_codex_project_local_install_fixture.json",
        "validation/phase9_codex_home_install_fixture.json",
        "validation/phase9_codex_runtime_external_evidence.json",
        "validation/phase9_codex_runtime_external_evidence_selftest.json",
        "validation/phase9_claude_project_local_package.json",
        "validation/phase9_claude_skill_creator_alignment.json",
        "validation/phase9_capability_matrix.json",
      ],
      [],
    ),
    makeRequirement(
      2,
      "Harness Principles",
      statusFromChecks([
        phase5 && phase5.ok === true,
        phase6 && phase6.ok === true,
        phase7 && phase7.ok === true,
        phase8 && phase8.ok === true,
        sideScenariosOk,
      ]),
      [
        "validation/phase5_controller_assets.json",
        "validation/phase6_worktrees.json",
        "validation/phase7_workflows.json",
        "validation/phase8_owner_utilities.json",
        "validation/phase12_side_scenarios.json",
      ],
    ),
    makeRequirement(
      3,
      "Workflow Skill And Command Model",
      statusFromChecks([pluginExactSurfaceOk, claudePackageOk, claudeSkillCreatorAlignmentOk, codexPackageInstallScopeOk, installedFlowOk]),
      [
        "validation/phase2_public_skill_surface.json",
        "validation/phase9_codex_project_local_package.json",
        "validation/phase9_codex_project_local_install_fixture.json",
        "validation/phase9_codex_home_install_fixture.json",
        "validation/phase9_codex_runtime_external_evidence.json",
        "validation/phase9_codex_runtime_external_evidence_selftest.json",
        "validation/phase9_claude_project_local_probe.json",
        "validation/phase9_claude_project_local_command_sequence.json",
        "validation/phase9_claude_skill_creator_alignment.json",
        "validation/phase11_installed_flow_fixture.json",
      ],
      [],
    ),
    makeRequirement(
      4,
      "Product Surface",
      statusFromChecks([pluginExactSurfaceOk, alphaPackageOk, claudePackageOk, claudeSkillCreatorAlignmentOk, codexPackageInstallScopeOk]),
      [
        "validation/phase2_public_skill_surface.json",
        "validation/phase4_alpha_package.json",
        "validation/phase9_codex_project_local_package.json",
        "validation/phase9_codex_project_local_install_fixture.json",
        "validation/phase9_codex_home_install_fixture.json",
        "validation/phase9_codex_runtime_external_evidence.json",
        "validation/phase9_codex_runtime_external_evidence_selftest.json",
        "validation/phase9_claude_skill_creator_alignment.json",
        "validation/phase9_capability_matrix.json",
      ],
      [
        ...(opencodeDeferred ? ["OpenCode is explicitly deferred until direct /diayn-* skill invocation is proven."] : []),
      ],
    ),
    makeRequirement(
      5,
      "Skills Architecture",
      statusFromChecks([pluginExactSurfaceOk, dependencyOk, alphaPackageOk, codexPackageInstallScopeOk]),
      [
        "validation/phase2_public_skill_surface.json",
        "validation/phase3_dependency_skills.json",
        "validation/phase4_alpha_package.json",
        "validation/phase9_codex_project_local_package.json",
        "validation/phase9_codex_project_local_install_fixture.json",
        "validation/phase9_codex_home_install_fixture.json",
        "validation/phase9_codex_runtime_external_evidence.json",
        "validation/phase9_codex_runtime_external_evidence_selftest.json",
      ],
    ),
    makeRequirement(
      6,
      "Complete Behavior Of The 12 Commands",
      statusFromChecks([installedFlowOk, sideScenariosOk]),
      [
        "validation/phase11_installed_flow_fixture.json",
        "validation/phase12_side_scenarios.json",
        "validation/phase9_release_gate.json",
      ],
      [],
    ),
    makeRequirement(
      7,
      "Third-Party agent-skills Composition",
      statusFromChecks([dependencyOk, releaseGate && releaseGate.claude_project_local_dependency_skill_ok, releaseGate && releaseGate.claude_project_local_routed_dependency_ok]),
      [
        "validation/phase3_dependency_skills.json",
        "plugins/docs-is-all-you-need/dependency-skills/manifest.json",
        "validation/phase9_claude_project_local_routed_dependency_probe.json",
      ],
      [],
    ),
    makeRequirement(
      8,
      "Document Architecture",
      statusFromChecks([phase5 && phase5.ok === true, phase6 && phase6.ok === true, installedFlowOk]),
      [
        "validation/phase5_controller_assets.json",
        "validation/phase6_worktrees.json",
        "validation/phase11_installed_flow_fixture.json",
      ],
    ),
    makeRequirement(
      9,
      "Session Model And State Flow",
      statusFromChecks([phase6 && phase6.ok === true, phase7 && phase7.ok === true, installedFlowOk, sideScenariosOk]),
      [
        "validation/phase6_worktrees.json",
        "validation/phase7_workflows.json",
        "validation/phase11_installed_flow_fixture.json",
        "validation/phase12_side_scenarios.json",
      ],
    ),
    makeRequirement(
      10,
      "Helper Scripts",
      statusFromChecks([phase5 && phase5.ok === true, phase6 && phase6.ok === true, phase8 && phase8.ok === true, sideScenariosOk]),
      [
        "skills/diayn-init/scripts/harness_audit.py",
        "skills/diayn-worktrees/scripts/worktree_plan.py",
        "skills/diayn-html/scripts/cleanup_plan.py",
        "maintainers/internal-skills/update-diayn-scaffold/scripts/scaffold_upgrade_audit.py",
        "validation/phase12_side_scenarios.json",
      ],
    ),
    makeRequirement(
      11,
      "Owner Experience And Validation Strategy",
      statusFromChecks([phase8 && phase8.ok === true, installedFlowOk, sideScenariosOk, claudeSkillCreatorAlignmentOk, codexPackageInstallScopeOk]),
      [
        "validation/phase8_owner_utilities.json",
        "validation/phase11_installed_flow_fixture.json",
        "validation/phase12_side_scenarios.json",
        "validation/phase9_claude_skill_creator_alignment.json",
        "validation/phase9_release_gate.json",
      ],
      [],
    ),
    makeRequirement(
      12,
      "Recommended V1 Implementation Order",
      statusFromChecks([requirementHeadings.length === 12, releaseGateHonest, sideScenariosOk]),
      [
        "docs/meta/diayn_v1_implementation_plan.md",
        "validation/phase9_release_gate.json",
        "validation/phase12_side_scenarios.json",
      ],
      [],
    ),
  ];

  const counts = requirements.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    {},
  );
  const goalComplete = requirements.every((item) => item.status === "proven") && codexPackageInstallScopeOk;
  const supportedAlphaSurfaces =
    releaseGate && Array.isArray(releaseGate.supported_alpha_surfaces) ? releaseGate.supported_alpha_surfaces : [];
  const remainingBlockers = matrix && Array.isArray(matrix.blocking_issues) ? matrix.blocking_issues : [];
  const blockedSurfaces = remainingBlockers
    .map((item) => item && item.surface)
    .filter((surface, index, values) => typeof surface === "string" && values.indexOf(surface) === index);

  const result = {
    schema: "diayn.dddv8.completion_audit.v1",
    ok: errors.length === 0,
    goal_complete: goalComplete,
    completion_status: goalComplete ? "complete_for_package_install_scope" : "incomplete",
    release_ready: Boolean(releaseGate && releaseGate.release_ready === true),
    supported_alpha_surfaces: supportedAlphaSurfaces,
    blocked_surfaces: blockedSurfaces,
    requirement_source: path.relative(repoRoot, requirementPath).replace(/\\/g, "/"),
    requirement_section_count: requirementHeadings.length,
    expected_commands: expectedCommands,
    requirement_commands_found: requirementCommands,
    surface_summary: {
      claude_code_cli_project_local: installedFlowOk ? "proven_full_flow" : "not_proven",
      codex_package_install: codexPackageInstallScopeOk
        ? "package_install_validated_app_session_runtime_not_attempted_current_scope"
        : "not_proven",
      codex_desktop_app_session_runtime: codexDesktopAppSessionRuntimeNotClaimed
        ? "not_attempted_current_scope_not_claimed"
        : "unknown",
      opencode_cli: opencodeDeferred ? "deferred_by_requirement" : "unknown",
    },
    surface_completion: {
      claude_code_cli_project_local: {
        status: installedFlowOk && sideScenariosOk ? "alpha_surface_complete" : "not_complete",
        alpha_claim_allowed: supportedAlphaSurfaces.includes("claude_code_cli_project_local"),
        evidence: [
          "validation/phase9_claude_project_local_package.json",
          "validation/phase9_claude_project_local_probe.json",
          "validation/phase9_claude_project_local_routed_dependency_probe.json",
          "validation/phase9_claude_project_local_command_sequence.json",
          "validation/phase9_claude_skill_creator_alignment.json",
          "validation/phase11_installed_flow_fixture.json",
          "validation/phase12_side_scenarios.json",
        ],
      },
      codex_package_install: {
        status: codexPackageInstallScopeOk ? "alpha_surface_complete_for_package_install_scope" : "not_complete",
        alpha_claim_allowed: supportedAlphaSurfaces.includes("codex_package_install"),
        desktop_app_session_runtime_claim_allowed: false,
        evidence: [
          "validation/phase9_codex_project_local_package.json",
          "validation/phase9_codex_project_local_install_fixture.json",
          "validation/phase9_codex_home_install_fixture.json",
          "validation/phase9_codex_runtime_external_evidence.json",
          "validation/phase9_codex_runtime_external_evidence_selftest.json",
        ],
        boundary: "Codex Desktop app-session runtime requires separate runtime evidence and is not claimed.",
      },
      opencode_cli: {
        status: opencodeDeferred ? "deferred_by_requirement" : "unknown",
        alpha_claim_allowed: false,
      },
    },
    counts,
    requirements,
    remaining_blockers: remainingBlockers,
    warnings: matrix && Array.isArray(matrix.warnings) ? matrix.warnings : [],
    errors,
  };

  const payload = JSON.stringify(result, null, 2);
  if (outputPath) {
    const fullOutput = path.resolve(repoRoot, outputPath);
    fs.mkdirSync(path.dirname(fullOutput), { recursive: true });
    fs.writeFileSync(fullOutput, `${payload}\n`, "utf8");
  }
  console.log(payload);
  if (!result.ok) process.exitCode = 1;
}

main();
