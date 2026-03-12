# anti-reversing-techniques
Source: https://antigravity.codes/agent-skills/security/anti-reversing-techniques

## AI Worker Instructions
When the user requests functionality related to anti-reversing-techniques, follow these guidelines and utilize this context.

## Scraped Content

# anti-reversing-techniques
```
// IsDebuggerPresentif (IsDebuggerPresent()) {    exit(1);}// CheckRemoteDebuggerPresentBOOL debugged = FALSE;CheckRemoteDebuggerPresent(GetCurrentProcess(), &debugged);if (debugged) exit(1);// NtQueryInformationProcesstypedef NTSTATUS (NTAPI *pNtQueryInformationProcess)(    HANDLE, PROCESSINFOCLASS, PVOID, ULONG, PULONG);DWORD debugPort = 0;NtQueryInformationProcess(    GetCurrentProcess(),    ProcessDebugPort,        // 7    &debugPort,    sizeof(debugPort),    NULL);if (debugPort != 0) exit(1);// Debug flagsDWORD debugFlags = 0;NtQueryInformationProcess(    GetCurrentProcess(),    ProcessDebugFlags,       // 0x1F    &debugFlags,    sizeof(debugFlags),    NULL);if (debugFlags == 0) exit(1);  // 0 means being debugged
```
```
// IsDebuggerPresentif (IsDebuggerPresent()) {    exit(1);}// CheckRemoteDebuggerPresentBOOL debugged = FALSE;CheckRemoteDebuggerPresent(GetCurrentProcess(), &debugged);if (debugged) exit(1);// NtQueryInformationProcesstypedef NTSTATUS (NTAPI *pNtQueryInformationProcess)(    HANDLE, PROCESSINFOCLASS, PVOID, ULONG, PULONG);DWORD debugPort = 0;NtQueryInformationProcess(    GetCurrentProcess(),    ProcessDebugPort,        // 7    &debugPort,    sizeof(debugPort),    NULL);if (debugPort != 0) exit(1);// Debug flagsDWORD debugFlags = 0;NtQueryInformationProcess(    GetCurrentProcess(),    ProcessDebugFlags,       // 0x1F    &debugFlags,    sizeof(debugFlags),    NULL);if (debugFlags == 0) exit(1);  // 0 means being debugged
```
```
# x64dbg: ScyllaHide plugin# Patches common anti-debug checks# Manual patching in debugger:# - Set IsDebuggerPresent return to 0# - Patch PEB.BeingDebugged to 0# - Hook NtQueryInformationProcess# IDAPython: Patch checksida_bytes.patch_byte(check_addr, 0x90)  # NOP
```
```
# x64dbg: ScyllaHide plugin# Patches common anti-debug checks# Manual patching in debugger:# - Set IsDebuggerPresent return to 0# - Patch PEB.BeingDebugged to 0# - Hook NtQueryInformationProcess# IDAPython: Patch checksida_bytes.patch_byte(check_addr, 0x90)  # NOP
```
```
// Direct PEB access#ifdef _WIN64    PPEB peb = (PPEB)__readgsqword(0x60);#else    PPEB peb = (PPEB)__readfsdword(0x30);#endif// BeingDebugged flagif (peb->BeingDebugged) exit(1);// NtGlobalFlag// Debugged: 0x70 (FLG_HEAP_ENABLE_TAIL_CHECK |//                 FLG_HEAP_ENABLE_FREE_CHECK |//                 FLG_HEAP_VALIDATE_PARAMETERS)if (peb->NtGlobalFlag & 0x70) exit(1);// Heap flagsPDWORD heapFlags = (PDWORD)((PBYTE)peb->ProcessHeap + 0x70);if (*heapFlags & 0x50000062) exit(1);
```
```
// Direct PEB access#ifdef _WIN64    PPEB peb = (PPEB)__readgsqword(0x60);#else    PPEB peb = (PPEB)__readfsdword(0x30);#endif// BeingDebugged flagif (peb->BeingDebugged) exit(1);// NtGlobalFlag// Debugged: 0x70 (FLG_HEAP_ENABLE_TAIL_CHECK |//                 FLG_HEAP_ENABLE_FREE_CHECK |//                 FLG_HEAP_VALIDATE_PARAMETERS)if (peb->NtGlobalFlag & 0x70) exit(1);// Heap flagsPDWORD heapFlags = (PDWORD)((PBYTE)peb->ProcessHeap + 0x70);if (*heapFlags & 0x50000062) exit(1);
```
```
; In debugger, modify PEB directly; x64dbg: dump at gs:[60] (x64) or fs:[30] (x86); Set BeingDebugged (offset 2) to 0; Clear NtGlobalFlag (offset 0xBC for x64)
```
```
; In debugger, modify PEB directly; x64dbg: dump at gs:[60] (x64) or fs:[30] (x86); Set BeingDebugged (offset 2) to 0; Clear NtGlobalFlag (offset 0xBC for x64)
```
```
// RDTSC timinguint64_t start = __rdtsc();// ... some code ...uint64_t end = __rdtsc();if ((end - start) > THRESHOLD) exit(1);// QueryPerformanceCounterLARGE_INTEGER start, end, freq;QueryPerformanceFrequency(&freq);QueryPerformanceCounter(&start);// ... code ...QueryPerformanceCounter(&end);double elapsed = (double)(end.QuadPart - start.QuadPart) / freq.QuadPart;if (elapsed > 0.1) exit(1);  // Too slow = debugger// GetTickCountDWORD start = GetTickCount();// ... code ...if (GetTickCount() - start > 1000) exit(1);
```
```
// RDTSC timinguint64_t start = __rdtsc();// ... some code ...uint64_t end = __rdtsc();if ((end - start) > THRESHOLD) exit(1);// QueryPerformanceCounterLARGE_INTEGER start, end, freq;QueryPerformanceFrequency(&freq);QueryPerformanceCounter(&start);// ... code ...QueryPerformanceCounter(&end);double elapsed = (double)(end.QuadPart - start.QuadPart) / freq.QuadPart;if (elapsed > 0.1) exit(1);  // Too slow = debugger// GetTickCountDWORD start = GetTickCount();// ... code ...if (GetTickCount() - start > 1000) exit(1);
```
```
- Use hardware breakpoints instead of software- Patch timing checks- Use VM with controlled time- Hook timing APIs to return consistent values
```
```
- Use hardware breakpoints instead of software- Patch timing checks- Use VM with controlled time- Hook timing APIs to return consistent values
```
```
// SEH-based detection__try {    __asm { int 3 }  // Software breakpoint}__except(EXCEPTION_EXECUTE_HANDLER) {    // Normal execution: exception caught    return;}// Debugger ate the exceptionexit(1);// VEH-based detectionLONG CALLBACK VectoredHandler(PEXCEPTION_POINTERS ep) {    if (ep->ExceptionRecord->ExceptionCode == EXCEPTION_BREAKPOINT) {        ep->ContextRecord->Rip++;  // Skip INT3        return EXCEPTION_CONTINUE_EXECUTION;    }    return EXCEPTION_CONTINUE_SEARCH;}
```
```
// SEH-based detection__try {    __asm { int 3 }  // Software breakpoint}__except(EXCEPTION_EXECUTE_HANDLER) {    // Normal execution: exception caught    return;}// Debugger ate the exceptionexit(1);// VEH-based detectionLONG CALLBACK VectoredHandler(PEXCEPTION_POINTERS ep) {    if (ep->ExceptionRecord->ExceptionCode == EXCEPTION_BREAKPOINT) {        ep->ContextRecord->Rip++;  // Skip INT3        return EXCEPTION_CONTINUE_EXECUTION;    }    return EXCEPTION_CONTINUE_SEARCH;}
```
```
// ptrace self-traceif (ptrace(PTRACE_TRACEME, 0, NULL, NULL) == -1) {    // Already being traced    exit(1);}// /proc/self/statusFILE *f = fopen("/proc/self/status", "r");char line[256];while (fgets(line, sizeof(line), f)) {    if (strncmp(line, "TracerPid:", 10) == 0) {        int tracer_pid = atoi(line + 10);        if (tracer_pid != 0) exit(1);    }}// Parent process checkif (getppid() != 1 && strcmp(get_process_name(getppid()), "bash") != 0) {    // Unusual parent (might be debugger)}
```
```
// ptrace self-traceif (ptrace(PTRACE_TRACEME, 0, NULL, NULL) == -1) {    // Already being traced    exit(1);}// /proc/self/statusFILE *f = fopen("/proc/self/status", "r");char line[256];while (fgets(line, sizeof(line), f)) {    if (strncmp(line, "TracerPid:", 10) == 0) {        int tracer_pid = atoi(line + 10);        if (tracer_pid != 0) exit(1);    }}// Parent process checkif (getppid() != 1 && strcmp(get_process_name(getppid()), "bash") != 0) {    // Unusual parent (might be debugger)}
```
```
# LD_PRELOAD to hook ptrace# Compile: gcc -shared -fPIC -o hook.so hook.clong ptrace(int request, ...) {    return 0;  // Always succeed}# UsageLD_PRELOAD=./hook.so ./target
```
```
# LD_PRELOAD to hook ptrace# Compile: gcc -shared -fPIC -o hook.so hook.clong ptrace(int request, ...) {    return 0;  // Always succeed}# UsageLD_PRELOAD=./hook.so ./target
```
```
// CPUID-based detectionint cpuid_info[4];__cpuid(cpuid_info, 1);// Check hypervisor bit (bit 31 of ECX)if (cpuid_info[2] & (1 << 31)) {    // Running in hypervisor}// CPUID brand string__cpuid(cpuid_info, 0x40000000);char vendor[13] = {0};memcpy(vendor, &cpuid_info[1], 12);// "VMwareVMware", "Microsoft Hv", "KVMKVMKVM", "VBoxVBoxVBox"// MAC address prefix// VMware: 00:0C:29, 00:50:56// VirtualBox: 08:00:27// Hyper-V: 00:15:5D
```
```
// CPUID-based detectionint cpuid_info[4];__cpuid(cpuid_info, 1);// Check hypervisor bit (bit 31 of ECX)if (cpuid_info[2] & (1 << 31)) {    // Running in hypervisor}// CPUID brand string__cpuid(cpuid_info, 0x40000000);char vendor[13] = {0};memcpy(vendor, &cpuid_info[1], 12);// "VMwareVMware", "Microsoft Hv", "KVMKVMKVM", "VBoxVBoxVBox"// MAC address prefix// VMware: 00:0C:29, 00:50:56// VirtualBox: 08:00:27// Hyper-V: 00:15:5D
```
```
// Windows registry keys// HKLM\SOFTWARE\VMware, Inc.\VMware Tools// HKLM\SOFTWARE\Oracle\VirtualBox Guest Additions// HKLM\HARDWARE\ACPI\DSDT\VBOX__// Files// C:\Windows\System32\drivers\vmmouse.sys// C:\Windows\System32\drivers\vmhgfs.sys// C:\Windows\System32\drivers\VBoxMouse.sys// Processes// vmtoolsd.exe, vmwaretray.exe// VBoxService.exe, VBoxTray.exe
```
```
// Windows registry keys// HKLM\SOFTWARE\VMware, Inc.\VMware Tools// HKLM\SOFTWARE\Oracle\VirtualBox Guest Additions// HKLM\HARDWARE\ACPI\DSDT\VBOX__// Files// C:\Windows\System32\drivers\vmmouse.sys// C:\Windows\System32\drivers\vmhgfs.sys// C:\Windows\System32\drivers\VBoxMouse.sys// Processes// vmtoolsd.exe, vmwaretray.exe// VBoxService.exe, VBoxTray.exe
```
```
// VM exits cause timing anomaliesuint64_t start = __rdtsc();__cpuid(cpuid_info, 0);  // Causes VM exituint64_t end = __rdtsc();if ((end - start) > 500) {    // Likely in VM (CPUID takes longer)}
```
```
// VM exits cause timing anomaliesuint64_t start = __rdtsc();__cpuid(cpuid_info, 0);  // Causes VM exituint64_t end = __rdtsc();if ((end - start) > 500) {    // Likely in VM (CPUID takes longer)}
```
```
- Use bare-metal analysis environment- Harden VM (remove guest tools, change MAC)- Patch detection code- Use specialized analysis VMs (FLARE-VM)
```
```
- Use bare-metal analysis environment- Harden VM (remove guest tools, change MAC)- Patch detection code- Use specialized analysis VMs (FLARE-VM)
```
```
// Originalif (cond) {    func_a();} else {    func_b();}func_c();// Flattenedint state = 0;while (1) {    switch (state) {        case 0:            state = cond ? 1 : 2;            break;        case 1:            func_a();            state = 3;            break;        case 2:            func_b();            state = 3;            break;        case 3:            func_c();            return;    }}
```
```
// Originalif (cond) {    func_a();} else {    func_b();}func_c();// Flattenedint state = 0;while (1) {    switch (state) {        case 0:            state = cond ? 1 : 2;            break;        case 1:            func_a();            state = 3;            break;        case 2:            func_b();            state = 3;            break;        case 3:            func_c();            return;    }}
```
```
// Always true, but complex to analyzeint x = rand();if ((x * x) >= 0) {  // Always true    real_code();} else {    junk_code();  // Dead code}// Always falseif ((x * (x + 1)) % 2 == 1) {  // Product of consecutive = even    junk_code();}
```
```
// Always true, but complex to analyzeint x = rand();if ((x * x) >= 0) {  // Always true    real_code();} else {    junk_code();  // Dead code}// Always falseif ((x * (x + 1)) % 2 == 1) {  // Product of consecutive = even    junk_code();}
```
```
// XOR encryptionchar decrypt_string(char *enc, int len, char key) {    char *dec = malloc(len + 1);    for (int i = 0; i < len; i++) {        dec[i] = enc[i] ^ key;    }    dec[len] = 0;    return dec;}// Stack stringschar url[20];url[0] = 'h'; url[1] = 't'; url[2] = 't'; url[3] = 'p';url[4] = ':'; url[5] = '/'; url[6] = '/';// ...
```
```
// XOR encryptionchar decrypt_string(char *enc, int len, char key) {    char *dec = malloc(len + 1);    for (int i = 0; i < len; i++) {        dec[i] = enc[i] ^ key;    }    dec[len] = 0;    return dec;}// Stack stringschar url[20];url[0] = 'h'; url[1] = 't'; url[2] = 't'; url[3] = 'p';url[4] = ':'; url[5] = '/'; url[6] = '/';// ...
```
```
# FLOSS for automatic string deobfuscationfloss malware.exe# IDAPython string decryptiondef decrypt_xor(ea, length, key):    result = ""    for i in range(length):        byte = ida_bytes.get_byte(ea + i)        result += chr(byte ^ key)    return result
```
```
# FLOSS for automatic string deobfuscationfloss malware.exe# IDAPython string decryptiondef decrypt_xor(ea, length, key):    result = ""    for i in range(length):        byte = ida_bytes.get_byte(ea + i)        result += chr(byte ^ key)    return result
```
```
// Dynamic API resolutiontypedef HANDLE (WINAPI *pCreateFileW)(LPCWSTR, DWORD, DWORD,    LPSECURITY_ATTRIBUTES, DWORD, DWORD, HANDLE);HMODULE kernel32 = LoadLibraryA("kernel32.dll");pCreateFileW myCreateFile = (pCreateFileW)GetProcAddress(    kernel32, "CreateFileW");// API hashingDWORD hash_api(char *name) {    DWORD hash = 0;    while (*name) {        hash = ((hash >> 13) | (hash << 19)) + *name++;    }    return hash;}// Resolve by hash comparison instead of string
```
```
// Dynamic API resolutiontypedef HANDLE (WINAPI *pCreateFileW)(LPCWSTR, DWORD, DWORD,    LPSECURITY_ATTRIBUTES, DWORD, DWORD, HANDLE);HMODULE kernel32 = LoadLibraryA("kernel32.dll");pCreateFileW myCreateFile = (pCreateFileW)GetProcAddress(    kernel32, "CreateFileW");// API hashingDWORD hash_api(char *name) {    DWORD hash = 0;    while (*name) {        hash = ((hash >> 13) | (hash << 19)) + *name++;    }    return hash;}// Resolve by hash comparison instead of string
```
```
; Originalmov eax, 1; With dead codepush ebx           ; Deadmov eax, 1pop ebx            ; Deadxor ecx, ecx       ; Deadadd ecx, ecx       ; Dead
```
```
; Originalmov eax, 1; With dead codepush ebx           ; Deadmov eax, 1pop ebx            ; Deadxor ecx, ecx       ; Deadadd ecx, ecx       ; Dead
```
```
; Original: xor eax, eax (set to 0); Substitutions:sub eax, eaxmov eax, 0and eax, 0lea eax, [0]; Original: mov eax, 1; Substitutions:xor eax, eaxinc eaxpush 1pop eax
```
```
; Original: xor eax, eax (set to 0); Substitutions:sub eax, eaxmov eax, 0and eax, 0lea eax, [0]; Original: mov eax, 1; Substitutions:xor eax, eaxinc eaxpush 1pop eax
```
```
UPX          - Open source, easy to unpackThemida      - Commercial, VM-based protectionVMProtect    - Commercial, code virtualizationASPack       - Compression packerPECompact    - Compression packerEnigma       - Commercial protector
```
```
UPX          - Open source, easy to unpackThemida      - Commercial, VM-based protectionVMProtect    - Commercial, code virtualizationASPack       - Compression packerPECompact    - Compression packerEnigma       - Commercial protector
```
```
1. Identify packer (DIE, Exeinfo PE, PEiD)2. Static unpacking (if known packer):   - UPX: upx -d packed.exe   - Use existing unpackers3. Dynamic unpacking:   a. Find Original Entry Point (OEP)   b. Set breakpoint on OEP   c. Dump memory when OEP reached   d. Fix import table (Scylla, ImpREC)4. OEP finding techniques:   - Hardware breakpoint on stack (ESP trick)   - Break on common API calls (GetCommandLineA)   - Trace and look for typical entry patterns
```
```
1. Identify packer (DIE, Exeinfo PE, PEiD)2. Static unpacking (if known packer):   - UPX: upx -d packed.exe   - Use existing unpackers3. Dynamic unpacking:   a. Find Original Entry Point (OEP)   b. Set breakpoint on OEP   c. Dump memory when OEP reached   d. Fix import table (Scylla, ImpREC)4. OEP finding techniques:   - Hardware breakpoint on stack (ESP trick)   - Break on common API calls (GetCommandLineA)   - Trace and look for typical entry patterns
```
```
1. Load packed binary in x64dbg2. Note entry point (packer stub)3. Use ESP trick:   - Run to entry   - Set hardware breakpoint on [ESP]   - Run until breakpoint hits (after PUSHAD/POPAD)4. Look for JMP to OEP5. At OEP, use Scylla to:   - Dump process   - Find imports (IAT autosearch)   - Fix dump
```
```
1. Load packed binary in x64dbg2. Note entry point (packer stub)3. Use ESP trick:   - Run to entry   - Set hardware breakpoint on [ESP]   - Run until breakpoint hits (after PUSHAD/POPAD)4. Look for JMP to OEP5. At OEP, use Scylla to:   - Dump process   - Find imports (IAT autosearch)   - Fix dump
```
```
Original x86 code is converted to custom bytecodeinterpreted by embedded VM at runtime.Original:     VM Protected:mov eax, 1    push vm_contextadd eax, 2    call vm_entry              ; VM interprets bytecode              ; equivalent to original
```
```
Original x86 code is converted to custom bytecodeinterpreted by embedded VM at runtime.Original:     VM Protected:mov eax, 1    push vm_contextadd eax, 2    call vm_entry              ; VM interprets bytecode              ; equivalent to original
```
```
1. Identify VM components:   - VM entry (dispatcher)   - Handler table   - Bytecode location   - Virtual registers/stack2. Trace execution:   - Log handler calls   - Map bytecode to operations   - Understand instruction set3. Lifting/devirtualization:   - Map VM instructions back to native   - Tools: VMAttack, SATURN, NoVmp4. Symbolic execution:   - Analyze VM semantically   - angr, Triton
```
```
1. Identify VM components:   - VM entry (dispatcher)   - Handler table   - Bytecode location   - Virtual registers/stack2. Trace execution:   - Log handler calls   - Map bytecode to operations   - Understand instruction set3. Lifting/devirtualization:   - Map VM instructions back to native   - Tools: VMAttack, SATURN, NoVmp4. Symbolic execution:   - Analyze VM semantically   - angr, Triton
```
```
Anti-debug bypass:    ScyllaHide, TitanHideUnpacking:           x64dbg + Scylla, OllyDumpExDeobfuscation:       D-810, SATURN, miasmVM analysis:         VMAttack, NoVmp, manual tracingString decryption:   FLOSS, custom scriptsSymbolic execution:  angr, Triton
```
```
Anti-debug bypass:    ScyllaHide, TitanHideUnpacking:           x64dbg + Scylla, OllyDumpExDeobfuscation:       D-810, SATURN, miasmVM analysis:         VMAttack, NoVmp, manual tracingString decryption:   FLOSS, custom scriptsSymbolic execution:  angr, Triton
```
This skill empowers AI agents to dissect the complex world of software protection. Beyond basic analysis, it delves into the intricate methods developers use to safeguard their applications from unauthorized inspection or modification. By understanding these defensive layers—from anti-debugging to code obfuscation—users can conduct authorized security assessments, ethically bypass protections in controlled environments like CTFs, or thoroughly analyze malicious software. It's a critical tool for anyone performing deep-dive binary analysis, ensuring comprehensive and legitimate insights into software's inner workings.

# When to Use This Skill
- •Analyzing protected binaries for legitimate security research.
- •Bypassing anti-debugging mechanisms during authorized penetration tests.
- •Understanding and documenting software protection mechanisms in owned applications.
- •Dissecting malware samples that employ sophisticated anti-analysis techniques.

# Pro Tips
- 💡Always prioritize ethical considerations and legal compliance; unauthorized circumvention has severe consequences.
- 💡Combine this skill with dynamic analysis tools (debuggers, sandboxes) for a comprehensive understanding of protection mechanisms.
- 💡Focus on identifying the *intent* behind protection techniques to better strategize bypass methods.

