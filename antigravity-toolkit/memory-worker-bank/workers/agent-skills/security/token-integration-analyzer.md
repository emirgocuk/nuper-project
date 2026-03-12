# token-integration-analyzer
Source: https://antigravity.codes/agent-skills/security/token-integration-analyzer

## AI Worker Instructions
When the user requests functionality related to token-integration-analyzer, follow these guidelines and utilize this context.

## Scraped Content

# token-integration-analyzer
```
slither-check-erc
```
```
slither --print human-summary
```
```
slither --print contract-summary
```
```
slither-prop
```
```
=== TOKEN INTEGRATION ANALYSIS REPORT ===Project: MultiToken DEXToken Analyzed: Custom Reward Token + Integration SafetyPlatform: Solidity 0.8.20Analysis Date: March 15, 2024---## EXECUTIVE SUMMARYToken Type: ERC20 Implementation + Protocol Integrating External TokensOverall Risk Level: MEDIUMCritical Issues: 2High Issues: 3Medium Issues: 4**Top Concerns:**⚠ Fee-on-transfer tokens not handled correctly⚠ No validation for missing return values (USDT compatibility)⚠ Owner can mint unlimited tokens without cap**Recommendation:** Address critical/high issues before mainnet launch.---## 1. GENERAL CONSIDERATIONS✓ Contract audited by CertiK (June 2023)✓ Team contactable via security@project.com✗ No security mailing list for critical announcements**Risk:** Users won't be notified of critical issues**Action:** Set up security@project.com mailing list---## 2. CONTRACT COMPOSITION### Complexity Analysis**Slither human-summary Results:**- 456 lines of code- Cyclomatic complexity: Average 6, Max 14 (transferWithFee())- 12 functions, 8 state variables- Inheritance depth: 3 (moderate)✓ Contract complexity is reasonable⚠ transferWithFee() complexity high (14) - consider splitting### SafeMath Usage✓ Using Solidity 0.8.20 (built-in overflow protection)✓ No unchecked blocks found✓ All arithmetic operations protected### Non-Token Functions**Functions Beyond ERC20:**- setFeeCollector() - Admin function ✓- setTransferFee() - Admin function ✓- withdrawFees() - Admin function ✓- pause()/unpause() - Emergency functions ✓⚠ 4 non-token functions (acceptable but adds complexity)### Address Entry Points✓ Single contract address✓ No proxy with multiple entry points✓ No token migration creating address confusion**Status:** PASS---## 3. OWNER PRIVILEGES### Upgradeability⚠ Contract uses TransparentUpgradeableProxy**Risk:** Owner can change contract logic at any time**Current Implementation:**- ProxyAdmin: 0x1234... (2/3 multisig) ✓- Timelock: None ✗**Recommendation:** Add 48-hour timelock to all upgrades### Minting Capabilities❌ CRITICAL: Unlimited mintingFile: contracts/RewardToken.sol:89
```
```
=== TOKEN INTEGRATION ANALYSIS REPORT ===Project: MultiToken DEXToken Analyzed: Custom Reward Token + Integration SafetyPlatform: Solidity 0.8.20Analysis Date: March 15, 2024---## EXECUTIVE SUMMARYToken Type: ERC20 Implementation + Protocol Integrating External TokensOverall Risk Level: MEDIUMCritical Issues: 2High Issues: 3Medium Issues: 4**Top Concerns:**⚠ Fee-on-transfer tokens not handled correctly⚠ No validation for missing return values (USDT compatibility)⚠ Owner can mint unlimited tokens without cap**Recommendation:** Address critical/high issues before mainnet launch.---## 1. GENERAL CONSIDERATIONS✓ Contract audited by CertiK (June 2023)✓ Team contactable via security@project.com✗ No security mailing list for critical announcements**Risk:** Users won't be notified of critical issues**Action:** Set up security@project.com mailing list---## 2. CONTRACT COMPOSITION### Complexity Analysis**Slither human-summary Results:**- 456 lines of code- Cyclomatic complexity: Average 6, Max 14 (transferWithFee())- 12 functions, 8 state variables- Inheritance depth: 3 (moderate)✓ Contract complexity is reasonable⚠ transferWithFee() complexity high (14) - consider splitting### SafeMath Usage✓ Using Solidity 0.8.20 (built-in overflow protection)✓ No unchecked blocks found✓ All arithmetic operations protected### Non-Token Functions**Functions Beyond ERC20:**- setFeeCollector() - Admin function ✓- setTransferFee() - Admin function ✓- withdrawFees() - Admin function ✓- pause()/unpause() - Emergency functions ✓⚠ 4 non-token functions (acceptable but adds complexity)### Address Entry Points✓ Single contract address✓ No proxy with multiple entry points✓ No token migration creating address confusion**Status:** PASS---## 3. OWNER PRIVILEGES### Upgradeability⚠ Contract uses TransparentUpgradeableProxy**Risk:** Owner can change contract logic at any time**Current Implementation:**- ProxyAdmin: 0x1234... (2/3 multisig) ✓- Timelock: None ✗**Recommendation:** Add 48-hour timelock to all upgrades### Minting Capabilities❌ CRITICAL: Unlimited mintingFile: contracts/RewardToken.sol:89
```
```
**Risk:** Owner can inflate supply arbitrarily**Fix:** Add maximum supply cap or rate-limited minting### Pausability✓ Pausable pattern implemented (OpenZeppelin)✓ Only owner can pause⚠ Paused state affects all transfers (including existing holders)**Risk:** Owner can trap all user funds**Mitigation:** Use multi-sig for pause function (already implemented ✓)### Blacklisting✗ No blacklist functionality**Assessment:** Good - no centralized censorship risk### Team Transparency✓ Team members public (team.md)✓ Company registered in Switzerland✓ Accountable and contactable**Status:** ACCEPTABLE---## 4. ERC20 CONFORMITY### Slither-check-erc ResultsCommand: slither-check-erc . RewardToken --erc erc20✓ transfer returns bool✓ transferFrom returns bool✓ name, decimals, symbol present✓ decimals returns uint8 (value: 18)✓ Race condition mitigated (increaseAllowance/decreaseAllowance)**Status:** FULLY COMPLIANT### slither-prop Test ResultsCommand: slither-prop . --contract RewardToken**Generated 12 properties, all passed:**✓ Transfer doesn't change total supply✓ Allowance correctly updates✓ Balance updates match transfer amounts✓ No balance manipulation possible[... 8 more properties ...]**Echidna fuzzing:** 50,000 runs, no violations ✓**Status:** EXCELLENT---## 5. WEIRD TOKEN PATTERN ANALYSIS### Integration Safety Check**Your Protocol Integrates 5 External Tokens:**1. USDT (0xdac17f9...)2. USDC (0xa0b86991...)3. DAI (0x6b175474...)4. WETH (0xc02aaa39...)5. UNI (0x1f9840a8...)### Critical Issues Found❌ **Pattern 7.2: Missing Return Values****Found in:** USDT integrationFile: contracts/Vault.sol:156
```
```
**Risk:** Owner can inflate supply arbitrarily**Fix:** Add maximum supply cap or rate-limited minting### Pausability✓ Pausable pattern implemented (OpenZeppelin)✓ Only owner can pause⚠ Paused state affects all transfers (including existing holders)**Risk:** Owner can trap all user funds**Mitigation:** Use multi-sig for pause function (already implemented ✓)### Blacklisting✗ No blacklist functionality**Assessment:** Good - no centralized censorship risk### Team Transparency✓ Team members public (team.md)✓ Company registered in Switzerland✓ Accountable and contactable**Status:** ACCEPTABLE---## 4. ERC20 CONFORMITY### Slither-check-erc ResultsCommand: slither-check-erc . RewardToken --erc erc20✓ transfer returns bool✓ transferFrom returns bool✓ name, decimals, symbol present✓ decimals returns uint8 (value: 18)✓ Race condition mitigated (increaseAllowance/decreaseAllowance)**Status:** FULLY COMPLIANT### slither-prop Test ResultsCommand: slither-prop . --contract RewardToken**Generated 12 properties, all passed:**✓ Transfer doesn't change total supply✓ Allowance correctly updates✓ Balance updates match transfer amounts✓ No balance manipulation possible[... 8 more properties ...]**Echidna fuzzing:** 50,000 runs, no violations ✓**Status:** EXCELLENT---## 5. WEIRD TOKEN PATTERN ANALYSIS### Integration Safety Check**Your Protocol Integrates 5 External Tokens:**1. USDT (0xdac17f9...)2. USDC (0xa0b86991...)3. DAI (0x6b175474...)4. WETH (0xc02aaa39...)5. UNI (0x1f9840a8...)### Critical Issues Found❌ **Pattern 7.2: Missing Return Values****Found in:** USDT integrationFile: contracts/Vault.sol:156
```
```
**Risk:** Silent failures on USDT transfers**Exploit:** User appears to deposit, but no tokens moved**Fix:** Use OpenZeppelin SafeERC20 wrapper---❌ **Pattern 7.3: Fee on Transfer****Risk for:** Any token with transfer feesFile: contracts/Vault.sol:170
```
```
**Risk:** Silent failures on USDT transfers**Exploit:** User appears to deposit, but no tokens moved**Fix:** Use OpenZeppelin SafeERC20 wrapper---❌ **Pattern 7.3: Fee on Transfer****Risk for:** Any token with transfer feesFile: contracts/Vault.sol:170
```
```
**Risk:** Accounting mismatch if token takes fees**Exploit:** User credited more shares than tokens deposited**Fix:** Calculate shares from balanceAfter - balanceBefore---### Known Non-Standard Token Handling✓ **USDC:** Properly handled (SafeERC20, 6 decimals accounted for)⚠ **DAI:** permit() function not used (opportunity for gas savings)✗ **USDT:** Missing return value not handled (CRITICAL)✓ **WETH:** Standard wrapper, properly handled⚠ **UNI:** Large approval handling not checked (reverts >= 2^96)---[... Additional sections for remaining analysis categories ...]
```
```
**Risk:** Accounting mismatch if token takes fees**Exploit:** User credited more shares than tokens deposited**Fix:** Calculate shares from balanceAfter - balanceBefore---### Known Non-Standard Token Handling✓ **USDC:** Properly handled (SafeERC20, 6 decimals accounted for)⚠ **DAI:** permit() function not used (opportunity for gas savings)✗ **USDT:** Missing return value not handled (CRITICAL)✓ **WETH:** Standard wrapper, properly handled⚠ **UNI:** Large approval handling not checked (reverts >= 2^96)---[... Additional sections for remaining analysis categories ...]
```
```
balanceAfter - balanceBefore
```
Navigate the complex landscape of token standards and integrations with unparalleled clarity. This Agent Skill leverages the rigorous methodology of Trail of Bits to provide a comprehensive analysis of your token projects. Whether you're minting a new ERC20, integrating third-party tokens into your DeFi protocol, or simply seeking to understand the nuances of non-standard token behaviors, this analyzer acts as your diligent security partner. Proactively identify vulnerabilities, ensure compliance, and safeguard your smart contracts against known exploits and peculiar token patterns, enhancing the robustness and trustworthiness of your decentralized applications.

# When to Use This Skill
- •Auditing a newly developed ERC20 or ERC721 token contract for compliance and security before deployment.
- •Analyzing an existing DeFi protocol's integration with external tokens to identify vulnerabilities related to non-standard or 'weird' token behaviors.
- •Performing a pre-audit security check on smart contracts that interact with various token types to understand potential attack vectors.
- •Evaluating the on-chain characteristics of a token, such as scarcity and distribution, for a deeper understanding of its economic model and security implications.

# Pro Tips
- 💡For the most accurate analysis, ensure your project's smart contracts are well-commented and context is clearly provided (e.g., target chain, token types involved).
- 💡Combine this skill with a general smart contract auditor skill to get a holistic security overview, covering both token-specific and general contract vulnerabilities.
- 💡Use the output to prioritize findings: focus on 'weird token patterns' and 'owner privileges' as these often represent critical risks, then address ERC conformity issues.

