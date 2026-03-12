# wycheproof
Source: https://antigravity.codes/agent-skills/security/wycheproof

## AI Worker Instructions
When the user requests functionality related to wycheproof, follow these guidelines and utilize this context.

## Scraped Content

# wycheproof
```
aes_gcm_test.json
```
```
ecdsa_*_test.json
```
```
ecdh_*_test.json
```
```
rsa_*_test.json
```
```
chacha20_poly1305_test.json
```
```
Phase 1: Setup                 Phase 2: Parse Test Vectors┌─────────────────┐          ┌─────────────────┐│ Add Wycheproof  │    →     │ Load JSON file  ││ as submodule    │          │ Filter by params│└─────────────────┘          └─────────────────┘         ↓                            ↓Phase 4: CI Integration        Phase 3: Write Harness┌─────────────────┐          ┌─────────────────┐│ Auto-update     │    ←     │ Test valid &    ││ test vectors    │          │ invalid cases   │└─────────────────┘          └─────────────────┘
```
```
Phase 1: Setup                 Phase 2: Parse Test Vectors┌─────────────────┐          ┌─────────────────┐│ Add Wycheproof  │    →     │ Load JSON file  ││ as submodule    │          │ Filter by params│└─────────────────┘          └─────────────────┘         ↓                            ↓Phase 4: CI Integration        Phase 3: Write Harness┌─────────────────┐          ┌─────────────────┐│ Auto-update     │    ←     │ Test valid &    ││ test vectors    │          │ invalid cases   │└─────────────────┘          └─────────────────┘
```
```
┣ 📜 README.md       : Project overview┣ 📂 doc             : Documentation┣ 📂 java            : Java JCE interface testing harness┣ 📂 javascript      : JavaScript testing harness┣ 📂 schemas         : Test vector schemas┣ 📂 testvectors     : Test vectors┗ 📂 testvectors_v1  : Updated test vectors (more detailed)
```
```
┣ 📜 README.md       : Project overview┣ 📂 doc             : Documentation┣ 📂 java            : Java JCE interface testing harness┣ 📂 javascript      : JavaScript testing harness┣ 📂 schemas         : Test vector schemas┣ 📂 testvectors     : Test vectors┗ 📂 testvectors_v1  : Updated test vectors (more detailed)
```
```
testvectors
```
```
testvectors_v1
```
```
testvectors_v1
```
```
"algorithm"         : The name of the algorithm tested"schema"            : The JSON schema (found in schemas folder)"generatorVersion"  : The version number"numberOfTests"     : The total number of test vectors in this file"header"            : Detailed description of test vectors"notes"             : In-depth explanation of flags in test vectors"testGroups"        : Array of one or multiple test groups
```
```
"algorithm"         : The name of the algorithm tested"schema"            : The JSON schema (found in schemas folder)"generatorVersion"  : The version number"numberOfTests"     : The total number of test vectors in this file"header"            : Detailed description of test vectors"notes"             : In-depth explanation of flags in test vectors"testGroups"        : Array of one or multiple test groups
```
```
notes
```
```
result
```
```
key
```
```
iv
```
```
aad
```
```
msg
```
```
ct
```
```
tag
```
```
public
```
```
private
```
```
shared
```
```
msg
```
```
sig
```
```
result
```
```
msg
```
```
sig
```
```
pk
```
```
git submodule add https://github.com/C2SP/wycheproof.git
```
```
git submodule add https://github.com/C2SP/wycheproof.git
```
```
#!/bin/bashTMP_WYCHEPROOF_FOLDER=".wycheproof/"TEST_VECTORS=('aes_gcm_test.json' 'aes_eax_test.json')BASE_URL="https://raw.githubusercontent.com/C2SP/wycheproof/master/testvectors_v1/"# Create wycheproof foldermkdir -p $TMP_WYCHEPROOF_FOLDER# Request all test vector files if they don't existfor i in "${TEST_VECTORS[@]}"; do  if [ ! -f "${TMP_WYCHEPROOF_FOLDER}${i}" ]; then    curl -o "${TMP_WYCHEPROOF_FOLDER}${i}" "${BASE_URL}${i}"    if [ $? -ne 0 ]; then      echo "Failed to download ${i}"      exit 1    fi  fidone
```
```
#!/bin/bashTMP_WYCHEPROOF_FOLDER=".wycheproof/"TEST_VECTORS=('aes_gcm_test.json' 'aes_eax_test.json')BASE_URL="https://raw.githubusercontent.com/C2SP/wycheproof/master/testvectors_v1/"# Create wycheproof foldermkdir -p $TMP_WYCHEPROOF_FOLDER# Request all test vector files if they don't existfor i in "${TEST_VECTORS[@]}"; do  if [ ! -f "${TMP_WYCHEPROOF_FOLDER}${i}" ]; then    curl -o "${TMP_WYCHEPROOF_FOLDER}${i}" "${BASE_URL}${i}"    if [ $? -ne 0 ]; then      echo "Failed to download ${i}"      exit 1    fi  fidone
```
```
import jsondef load_wycheproof_test_vectors(path: str):    testVectors = []    try:        with open(path, "r") as f:            wycheproof_json = json.loads(f.read())    except FileNotFoundError:        print(f"No Wycheproof file found at: {path}")        return testVectors    # Attributes that need hex-to-bytes conversion    convert_attr = {"key", "aad", "iv", "msg", "ct", "tag"}    for testGroup in wycheproof_json["testGroups"]:        # Filter test groups based on implementation constraints        if testGroup["ivSize"] < 64 or testGroup["ivSize"] > 1024:            continue        for tv in testGroup["tests"]:            # Convert hex strings to bytes            for attr in convert_attr:                if attr in tv:                    tv[attr] = bytes.fromhex(tv[attr])            testVectors.append(tv)    return testVectors
```
```
import jsondef load_wycheproof_test_vectors(path: str):    testVectors = []    try:        with open(path, "r") as f:            wycheproof_json = json.loads(f.read())    except FileNotFoundError:        print(f"No Wycheproof file found at: {path}")        return testVectors    # Attributes that need hex-to-bytes conversion    convert_attr = {"key", "aad", "iv", "msg", "ct", "tag"}    for testGroup in wycheproof_json["testGroups"]:        # Filter test groups based on implementation constraints        if testGroup["ivSize"] < 64 or testGroup["ivSize"] > 1024:            continue        for tv in testGroup["tests"]:            # Convert hex strings to bytes            for attr in convert_attr:                if attr in tv:                    tv[attr] = bytes.fromhex(tv[attr])            testVectors.append(tv)    return testVectors
```
```
const fs = require('fs').promises;async function loadWycheproofTestVectors(path) {  const tests = [];  try {    const fileContent = await fs.readFile(path);    const data = JSON.parse(fileContent.toString());    data.testGroups.forEach(testGroup => {      testGroup.tests.forEach(test => {        // Add shared test group properties to each test        test['pk'] = testGroup.publicKey.pk;        tests.push(test);      });    });  } catch (err) {    console.error('Error reading or parsing file:', err);    throw err;  }  return tests;}
```
```
const fs = require('fs').promises;async function loadWycheproofTestVectors(path) {  const tests = [];  try {    const fileContent = await fs.readFile(path);    const data = JSON.parse(fileContent.toString());    data.testGroups.forEach(testGroup => {      testGroup.tests.forEach(test => {        // Add shared test group properties to each test        test['pk'] = testGroup.publicKey.pk;        tests.push(test);      });    });  } catch (err) {    console.error('Error reading or parsing file:', err);    throw err;  }  return tests;}
```
```
import pytestfrom cryptography.hazmat.primitives.ciphers.aead import AESGCMtvs = load_wycheproof_test_vectors("wycheproof/testvectors_v1/aes_gcm_test.json")@pytest.mark.parametrize("tv", tvs, ids=[str(tv['tcId']) for tv in tvs])def test_encryption(tv):    try:        aesgcm = AESGCM(tv['key'])        ct = aesgcm.encrypt(tv['iv'], tv['msg'], tv['aad'])    except ValueError as e:        # Implementation raised error - verify test was expected to fail        assert tv['result'] != 'valid', tv['comment']        return    if tv['result'] == 'valid':        assert ct[:-16] == tv['ct'], f"Ciphertext mismatch: {tv['comment']}"        assert ct[-16:] == tv['tag'], f"Tag mismatch: {tv['comment']}"    elif tv['result'] == 'invalid' or tv['result'] == 'acceptable':        assert ct[:-16] != tv['ct'] or ct[-16:] != tv['tag']@pytest.mark.parametrize("tv", tvs, ids=[str(tv['tcId']) for tv in tvs])def test_decryption(tv):    try:        aesgcm = AESGCM(tv['key'])        decrypted_msg = aesgcm.decrypt(tv['iv'], tv['ct'] + tv['tag'], tv['aad'])    except ValueError:        assert tv['result'] != 'valid', tv['comment']        return    except InvalidTag:        assert tv['result'] != 'valid', tv['comment']        assert 'ModifiedTag' in tv['flags'], f"Expected 'ModifiedTag' flag: {tv['comment']}"        return    assert tv['result'] == 'valid', f"No invalid test case should pass: {tv['comment']}"    assert decrypted_msg == tv['msg'], f"Decryption mismatch: {tv['comment']}"
```
```
import pytestfrom cryptography.hazmat.primitives.ciphers.aead import AESGCMtvs = load_wycheproof_test_vectors("wycheproof/testvectors_v1/aes_gcm_test.json")@pytest.mark.parametrize("tv", tvs, ids=[str(tv['tcId']) for tv in tvs])def test_encryption(tv):    try:        aesgcm = AESGCM(tv['key'])        ct = aesgcm.encrypt(tv['iv'], tv['msg'], tv['aad'])    except ValueError as e:        # Implementation raised error - verify test was expected to fail        assert tv['result'] != 'valid', tv['comment']        return    if tv['result'] == 'valid':        assert ct[:-16] == tv['ct'], f"Ciphertext mismatch: {tv['comment']}"        assert ct[-16:] == tv['tag'], f"Tag mismatch: {tv['comment']}"    elif tv['result'] == 'invalid' or tv['result'] == 'acceptable':        assert ct[:-16] != tv['ct'] or ct[-16:] != tv['tag']@pytest.mark.parametrize("tv", tvs, ids=[str(tv['tcId']) for tv in tvs])def test_decryption(tv):    try:        aesgcm = AESGCM(tv['key'])        decrypted_msg = aesgcm.decrypt(tv['iv'], tv['ct'] + tv['tag'], tv['aad'])    except ValueError:        assert tv['result'] != 'valid', tv['comment']        return    except InvalidTag:        assert tv['result'] != 'valid', tv['comment']        assert 'ModifiedTag' in tv['flags'], f"Expected 'ModifiedTag' flag: {tv['comment']}"        return    assert tv['result'] == 'valid', f"No invalid test case should pass: {tv['comment']}"    assert decrypted_msg == tv['msg'], f"Decryption mismatch: {tv['comment']}"
```
```
const assert = require('assert');function testFactory(tcId, tests) {  it([${tcId + 1}] ${tests[tcId].comment}, function () {    const test = tests[tcId];    const ed25519 = new eddsa('ed25519');    const key = ed25519.keyFromPublic(toArray(test.pk, 'hex'));    let sig;    if (test.result === 'valid') {      sig = key.verify(test.msg, test.sig);      assert.equal(sig, true, [${test.tcId}] ${test.comment});    } else if (test.result === 'invalid') {      try {        sig = key.verify(test.msg, test.sig);      } catch (err) {        // Point could not be decoded        sig = false;      }      assert.equal(sig, false, [${test.tcId}] ${test.comment});    }  });}// Generate tests for all test vectorsfor (var tcId = 0; tcId < tests.length; tcId++) {  testFactory(tcId, tests);}
```
```
const assert = require('assert');function testFactory(tcId, tests) {  it([${tcId + 1}] ${tests[tcId].comment}, function () {    const test = tests[tcId];    const ed25519 = new eddsa('ed25519');    const key = ed25519.keyFromPublic(toArray(test.pk, 'hex'));    let sig;    if (test.result === 'valid') {      sig = key.verify(test.msg, test.sig);      assert.equal(sig, true, [${test.tcId}] ${test.comment});    } else if (test.result === 'invalid') {      try {        sig = key.verify(test.msg, test.sig);      } catch (err) {        // Point could not be decoded        sig = false;      }      assert.equal(sig, false, [${test.tcId}] ${test.comment});    }  });}// Generate tests for all test vectorsfor (var tcId = 0; tcId < tests.length; tcId++) {  testFactory(tcId, tests);}
```
```
[${tcId + 1}] ${tests[tcId].comment}
```
```
[${test.tcId}] ${test.comment}
```
```
[${test.tcId}] ${test.comment}
```
```
Valid signature:   ...6a5c51eb6f946b30dInvalid signature: ...6a5c51eb6f946b30d0000  (should be rejected)
```
```
Valid signature:   ...6a5c51eb6f946b30dInvalid signature: ...6a5c51eb6f946b30d0000  (should be rejected)
```
```
# Add signature length checkif len(sig) != 128:  # EdDSA signatures must be exactly 64 bytes (128 hex chars)    return False
```
```
# Add signature length checkif len(sig) != 128:  # EdDSA signatures must be exactly 64 bytes (128 hex chars)    return False
```
```
testvectors_v1/ed25519_test.json
```
```
if(sig.length !== 128) return false;
```
```
if ((data[p.place] & 128) !== 0) return false;
```
```
if(buf[p.place] === 0x00) return false;
```
```
notes
```
```
┌─────────────────────┐                    │    wycheproof       │                    │   (this skill)      │                    └──────────┬──────────┘                               │           ┌───────────────────┼───────────────────┐           │                   │                   │           ▼                   ▼                   ▼┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│  pytest/mocha   │ │ constant-time   │ │   cryptofuzz    ││ (test framework)│ │   testing       │ │   (fuzzing)     │└────────┬────────┘ └────────┬────────┘ └────────┬────────┘         │                   │                   │         └───────────────────┼───────────────────┘                             │                             ▼              ┌──────────────────────────┐              │   Technique Skills       │              │ coverage, harness, PBT   │              └──────────────────────────┘
```
```
┌─────────────────────┐                    │    wycheproof       │                    │   (this skill)      │                    └──────────┬──────────┘                               │           ┌───────────────────┼───────────────────┐           │                   │                   │           ▼                   ▼                   ▼┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│  pytest/mocha   │ │ constant-time   │ │   cryptofuzz    ││ (test framework)│ │   testing       │ │   (fuzzing)     │└────────┬────────┘ └────────┬────────┘ └────────┬────────┘         │                   │                   │         └───────────────────┼───────────────────┘                             │                             ▼              ┌──────────────────────────┐              │   Technique Skills       │              │ coverage, harness, PBT   │              └──────────────────────────┘
```
```
testvectors/
```
```
testvectors_v1/
```
```
schemas/
```
```
doc/
```
Integrating the Wycheproof Agent Skill transforms your coding assistant into a vigilant guardian for cryptographic integrity. This skill empowers AI to leverage Google's renowned Wycheproof project, a vast repository of test vectors designed to rigorously validate crypto implementations. It's an indispensable tool for developers keen on fortifying their applications against common pitfalls and sophisticated attacks. By guiding your AI to employ these comprehensive tests, you can proactively identify subtle bugs, expose vulnerabilities, and ensure that your secure protocols stand up to scrutiny, ultimately building more robust and trustworthy systems. It's about proactive security through intelligent testing.

# When to Use This Skill
- •Validating a new cryptographic library integration in an application to ensure it meets security standards.
- •Auditing existing codebase for known cryptographic weaknesses by applying Wycheproof test patterns.
- •Generating targeted test cases for specific crypto algorithms (e.g., ECDHC, SHA1withDSA) to confirm correct implementation.
- •Analyzing Wycheproof test failures to understand best practices and common pitfalls in cryptographic design.

# Pro Tips
- 💡Combine with static analysis tools: Use Wycheproof results to focus your static analysis efforts on potentially vulnerable crypto implementations, creating a multi-layered security approach.
- 💡Iterate on failed tests: When a Wycheproof test fails, leverage the skill to suggest specific code adjustments, library updates, or configuration changes to rectify the issue effectively.
- 💡Automate regression testing: Integrate Wycheproof-based checks into your CI/CD pipeline to prevent regressions in cryptographic correctness and maintain ongoing security compliance.

