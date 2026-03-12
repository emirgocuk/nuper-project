# solidity-security
Source: https://antigravity.codes/agent-skills/security/solidity-security

## AI Worker Instructions
When the user requests functionality related to solidity-security, follow these guidelines and utilize this context.

## Scraped Content

# solidity-security
```
// VULNERABLE TO REENTRANCYcontract VulnerableBank {    mapping(address => uint256) public balances;    function withdraw() public {        uint256 amount = balances[msg.sender];        // DANGER: External call before state update        (bool success, ) = msg.sender.call{value: amount}("");        require(success);        balances[msg.sender] = 0;  // Too late!    }}
```
```
// VULNERABLE TO REENTRANCYcontract VulnerableBank {    mapping(address => uint256) public balances;    function withdraw() public {        uint256 amount = balances[msg.sender];        // DANGER: External call before state update        (bool success, ) = msg.sender.call{value: amount}("");        require(success);        balances[msg.sender] = 0;  // Too late!    }}
```
```
contract SecureBank {    mapping(address => uint256) public balances;    function withdraw() public {        uint256 amount = balances[msg.sender];        require(amount > 0, "Insufficient balance");        // EFFECTS: Update state BEFORE external call        balances[msg.sender] = 0;        // INTERACTIONS: External call last        (bool success, ) = msg.sender.call{value: amount}("");        require(success, "Transfer failed");    }}
```
```
contract SecureBank {    mapping(address => uint256) public balances;    function withdraw() public {        uint256 amount = balances[msg.sender];        require(amount > 0, "Insufficient balance");        // EFFECTS: Update state BEFORE external call        balances[msg.sender] = 0;        // INTERACTIONS: External call last        (bool success, ) = msg.sender.call{value: amount}("");        require(success, "Transfer failed");    }}
```
```
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";contract SecureBank is ReentrancyGuard {    mapping(address => uint256) public balances;    function withdraw() public nonReentrant {        uint256 amount = balances[msg.sender];        require(amount > 0, "Insufficient balance");        balances[msg.sender] = 0;        (bool success, ) = msg.sender.call{value: amount}("");        require(success, "Transfer failed");    }}
```
```
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";contract SecureBank is ReentrancyGuard {    mapping(address => uint256) public balances;    function withdraw() public nonReentrant {        uint256 amount = balances[msg.sender];        require(amount > 0, "Insufficient balance");        balances[msg.sender] = 0;        (bool success, ) = msg.sender.call{value: amount}("");        require(success, "Transfer failed");    }}
```
```
// VULNERABLEcontract VulnerableToken {    mapping(address => uint256) public balances;    function transfer(address to, uint256 amount) public {        // No overflow check - can wrap around        balances[msg.sender] -= amount;  // Can underflow!        balances[to] += amount;          // Can overflow!    }}
```
```
// VULNERABLEcontract VulnerableToken {    mapping(address => uint256) public balances;    function transfer(address to, uint256 amount) public {        // No overflow check - can wrap around        balances[msg.sender] -= amount;  // Can underflow!        balances[to] += amount;          // Can overflow!    }}
```
```
// Solidity 0.8+ has built-in overflow/underflow checkscontract SecureToken {    mapping(address => uint256) public balances;    function transfer(address to, uint256 amount) public {        // Automatically reverts on overflow/underflow        balances[msg.sender] -= amount;        balances[to] += amount;    }}
```
```
// Solidity 0.8+ has built-in overflow/underflow checkscontract SecureToken {    mapping(address => uint256) public balances;    function transfer(address to, uint256 amount) public {        // Automatically reverts on overflow/underflow        balances[msg.sender] -= amount;        balances[to] += amount;    }}
```
```
import "@openzeppelin/contracts/utils/math/SafeMath.sol";contract SecureToken {    using SafeMath for uint256;    mapping(address => uint256) public balances;    function transfer(address to, uint256 amount) public {        balances[msg.sender] = balances[msg.sender].sub(amount);        balances[to] = balances[to].add(amount);    }}
```
```
import "@openzeppelin/contracts/utils/math/SafeMath.sol";contract SecureToken {    using SafeMath for uint256;    mapping(address => uint256) public balances;    function transfer(address to, uint256 amount) public {        balances[msg.sender] = balances[msg.sender].sub(amount);        balances[to] = balances[to].add(amount);    }}
```
```
// VULNERABLE: Anyone can call critical functionscontract VulnerableContract {    address public owner;    function withdraw(uint256 amount) public {        // No access control!        payable(msg.sender).transfer(amount);    }}
```
```
// VULNERABLE: Anyone can call critical functionscontract VulnerableContract {    address public owner;    function withdraw(uint256 amount) public {        // No access control!        payable(msg.sender).transfer(amount);    }}
```
```
import "@openzeppelin/contracts/access/Ownable.sol";contract SecureContract is Ownable {    function withdraw(uint256 amount) public onlyOwner {        payable(owner()).transfer(amount);    }}// Or implement custom role-based accesscontract RoleBasedContract {    mapping(address => bool) public admins;    modifier onlyAdmin() {        require(admins[msg.sender], "Not an admin");        _;    }    function criticalFunction() public onlyAdmin {        // Protected function    }}
```
```
import "@openzeppelin/contracts/access/Ownable.sol";contract SecureContract is Ownable {    function withdraw(uint256 amount) public onlyOwner {        payable(owner()).transfer(amount);    }}// Or implement custom role-based accesscontract RoleBasedContract {    mapping(address => bool) public admins;    modifier onlyAdmin() {        require(admins[msg.sender], "Not an admin");        _;    }    function criticalFunction() public onlyAdmin {        // Protected function    }}
```
```
// VULNERABLE TO FRONT-RUNNINGcontract VulnerableDEX {    function swap(uint256 amount, uint256 minOutput) public {        // Attacker sees this in mempool and front-runs        uint256 output = calculateOutput(amount);        require(output >= minOutput, "Slippage too high");        // Perform swap    }}
```
```
// VULNERABLE TO FRONT-RUNNINGcontract VulnerableDEX {    function swap(uint256 amount, uint256 minOutput) public {        // Attacker sees this in mempool and front-runs        uint256 output = calculateOutput(amount);        require(output >= minOutput, "Slippage too high");        // Perform swap    }}
```
```
contract SecureDEX {    mapping(bytes32 => bool) public usedCommitments;    // Step 1: Commit to trade    function commitTrade(bytes32 commitment) public {        usedCommitments[commitment] = true;    }    // Step 2: Reveal trade (next block)    function revealTrade(        uint256 amount,        uint256 minOutput,        bytes32 secret    ) public {        bytes32 commitment = keccak256(abi.encodePacked(            msg.sender, amount, minOutput, secret        ));        require(usedCommitments[commitment], "Invalid commitment");        // Perform swap    }}
```
```
contract SecureDEX {    mapping(bytes32 => bool) public usedCommitments;    // Step 1: Commit to trade    function commitTrade(bytes32 commitment) public {        usedCommitments[commitment] = true;    }    // Step 2: Reveal trade (next block)    function revealTrade(        uint256 amount,        uint256 minOutput,        bytes32 secret    ) public {        bytes32 commitment = keccak256(abi.encodePacked(            msg.sender, amount, minOutput, secret        ));        require(usedCommitments[commitment], "Invalid commitment");        // Perform swap    }}
```
```
contract SecurePattern {    mapping(address => uint256) public balances;    function withdraw(uint256 amount) public {        // 1. CHECKS: Validate conditions        require(amount <= balances[msg.sender], "Insufficient balance");        require(amount > 0, "Amount must be positive");        // 2. EFFECTS: Update state        balances[msg.sender] -= amount;        // 3. INTERACTIONS: External calls last        (bool success, ) = msg.sender.call{value: amount}("");        require(success, "Transfer failed");    }}
```
```
contract SecurePattern {    mapping(address => uint256) public balances;    function withdraw(uint256 amount) public {        // 1. CHECKS: Validate conditions        require(amount <= balances[msg.sender], "Insufficient balance");        require(amount > 0, "Amount must be positive");        // 2. EFFECTS: Update state        balances[msg.sender] -= amount;        // 3. INTERACTIONS: External calls last        (bool success, ) = msg.sender.call{value: amount}("");        require(success, "Transfer failed");    }}
```
```
// Prefer this (pull)contract SecurePayment {    mapping(address => uint256) public pendingWithdrawals;    function recordPayment(address recipient, uint256 amount) internal {        pendingWithdrawals[recipient] += amount;    }    function withdraw() public {        uint256 amount = pendingWithdrawals[msg.sender];        require(amount > 0, "Nothing to withdraw");        pendingWithdrawals[msg.sender] = 0;        payable(msg.sender).transfer(amount);    }}// Over this (push)contract RiskyPayment {    function distributePayments(address[] memory recipients, uint256[] memory amounts) public {        for (uint i = 0; i < recipients.length; i++) {            // If any transfer fails, entire batch fails            payable(recipients[i]).transfer(amounts[i]);        }    }}
```
```
// Prefer this (pull)contract SecurePayment {    mapping(address => uint256) public pendingWithdrawals;    function recordPayment(address recipient, uint256 amount) internal {        pendingWithdrawals[recipient] += amount;    }    function withdraw() public {        uint256 amount = pendingWithdrawals[msg.sender];        require(amount > 0, "Nothing to withdraw");        pendingWithdrawals[msg.sender] = 0;        payable(msg.sender).transfer(amount);    }}// Over this (push)contract RiskyPayment {    function distributePayments(address[] memory recipients, uint256[] memory amounts) public {        for (uint i = 0; i < recipients.length; i++) {            // If any transfer fails, entire batch fails            payable(recipients[i]).transfer(amounts[i]);        }    }}
```
```
contract SecureContract {    function transfer(address to, uint256 amount) public {        // Validate inputs        require(to != address(0), "Invalid recipient");        require(to != address(this), "Cannot send to contract");        require(amount > 0, "Amount must be positive");        require(amount <= balances[msg.sender], "Insufficient balance");        // Proceed with transfer        balances[msg.sender] -= amount;        balances[to] += amount;    }}
```
```
contract SecureContract {    function transfer(address to, uint256 amount) public {        // Validate inputs        require(to != address(0), "Invalid recipient");        require(to != address(this), "Cannot send to contract");        require(amount > 0, "Amount must be positive");        require(amount <= balances[msg.sender], "Insufficient balance");        // Proceed with transfer        balances[msg.sender] -= amount;        balances[to] += amount;    }}
```
```
import "@openzeppelin/contracts/security/Pausable.sol";contract EmergencyStop is Pausable, Ownable {    function criticalFunction() public whenNotPaused {        // Function logic    }    function emergencyStop() public onlyOwner {        _pause();    }    function resume() public onlyOwner {        _unpause();    }}
```
```
import "@openzeppelin/contracts/security/Pausable.sol";contract EmergencyStop is Pausable, Ownable {    function criticalFunction() public whenNotPaused {        // Function logic    }    function emergencyStop() public onlyOwner {        _pause();    }    function resume() public onlyOwner {        _unpause();    }}
```
```
uint256
```
```
// More gas efficientcontract GasEfficient {    uint256 public value;  // Optimal    function set(uint256 _value) public {        value = _value;    }}// Less efficientcontract GasInefficient {    uint8 public value;  // Still uses 256-bit slot    function set(uint8 _value) public {        value = _value;  // Extra gas for type conversion    }}
```
```
// More gas efficientcontract GasEfficient {    uint256 public value;  // Optimal    function set(uint256 _value) public {        value = _value;    }}// Less efficientcontract GasInefficient {    uint8 public value;  // Still uses 256-bit slot    function set(uint8 _value) public {        value = _value;  // Extra gas for type conversion    }}
```
```
// Gas efficient (3 variables in 1 slot)contract PackedStorage {    uint128 public a;  // Slot 0    uint64 public b;   // Slot 0    uint64 public c;   // Slot 0    uint256 public d;  // Slot 1}// Gas inefficient (each variable in separate slot)contract UnpackedStorage {    uint256 public a;  // Slot 0    uint256 public b;  // Slot 1    uint256 public c;  // Slot 2    uint256 public d;  // Slot 3}
```
```
// Gas efficient (3 variables in 1 slot)contract PackedStorage {    uint128 public a;  // Slot 0    uint64 public b;   // Slot 0    uint64 public c;   // Slot 0    uint256 public d;  // Slot 1}// Gas inefficient (each variable in separate slot)contract UnpackedStorage {    uint256 public a;  // Slot 0    uint256 public b;  // Slot 1    uint256 public c;  // Slot 2    uint256 public d;  // Slot 3}
```
```
calldata
```
```
memory
```
```
contract GasOptimized {    // More gas efficient    function processData(uint256[] calldata data) public pure returns (uint256) {        return data[0];    }    // Less efficient    function processDataMemory(uint256[] memory data) public pure returns (uint256) {        return data[0];    }}
```
```
contract GasOptimized {    // More gas efficient    function processData(uint256[] calldata data) public pure returns (uint256) {        return data[0];    }    // Less efficient    function processDataMemory(uint256[] memory data) public pure returns (uint256) {        return data[0];    }}
```
```
contract EventStorage {    // Emitting events is cheaper than storage    event DataStored(address indexed user, uint256 indexed id, bytes data);    function storeData(uint256 id, bytes calldata data) public {        emit DataStored(msg.sender, id, data);        // Don't store in contract storage unless needed    }}
```
```
contract EventStorage {    // Emitting events is cheaper than storage    event DataStored(address indexed user, uint256 indexed id, bytes data);    function storeData(uint256 id, bytes calldata data) public {        emit DataStored(msg.sender, id, data);        // Don't store in contract storage unless needed    }}
```
```
// Security Checklist Contractcontract SecurityChecklist {    /**     * [ ] Reentrancy protection (ReentrancyGuard or CEI pattern)     * [ ] Integer overflow/underflow (Solidity 0.8+ or SafeMath)     * [ ] Access control (Ownable, roles, modifiers)     * [ ] Input validation (require statements)     * [ ] Front-running mitigation (commit-reveal if applicable)     * [ ] Gas optimization (packed storage, calldata)     * [ ] Emergency stop mechanism (Pausable)     * [ ] Pull over push pattern for payments     * [ ] No delegatecall to untrusted contracts     * [ ] No tx.origin for authentication (use msg.sender)     * [ ] Proper event emission     * [ ] External calls at end of function     * [ ] Check return values of external calls     * [ ] No hardcoded addresses     * [ ] Upgrade mechanism (if proxy pattern)     */}
```
```
// Security Checklist Contractcontract SecurityChecklist {    /**     * [ ] Reentrancy protection (ReentrancyGuard or CEI pattern)     * [ ] Integer overflow/underflow (Solidity 0.8+ or SafeMath)     * [ ] Access control (Ownable, roles, modifiers)     * [ ] Input validation (require statements)     * [ ] Front-running mitigation (commit-reveal if applicable)     * [ ] Gas optimization (packed storage, calldata)     * [ ] Emergency stop mechanism (Pausable)     * [ ] Pull over push pattern for payments     * [ ] No delegatecall to untrusted contracts     * [ ] No tx.origin for authentication (use msg.sender)     * [ ] Proper event emission     * [ ] External calls at end of function     * [ ] Check return values of external calls     * [ ] No hardcoded addresses     * [ ] Upgrade mechanism (if proxy pattern)     */}
```
```
// Hardhat test exampleconst { expect } = require("chai");const { ethers } = require("hardhat");describe("Security Tests", function () {  it("Should prevent reentrancy attack", async function () {    const [attacker] = await ethers.getSigners();    const VictimBank = await ethers.getContractFactory("SecureBank");    const bank = await VictimBank.deploy();    const Attacker = await ethers.getContractFactory("ReentrancyAttacker");    const attackerContract = await Attacker.deploy(bank.address);    // Deposit funds    await bank.deposit({ value: ethers.utils.parseEther("10") });    // Attempt reentrancy attack    await expect(      attackerContract.attack({ value: ethers.utils.parseEther("1") }),    ).to.be.revertedWith("ReentrancyGuard: reentrant call");  });  it("Should prevent integer overflow", async function () {    const Token = await ethers.getContractFactory("SecureToken");    const token = await Token.deploy();    // Attempt overflow    await expect(token.transfer(attacker.address, ethers.constants.MaxUint256))      .to.be.reverted;  });  it("Should enforce access control", async function () {    const [owner, attacker] = await ethers.getSigners();    const Contract = await ethers.getContractFactory("SecureContract");    const contract = await Contract.deploy();    // Attempt unauthorized withdrawal    await expect(contract.connect(attacker).withdraw(100)).to.be.revertedWith(      "Ownable: caller is not the owner",    );  });});
```
```
// Hardhat test exampleconst { expect } = require("chai");const { ethers } = require("hardhat");describe("Security Tests", function () {  it("Should prevent reentrancy attack", async function () {    const [attacker] = await ethers.getSigners();    const VictimBank = await ethers.getContractFactory("SecureBank");    const bank = await VictimBank.deploy();    const Attacker = await ethers.getContractFactory("ReentrancyAttacker");    const attackerContract = await Attacker.deploy(bank.address);    // Deposit funds    await bank.deposit({ value: ethers.utils.parseEther("10") });    // Attempt reentrancy attack    await expect(      attackerContract.attack({ value: ethers.utils.parseEther("1") }),    ).to.be.revertedWith("ReentrancyGuard: reentrant call");  });  it("Should prevent integer overflow", async function () {    const Token = await ethers.getContractFactory("SecureToken");    const token = await Token.deploy();    // Attempt overflow    await expect(token.transfer(attacker.address, ethers.constants.MaxUint256))      .to.be.reverted;  });  it("Should enforce access control", async function () {    const [owner, attacker] = await ethers.getSigners();    const Contract = await ethers.getContractFactory("SecureContract");    const contract = await Contract.deploy();    // Attempt unauthorized withdrawal    await expect(contract.connect(attacker).withdraw(100)).to.be.revertedWith(      "Ownable: caller is not the owner",    );  });});
```
```
contract WellDocumentedContract {    /**     * @title Well Documented Contract     * @dev Example of proper documentation for audits     * @notice This contract handles user deposits and withdrawals     */    /// @notice Mapping of user balances    mapping(address => uint256) public balances;    /**     * @dev Deposits ETH into the contract     * @notice Anyone can deposit funds     */    function deposit() public payable {        require(msg.value > 0, "Must send ETH");        balances[msg.sender] += msg.value;    }    /**     * @dev Withdraws user's balance     * @notice Follows CEI pattern to prevent reentrancy     * @param amount Amount to withdraw in wei     */    function withdraw(uint256 amount) public {        // CHECKS        require(amount <= balances[msg.sender], "Insufficient balance");        // EFFECTS        balances[msg.sender] -= amount;        // INTERACTIONS        (bool success, ) = msg.sender.call{value: amount}("");        require(success, "Transfer failed");    }}
```
```
contract WellDocumentedContract {    /**     * @title Well Documented Contract     * @dev Example of proper documentation for audits     * @notice This contract handles user deposits and withdrawals     */    /// @notice Mapping of user balances    mapping(address => uint256) public balances;    /**     * @dev Deposits ETH into the contract     * @notice Anyone can deposit funds     */    function deposit() public payable {        require(msg.value > 0, "Must send ETH");        balances[msg.sender] += msg.value;    }    /**     * @dev Withdraws user's balance     * @notice Follows CEI pattern to prevent reentrancy     * @param amount Amount to withdraw in wei     */    function withdraw(uint256 amount) public {        // CHECKS        require(amount <= balances[msg.sender], "Insufficient balance");        // EFFECTS        balances[msg.sender] -= amount;        // INTERACTIONS        (bool success, ) = msg.sender.call{value: amount}("");        require(success, "Transfer failed");    }}
```
```
tx.origin
```
```
msg.sender
```
Smart contract security is paramount in the blockchain ecosystem, where even minor flaws can lead to catastrophic financial losses. This powerful agent skill is your dedicated partner in fortifying decentralized applications against a myriad of threats. It distills complex security principles into actionable guidance, helping developers proactively identify and mitigate risks from the ground up. Whether you're crafting new protocols or scrutinizing existing codebases, leveraging this skill ensures your Solidity contracts adhere to the highest standards of safety, protecting user funds and maintaining trust in your dApps. It's an indispensable tool for building resilient and tamper-proof blockchain solutions.

# When to Use This Skill
- •Designing and implementing new smart contracts with a security-first mindset.
- •Conducting comprehensive security audits of existing Solidity codebases for potential weaknesses.
- •Refactoring vulnerable contract logic to incorporate robust defense mechanisms and secure patterns.
- •Preparing smart contracts for external security reviews and formal audits to ensure compliance and safety.

# Pro Tips
- 💡Prioritize a "Security-First" Mindset: Always consider potential attack vectors from the very first line of code. Use this skill as a constant checklist during development to proactively build secure contracts.
- 💡Combine with Manual Review: While this skill provides excellent guidance and identifies common pitfalls, always complement its suggestions with thorough manual code reviews by experienced security auditors.
- 💡Utilize Static Analysis Tools: Integrate automated tools like Slither or MythX into your CI/CD pipeline alongside this skill's insights for an even stronger, multi-layered security posture.

