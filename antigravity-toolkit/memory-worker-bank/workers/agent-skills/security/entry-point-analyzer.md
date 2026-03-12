# entry-point-analyzer
Source: https://antigravity.codes/agent-skills/security/entry-point-analyzer

## AI Worker Instructions
When the user requests functionality related to entry-point-analyzer, follow these guidelines and utilize this context.

## Scraped Content

# entry-point-analyzer
```
view
```
```
pure
```
```
@view
```
```
@pure
```
```
mut
```
```
public fun
```
```
get
```
```
query
```
```
which slither
```
```
which slither
```
```
slither . --print entry-points
```
```
slither . --print entry-points
```
```
which slither
```
```
.sol
```
```
.vy
```
```
.rs
```
```
Cargo.toml
```
```
solana-program
```
```
.move
```
```
.fc
```
```
.func
```
```
.tact
```
```
.rs
```
```
Cargo.toml
```
```
cosmwasm-std
```
```
admin
```
```
owner
```
```
governance
```
```
guardian
```
```
operator
```
```
manager
```
```
minter
```
```
pauser
```
```
keeper
```
```
relayer
```
```
lender
```
```
borrower
```
```
onlyRole
```
```
hasRole
```
```
require(msg.sender == X)
```
```
assert_owner
```
```
#[access_control]
```
```
onERC721Received
```
```
uniswapV3SwapCallback
```
```
flashLoanCallback
```
```
tx.origin == msg.sender
```
```
# Entry Point Analysis: [Project Name]**Analyzed**: [timestamp]**Scope**: [directories analyzed or "full codebase"]**Languages**: [detected languages]**Focus**: State-changing functions only (view/pure excluded)## Summary| Category | Count ||----------|-------|| Public (Unrestricted) | X || Role-Restricted | X || Restricted (Review Required) | X || Contract-Only | X || **Total** | **X** |---## Public Entry Points (Unrestricted)State-changing functions callable by anyone—prioritize for attack surface analysis.| Function | File | Notes ||----------|------|-------|| functionName(params) | path/to/file.sol:L42 | Brief note if relevant |---## Role-Restricted Entry Points### Admin / Owner| Function | File | Restriction ||----------|------|-------------|| setFee(uint256) | Config.sol:L15 | onlyOwner |### Governance| Function | File | Restriction ||----------|------|-------------|### Guardian / Pauser| Function | File | Restriction ||----------|------|-------------|### Other Roles| Function | File | Restriction | Role ||----------|------|-------------|------|---## Restricted (Review Required)Functions with access control patterns that need manual verification.| Function | File | Pattern | Why Review ||----------|------|---------|------------|| execute(bytes) | Executor.sol:L88 | require(trusted[msg.sender]) | Dynamic trust list |---## Contract-Only (Internal Integration Points)Functions only callable by other contracts—useful for understanding trust boundaries.| Function | File | Expected Caller ||----------|------|-----------------|| onFlashLoan(...) | Vault.sol:L200 | Flash loan provider |---## Files Analyzed- path/to/file1.sol (X state-changing entry points)- path/to/file2.sol (X state-changing entry points)
```
```
# Entry Point Analysis: [Project Name]**Analyzed**: [timestamp]**Scope**: [directories analyzed or "full codebase"]**Languages**: [detected languages]**Focus**: State-changing functions only (view/pure excluded)## Summary| Category | Count ||----------|-------|| Public (Unrestricted) | X || Role-Restricted | X || Restricted (Review Required) | X || Contract-Only | X || **Total** | **X** |---## Public Entry Points (Unrestricted)State-changing functions callable by anyone—prioritize for attack surface analysis.| Function | File | Notes ||----------|------|-------|| functionName(params) | path/to/file.sol:L42 | Brief note if relevant |---## Role-Restricted Entry Points### Admin / Owner| Function | File | Restriction ||----------|------|-------------|| setFee(uint256) | Config.sol:L15 | onlyOwner |### Governance| Function | File | Restriction ||----------|------|-------------|### Guardian / Pauser| Function | File | Restriction ||----------|------|-------------|### Other Roles| Function | File | Restriction | Role ||----------|------|-------------|------|---## Restricted (Review Required)Functions with access control patterns that need manual verification.| Function | File | Pattern | Why Review ||----------|------|---------|------------|| execute(bytes) | Executor.sol:L88 | require(trusted[msg.sender]) | Dynamic trust list |---## Contract-Only (Internal Integration Points)Functions only callable by other contracts—useful for understanding trust boundaries.| Function | File | Expected Caller ||----------|------|-----------------|| onFlashLoan(...) | Vault.sol:L200 | Flash loan provider |---## Files Analyzed- path/to/file1.sol (X state-changing entry points)- path/to/file2.sol (X state-changing entry points)
```
```
functionName(params)
```
```
path/to/file.sol:L42
```
```
setFee(uint256)
```
```
Config.sol:L15
```
```
onlyOwner
```
```
execute(bytes)
```
```
Executor.sol:L88
```
```
require(trusted[msg.sender])
```
```
onFlashLoan(...)
```
```
Vault.sol:L200
```
```
path/to/file1.sol
```
```
path/to/file2.sol
```
```
src/core/
```
```
src/core/
```
```
view
```
```
pure
```
```
owner
```
```
feeManager
```
```
pairCreator
```
```
admin
```
```
guardian
```
```
liquidator
```
```
oracle
```
```
proposer
```
```
executor
```
```
canceller
```
```
timelock
```
```
minter
```
```
admin
```
```
royaltyReceiver
```
```
relayer
```
```
guardian
```
```
validator
```
```
operator
```
```
strategist
```
```
keeper
```
```
harvester
```
```
manager
```
This skill provides a foundational layer for robust smart contract security. By methodically mapping out all functions capable of altering contract state, it helps auditors pinpoint critical areas for review. It moves beyond superficial checks to deep-dive into how external interactions can modify the underlying ledger. This systematic approach ensures that no potential attack vector related to state manipulation is overlooked, making it an indispensable tool for proactive blockchain security assessments and understanding complex contract logic. It's an essential first step before detailed vulnerability hunting begins.

# When to Use This Skill
- •Initial phase of a smart contract security audit to understand the attack surface and potential state-modifying pathways.
- •Analyzing sophisticated access control mechanisms and privileged functions in large dApp codebases across various blockchain platforms.
- •When needing to quickly identify all external, state-modifying functions across multiple blockchain languages for compliance or architecture review.
- •Building comprehensive documentation for contract entry points, their associated state changes, and required access levels.

# Pro Tips
- 💡Combine with `audit-context-building` to enrich identified entry points with relevant vulnerability patterns and historical context.
- 💡After identifying entry points, use `solidity-test-generator` or similar to create targeted test cases specifically for state transitions and access control logic.
- 💡Run this skill against different versions of a contract to identify new, removed, or modified state-changing entry points during an upgrade or migration audit.

