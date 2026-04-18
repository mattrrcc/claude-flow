# Agent Skills

Agent Skills extend Claude Flow and Codex CLI with specialized expertise, procedural workflows, and task-specific resources. Based on the [Agent Skills](https://agentskills.io) open standard, each skill is a self-contained directory that packages instructions and assets into a discoverable capability.

## Overview

Unlike general context files (`AGENTS.md`, `CLAUDE.md`), which provide persistent workspace-wide background, skills represent **on-demand expertise**. This allows the AI to maintain a vast library of specialized capabilities without cluttering the immediate context window.

The agent autonomously decides when to employ a skill based on your request and the skill's description. When a relevant skill is identified, the model pulls in the full instructions and resources required to complete the task.

## Key Benefits

- **Shared Expertise**: Package complex workflows into a folder that anyone on the team can use.
- **Repeatable Workflows**: Ensure complex multi-step tasks are performed consistently via a procedural framework.
- **Resource Bundling**: Include scripts, templates, or example data alongside instructions.
- **Progressive Disclosure**: Only skill metadata (name and description) is loaded initially. Detailed instructions are only disclosed when the skill is activated, saving context tokens.

## Discovery Tiers

Skills are discovered from two primary locations:

1. **Workspace Skills** — `.agents/skills/` (committed to version control, shared with team)
2. **Active Skills** — `.claude/skills/` (subset loaded into the Claude Code harness)

Within the workspace tier, `.agents/skills/` is the authoring location. The `.claude/skills/` directory contains the subset actively surfaced to Claude Code sessions.

**Precedence**: Workspace > User for skills with the same name.

## Skill Structure

Each skill lives in its own directory with a `SKILL.md` file:

```
.agents/skills/
  skill-name/
    SKILL.md        # Required: skill instructions and metadata
    scripts/        # Optional: helper scripts
    docs/           # Optional: supplementary documentation
```

### SKILL.md Format

A `SKILL.md` file contains two YAML frontmatter blocks followed by the skill body:

```markdown
---
name: skill-name
description: Brief description - invoke with $skill-name
---

---
name: display-name
type: developer|coordinator|analyst|...
color: "#HEX"
description: Detailed description of what this skill does
capabilities:
  - capability_one
  - capability_two
priority: critical|high|normal|low
hooks:
  pre: |
    # Shell commands to run before skill invocation
    echo "Starting: $TASK"
  post: |
    # Shell commands to run after skill completes
    echo "Complete"
---

# Skill Body

Full instructions, examples, and procedural guidance...
```

**Frontmatter fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique skill identifier (used in invocation) |
| `description` | Yes | What the skill does (shown during discovery) |
| `type` | No | Skill category (developer, coordinator, analyst, etc.) |
| `color` | No | Hex color for UI display |
| `capabilities` | No | List of specific capabilities |
| `priority` | No | Execution priority: `critical`, `high`, `normal`, `low` |
| `hooks.pre` | No | Shell script run before skill activation |
| `hooks.post` | No | Shell script run after skill completes |

## Invoking Skills

Skills are invoked using `$skill-name` syntax in prompts or commands:

```bash
# Invoke the coder skill
$agent-coder implement the user authentication module

# Invoke swarm orchestration
$swarm-orchestration coordinate a 6-agent feature development swarm

# Invoke security audit
$security-audit scan ./src for vulnerabilities
```

Skills can also be activated automatically when the AI determines a task matches the skill's description.

## Configuration

Skills are configured in `.agents/config.toml`:

```toml
[[skills.config]]
path = ".agents/skills/swarm-orchestration"
enabled = true

[[skills.config]]
path = ".agents/skills/security-audit"
enabled = true
```

Set `enabled = false` to disable a skill without deleting it.

## Available Skills

Claude Flow includes 134 skills organized into the following categories.

### Core Agent Skills

Fundamental agents for software development workflows:

| Skill | Description |
|-------|-------------|
| `agent-coder` | Implementation specialist for writing clean, efficient code |
| `agent-researcher` | Deep research and information gathering specialist |
| `agent-planner` | Strategic planning and task orchestration |
| `agent-reviewer` | Code review and quality assurance |
| `agent-tester` | Comprehensive testing and quality assurance |
| `agent-architect` | System design and architecture decisions |
| `agent-agent` | General-purpose agent coordination |

### Coordinator Agents

Multi-agent coordination and consensus protocols:

| Skill | Description |
|-------|-------------|
| `agent-adaptive-coordinator` | Dynamic topology switching with self-organizing swarm patterns and real-time optimization |
| `agent-byzantine-coordinator` | Byzantine fault-tolerant consensus with malicious actor detection |
| `agent-consensus-coordinator` | Distributed consensus using sublinear solvers for fast agreement |
| `agent-collective-intelligence-coordinator` | Orchestrates distributed cognitive processes across the hive mind |
| `agent-gossip-coordinator` | Gossip-based consensus for scalable eventually consistent systems |
| `agent-hierarchical-coordinator` | Queen-led hierarchical swarm coordination with specialized worker delegation |
| `agent-load-balancer` | Dynamic task distribution with work-stealing algorithms |
| `agent-mesh-coordinator` | Peer-to-peer mesh network swarm with distributed decision making |
| `agent-queen-coordinator` | Sovereign orchestrator of hierarchical hive operations |
| `agent-crdt-synchronizer` | Conflict-free Replicated Data Types for eventually consistent state |
| `agent-quorum-manager` | Dynamic quorum adjustment and intelligent membership management |
| `agent-raft-manager` | Raft consensus with leader election and log replication |
| `agent-topology-optimizer` | Dynamic swarm topology reconfiguration and communication pattern optimization |

### Development Agents

Specialized agents for different development phases:

| Skill | Description |
|-------|-------------|
| `agent-architecture` | SPARC Architecture phase specialist for system design |
| `agent-arch-system-design` | Expert agent for system architecture design and high-level technical decisions |
| `agent-base-template-generator` | Creates foundational templates, boilerplate code, and starter configurations |
| `agent-code-analyzer` | Advanced code quality analysis for comprehensive reviews and improvements |
| `agent-code-goal-planner` | Code-centric Goal-Oriented Action Planning for software development objectives |
| `agent-code-review-swarm` | Deploy specialized AI agents for comprehensive intelligent code reviews |
| `agent-dev-backend-api` | Specialized agent for backend API development with self-learning |
| `agent-docs-api-openapi` | Expert agent for creating and maintaining OpenAPI/Swagger documentation |
| `agent-implementer-sparc-coder` | Transforms specifications into working code with TDD practices |
| `agent-pseudocode` | SPARC Pseudocode phase specialist for algorithm design |
| `agent-refinement` | SPARC Refinement phase specialist for iterative improvement |
| `agent-specification` | SPARC Specification phase specialist for requirements analysis |
| `agent-tdd-london-swarm` | TDD London School specialist for mock-driven development |

### GitHub & Repository Agents

GitHub workflow automation and repository management:

| Skill | Description |
|-------|-------------|
| `agent-github-modes` | Comprehensive GitHub integration for workflow orchestration and PR management |
| `agent-github-pr-manager` | Complete pull request lifecycle management and GitHub workflow coordination |
| `agent-issue-tracker` | Intelligent issue management with automated tracking and progress monitoring |
| `agent-multi-repo-swarm` | Cross-repository swarm orchestration for organization-wide automation |
| `agent-pr-manager` | Full PR lifecycle management |
| `agent-project-board-sync` | Synchronize AI swarms with GitHub Projects for visual task management |
| `agent-release-manager` | Automated release coordination and deployment with swarm orchestration |
| `agent-release-swarm` | Orchestrate complex software releases using AI swarms |
| `agent-repo-architect` | Repository structure optimization and multi-repo management |
| `agent-swarm-issue` | GitHub issue-based swarm coordination with automatic task decomposition |
| `agent-swarm-pr` | Pull request swarm management with multi-agent code review and validation |
| `agent-sync-coordinator` | Multi-repository synchronization for version alignment and dependency sync |
| `agent-workflow-automation` | GitHub Actions workflow automation with adaptive CI/CD pipelines |

### Orchestration & Coordination

Task and swarm orchestration:

| Skill | Description |
|-------|-------------|
| `agent-coordination` | General multi-agent coordination |
| `agent-coordinator-swarm-init` | Swarm initialization and topology optimization specialist |
| `agent-orchestrator-task` | Central coordination for task decomposition, execution planning, and synthesis |
| `agent-swarm` | General swarm coordination and management |
| `agent-swarm-memory-manager` | Manages distributed memory across the hive mind with data consistency |
| `agent-memory-coordinator` | Manages persistent memory across sessions with cross-agent sharing |

### Performance & Analysis

Performance measurement and optimization:

| Skill | Description |
|-------|-------------|
| `agent-analyze-code-quality` | Advanced code quality analysis |
| `agent-benchmark-suite` | Comprehensive performance benchmarking and regression detection |
| `agent-matrix-optimizer` | Matrix analysis and optimization using sublinear algorithms |
| `agent-pagerank-analyzer` | Graph analysis and PageRank calculations for network optimization |
| `agent-performance-analyzer` | Performance bottleneck analyzer for identifying workflow inefficiencies |
| `agent-performance-benchmarker` | Comprehensive performance benchmarking for distributed consensus protocols |
| `agent-performance-monitor` | Real-time metrics collection, bottleneck analysis, and SLA monitoring |
| `agent-performance-optimizer` | System performance optimization using sublinear algorithms |
| `agent-resource-allocator` | Adaptive resource allocation, predictive scaling, and capacity planning |

### V3 Specialized Agents

Next-generation V3 implementation specialists:

| Skill | Description |
|-------|-------------|
| `agent-v3-integration-architect` | Deep agentic-flow integration, implementing ADR-001 to eliminate duplicate code |
| `agent-v3-memory-specialist` | Unifies 6+ memory systems into AgentDB with HNSW indexing (150x-12,500x improvement) |
| `agent-v3-performance-engineer` | Achieves aggressive performance targets including Flash Attention speedup |
| `agent-v3-queen-coordinator` | 15-agent concurrent swarm orchestration for 14-week V3 delivery |
| `agent-v3-security-architect` | Complete security overhaul, threat modeling, and CVE remediation |

### Neural & Intelligence

AI and machine learning specialists:

| Skill | Description |
|-------|-------------|
| `agent-safla-neural` | Self-Aware Feedback Loop Algorithm with memory-persistent AI systems |
| `agent-sona-learning-optimizer` | SONA-powered self-optimizing agent with LoRA fine-tuning and EWC++ memory |
| `agent-neural-network` | Neural network training and deployment specialist |
| `agent-trading-predictor` | Advanced financial trading using temporal advantage calculations |

### Domain-Specific Agents

| Skill | Description |
|-------|-------------|
| `agent-agentic-payments` | Multi-agent payment authorization with cryptographic verification |
| `agent-app-store` | Application marketplace and template management |
| `agent-authentication` | Authentication implementation specialist |
| `agent-automation-smart-agent` | Intelligent agent coordination and dynamic spawning |
| `agent-challenges` | Coding challenges and gamification specialist |
| `agent-data-ml-model` | Machine learning model development, training, and deployment |
| `agent-goal-planner` | Goal-Oriented Action Planning (GOAP) for complex objectives |
| `agent-migration-plan` | Comprehensive migration planning for system upgrades |
| `agent-ops-cicd-github` | CI/CD pipeline creation and optimization with GitHub Actions |
| `agent-payments` | Credit management and billing specialist |
| `agent-production-validator` | Production validation ensuring fully implemented, deployment-ready applications |
| `agent-sandbox` | E2B sandbox deployment and management |
| `agent-scout-explorer` | Information reconnaissance for exploring unknown territories |
| `agent-security-manager` | Comprehensive security mechanisms for distributed consensus protocols |
| `agent-spec-mobile-react-native` | React Native mobile application development |
| `agent-test-long-runner` | Test agent for complex tasks running 30+ minutes |
| `agent-user-tools` | User management and system utilities |
| `agent-worker-specialist` | Dedicated task execution specialist |
| `agent-workflow` | Event-driven workflow automation |

### AgentDB Skills

Vector database and memory management:

| Skill | Description |
|-------|-------------|
| `agentdb-advanced` | Advanced AgentDB operations and management |
| `agentdb-learning` | Self-learning pattern acquisition for AgentDB |
| `agentdb-memory-patterns` | Memory pattern storage and retrieval strategies |
| `agentdb-optimization` | AgentDB query and index optimization |
| `agentdb-vector-search` | HNSW vector search with 150x-12,500x performance improvement |

### Flow Nexus Skills

Cloud platform integration:

| Skill | Description |
|-------|-------------|
| `flow-nexus-neural` | Neural network training and deployment on Flow Nexus infrastructure |
| `flow-nexus-platform` | Core Flow Nexus platform operations |
| `flow-nexus-swarm` | AI swarm orchestration and management on Flow Nexus |

### GitHub Integration Skills

Dedicated GitHub workflow skills (distinct from agent-github-* which are agent wrappers):

| Skill | Description |
|-------|-------------|
| `github-automation` | Automated GitHub operations and workflow management |
| `github-code-review` | Structured code review workflows |
| `github-multi-repo` | Multi-repository coordination and synchronization |
| `github-project-management` | GitHub Projects management with milestone tracking |
| `github-release-management` | Release lifecycle management and automation |
| `github-workflow-automation` | GitHub Actions workflow creation and optimization |

### Hive-Mind Skills

Queen-led Byzantine fault-tolerant consensus:

| Skill | Description |
|-------|-------------|
| `hive-mind` | Core hive-mind coordination with queen-led consensus |
| `hive-mind-advanced` | Advanced hive-mind patterns including Byzantine fault tolerance |

### Operational Skills

Platform operations and tooling:

| Skill | Description |
|-------|-------------|
| `agentic-jujutsu` | Advanced agentic programming techniques and patterns |
| `claims` | Claims-based authorization (check, grant, revoke, list) |
| `embeddings` | Vector embeddings with sql.js, HNSW, and hyperbolic support |
| `hooks-automation` | Automated hook configuration and lifecycle management |
| `memory-management` | AgentDB memory lifecycle, search, and persistence |
| `neural-training` | Neural pattern training with SONA, MoE, and EWC++ |
| `pair-programming` | Interactive pair programming workflows with Claude |
| `performance-analysis` | System-wide performance analysis and optimization |
| `security-audit` | Security auditing, CVE scanning, and threat modeling |
| `skill-builder` | Create and configure new agent skills |

### ReasoningBank Skills

Intelligent reasoning and pattern retrieval:

| Skill | Description |
|-------|-------------|
| `reasoningbank-agentdb` | ReasoningBank integration with AgentDB for persistent reasoning patterns |
| `reasoningbank-intelligence` | Advanced intelligence retrieval using ReasoningBank |

### SPARC Methodology

Structured software development process:

| Skill | Description |
|-------|-------------|
| `sparc-methodology` | Full SPARC workflow: Specification → Pseudocode → Architecture → Refinement → Completion |

### Streaming & Pipelines

| Skill | Description |
|-------|-------------|
| `stream-chain` | Pipeline construction for streaming data processing |

### Swarm Skills

| Skill | Description |
|-------|-------------|
| `swarm-advanced` | Advanced swarm coordination patterns and topologies |
| `swarm-orchestration` | Core swarm initialization, agent spawning, and task distribution |

### V3 Implementation Skills

Domain-specific skills for V3 development:

| Skill | Description |
|-------|-------------|
| `v3-cli-modernization` | Modernizing the V3 CLI with 26 commands and 140+ subcommands |
| `v3-core-implementation` | Core V3 TypeScript monorepo implementation |
| `v3-ddd-architecture` | Domain-Driven Design bounded context implementation |
| `v3-integration-deep` | Deep integration between agentic-flow and claude-flow packages |
| `v3-mcp-optimization` | MCP protocol optimization and tool management |
| `v3-memory-unification` | Unifying 6+ memory systems into a single AgentDB backend |
| `v3-performance-optimization` | V3 performance targets: Flash Attention, HNSW, SONA |
| `v3-security-overhaul` | Addressing CVEs and implementing secure-by-default patterns |
| `v3-swarm-coordination` | V3 swarm coordination with 15-agent concurrent execution |

### Quality & Worker Skills

| Skill | Description |
|-------|-------------|
| `verification-quality` | Code verification and quality gate enforcement |
| `worker-benchmarks` | Background worker performance benchmarking |
| `worker-integration` | Worker system integration testing and validation |
| `workflow-automation` | Automated workflow creation and execution |

## Creating New Skills

### 1. Create the skill directory

```bash
mkdir -p .agents/skills/my-skill
```

### 2. Write the SKILL.md

```markdown
---
name: my-skill
description: Brief description of what this skill does
---

---
name: my-skill
type: developer
color: "#4CAF50"
description: Detailed description for discovery
capabilities:
  - specific_capability
priority: normal
hooks:
  pre: |
    echo "Starting my-skill: $TASK"
  post: |
    echo "my-skill complete"
---

# My Skill

Describe what this skill does and how to use it.

## Instructions

Step-by-step instructions for the agent...
```

### 3. Enable in config.toml

```toml
[[skills.config]]
path = ".agents/skills/my-skill"
enabled = true
```

### 4. Test the skill

```bash
$my-skill perform a specific task
```

### Using the skill-builder skill

The `skill-builder` skill automates creation of new skills:

```bash
$skill-builder create a new skill for [your domain]
```

## Integration with Claude Code

Claude Code skills live in `.claude/skills/` and are surfaced as invocable skills during sessions. The 38 active Claude Code skills are a curated subset of the 134 workspace skills.

### Active Claude Code Skills

The following skills are loaded into every Claude Code session:

- `agentdb-*` (5 variants) — AgentDB memory operations
- `agentic-jujutsu` — Advanced agentic programming
- `dual-mode` — Claude + Codex dual-mode orchestration
- `flow-nexus-*` (3 variants) — Flow Nexus platform
- `github-*` (5 variants) — GitHub integration
- `hive-mind-advanced` — Byzantine fault-tolerant consensus
- `hooks-automation` — Hook lifecycle management
- `pair-programming` — Interactive pair programming
- `performance-analysis` — Performance profiling
- `reasoningbank-*` (2 variants) — Intelligent reasoning
- `sparc-methodology` — SPARC development workflow
- `stream-chain` — Streaming pipelines
- `swarm-*` (2 variants) — Swarm coordination
- `v3-*` (9 variants) — V3 implementation specialists
- `verification-quality` — Quality gates
- `worker-*` (2 variants) — Worker management

### Invoking Claude Code Skills

In Claude Code sessions, skills are available as slash commands:

```
/agentdb-advanced
/swarm-orchestration
/sparc-methodology
```

Skills listed in the session's system prompt are auto-invoked when the task matches the skill description.

## Hooks Integration

Skills integrate with the Claude Flow hooks system. When a skill is activated:

1. The `pre` hook runs (shell commands, MCP tool calls, initialization)
2. The skill body is injected into the agent's context
3. The agent executes the task using skill guidance
4. The `post` hook runs (cleanup, metrics, pattern learning)

Example pre-hook using MCP tools:

```bash
# Initialize swarm for this skill
mcp__claude-flow__swarm_init hierarchical --maxAgents=8 --strategy=specialized

# Store context in memory
mcp__claude-flow__memory_usage store "skill:context:${TASK_ID}" "${TASK}" --namespace=skills
```

## 3-Tier Model Routing

Skills participate in the 3-tier model routing system (ADR-026):

| Tier | Handler | Use Case |
|------|---------|----------|
| 1 | Agent Booster (WASM) | Simple transforms, <1ms, $0 |
| 2 | Haiku | Low-complexity skill tasks (<30%) |
| 3 | Sonnet/Opus | Complex reasoning, architecture, security (>30%) |

Skills with `priority: critical` or `priority: high` are routed to Tier 3 automatically.
