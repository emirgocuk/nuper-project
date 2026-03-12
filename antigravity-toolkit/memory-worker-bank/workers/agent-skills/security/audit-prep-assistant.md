# audit-prep-assistant
Source: https://antigravity.codes/agent-skills/security/audit-prep-assistant

## AI Worker Instructions
When the user requests functionality related to audit-prep-assistant, follow these guidelines and utilize this context.

## Scraped Content

# audit-prep-assistant
```
slither . --exclude-dependencies
```
```
slither . --exclude-dependencies
```
```
dylint --all
```
```
dylint --all
```
```
golangci-lint run
```
```
golangci-lint run
```
```
# CodeQL and Semgrep checks
```
```
# CodeQL and Semgrep checks
```
```
=== AUDIT PREP PACKAGE ===Project: DeFi DEX ProtocolAudit Date: March 15, 2024Preparation Status: Complete---## REVIEW GOALS DOCUMENTSecurity Objectives:- Verify economic security of liquidity pool swaps- Validate oracle manipulation resistance- Assess flash loan attack vectorsAreas of Concern:1. Complex AMM pricing calculation (src/SwapRouter.sol:89-156)2. Multi-hop swap routing logic (src/Router.sol)3. Oracle price aggregation (src/PriceOracle.sol:45-78)Worst-Case Scenario:- Flash loan attack drains liquidity pools via oracle manipulationQuestions for Auditors:- Can the AMM pricing model produce negative slippage under edge cases?- Is the slippage protection sufficient to prevent sandwich attacks?- How resilient is the system to temporary oracle failures?---## STATIC ANALYSIS REPORTSlither Scan Results:✓ High: 0 issues✓ Medium: 0 issues⚠ Low: 2 issues (triaged - documented in TRIAGE.md)ℹ Info: 5 issues (code style, acceptable)Tool: slither . --exclude-dependenciesDate: March 1, 2024Status: CLEAN (all critical issues resolved)---## TEST COVERAGE REPORTOverall Coverage: 94%- Statements: 1,245 / 1,321 (94%)- Branches: 456 / 498 (92%)- Functions: 89 / 92 (97%)Uncovered Areas:- Emergency pause admin functions (tested manually)- Governance migration path (one-time use)Command: forge coverageStatus: EXCELLENT---## CODE SCOPEIn-Scope Files (8):✓ src/SwapRouter.sol (456 lines)✓ src/LiquidityPool.sol (234 lines)✓ src/PairFactory.sol (389 lines)✓ src/PriceOracle.sol (167 lines)✓ src/LiquidityManager.sol (298 lines)✓ src/Governance.sol (201 lines)✓ src/FlashLoan.sol (145 lines)✓ src/RewardsDistributor.sol (178 lines)Out-of-Scope:- lib/ (OpenZeppelin, external dependencies)- test/ (test contracts)- scripts/ (deployment scripts)Total In-Scope: 2,068 lines of Solidity---## BUILD INSTRUCTIONSPrerequisites:- Foundry 0.2.0+- Node.js 18+- GitSetup:
```
```
=== AUDIT PREP PACKAGE ===Project: DeFi DEX ProtocolAudit Date: March 15, 2024Preparation Status: Complete---## REVIEW GOALS DOCUMENTSecurity Objectives:- Verify economic security of liquidity pool swaps- Validate oracle manipulation resistance- Assess flash loan attack vectorsAreas of Concern:1. Complex AMM pricing calculation (src/SwapRouter.sol:89-156)2. Multi-hop swap routing logic (src/Router.sol)3. Oracle price aggregation (src/PriceOracle.sol:45-78)Worst-Case Scenario:- Flash loan attack drains liquidity pools via oracle manipulationQuestions for Auditors:- Can the AMM pricing model produce negative slippage under edge cases?- Is the slippage protection sufficient to prevent sandwich attacks?- How resilient is the system to temporary oracle failures?---## STATIC ANALYSIS REPORTSlither Scan Results:✓ High: 0 issues✓ Medium: 0 issues⚠ Low: 2 issues (triaged - documented in TRIAGE.md)ℹ Info: 5 issues (code style, acceptable)Tool: slither . --exclude-dependenciesDate: March 1, 2024Status: CLEAN (all critical issues resolved)---## TEST COVERAGE REPORTOverall Coverage: 94%- Statements: 1,245 / 1,321 (94%)- Branches: 456 / 498 (92%)- Functions: 89 / 92 (97%)Uncovered Areas:- Emergency pause admin functions (tested manually)- Governance migration path (one-time use)Command: forge coverageStatus: EXCELLENT---## CODE SCOPEIn-Scope Files (8):✓ src/SwapRouter.sol (456 lines)✓ src/LiquidityPool.sol (234 lines)✓ src/PairFactory.sol (389 lines)✓ src/PriceOracle.sol (167 lines)✓ src/LiquidityManager.sol (298 lines)✓ src/Governance.sol (201 lines)✓ src/FlashLoan.sol (145 lines)✓ src/RewardsDistributor.sol (178 lines)Out-of-Scope:- lib/ (OpenZeppelin, external dependencies)- test/ (test contracts)- scripts/ (deployment scripts)Total In-Scope: 2,068 lines of Solidity---## BUILD INSTRUCTIONSPrerequisites:- Foundry 0.2.0+- Node.js 18+- GitSetup:
```
```
Verification:✓ Build succeeds without errors✓ All 127 tests pass✓ No warnings from compiler---## DOCUMENTATIONGenerated Artifacts:✓ ARCHITECTURE.md - System overview with diagrams✓ USER_STORIES.md - 12 user interaction flows✓ GLOSSARY.md - 34 domain terms defined✓ docs/diagrams/contract-interactions.png✓ docs/diagrams/swap-flow.png✓ docs/diagrams/state-machine.pngNatSpec Coverage: 100% of public functions---## DEPLOYMENT INFONetwork: Ethereum MainnetCommit: abc123def456 (audit-march-2024 branch)Deployed Contracts:- SwapRouter: 0x1234...- PriceOracle: 0x5678...[... etc]---PACKAGE READY FOR AUDIT ✓Next Step: Share with Trail of Bits assessment team
```
```
Verification:✓ Build succeeds without errors✓ All 127 tests pass✓ No warnings from compiler---## DOCUMENTATIONGenerated Artifacts:✓ ARCHITECTURE.md - System overview with diagrams✓ USER_STORIES.md - 12 user interaction flows✓ GLOSSARY.md - 34 domain terms defined✓ docs/diagrams/contract-interactions.png✓ docs/diagrams/swap-flow.png✓ docs/diagrams/state-machine.pngNatSpec Coverage: 100% of public functions---## DEPLOYMENT INFONetwork: Ethereum MainnetCommit: abc123def456 (audit-march-2024 branch)Deployed Contracts:- SwapRouter: 0x1234...- PriceOracle: 0x5678...[... etc]---PACKAGE READY FOR AUDIT ✓Next Step: Share with Trail of Bits assessment team
```
Navigating the complexities of a security audit can be daunting. This AI Agent Skill is designed to streamline your preparation process, ensuring your codebase is robust and well-documented before experts dive in. Leveraging insights from Trail of Bits' best practices, it guides you through crucial steps from defining review goals to enhancing code quality. Equip your project with a strong foundation, mitigating potential vulnerabilities proactively and setting the stage for a successful and efficient security assessment. This assistant becomes an invaluable partner, transforming a stressful obligation into a structured, manageable task.

# When to Use This Skill
- •Pre-audit preparation: Use 1-2 weeks before a scheduled security audit to systematically prepare your codebase.
- •Continuous security improvement: Regularly run the skill to identify and resolve vulnerabilities, maintaining a high security posture.
- •New feature or major refactor review: Apply before releasing significant code changes to ensure they meet security standards.
- •Comprehensive project documentation: Generate flowcharts, user stories, and inline comments to improve understanding and reviewability of the project.

# Pro Tips
- 💡Start by focusing on the 'Set Review Goals' step to align the AI's efforts with your specific audit objectives and communicate them to your security team.
- 💡For large codebases, run static analysis tools incrementally on critical modules first, then expand to the entire project to manage findings effectively.
- 💡Always manually review the suggested fixes and generated documentation, using them as a starting point for deeper human analysis and refinement.

