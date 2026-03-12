# sharp-edges
Source: https://antigravity.codes/agent-skills/security/sharp-edges

## AI Worker Instructions
When the user requests functionality related to sharp-edges, follow these guidelines and utilize this context.

## Scraped Content

# sharp-edges
```
"alg": "none"
```
```
algorithm
```
```
mode
```
```
cipher
```
```
hash_type
```
```
// DANGEROUS: allows crc32, md5, sha1password_hash($password, PASSWORD_DEFAULT); // Good - no choicehash($algorithm, $password); // BAD: accepts "crc32"
```
```
// DANGEROUS: allows crc32, md5, sha1password_hash($password, PASSWORD_DEFAULT); // Good - no choicehash($algorithm, $password); // BAD: accepts "crc32"
```
```
# What happens when lifetime=0?def verify_otp(code, lifetime=300):  # 300 seconds default    if lifetime == 0:        return True  # OOPS: 0 means "accept all"?        # Or does it mean "expired immediately"?
```
```
# What happens when lifetime=0?def verify_otp(code, lifetime=300):  # 300 seconds default    if lifetime == 0:        return True  # OOPS: 0 means "accept all"?        # Or does it mean "expired immediately"?
```
```
timeout=0
```
```
max_attempts=0
```
```
key=""
```
```
// Libsodium (primitives): bytes are bytessodium_crypto_box($message, $nonce, $keypair);// Easy to: swap nonce/keypair, reuse nonces, use wrong key type// Halite (semantic): types enforce correct usageCrypto::seal($message, new EncryptionPublicKey($key));// Wrong key type = type error, not silent failure
```
```
// Libsodium (primitives): bytes are bytessodium_crypto_box($message, $nonce, $keypair);// Easy to: swap nonce/keypair, reuse nonces, use wrong key type// Halite (semantic): types enforce correct usageCrypto::seal($message, new EncryptionPublicKey($key));// Wrong key type = type error, not silent failure
```
```
bytes
```
```
string
```
```
[]byte
```
```
// Timing-safe comparison looks identical to unsafeif hmac == expected { }           // BAD: timing attackif hmac.Equal(mac, expected) { }  // Good: constant-time// Same types, different security properties
```
```
// Timing-safe comparison looks identical to unsafeif hmac == expected { }           // BAD: timing attackif hmac.Equal(mac, expected) { }  // Good: constant-time// Same types, different security properties
```
```
# One typo = disasterverify_ssl: fasle  # Typo silently accepted as truthy?# Magic valuessession_timeout: -1  # Does this mean "never expire"?# Dangerous combinations accepted silentlyauth_required: truebypass_auth_for_health_checks: truehealth_check_path: "/"  # Oops
```
```
# One typo = disasterverify_ssl: fasle  # Typo silently accepted as truthy?# Magic valuessession_timeout: -1  # Does this mean "never expire"?# Dangerous combinations accepted silentlyauth_required: truebypass_auth_for_health_checks: truehealth_check_path: "/"  # Oops
```
```
// Sensible default doesn't protect against bad callerspublic function __construct(    public string $hashAlgo = 'sha256',  // Good default...    public int $otpLifetime = 120,       // ...but accepts md5, 0, etc.) {}
```
```
// Sensible default doesn't protect against bad callerspublic function __construct(    public string $hashAlgo = 'sha256',  // Good default...    public int $otpLifetime = 120,       // ...but accepts md5, 0, etc.) {}
```
```
# Silent bypassdef verify_signature(sig, data, key):    if not key:        return True  # No key = skip verification?!# Return value ignoredsignature.verify(data, sig)  # Throws on failurecrypto.verify(data, sig)     # Returns False on failure# Developer forgets to check return value
```
```
# Silent bypassdef verify_signature(sig, data, key):    if not key:        return True  # No key = skip verification?!# Return value ignoredsignature.verify(data, sig)  # Throws on failurecrypto.verify(data, sig)     # Returns False on failure# Developer forgets to check return value
```
```
permissions = "read,write"permissions += ",admin"  # Too easy to escalate# vs. type-safepermissions = {Permission.READ, Permission.WRITE}permissions.add(Permission.ADMIN)  # At least it's explicit
```
```
permissions = "read,write"permissions += ",admin"  # Too easy to escalate# vs. type-safepermissions = {Permission.READ, Permission.WRITE}permissions.add(Permission.ADMIN)  # At least it's explicit
```
```
0
```
```
""
```
```
null
```
```
[]
```
```
-1
```
```
verify: false
```
The 'Sharp Edges' Agent Skill is engineered to help developers and security architects build systems that are inherently secure, right from the design phase. Instead of patching vulnerabilities post-deployment, this skill proactively identifies 'footgun' designs—interfaces or configurations that are easy to misuse, leading to security flaws. It champions the 'pit of success' principle, guiding you to create APIs and systems where the path of least resistance is also the most secure. This ensures that even under pressure, developers are steered towards robust, secure implementations without needing deep security expertise for every decision.

# When to Use This Skill
- •Designing new API endpoints or SDKs to ensure they are misuse-resistant and follow secure-by-default principles.
- •Auditing existing configuration files or schemas for dangerous default settings, complex security parameters, or potential 'footguns'.
- •Evaluating the ergonomics and security posture of cryptographic library usage within an application.
- •Reviewing authentication and authorization mechanisms to prevent common security mistakes and ensure robust access control.

# Pro Tips
- 💡Apply this skill early in the design phase, before significant code is written, to catch fundamental architectural security flaws and save refactoring effort.
- 💡When prompted, ask the AI to suggest alternative, more misuse-resistant API designs or configuration options for identified 'sharp edges'.
- 💡Combine with general code review skills to ensure both design and implementation adhere to secure principles and best practices.

