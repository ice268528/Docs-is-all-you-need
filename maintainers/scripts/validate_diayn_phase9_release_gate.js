#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");

const priorEvidence = [
  ["phase2_public_skill_surface", "validation/phase2_public_skill_surface.json"],
  ["phase3_dependency_skills", "validation/phase3_dependency_skills.json"],
  ["phase4_alpha_package", "validation/phase4_alpha_package.json"],
  ["phase5_controller_assets", "validation/phase5_controller_assets.json"],
  ["phase6_worktrees", "validation/phase6_worktrees.json"],
  ["phase7_workflows", "validation/phase7_workflows.json"],
  ["phase8_owner_utilities", "validation/phase8_owner_utilities.json"],
];

function readJson(relative, errors) {
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

function main() {
  const outputIndex = process.argv.indexOf("--json");
  const outputPath = outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  if (outputIndex >= 0 && !outputPath) throw new Error("--json requires an output path");

  const errors = [];
  const prior = {};

  for (const [key, relative] of priorEvidence) {
    const json = readJson(relative, errors);
    prior[key] = json ? Boolean(json.ok) : false;
    if (json && json.ok !== true) errors.push(`${relative} is not ok`);
  }

  const matrix = readJson("validation/phase9_capability_matrix.json", errors);
  const claudePackage = readJson("validation/phase9_claude_project_local_package.json", errors);
  const codexPackage = readJson("validation/phase9_codex_project_local_package.json", errors);
  const codexInstallFixture = readJson("validation/phase9_codex_project_local_install_fixture.json", errors);
  const codexHomeInstallFixture = readJson("validation/phase9_codex_home_install_fixture.json", errors);
  const codexExternalRuntimeEvidence = readJson("validation/phase9_codex_runtime_external_evidence.json", errors);
  const codexExternalRuntimeEvidenceSelftest = readJson("validation/phase9_codex_runtime_external_evidence_selftest.json", errors);
  const claudeProbe = readJson("validation/phase9_claude_project_local_probe.json", errors);
  const claudeRoutedProbe = readJson("validation/phase9_claude_project_local_routed_dependency_probe.json", errors);
  const claudeCommandSequence = readJson("validation/phase9_claude_project_local_command_sequence.json", errors);
  const phase11InstalledFlowFixture = readJson("validation/phase11_installed_flow_fixture.json", errors);
  const phase12SideScenarios = readJson("validation/phase12_side_scenarios.json", errors);
  const phase11InstalledFlowComplete = Boolean(
    phase11InstalledFlowFixture && phase11InstalledFlowFixture.installed_flow_complete === true
  );
  const blockers = matrix && Array.isArray(matrix.blocking_issues) ? matrix.blocking_issues : [];
  const blockerIds = new Set(blockers.map((item) => item.id));

  if (matrix) {
    if (matrix.schema !== "diayn.phase9.capability_matrix.v1") errors.push("phase9 matrix schema mismatch");
    if (matrix.phase9_complete !== false) errors.push("phase9 matrix must not mark phase9_complete true while blockers remain");
    if (matrix.release_claim_allowed !== false) errors.push("phase9 matrix must not allow release claim while blockers remain");
    if (
      !Array.isArray(matrix.supported_alpha_surfaces) ||
      !matrix.supported_alpha_surfaces.includes("claude_code_cli_project_local")
    ) {
      errors.push("supported_alpha_surfaces must record the proven Claude project-local surface");
    }
    if (Array.isArray(matrix.supported_alpha_surfaces) && matrix.supported_alpha_surfaces.includes("codex_desktop")) {
      errors.push("supported_alpha_surfaces must not include Codex Desktop while P9-CODEX-001 remains");
    }
    if (!blockerIds.has("P9-CODEX-001")) {
      errors.push("phase9 matrix missing blocker P9-CODEX-001");
    }
    if (
      !matrix.static_evidence ||
      matrix.static_evidence.phase12_side_scenarios !== "validation/phase12_side_scenarios.json"
    ) {
      errors.push("phase9 matrix must reference Phase 12 side-scenario evidence");
    }
    if (
      !matrix.static_evidence ||
      matrix.static_evidence.phase9_codex_project_local_package !== "validation/phase9_codex_project_local_package.json"
    ) {
      errors.push("phase9 matrix must reference Codex project-local static package evidence");
    }
    if (
      !matrix.static_evidence ||
      matrix.static_evidence.phase9_codex_project_local_install_fixture !== "validation/phase9_codex_project_local_install_fixture.json"
    ) {
      errors.push("phase9 matrix must reference Codex project-local install fixture evidence");
    }
    if (
      !matrix.static_evidence ||
      matrix.static_evidence.phase9_codex_home_install_fixture !== "validation/phase9_codex_home_install_fixture.json"
    ) {
      errors.push("phase9 matrix must reference Codex home install fixture evidence");
    }
    if (matrix.static_evidence && matrix.static_evidence.phase9_codex_home_install_actual) {
      errors.push("phase9 matrix must not require local-only actual Codex home install evidence");
    }
    if (matrix.static_evidence && matrix.static_evidence.phase9_codex_project_local_probe) {
      errors.push("phase9 matrix must not require local-only Codex executable probe evidence");
    }
    if (
      !matrix.static_evidence ||
      matrix.static_evidence.phase9_codex_runtime_external_evidence !== "validation/phase9_codex_runtime_external_evidence.json"
    ) {
      errors.push("phase9 matrix must reference Codex runtime external evidence validator output");
    }
    if (
      !matrix.static_evidence ||
      matrix.static_evidence.phase9_codex_runtime_external_evidence_selftest !== "validation/phase9_codex_runtime_external_evidence_selftest.json"
    ) {
      errors.push("phase9 matrix must reference Codex runtime external evidence validator selftest output");
    }
    if (phase11InstalledFlowComplete) {
      if (blockerIds.has("P9-FLOW-001")) {
        errors.push("stale full-flow blocker must be removed after installed-flow completion");
      }
    } else if (!blockerIds.has("P9-FLOW-001")) {
      errors.push("phase9 matrix missing blocker P9-FLOW-001 while Phase 12 installed flow is incomplete");
    }
    if (blockerIds.has("P9-COMMAND-SEQUENCE-001")) {
      errors.push("stale Claude command-sequence blocker must be removed after all 12 project-local commands enter workflow context");
    }
    if (blockerIds.has("P9-CLAUDE-001")) {
      errors.push("stale Claude bare-command blocker must be removed after project-local probe passes");
    }
    if (blockerIds.has("P9-DEPS-001")) {
      errors.push("stale dependency routing blocker must be removed after routed project-local probe passes");
    }

    const claude = matrix.surfaces && matrix.surfaces.claude_code_cli;
    if (!claude) {
      errors.push("Claude Code CLI surface must be recorded");
    } else {
      if (claude.bare_diayn_invocation !== "proven_for_project_local_package") {
        errors.push("Claude project-local bare /diayn-* proof must be recorded");
      }
      if (claude.dependency_managed_agent_skills_registered !== "proven_for_project_local_package") {
        errors.push("Claude project-local dependency skill registration proof must be recorded");
      }
      if (claude.dependency_native_invocation !== "direct_and_routed_dependency_skill_observed_for_project_local_package") {
        errors.push("Claude project-local direct and routed dependency Skill-tool evidence must be recorded");
      }
      if (claude.routed_dependency_invocation_from_diayn_workflow !== "observed_for_diayn_init_to_idea_refine") {
        errors.push("routed dependency invocation from /diayn-init to idea-refine must be recorded");
      }
      if (
        claude.full_flow !== "complete_for_project_local_package_primary_flow" ||
        claude.alpha_claim_allowed !== true
      ) {
        errors.push("Claude surface must record alpha support only after project-local installed flow completion");
      }
      if (
        !claude.plugin_dir_probe ||
        claude.plugin_dir_probe.namespaced_skill_tool_invocation !== "observed for docs-is-all-you-need:diayn-init"
      ) {
        errors.push("Claude namespaced plugin Skill-tool evidence must be retained");
      }
      const projectLocal = claude.project_local_package;
      if (!projectLocal || !projectLocal.runtime_probe) {
        errors.push("Claude project-local package runtime probe must be recorded");
      } else {
        if (projectLocal.command_count !== 12 || projectLocal.workflow_skill_count !== 12) {
          errors.push("Claude project-local package must preserve 12 public workflow commands and skills");
        }
        if (projectLocal.dependency_skill_count !== 23 || projectLocal.total_project_local_skill_count !== 35) {
          errors.push("Claude project-local package dependency skill count must match vendored agent-skills");
        }
        if (projectLocal.runtime_probe.bare_diayn_init.skill_tool_invocation !== "observed for diayn-init") {
          errors.push("Claude project-local /diayn-init Skill-tool invocation must be recorded");
        }
        if (projectLocal.runtime_probe.dependency_skill.skill_tool_invocation !== "observed for idea-refine") {
          errors.push("Claude project-local dependency Skill-tool invocation must be recorded");
        }
        if (
          !projectLocal.runtime_probe.routed_dependency_from_diayn_init ||
          projectLocal.runtime_probe.routed_dependency_from_diayn_init.dependency_skill_tool_invocation !== "observed for idea-refine"
        ) {
          errors.push("Claude project-local routed dependency Skill-tool invocation must be recorded");
        }
        if (
          !projectLocal.command_sequence_probe ||
          projectLocal.command_sequence_probe.all_12_bare_commands_visible !== true ||
          projectLocal.command_sequence_probe.all_12_workflow_skills_visible !== true ||
          projectLocal.command_sequence_probe.all_12_commands_entered_workflow !== true ||
          projectLocal.command_sequence_probe.strict_sequence_probe_completed !== false
        ) {
          errors.push("Claude project-local command sequence entry evidence and strict-probe limit must be recorded");
        }
        if (!projectLocal.installed_flow_fixture || projectLocal.installed_flow_fixture.probe_record !== "validation/phase11_installed_flow_fixture.json") {
          errors.push("Claude project-local installed-flow fixture attempt must be recorded");
        } else {
          if (projectLocal.installed_flow_fixture.init_scaffold_created !== true) {
            errors.push("Claude project-local installed-flow fixture must record /diayn-init scaffold creation");
          }
        }
      }
    }

    const codex = matrix.surfaces && matrix.surfaces.codex_desktop;
    if (!codex || !codex.local_probe || codex.local_probe.result !== "blocked_access_denied") {
      errors.push("Codex access-denied blocker must be recorded");
    } else {
      const projectLocal = codex.project_local_package;
      if (!projectLocal || projectLocal.validator_output !== "validation/phase9_codex_project_local_package.json") {
        errors.push("Codex project-local static package evidence must be recorded");
      } else {
        if (projectLocal.workflow_skill_count !== 12 || projectLocal.dependency_skill_count !== 23) {
          errors.push("Codex project-local package must record 12 workflow skills and 23 dependency skills");
        }
        if (projectLocal.static_validation !== "ok") {
          errors.push("Codex project-local package static validation must be ok");
        }
        if (projectLocal.install_fixture !== "validation/phase9_codex_project_local_install_fixture.json") {
          errors.push("Codex project-local package install fixture record must be linked");
        }
        if (projectLocal.codex_home_install_fixture !== "validation/phase9_codex_home_install_fixture.json") {
          errors.push("Codex-home install fixture record must be linked");
        }
        if (projectLocal.codex_home_install_actual) {
          errors.push("Actual Codex-home install record must be local-only, not part of the remote matrix");
        }
        if (projectLocal.runtime_validation !== "not_proven_access_denied") {
          errors.push("Codex project-local package runtime validation must remain honestly unproven");
        }
        if (projectLocal.runtime_probe) {
          errors.push("Codex project-local executable runtime probe must be local-only, not part of the remote matrix");
        }
        if (projectLocal.external_runtime_evidence !== "validation/phase9_codex_runtime_external_evidence.json") {
          errors.push("Codex external runtime evidence validator output must be linked");
        }
      }
    }
  }

  if (codexExternalRuntimeEvidence) {
    if (codexExternalRuntimeEvidence.schema !== "diayn.phase9.codex_runtime_external_evidence.v1") {
      errors.push("Codex external runtime evidence schema mismatch");
    }
    if (codexExternalRuntimeEvidence.ok !== true) {
      errors.push("Codex external runtime evidence validator must be ok");
    }
    if (codexExternalRuntimeEvidence.runtime_proven !== false || codexExternalRuntimeEvidence.blocker_id !== "P9-CODEX-001") {
      errors.push("Codex external runtime evidence must not clear P9-CODEX-001 without complete external proof");
    }
    if (!Array.isArray(codexExternalRuntimeEvidence.expected_commands) || codexExternalRuntimeEvidence.expected_commands.length !== 12) {
      errors.push("Codex external runtime evidence must list all 12 expected commands");
    }
    if (!Array.isArray(codexExternalRuntimeEvidence.gaps) || codexExternalRuntimeEvidence.gaps.length === 0) {
      errors.push("Codex external runtime evidence must record remaining gaps while runtime is not proven");
    }
  }

  if (codexExternalRuntimeEvidenceSelftest) {
    if (codexExternalRuntimeEvidenceSelftest.schema !== "diayn.phase9.codex_runtime_external_evidence_selftest.v1") {
      errors.push("Codex external runtime evidence selftest schema mismatch");
    }
    if (codexExternalRuntimeEvidenceSelftest.ok !== true) {
      errors.push("Codex external runtime evidence selftest must be ok");
    }
    const cases = codexExternalRuntimeEvidenceSelftest.cases || {};
    if (cases.complete_concrete_evidence_clears_blocker !== true) {
      errors.push("Codex external runtime evidence selftest must prove complete concrete evidence clears the blocker");
    }
    if (cases.placeholder_template_remains_blocked !== true) {
      errors.push("Codex external runtime evidence selftest must prove the placeholder template remains blocked");
    }
    if (cases.nonexistent_evidence_refs_remain_blocked !== true) {
      errors.push("Codex external runtime evidence selftest must prove nonexistent evidence_refs remain blocked");
    }
    if (cases.missing_input_remains_blocked !== true) {
      errors.push("Codex external runtime evidence selftest must prove missing input remains blocked");
    }
    const gapsObserved = codexExternalRuntimeEvidenceSelftest.gaps_observed || {};
    if (typeof gapsObserved.nonexistent_refs !== "number" || gapsObserved.nonexistent_refs <= 0) {
      errors.push("Codex external runtime evidence selftest must observe nonexistent evidence_ref gaps");
    }
    if (typeof gapsObserved.template !== "number" || gapsObserved.template <= 0) {
      errors.push("Codex external runtime evidence selftest must observe template gaps");
    }
    if (typeof gapsObserved.missing !== "number" || gapsObserved.missing <= 0) {
      errors.push("Codex external runtime evidence selftest must observe missing-input gaps");
    }
  }

  if (codexInstallFixture) {
    if (codexInstallFixture.schema !== "diayn.phase9.codex_project_local_install.v1") {
      errors.push("Codex project-local install fixture schema mismatch");
    }
    if (codexInstallFixture.ok !== true) errors.push("Codex project-local install fixture is not ok");
    if (codexInstallFixture.mode !== "execute" || codexInstallFixture.fixture_mode !== true) {
      errors.push("Codex project-local install fixture must be an executed fixture install");
    }
    if (
      !codexInstallFixture.package_preflight ||
      codexInstallFixture.package_preflight.workflow_skill_count !== 12 ||
      codexInstallFixture.package_preflight.dependency_skill_count !== 23
    ) {
      errors.push("Codex project-local install fixture must retain package preflight counts");
    }
    if (
      !codexInstallFixture.installed_result ||
      codexInstallFixture.installed_result.installed_package_visible !== true ||
      codexInstallFixture.installed_result.installed_workflow_skill_count !== 12 ||
      codexInstallFixture.installed_result.installed_dependency_skill_count !== 23 ||
      codexInstallFixture.installed_result.metadata_present !== true ||
      codexInstallFixture.installed_result.routing_map_present !== true
    ) {
      errors.push("Codex project-local install fixture must prove installed .codex/skills and metadata shape");
    }
    if (!installResidueAccountingOk(codexInstallFixture, 35)) {
      errors.push("Codex project-local install fixture must report preserved non-package skill accounting");
    }
  }

  if (codexHomeInstallFixture) {
    if (codexHomeInstallFixture.schema !== "diayn.phase9.codex_home_install.v1") {
      errors.push("Codex home install fixture schema mismatch");
    }
    if (codexHomeInstallFixture.ok !== true) errors.push("Codex home install fixture is not ok");
    if (
      codexHomeInstallFixture.mode !== "execute" ||
      codexHomeInstallFixture.fixture_mode !== true ||
      codexHomeInstallFixture.install_surface !== "codex_home"
    ) {
      errors.push("Codex home install fixture must be an executed codex_home fixture install");
    }
    if (
      !codexHomeInstallFixture.package_preflight ||
      codexHomeInstallFixture.package_preflight.workflow_skill_count !== 12 ||
      codexHomeInstallFixture.package_preflight.dependency_skill_count !== 23
    ) {
      errors.push("Codex home install fixture must retain package preflight counts");
    }
    if (
      !codexHomeInstallFixture.installed_result ||
      codexHomeInstallFixture.installed_result.installed_package_visible !== true ||
      codexHomeInstallFixture.installed_result.installed_workflow_skill_count !== 12 ||
      codexHomeInstallFixture.installed_result.installed_dependency_skill_count !== 23 ||
      codexHomeInstallFixture.installed_result.metadata_present !== true ||
      codexHomeInstallFixture.installed_result.routing_map_present !== true ||
      codexHomeInstallFixture.install_targets.skills !== "skills" ||
      codexHomeInstallFixture.install_targets.metadata !== "diayn/docs-is-all-you-need"
    ) {
      errors.push("Codex home install fixture must prove CODEX_HOME skills and metadata shape");
    }
    if (!installResidueAccountingOk(codexHomeInstallFixture, 35)) {
      errors.push("Codex home install fixture must report preserved non-package skill accounting");
    }
  }

  if (codexPackage) {
    if (codexPackage.ok !== true) errors.push("Codex project-local package validator is not ok");
    if (codexPackage.workflow_skill_count !== 12) {
      errors.push("Codex project-local package must have exactly 12 public workflow skills");
    }
    if (codexPackage.dependency_skill_count !== 23 || codexPackage.total_project_local_skill_count !== 35) {
      errors.push("Codex project-local package must expose the locked dependency skills");
    }
    if (codexPackage.bare_diayn_skill_surface !== true) {
      errors.push("Codex project-local package bare /diayn-* skill surface is not statically present");
    }
    if (codexPackage.dependency_skills_platform_visible !== true) {
      errors.push("Codex project-local dependency skills must be platform-visible");
    }
    if (
      !codexPackage.runtime_validation ||
      codexPackage.runtime_validation.direct_diayn_invocation !== "not_proven_access_denied_in_current_environment"
    ) {
      errors.push("Codex project-local validator must not claim direct runtime /diayn-* invocation");
    }
  }

  if (claudePackage) {
    if (claudePackage.ok !== true) errors.push("Claude project-local package validator is not ok");
    if (claudePackage.command_count !== 12 || claudePackage.workflow_skill_count !== 12) {
      errors.push("Claude project-local package must have exactly 12 public workflow commands/skills");
    }
    if (claudePackage.dependency_skill_count !== 23 || claudePackage.total_project_local_skill_count !== 35) {
      errors.push("Claude project-local package must expose the locked dependency skills");
    }
    if (claudePackage.bare_command_surface !== true) errors.push("Claude project-local package bare command surface is not proven");
    if (claudePackage.dependency_skills_platform_visible !== true) {
      errors.push("Claude project-local dependency skills must be platform-visible");
    }
    if (claudePackage.dependency_routing_map_present !== true || claudePackage.internal_role_references_present !== true) {
      errors.push("Claude project-local package must include dependency routing references");
    }
  }

  if (claudeProbe) {
    if (claudeProbe.ok !== true) errors.push("Claude project-local runtime probe is not ok");
    if (!claudeProbe.command_probe || claudeProbe.command_probe.exit_code !== 0) {
      errors.push("Claude project-local /diayn-init probe must exit 0");
    }
    if (!claudeProbe.command_probe || !claudeProbe.command_probe.skill_tool_invocation.observed) {
      errors.push("Claude project-local /diayn-init Skill-tool invocation must be observed");
    }
    if (!claudeProbe.dependency_skill_probe || claudeProbe.dependency_skill_probe.exit_code !== 0) {
      errors.push("Claude project-local dependency skill probe must exit 0");
    }
    if (!claudeProbe.dependency_skill_probe || !claudeProbe.dependency_skill_probe.skill_tool_invocation.observed) {
      errors.push("Claude project-local dependency Skill-tool invocation must be observed");
    }
    if (!claudeProbe.limits || claudeProbe.limits.full_installed_flow !== "not_run") {
      errors.push("Claude project-local probe must not claim full installed flow completion");
    }
  }

  if (claudeRoutedProbe) {
    if (claudeRoutedProbe.ok !== true) errors.push("Claude project-local routed dependency probe is not ok");
    if (claudeRoutedProbe.exit_code !== 0) errors.push("Claude project-local routed dependency probe must exit 0");
    const invocations = Array.isArray(claudeRoutedProbe.skill_tool_invocations) ? claudeRoutedProbe.skill_tool_invocations : [];
    const invocationSkills = invocations.map((item) => item.skill);
    if (invocationSkills[0] !== "diayn-init" || invocationSkills[1] !== "idea-refine") {
      errors.push("Claude project-local routed dependency probe must invoke diayn-init then idea-refine");
    }
    if (!claudeRoutedProbe.routing_context || claudeRoutedProbe.routing_context.public_workflow !== "/diayn-init") {
      errors.push("Claude project-local routed dependency probe must record /diayn-init routing context");
    }
    if (!claudeRoutedProbe.limits || claudeRoutedProbe.limits.full_installed_flow !== "not_run") {
      errors.push("Claude project-local routed dependency probe must not claim full installed flow completion");
    }
  }

  if (claudeCommandSequence) {
    if (claudeCommandSequence.schema !== "diayn.phase9.claude_project_local_command_sequence.v1") {
      errors.push("Claude project-local command sequence schema mismatch");
    }
    if (claudeCommandSequence.ok !== true) {
      errors.push("Claude project-local command sequence entry evidence must be ok");
    }
    if (!claudeCommandSequence.positive_evidence || claudeCommandSequence.positive_evidence.all_12_bare_commands_visible_in_claude_init !== true) {
      errors.push("Claude project-local command sequence must record all 12 bare commands visible");
    }
    if (!claudeCommandSequence.positive_evidence || claudeCommandSequence.positive_evidence.all_12_workflow_skills_visible_in_claude_init !== true) {
      errors.push("Claude project-local command sequence must record all 12 workflow skills visible");
    }
    if (!claudeCommandSequence.positive_evidence || claudeCommandSequence.positive_evidence.all_12_commands_entered_workflow !== true) {
      errors.push("Claude project-local command sequence must record all 12 commands entering workflow context");
    }
    if (!claudeCommandSequence.remaining_failures || claudeCommandSequence.remaining_failures.strict_sequence_probe_completed !== false) {
      errors.push("Claude project-local command sequence must record validation short-circuit still incomplete");
    }
    if (!claudeCommandSequence.limits || claudeCommandSequence.limits.full_installed_flow !== "not_run") {
      errors.push("Claude project-local command sequence must not claim full installed flow completion");
    }
  }

  if (phase11InstalledFlowFixture) {
    if (phase11InstalledFlowFixture.schema !== "diayn.phase11.installed_flow_fixture.v1") {
      errors.push("Phase 11 installed-flow fixture schema mismatch");
    }
    if (phase11InstalledFlowFixture.ok !== true) {
      errors.push("Phase 11 installed-flow fixture evidence collector must be ok");
    }
    if (!phase11InstalledFlowFixture.install_checks || phase11InstalledFlowFixture.install_checks.command_count !== 12) {
      errors.push("Phase 11 installed-flow fixture must verify 12 installed commands");
    }
    if (!phase11InstalledFlowFixture.install_checks || phase11InstalledFlowFixture.install_checks.workflow_skill_count !== 12) {
      errors.push("Phase 11 installed-flow fixture must verify 12 installed workflow skills");
    }
    if (!phase11InstalledFlowFixture.install_checks || phase11InstalledFlowFixture.install_checks.dependency_skill_idea_refine_present !== true) {
      errors.push("Phase 11 installed-flow fixture must verify DIAYN-managed dependency skill presence");
    }
    if (!phase11InstalledFlowFixture.git || phase11InstalledFlowFixture.git.clean_after_baseline !== true) {
      errors.push("Phase 11 installed-flow fixture must start Claude commands from a clean git baseline");
    }
    if (!phase11InstalledFlowFixture.local_e2e || phase11InstalledFlowFixture.local_e2e.ok !== true) {
      errors.push("Phase 11 installed-flow fixture local E2E preflight must pass");
    }
    const claude = phase11InstalledFlowFixture.claude || {};
    const commandsRequested = Array.isArray(claude.commands_requested) ? claude.commands_requested : [];
    for (const requiredCommand of [
      "/diayn-init",
      "/diayn-plan",
      "/diayn-worktrees",
      "/diayn-backend",
      "/diayn-frontend",
      "/diayn-review-backend",
      "/diayn-review-frontend",
      "/diayn-sync",
      "/diayn-integration",
      "/diayn-html",
      "/diayn-bug",
      "/diayn-new",
    ]) {
      if (!commandsRequested.includes(requiredCommand)) {
        errors.push(`Phase 11 installed-flow fixture must include ${requiredCommand}`);
      }
    }
    if (claude.run_requested !== true) {
      errors.push("Phase 11 installed-flow fixture must record a real Claude command attempt");
    }
    if (claude.all_selected_commands_entered_workflow !== true) {
      errors.push("Phase 11 installed-flow fixture must record /diayn-init entering workflow context");
    }
    if (claude.all_selected_commands_used_native_workflow_skill !== true) {
      errors.push("Phase 11 installed-flow fixture must record native workflow skill entry for /diayn-init");
    }
    const workflowErrors = Array.isArray(phase11InstalledFlowFixture.workflow_errors)
      ? phase11InstalledFlowFixture.workflow_errors
      : [];
    if (workflowErrors.length !== 0) {
      errors.push("Phase 11 installed-flow fixture /diayn-init attempt must have no workflow errors");
    }
    const produced = phase11InstalledFlowFixture.flow_artifacts &&
      Array.isArray(phase11InstalledFlowFixture.flow_artifacts.produced_required_minimum_files)
        ? phase11InstalledFlowFixture.flow_artifacts.produced_required_minimum_files
        : [];
    for (const required of [
      "AGENTS.md",
      "TODO.md",
      ".diayn/worktree_manifest.md",
      ".diayn/scaffold_version.md",
      "docs/project/project_brief.md",
    ]) {
      if (!produced.includes(required)) {
        errors.push(`Phase 11 installed-flow fixture /diayn-init did not produce ${required}`);
      }
    }
    if (commandsRequested.includes("/diayn-plan")) {
      const planProduced = phase11InstalledFlowFixture.flow_artifacts &&
        Array.isArray(phase11InstalledFlowFixture.flow_artifacts.produced_required_plan_files)
          ? phase11InstalledFlowFixture.flow_artifacts.produced_required_plan_files
          : [];
      for (const required of [
        ["docs/stages/<stage-id>/stage_plan.md", (relative) => /^docs\/stages\/[^/]+\/stage_plan\.md$/.test(relative)],
        ["docs/lanes/backend/board.md", (relative) => relative === "docs/lanes/backend/board.md"],
        ["docs/lanes/backend/handoff.md", (relative) => relative === "docs/lanes/backend/handoff.md"],
        ["docs/lanes/frontend/board.md", (relative) => relative === "docs/lanes/frontend/board.md"],
        ["docs/lanes/frontend/handoff.md", (relative) => relative === "docs/lanes/frontend/handoff.md"],
        ["docs/shared/<contract>.md", (relative) => /^docs\/shared\/[^/]+\.md$/.test(relative)],
      ]) {
        if (!planProduced.some(required[1])) {
          errors.push(`Phase 11 installed-flow fixture /diayn-plan did not produce ${required[0]}`);
        }
      }
    }
    if (commandsRequested.includes("/diayn-worktrees")) {
      const worktreeProduced = phase11InstalledFlowFixture.flow_artifacts &&
        Array.isArray(phase11InstalledFlowFixture.flow_artifacts.produced_required_worktree_files)
          ? phase11InstalledFlowFixture.flow_artifacts.produced_required_worktree_files
          : [];
      for (const required of [
        ".diayn/worktree_plan.json",
        ".diayn/session_registry.md",
        "docs/lanes/backend/launch_prompt.md",
        "docs/lanes/frontend/launch_prompt.md",
      ]) {
        if (!worktreeProduced.includes(required)) {
          errors.push(`Phase 11 installed-flow fixture /diayn-worktrees did not produce ${required}`);
        }
      }
      const worktreePlan = phase11InstalledFlowFixture.flow_artifacts &&
        phase11InstalledFlowFixture.flow_artifacts.worktree_plan;
      if (!worktreePlan || worktreePlan.execute_requested !== true) {
        errors.push("Phase 11 installed-flow fixture /diayn-worktrees must record authorized worktree execution");
      }
      if (worktreePlan && worktreePlan.owner_gate_count !== 0) {
        errors.push("Phase 11 installed-flow fixture /diayn-worktrees must not leave OwnerGate items open");
      }
      const lanes = worktreePlan && Array.isArray(worktreePlan.lanes) ? worktreePlan.lanes : [];
      for (const laneName of ["backend", "frontend"]) {
        const lane = lanes.find((item) => item.lane === laneName);
        if (!lane || lane.status !== "ready" || !lane.worktree_path) {
          errors.push(`Phase 11 installed-flow fixture /diayn-worktrees must mark ${laneName} worktree ready`);
        }
      }
    }
    for (const [commandName, laneName] of [
      ["/diayn-backend", "backend"],
      ["/diayn-frontend", "frontend"],
    ]) {
      if (!commandsRequested.includes(commandName)) continue;
      const laneWorkers = phase11InstalledFlowFixture.flow_artifacts &&
        phase11InstalledFlowFixture.flow_artifacts.lane_workers;
      const lane = laneWorkers && laneWorkers[laneName];
      if (!lane || !lane.worktree_path) {
        errors.push(`Phase 11 installed-flow fixture ${commandName} must run in a registered ${laneName} worktree`);
        continue;
      }
      const producedFiles = Array.isArray(lane.produced_required_files) ? lane.produced_required_files : [];
      const hasWorklog = lane.has_worklog_artifact === true ||
        producedFiles.some((relative) =>
          relative === `docs/lanes/${laneName}/worklog.md` ||
          (relative.startsWith(`docs/lanes/${laneName}/`) && relative.endsWith("/worklog.md"))
        );
      const hasEvidence = lane.has_evidence_artifact === true ||
        producedFiles.some((relative) =>
          relative === `docs/lanes/${laneName}/evidence.md` ||
          relative.startsWith(`docs/lanes/${laneName}/evidence/`) ||
          (relative.startsWith(`docs/lanes/${laneName}/`) && relative.endsWith("/evidence.md"))
        );
      if (!hasWorklog) {
        errors.push(`Phase 11 installed-flow fixture ${commandName} did not produce a ${laneName} worklog artifact`);
      }
      if (!hasEvidence) {
        errors.push(`Phase 11 installed-flow fixture ${commandName} did not produce a ${laneName} evidence artifact`);
      }
      if (lane.board_has_candidate_done !== true) {
        errors.push(`Phase 11 installed-flow fixture ${commandName} must leave a task at candidate_done`);
      }
      if (lane.board_has_self_approved_done === true) {
        errors.push(`Phase 11 installed-flow fixture ${commandName} must not self-approve lane work`);
      }
      if (lane.evidence_mentions_e2e !== true) {
        errors.push(`Phase 11 installed-flow fixture ${commandName} must record E2E evidence`);
      }
      if (lane.git_status_after_command !== "") {
        errors.push(`Phase 11 installed-flow fixture ${commandName} lane worktree must be checkpointed clean`);
      }
    }
    for (const [commandName, laneName] of [
      ["/diayn-review-backend", "backend"],
      ["/diayn-review-frontend", "frontend"],
    ]) {
      if (!commandsRequested.includes(commandName)) continue;
      const laneReviews = phase11InstalledFlowFixture.flow_artifacts &&
        phase11InstalledFlowFixture.flow_artifacts.lane_reviews;
      const lane = laneReviews && laneReviews[laneName];
      if (!lane || !lane.worktree_path) {
        errors.push(`Phase 11 installed-flow fixture ${commandName} must run in the same ${laneName} worktree`);
        continue;
      }
      const reviewLog = `docs/lanes/${laneName}/review_log.md`;
      if (!Array.isArray(lane.produced_required_files) || !lane.produced_required_files.includes(reviewLog)) {
        errors.push(`Phase 11 installed-flow fixture ${commandName} did not produce ${reviewLog}`);
      }
      if (lane.board_has_review_done !== true && lane.review_log_decision_done !== true) {
        errors.push(`Phase 11 installed-flow fixture ${commandName} must record a done review decision`);
      }
      if (lane.board_has_rejected === true || lane.review_log_decision_rejected === true) {
        errors.push(`Phase 11 installed-flow fixture ${commandName} should not reject the happy-path baseline evidence`);
      }
      if (lane.board_has_owner_accepted === true) {
        errors.push(`Phase 11 installed-flow fixture ${commandName} must not mark Owner acceptance`);
      }
      if (lane.evidence_mentions_e2e !== true) {
        errors.push(`Phase 11 installed-flow fixture ${commandName} must record E2E review evidence`);
      }
      if (lane.git_status_after_command !== "") {
        errors.push(`Phase 11 installed-flow fixture ${commandName} lane worktree must be checkpointed clean`);
      }
    }
    if (commandsRequested.includes("/diayn-sync")) {
      const sync = phase11InstalledFlowFixture.flow_artifacts &&
        phase11InstalledFlowFixture.flow_artifacts.sync;
      if (!sync || !sync.worktree_path) {
        errors.push("Phase 11 installed-flow fixture /diayn-sync must run in the Controller root");
      } else {
        for (const required of [
          "docs/stages/stage-1-auth-fixture/sync_log.md",
          "docs/lanes/backend/review_log.md",
          "docs/lanes/frontend/review_log.md",
        ]) {
          if (!Array.isArray(sync.produced_required_files) || !sync.produced_required_files.includes(required)) {
            errors.push(`Phase 11 installed-flow fixture /diayn-sync did not produce ${required}`);
          }
        }
        if (sync.backend_review_done_synced !== true || sync.frontend_review_done_synced !== true) {
          errors.push("Phase 11 installed-flow fixture /diayn-sync must synchronize backend/frontend done review state");
        }
        if (sync.sync_log_says_no_business_code_merge !== true) {
          errors.push("Phase 11 installed-flow fixture /diayn-sync must record that no business code was merged");
        }
        if (sync.business_code_changed === true) {
          errors.push("Phase 11 installed-flow fixture /diayn-sync must not change business-code paths");
        }
      }
    }
    if (commandsRequested.includes("/diayn-integration")) {
      const integration = phase11InstalledFlowFixture.flow_artifacts &&
        phase11InstalledFlowFixture.flow_artifacts.integration;
      if (!integration || !integration.worktree_path) {
        errors.push("Phase 11 installed-flow fixture /diayn-integration must run in the Controller root");
      } else {
        for (const required of [
          "docs/stages/stage-1-auth-fixture/integration_summary.md",
          "docs/stages/stage-1-auth-fixture/integration_e2e.json",
        ]) {
          if (!Array.isArray(integration.produced_required_files) || !integration.produced_required_files.includes(required)) {
            errors.push(`Phase 11 installed-flow fixture /diayn-integration did not produce ${required}`);
          }
        }
        if (integration.reviewed_backend_done !== true || integration.reviewed_frontend_done !== true) {
          errors.push("Phase 11 installed-flow fixture /diayn-integration must record both reviewed lanes as done");
        }
        if (integration.mentions_merge_status !== true) {
          errors.push("Phase 11 installed-flow fixture /diayn-integration must record merge status");
        }
        if (integration.mentions_contract_consistency !== true) {
          errors.push("Phase 11 installed-flow fixture /diayn-integration must record contract consistency");
        }
        if (integration.evidence_mentions_e2e !== true) {
          errors.push("Phase 11 installed-flow fixture /diayn-integration must record integration E2E evidence");
        }
        if (integration.ready_for_owner_handoff !== true) {
          errors.push("Phase 11 installed-flow fixture /diayn-integration must prepare an Owner acceptance handoff");
        }
        if (integration.marks_owner_accepted === true) {
          errors.push("Phase 11 installed-flow fixture /diayn-integration must not mark Owner acceptance");
        }
        if (integration.business_code_changed === true) {
          errors.push("Phase 11 installed-flow fixture /diayn-integration must not change business-code paths in this no-op baseline fixture");
        }
      }
    }
    if (commandsRequested.includes("/diayn-html")) {
      const ownerAcceptance = phase11InstalledFlowFixture.flow_artifacts &&
        phase11InstalledFlowFixture.flow_artifacts.owner_acceptance;
      if (!ownerAcceptance || !ownerAcceptance.worktree_path) {
        errors.push("Phase 11 installed-flow fixture /diayn-html must run in the Controller root");
      } else {
        const record = "docs/stages/stage-1-auth-fixture/owner_acceptance_record.md";
        if (!Array.isArray(ownerAcceptance.produced_required_files) || !ownerAcceptance.produced_required_files.includes(record)) {
          errors.push(`Phase 11 installed-flow fixture /diayn-html did not produce ${record}`);
        }
        if (ownerAcceptance.owner_decision_accepted !== true) {
          errors.push("Phase 11 installed-flow fixture /diayn-html must record accepted Owner decision");
        }
        if (ownerAcceptance.references_integration_summary !== true) {
          errors.push("Phase 11 installed-flow fixture /diayn-html must reference integration evidence");
        }
        if (ownerAcceptance.markdown_is_authoritative !== true) {
          errors.push("Phase 11 installed-flow fixture /diayn-html must keep Markdown authoritative");
        }
        if (ownerAcceptance.business_code_changed === true) {
          errors.push("Phase 11 installed-flow fixture /diayn-html must not change business-code paths");
        }
      }
    }
    if (commandsRequested.includes("/diayn-bug")) {
      const bug = phase11InstalledFlowFixture.flow_artifacts &&
        phase11InstalledFlowFixture.flow_artifacts.bug_triage;
      if (!bug || !bug.worktree_path) {
        errors.push("Phase 11 installed-flow fixture /diayn-bug must produce a bug side-scenario artifact");
      } else {
        const record = "docs/stages/stage-1-auth-fixture/bug_triage_noop.md";
        if (!Array.isArray(bug.produced_required_files) || !bug.produced_required_files.includes(record)) {
          errors.push(`Phase 11 installed-flow fixture /diayn-bug did not produce ${record}`);
        }
        if (bug.classification_no_active_bug !== true) {
          errors.push("Phase 11 installed-flow fixture /diayn-bug must record no_active_bug classification");
        }
        if (bug.records_no_scope_or_lane_owner !== true) {
          errors.push("Phase 11 installed-flow fixture /diayn-bug must record no affected scope/lane owner");
        }
        if (bug.next_action_closeout !== true) {
          errors.push("Phase 11 installed-flow fixture /diayn-bug must route next action to closeout");
        }
        if (bug.business_code_changed === true) {
          errors.push("Phase 11 installed-flow fixture /diayn-bug must not change business-code paths");
        }
      }
    }
    if (commandsRequested.includes("/diayn-new")) {
      const closeout = phase11InstalledFlowFixture.flow_artifacts &&
        phase11InstalledFlowFixture.flow_artifacts.closeout;
      if (!closeout || !closeout.worktree_path) {
        errors.push("Phase 11 installed-flow fixture /diayn-new must run in the Controller root");
      } else {
        for (const required of [
          "docs/stages/stage-1-auth-fixture/stage_closeout.md",
          "docs/stages/stage-2-follow-up/baseline_refresh.md",
        ]) {
          if (!Array.isArray(closeout.produced_required_files) || !closeout.produced_required_files.includes(required)) {
            errors.push(`Phase 11 installed-flow fixture /diayn-new did not produce ${required}`);
          }
        }
        if (closeout.closeout_references_acceptance !== true) {
          errors.push("Phase 11 installed-flow fixture /diayn-new closeout must reference Owner acceptance");
        }
        if (closeout.closeout_references_integration !== true) {
          errors.push("Phase 11 installed-flow fixture /diayn-new closeout must reference integration evidence");
        }
        if (closeout.records_retention_notes !== true) {
          errors.push("Phase 11 installed-flow fixture /diayn-new closeout must record retention notes");
        }
        if (closeout.next_stage_baseline_refresh !== true) {
          errors.push("Phase 11 installed-flow fixture /diayn-new must record next-stage baseline refresh");
        }
        if (closeout.business_code_changed === true) {
          errors.push("Phase 11 installed-flow fixture /diayn-new must not change business-code paths");
        }
      }
    }
  }

  if (phase12SideScenarios) {
    if (phase12SideScenarios.schema !== "diayn.phase12.side_scenarios.v1") {
      errors.push("Phase 12 side-scenario schema mismatch");
    }
    if (phase12SideScenarios.ok !== true) {
      errors.push("Phase 12 side-scenario validator must be ok");
    }
    const sideScenarios = phase12SideScenarios.side_scenarios || {};
    for (const required of [
      "non_git_target",
      "existing_project_conflict_report",
      "dirty_working_tree_preflight",
      "not_applicable_lane",
      "interrupted_command_recovery",
      "scaffold_migration_dry_run",
      "mismatched_pre_existing_agent_skills",
      "privacy_network_default",
      "cleanup_plan_boundary",
      "bug_triage_side_scenario",
      "additional_new_intake_or_next_stage_refresh",
    ]) {
      if (sideScenarios[required] !== true) {
        errors.push(`Phase 12 side-scenario missing ${required}`);
      }
    }
  }

  const allPriorOk = Object.values(prior).every(Boolean);
  const claudeProjectLocalBareCommandOk = Boolean(
    claudeProbe && claudeProbe.command_probe && claudeProbe.command_probe.skill_tool_invocation.observed
  );
  const claudeProjectLocalDependencySkillOk = Boolean(
    claudeProbe && claudeProbe.dependency_skill_probe && claudeProbe.dependency_skill_probe.skill_tool_invocation.observed
  );
  const claudeProjectLocalRoutedDependencyOk = Boolean(
    claudeRoutedProbe &&
      Array.isArray(claudeRoutedProbe.skill_tool_invocations) &&
      claudeRoutedProbe.skill_tool_invocations[0] &&
      claudeRoutedProbe.skill_tool_invocations[0].skill === "diayn-init" &&
      claudeRoutedProbe.skill_tool_invocations[1] &&
      claudeRoutedProbe.skill_tool_invocations[1].skill === "idea-refine"
  );
  const phase12SideScenariosOk = Boolean(
    phase12SideScenarios &&
      phase12SideScenarios.ok === true &&
      phase12SideScenarios.side_scenarios &&
      Object.values(phase12SideScenarios.side_scenarios).every((value) => value === true)
  );
  const codexProjectLocalStaticPackageOk = Boolean(
    codexPackage &&
      codexPackage.ok === true &&
      codexPackage.workflow_skill_count === 12 &&
      codexPackage.dependency_skill_count === 23 &&
      codexPackage.total_project_local_skill_count === 35 &&
      codexPackage.runtime_validation &&
      codexPackage.runtime_validation.direct_diayn_invocation === "not_proven_access_denied_in_current_environment"
  );
  const codexProjectLocalInstallFixtureOk = Boolean(
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
  const releaseReady = Boolean(
    matrix &&
      matrix.phase9_complete === true &&
      matrix.release_claim_allowed === true &&
      Array.isArray(matrix.supported_alpha_surfaces) &&
      matrix.supported_alpha_surfaces.length > 0 &&
      blockers.length === 0 &&
      phase12SideScenariosOk
  );
  const phase11InstalledFlowFixtureOk = Boolean(
    phase11InstalledFlowFixture && phase11InstalledFlowFixture.ok === true
  );
  const phase11InstalledFlowAttempted = Boolean(
    phase11InstalledFlowFixture &&
      phase11InstalledFlowFixture.claude &&
      phase11InstalledFlowFixture.claude.run_requested === true &&
      phase11InstalledFlowFixture.claude.all_selected_commands_entered_workflow === true
  );
  const phase11NativeWorkflowSkillEntryOk = Boolean(
    phase11InstalledFlowFixture &&
      phase11InstalledFlowFixture.claude &&
      phase11InstalledFlowFixture.claude.all_selected_commands_used_native_workflow_skill === true
  );
  const phase11InitScaffoldOk = Boolean(
    phase11InstalledFlowFixture &&
      phase11InstalledFlowFixture.claude &&
      phase11InstalledFlowFixture.claude.command_execution_ok === true &&
      phase11InstalledFlowFixture.flow_artifacts &&
      Array.isArray(phase11InstalledFlowFixture.flow_artifacts.produced_required_minimum_files) &&
      phase11InstalledFlowFixture.flow_artifacts.produced_required_minimum_files.includes("AGENTS.md") &&
      phase11InstalledFlowFixture.flow_artifacts.produced_required_minimum_files.includes("TODO.md") &&
      phase11InstalledFlowFixture.flow_artifacts.produced_required_minimum_files.includes(".diayn/worktree_manifest.md") &&
      phase11InstalledFlowFixture.flow_artifacts.produced_required_minimum_files.includes(".diayn/scaffold_version.md") &&
      phase11InstalledFlowFixture.flow_artifacts.produced_required_minimum_files.includes("docs/project/project_brief.md")
  );
  const phase11PlanArtifactsOk = Boolean(
    phase11InstalledFlowFixture &&
      phase11InstalledFlowFixture.claude &&
      Array.isArray(phase11InstalledFlowFixture.claude.commands_requested) &&
      phase11InstalledFlowFixture.claude.commands_requested.includes("/diayn-plan") &&
      phase11InstalledFlowFixture.claude.command_execution_ok === true &&
      phase11InstalledFlowFixture.flow_artifacts &&
      Array.isArray(phase11InstalledFlowFixture.flow_artifacts.produced_required_plan_files) &&
      phase11InstalledFlowFixture.flow_artifacts.produced_required_plan_files.some((relative) =>
        /^docs\/stages\/[^/]+\/stage_plan\.md$/.test(relative)
      ) &&
      phase11InstalledFlowFixture.flow_artifacts.produced_required_plan_files.includes("docs/lanes/backend/board.md") &&
      phase11InstalledFlowFixture.flow_artifacts.produced_required_plan_files.includes("docs/lanes/backend/handoff.md") &&
      phase11InstalledFlowFixture.flow_artifacts.produced_required_plan_files.includes("docs/lanes/frontend/board.md") &&
      phase11InstalledFlowFixture.flow_artifacts.produced_required_plan_files.includes("docs/lanes/frontend/handoff.md") &&
      phase11InstalledFlowFixture.flow_artifacts.produced_required_plan_files.some((relative) =>
        /^docs\/shared\/[^/]+\.md$/.test(relative)
      )
  );
  const phase11WorktreeArtifactsOk = Boolean(
    phase11InstalledFlowFixture &&
      phase11InstalledFlowFixture.claude &&
      Array.isArray(phase11InstalledFlowFixture.claude.commands_requested) &&
      phase11InstalledFlowFixture.claude.commands_requested.includes("/diayn-worktrees") &&
      phase11InstalledFlowFixture.claude.command_execution_ok === true &&
      phase11InstalledFlowFixture.flow_artifacts &&
      Array.isArray(phase11InstalledFlowFixture.flow_artifacts.produced_required_worktree_files) &&
      phase11InstalledFlowFixture.flow_artifacts.produced_required_worktree_files.includes(".diayn/worktree_plan.json") &&
      phase11InstalledFlowFixture.flow_artifacts.produced_required_worktree_files.includes(".diayn/session_registry.md") &&
      phase11InstalledFlowFixture.flow_artifacts.produced_required_worktree_files.includes("docs/lanes/backend/launch_prompt.md") &&
      phase11InstalledFlowFixture.flow_artifacts.produced_required_worktree_files.includes("docs/lanes/frontend/launch_prompt.md") &&
      phase11InstalledFlowFixture.flow_artifacts.worktree_plan &&
      phase11InstalledFlowFixture.flow_artifacts.worktree_plan.execute_requested === true &&
      phase11InstalledFlowFixture.flow_artifacts.worktree_plan.owner_gate_count === 0 &&
      Array.isArray(phase11InstalledFlowFixture.flow_artifacts.worktree_plan.lanes) &&
      ["backend", "frontend"].every((laneName) => {
        const lane = phase11InstalledFlowFixture.flow_artifacts.worktree_plan.lanes.find((item) => item.lane === laneName);
        return lane && lane.status === "ready" && Boolean(lane.worktree_path);
      })
  );
  const phase11LaneWorkerArtifactsOk = Boolean(
    phase11InstalledFlowFixture &&
      phase11InstalledFlowFixture.claude &&
      Array.isArray(phase11InstalledFlowFixture.claude.commands_requested) &&
      phase11InstalledFlowFixture.claude.commands_requested.includes("/diayn-backend") &&
      phase11InstalledFlowFixture.claude.commands_requested.includes("/diayn-frontend") &&
      phase11InstalledFlowFixture.claude.command_execution_ok === true &&
      phase11InstalledFlowFixture.flow_artifacts &&
      phase11InstalledFlowFixture.flow_artifacts.lane_workers &&
      ["backend", "frontend"].every((laneName) => {
        const lane = phase11InstalledFlowFixture.flow_artifacts.lane_workers[laneName];
        return Boolean(
          lane &&
            lane.worktree_path &&
            Array.isArray(lane.produced_required_files) &&
            (
              lane.has_worklog_artifact === true ||
              lane.produced_required_files.some((relative) =>
                relative === `docs/lanes/${laneName}/worklog.md` ||
                (relative.startsWith(`docs/lanes/${laneName}/`) && relative.endsWith("/worklog.md"))
              )
            ) &&
            (
              lane.has_evidence_artifact === true ||
              lane.produced_required_files.some((relative) =>
                relative === `docs/lanes/${laneName}/evidence.md` ||
                relative.startsWith(`docs/lanes/${laneName}/evidence/`) ||
                (relative.startsWith(`docs/lanes/${laneName}/`) && relative.endsWith("/evidence.md"))
              )
            ) &&
            lane.board_has_candidate_done === true &&
            lane.board_has_self_approved_done === false &&
            lane.evidence_mentions_e2e === true &&
            lane.git_status_after_command === ""
        );
      })
  );
  const phase11ReviewArtifactsOk = Boolean(
    phase11InstalledFlowFixture &&
      phase11InstalledFlowFixture.claude &&
      Array.isArray(phase11InstalledFlowFixture.claude.commands_requested) &&
      phase11InstalledFlowFixture.claude.commands_requested.includes("/diayn-review-backend") &&
      phase11InstalledFlowFixture.claude.commands_requested.includes("/diayn-review-frontend") &&
      phase11InstalledFlowFixture.claude.command_execution_ok === true &&
      phase11InstalledFlowFixture.flow_artifacts &&
      phase11InstalledFlowFixture.flow_artifacts.lane_reviews &&
      ["backend", "frontend"].every((laneName) => {
        const lane = phase11InstalledFlowFixture.flow_artifacts.lane_reviews[laneName];
        return Boolean(
          lane &&
            lane.worktree_path &&
            Array.isArray(lane.produced_required_files) &&
            lane.produced_required_files.includes(`docs/lanes/${laneName}/review_log.md`) &&
            (lane.board_has_review_done === true || lane.review_log_decision_done === true) &&
            lane.board_has_rejected === false &&
            lane.review_log_decision_rejected === false &&
            lane.board_has_owner_accepted === false &&
            lane.evidence_mentions_e2e === true &&
            lane.git_status_after_command === ""
        );
      })
  );
  const phase11SyncArtifactsOk = Boolean(
    phase11InstalledFlowFixture &&
      phase11InstalledFlowFixture.claude &&
      Array.isArray(phase11InstalledFlowFixture.claude.commands_requested) &&
      phase11InstalledFlowFixture.claude.commands_requested.includes("/diayn-sync") &&
      phase11InstalledFlowFixture.claude.command_execution_ok === true &&
      phase11InstalledFlowFixture.flow_artifacts &&
      phase11InstalledFlowFixture.flow_artifacts.sync &&
      phase11InstalledFlowFixture.flow_artifacts.sync.worktree_path &&
      Array.isArray(phase11InstalledFlowFixture.flow_artifacts.sync.produced_required_files) &&
      phase11InstalledFlowFixture.flow_artifacts.sync.produced_required_files.includes("docs/stages/stage-1-auth-fixture/sync_log.md") &&
      phase11InstalledFlowFixture.flow_artifacts.sync.produced_required_files.includes("docs/lanes/backend/review_log.md") &&
      phase11InstalledFlowFixture.flow_artifacts.sync.produced_required_files.includes("docs/lanes/frontend/review_log.md") &&
      phase11InstalledFlowFixture.flow_artifacts.sync.backend_review_done_synced === true &&
      phase11InstalledFlowFixture.flow_artifacts.sync.frontend_review_done_synced === true &&
      phase11InstalledFlowFixture.flow_artifacts.sync.sync_log_says_no_business_code_merge === true &&
      phase11InstalledFlowFixture.flow_artifacts.sync.business_code_changed === false
  );
  const phase11IntegrationArtifactsOk = Boolean(
    phase11InstalledFlowFixture &&
      phase11InstalledFlowFixture.claude &&
      Array.isArray(phase11InstalledFlowFixture.claude.commands_requested) &&
      phase11InstalledFlowFixture.claude.commands_requested.includes("/diayn-integration") &&
      phase11InstalledFlowFixture.claude.command_execution_ok === true &&
      phase11InstalledFlowFixture.flow_artifacts &&
      phase11InstalledFlowFixture.flow_artifacts.integration &&
      phase11InstalledFlowFixture.flow_artifacts.integration.worktree_path &&
      Array.isArray(phase11InstalledFlowFixture.flow_artifacts.integration.produced_required_files) &&
      phase11InstalledFlowFixture.flow_artifacts.integration.produced_required_files.includes("docs/stages/stage-1-auth-fixture/integration_summary.md") &&
      phase11InstalledFlowFixture.flow_artifacts.integration.produced_required_files.includes("docs/stages/stage-1-auth-fixture/integration_e2e.json") &&
      phase11InstalledFlowFixture.flow_artifacts.integration.reviewed_backend_done === true &&
      phase11InstalledFlowFixture.flow_artifacts.integration.reviewed_frontend_done === true &&
      phase11InstalledFlowFixture.flow_artifacts.integration.mentions_merge_status === true &&
      phase11InstalledFlowFixture.flow_artifacts.integration.mentions_contract_consistency === true &&
      phase11InstalledFlowFixture.flow_artifacts.integration.evidence_mentions_e2e === true &&
      phase11InstalledFlowFixture.flow_artifacts.integration.ready_for_owner_handoff === true &&
      phase11InstalledFlowFixture.flow_artifacts.integration.marks_owner_accepted === false &&
      phase11InstalledFlowFixture.flow_artifacts.integration.business_code_changed === false
  );
  const phase11OwnerAcceptanceArtifactsOk = Boolean(
    phase11InstalledFlowFixture &&
      phase11InstalledFlowFixture.claude &&
      Array.isArray(phase11InstalledFlowFixture.claude.commands_requested) &&
      phase11InstalledFlowFixture.claude.commands_requested.includes("/diayn-html") &&
      phase11InstalledFlowFixture.claude.command_execution_ok === true &&
      phase11InstalledFlowFixture.flow_artifacts &&
      phase11InstalledFlowFixture.flow_artifacts.owner_acceptance &&
      phase11InstalledFlowFixture.flow_artifacts.owner_acceptance.worktree_path &&
      Array.isArray(phase11InstalledFlowFixture.flow_artifacts.owner_acceptance.produced_required_files) &&
      phase11InstalledFlowFixture.flow_artifacts.owner_acceptance.produced_required_files.includes("docs/stages/stage-1-auth-fixture/owner_acceptance_record.md") &&
      phase11InstalledFlowFixture.flow_artifacts.owner_acceptance.owner_decision_accepted === true &&
      phase11InstalledFlowFixture.flow_artifacts.owner_acceptance.references_integration_summary === true &&
      phase11InstalledFlowFixture.flow_artifacts.owner_acceptance.markdown_is_authoritative === true &&
      phase11InstalledFlowFixture.flow_artifacts.owner_acceptance.business_code_changed === false
  );
  const phase11BugArtifactsOk = Boolean(
    phase11InstalledFlowFixture &&
      phase11InstalledFlowFixture.claude &&
      Array.isArray(phase11InstalledFlowFixture.claude.commands_requested) &&
      phase11InstalledFlowFixture.claude.commands_requested.includes("/diayn-bug") &&
      phase11InstalledFlowFixture.claude.command_execution_ok === true &&
      phase11InstalledFlowFixture.flow_artifacts &&
      phase11InstalledFlowFixture.flow_artifacts.bug_triage &&
      phase11InstalledFlowFixture.flow_artifacts.bug_triage.worktree_path &&
      Array.isArray(phase11InstalledFlowFixture.flow_artifacts.bug_triage.produced_required_files) &&
      phase11InstalledFlowFixture.flow_artifacts.bug_triage.produced_required_files.includes("docs/stages/stage-1-auth-fixture/bug_triage_noop.md") &&
      phase11InstalledFlowFixture.flow_artifacts.bug_triage.classification_no_active_bug === true &&
      phase11InstalledFlowFixture.flow_artifacts.bug_triage.records_no_scope_or_lane_owner === true &&
      phase11InstalledFlowFixture.flow_artifacts.bug_triage.next_action_closeout === true &&
      phase11InstalledFlowFixture.flow_artifacts.bug_triage.business_code_changed === false
  );
  const phase11CloseoutArtifactsOk = Boolean(
    phase11InstalledFlowFixture &&
      phase11InstalledFlowFixture.claude &&
      Array.isArray(phase11InstalledFlowFixture.claude.commands_requested) &&
      phase11InstalledFlowFixture.claude.commands_requested.includes("/diayn-new") &&
      phase11InstalledFlowFixture.claude.command_execution_ok === true &&
      phase11InstalledFlowFixture.flow_artifacts &&
      phase11InstalledFlowFixture.flow_artifacts.closeout &&
      phase11InstalledFlowFixture.flow_artifacts.closeout.worktree_path &&
      Array.isArray(phase11InstalledFlowFixture.flow_artifacts.closeout.produced_required_files) &&
      phase11InstalledFlowFixture.flow_artifacts.closeout.produced_required_files.includes("docs/stages/stage-1-auth-fixture/stage_closeout.md") &&
      phase11InstalledFlowFixture.flow_artifacts.closeout.produced_required_files.includes("docs/stages/stage-2-follow-up/baseline_refresh.md") &&
      phase11InstalledFlowFixture.flow_artifacts.closeout.closeout_references_acceptance === true &&
      phase11InstalledFlowFixture.flow_artifacts.closeout.closeout_references_integration === true &&
      phase11InstalledFlowFixture.flow_artifacts.closeout.records_retention_notes === true &&
      phase11InstalledFlowFixture.flow_artifacts.closeout.next_stage_baseline_refresh === true &&
      phase11InstalledFlowFixture.flow_artifacts.closeout.business_code_changed === false
  );
  const result = {
    ok: errors.length === 0,
    release_ready: releaseReady,
    phase9_complete: matrix ? Boolean(matrix.phase9_complete) : false,
    prior_static_evidence_ok: allPriorOk,
    claude_project_local_bare_command_ok: claudeProjectLocalBareCommandOk,
    claude_project_local_dependency_skill_ok: claudeProjectLocalDependencySkillOk,
    claude_project_local_routed_dependency_ok: claudeProjectLocalRoutedDependencyOk,
    claude_project_local_command_sequence_visible: Boolean(
      claudeCommandSequence &&
        claudeCommandSequence.positive_evidence &&
        claudeCommandSequence.positive_evidence.all_12_bare_commands_visible_in_claude_init === true &&
        claudeCommandSequence.positive_evidence.all_12_workflow_skills_visible_in_claude_init === true
    ),
    claude_project_local_command_sequence_entry_ok: Boolean(
      claudeCommandSequence &&
        claudeCommandSequence.ok === true &&
        claudeCommandSequence.positive_evidence &&
        claudeCommandSequence.positive_evidence.all_12_commands_entered_workflow === true
    ),
    claude_project_local_command_sequence_ok: Boolean(claudeCommandSequence && claudeCommandSequence.ok === true),
    phase11_installed_flow_fixture_ok: phase11InstalledFlowFixtureOk,
    phase11_installed_flow_attempted: phase11InstalledFlowAttempted,
    phase11_installed_flow_complete: phase11InstalledFlowComplete,
    phase11_native_workflow_skill_entry_ok: phase11NativeWorkflowSkillEntryOk,
    phase11_init_scaffold_ok: phase11InitScaffoldOk,
    phase11_plan_artifacts_ok: phase11PlanArtifactsOk,
    phase11_worktree_artifacts_ok: phase11WorktreeArtifactsOk,
    phase11_lane_worker_artifacts_ok: phase11LaneWorkerArtifactsOk,
    phase11_review_artifacts_ok: phase11ReviewArtifactsOk,
    phase11_sync_artifacts_ok: phase11SyncArtifactsOk,
    phase11_integration_artifacts_ok: phase11IntegrationArtifactsOk,
    phase11_owner_acceptance_artifacts_ok: phase11OwnerAcceptanceArtifactsOk,
    phase11_bug_artifacts_ok: phase11BugArtifactsOk,
    phase11_closeout_artifacts_ok: phase11CloseoutArtifactsOk,
    phase12_side_scenarios_ok: phase12SideScenariosOk,
    codex_project_local_static_package_ok: codexProjectLocalStaticPackageOk,
    codex_project_local_install_fixture_ok: codexProjectLocalInstallFixtureOk,
    codex_home_install_fixture_ok: codexHomeInstallFixtureOk,
    codex_runtime_external_evidence_ok: codexExternalRuntimeEvidenceOk,
    codex_runtime_external_evidence_selftest_ok: codexExternalRuntimeEvidenceSelftestOk,
    supported_alpha_surfaces: matrix && Array.isArray(matrix.supported_alpha_surfaces) ? matrix.supported_alpha_surfaces : [],
    blocking_issue_ids: Array.from(blockerIds).sort(),
    notes: releaseReady
      ? "Installed-flow release gate is ready."
      : phase11InstalledFlowComplete
        ? "Claude project-local installed flow is complete for all 12 public commands, including Owner acceptance, /diayn-bug side-scenario triage, closeout, next-stage baseline refresh, and Phase 12 focused side-scenario coverage. Codex project-local .codex/skills package shape, project-local install fixture, and Codex-home install fixture are validated. Real Codex Home install and executable probes are local-only evidence, so release readiness remains blocked until the current/reloaded Codex app session proves direct /diayn-* invocation and native dependency-skill invocation."
        : "Installed-flow audit is recorded, but release readiness is blocked. Claude project-local command/dependency/routed-dependency smoke passes and all 12 commands are visible and enter workflow context. The installed fixture is green through the latest recorded command subset, but full Owner acceptance, closeout, next-stage refresh, and Phase 12 side scenarios remain unproven.",
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
