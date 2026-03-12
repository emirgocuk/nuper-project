# memory-forensics
Source: https://antigravity.codes/agent-skills/security/memory-forensics

## AI Worker Instructions
When the user requests functionality related to memory-forensics, follow these guidelines and utilize this context.

## Scraped Content

# memory-forensics
```
# WinPmem (Recommended)winpmem_mini_x64.exe memory.raw# DumpItDumpIt.exe# Belkasoft RAM Capturer# GUI-based, outputs raw format# Magnet RAM Capture# GUI-based, outputs raw format
```
```
# WinPmem (Recommended)winpmem_mini_x64.exe memory.raw# DumpItDumpIt.exe# Belkasoft RAM Capturer# GUI-based, outputs raw format# Magnet RAM Capture# GUI-based, outputs raw format
```
```
# LiME (Linux Memory Extractor)sudo insmod lime.ko "path=/tmp/memory.lime format=lime"# /dev/mem (limited, requires permissions)sudo dd if=/dev/mem of=memory.raw bs=1M# /proc/kcore (ELF format)sudo cp /proc/kcore memory.elf
```
```
# LiME (Linux Memory Extractor)sudo insmod lime.ko "path=/tmp/memory.lime format=lime"# /dev/mem (limited, requires permissions)sudo dd if=/dev/mem of=memory.raw bs=1M# /proc/kcore (ELF format)sudo cp /proc/kcore memory.elf
```
```
# osxpmemsudo ./osxpmem -o memory.raw# MacQuisition (commercial)
```
```
# osxpmemsudo ./osxpmem -o memory.raw# MacQuisition (commercial)
```
```
# VMware: .vmem file is raw memorycp vm.vmem memory.raw# VirtualBox: Use debug consolevboxmanage debugvm "VMName" dumpvmcore --filename memory.elf# QEMUvirsh dump <domain> memory.raw --memory-only# Hyper-V# Checkpoint contains memory state
```
```
# VMware: .vmem file is raw memorycp vm.vmem memory.raw# VirtualBox: Use debug consolevboxmanage debugvm "VMName" dumpvmcore --filename memory.elf# QEMUvirsh dump <domain> memory.raw --memory-only# Hyper-V# Checkpoint contains memory state
```
```
# Install Volatility 3pip install volatility3# Install symbol tables (Windows)# Download from https://downloads.volatilityfoundation.org/volatility3/symbols/# Basic usagevol -f memory.raw <plugin># With symbol pathvol -f memory.raw -s /path/to/symbols windows.pslist
```
```
# Install Volatility 3pip install volatility3# Install symbol tables (Windows)# Download from https://downloads.volatilityfoundation.org/volatility3/symbols/# Basic usagevol -f memory.raw <plugin># With symbol pathvol -f memory.raw -s /path/to/symbols windows.pslist
```
```
# List processesvol -f memory.raw windows.pslist# Process tree (parent-child relationships)vol -f memory.raw windows.pstree# Hidden process detectionvol -f memory.raw windows.psscan# Process memory dumpsvol -f memory.raw windows.memmap --pid <PID> --dump# Process environment variablesvol -f memory.raw windows.envars --pid <PID># Command line argumentsvol -f memory.raw windows.cmdline
```
```
# List processesvol -f memory.raw windows.pslist# Process tree (parent-child relationships)vol -f memory.raw windows.pstree# Hidden process detectionvol -f memory.raw windows.psscan# Process memory dumpsvol -f memory.raw windows.memmap --pid <PID> --dump# Process environment variablesvol -f memory.raw windows.envars --pid <PID># Command line argumentsvol -f memory.raw windows.cmdline
```
```
# Network connectionsvol -f memory.raw windows.netscan# Network connection statevol -f memory.raw windows.netstat
```
```
# Network connectionsvol -f memory.raw windows.netscan# Network connection statevol -f memory.raw windows.netstat
```
```
# Loaded DLLs per processvol -f memory.raw windows.dlllist --pid <PID># Find hidden/injected DLLsvol -f memory.raw windows.ldrmodules# Kernel modulesvol -f memory.raw windows.modules# Module dumpsvol -f memory.raw windows.moddump --pid <PID>
```
```
# Loaded DLLs per processvol -f memory.raw windows.dlllist --pid <PID># Find hidden/injected DLLsvol -f memory.raw windows.ldrmodules# Kernel modulesvol -f memory.raw windows.modules# Module dumpsvol -f memory.raw windows.moddump --pid <PID>
```
```
# Detect code injectionvol -f memory.raw windows.malfind# VAD (Virtual Address Descriptor) analysisvol -f memory.raw windows.vadinfo --pid <PID># Dump suspicious memory regionsvol -f memory.raw windows.vadyarascan --yara-rules rules.yar
```
```
# Detect code injectionvol -f memory.raw windows.malfind# VAD (Virtual Address Descriptor) analysisvol -f memory.raw windows.vadinfo --pid <PID># Dump suspicious memory regionsvol -f memory.raw windows.vadyarascan --yara-rules rules.yar
```
```
# List registry hivesvol -f memory.raw windows.registry.hivelist# Print registry keyvol -f memory.raw windows.registry.printkey --key "Software\Microsoft\Windows\CurrentVersion\Run"# Dump registry hivevol -f memory.raw windows.registry.hivescan --dump
```
```
# List registry hivesvol -f memory.raw windows.registry.hivelist# Print registry keyvol -f memory.raw windows.registry.printkey --key "Software\Microsoft\Windows\CurrentVersion\Run"# Dump registry hivevol -f memory.raw windows.registry.hivescan --dump
```
```
# Scan for file objectsvol -f memory.raw windows.filescan# Dump files from memoryvol -f memory.raw windows.dumpfiles --pid <PID># MFT analysisvol -f memory.raw windows.mftscan
```
```
# Scan for file objectsvol -f memory.raw windows.filescan# Dump files from memoryvol -f memory.raw windows.dumpfiles --pid <PID># MFT analysisvol -f memory.raw windows.mftscan
```
```
# Process listingvol -f memory.raw linux.pslist# Process treevol -f memory.raw linux.pstree# Bash historyvol -f memory.raw linux.bash# Network connectionsvol -f memory.raw linux.sockstat# Loaded kernel modulesvol -f memory.raw linux.lsmod# Mount pointsvol -f memory.raw linux.mount# Environment variablesvol -f memory.raw linux.envars
```
```
# Process listingvol -f memory.raw linux.pslist# Process treevol -f memory.raw linux.pstree# Bash historyvol -f memory.raw linux.bash# Network connectionsvol -f memory.raw linux.sockstat# Loaded kernel modulesvol -f memory.raw linux.lsmod# Mount pointsvol -f memory.raw linux.mount# Environment variablesvol -f memory.raw linux.envars
```
```
# Process listingvol -f memory.raw mac.pslist# Process treevol -f memory.raw mac.pstree# Network connectionsvol -f memory.raw mac.netstat# Kernel extensionsvol -f memory.raw mac.lsmod
```
```
# Process listingvol -f memory.raw mac.pslist# Process treevol -f memory.raw mac.pstree# Network connectionsvol -f memory.raw mac.netstat# Kernel extensionsvol -f memory.raw mac.lsmod
```
```
# 1. Initial process surveyvol -f memory.raw windows.pstree > processes.txtvol -f memory.raw windows.pslist > pslist.txt# 2. Network connectionsvol -f memory.raw windows.netscan > network.txt# 3. Detect injectionvol -f memory.raw windows.malfind > malfind.txt# 4. Analyze suspicious processesvol -f memory.raw windows.dlllist --pid <PID>vol -f memory.raw windows.handles --pid <PID># 5. Dump suspicious executablesvol -f memory.raw windows.pslist --pid <PID> --dump# 6. Extract strings from dumpsstrings -a pid.<PID>.exe > strings.txt# 7. YARA scanningvol -f memory.raw windows.yarascan --yara-rules malware.yar
```
```
# 1. Initial process surveyvol -f memory.raw windows.pstree > processes.txtvol -f memory.raw windows.pslist > pslist.txt# 2. Network connectionsvol -f memory.raw windows.netscan > network.txt# 3. Detect injectionvol -f memory.raw windows.malfind > malfind.txt# 4. Analyze suspicious processesvol -f memory.raw windows.dlllist --pid <PID>vol -f memory.raw windows.handles --pid <PID># 5. Dump suspicious executablesvol -f memory.raw windows.pslist --pid <PID> --dump# 6. Extract strings from dumpsstrings -a pid.<PID>.exe > strings.txt# 7. YARA scanningvol -f memory.raw windows.yarascan --yara-rules malware.yar
```
```
# 1. Timeline of eventsvol -f memory.raw windows.timeliner > timeline.csv# 2. User activityvol -f memory.raw windows.cmdlinevol -f memory.raw windows.consoles# 3. Persistence mechanismsvol -f memory.raw windows.registry.printkey \    --key "Software\Microsoft\Windows\CurrentVersion\Run"# 4. Servicesvol -f memory.raw windows.svcscan# 5. Scheduled tasksvol -f memory.raw windows.scheduled_tasks# 6. Recent filesvol -f memory.raw windows.filescan | grep -i "recent"
```
```
# 1. Timeline of eventsvol -f memory.raw windows.timeliner > timeline.csv# 2. User activityvol -f memory.raw windows.cmdlinevol -f memory.raw windows.consoles# 3. Persistence mechanismsvol -f memory.raw windows.registry.printkey \    --key "Software\Microsoft\Windows\CurrentVersion\Run"# 4. Servicesvol -f memory.raw windows.svcscan# 5. Scheduled tasksvol -f memory.raw windows.scheduled_tasks# 6. Recent filesvol -f memory.raw windows.filescan | grep -i "recent"
```
```
// EPROCESS (Executive Process)typedef struct _EPROCESS {    KPROCESS Pcb;                    // Kernel process block    EX_PUSH_LOCK ProcessLock;    LARGE_INTEGER CreateTime;    LARGE_INTEGER ExitTime;    // ...    LIST_ENTRY ActiveProcessLinks;   // Doubly-linked list    ULONG_PTR UniqueProcessId;       // PID    // ...    PEB* Peb;                        // Process Environment Block    // ...} EPROCESS;// PEB (Process Environment Block)typedef struct _PEB {    BOOLEAN InheritedAddressSpace;    BOOLEAN ReadImageFileExecOptions;    BOOLEAN BeingDebugged;           // Anti-debug check    // ...    PVOID ImageBaseAddress;          // Base address of executable    PPEB_LDR_DATA Ldr;              // Loader data (DLL list)    PRTL_USER_PROCESS_PARAMETERS ProcessParameters;    // ...} PEB;
```
```
// EPROCESS (Executive Process)typedef struct _EPROCESS {    KPROCESS Pcb;                    // Kernel process block    EX_PUSH_LOCK ProcessLock;    LARGE_INTEGER CreateTime;    LARGE_INTEGER ExitTime;    // ...    LIST_ENTRY ActiveProcessLinks;   // Doubly-linked list    ULONG_PTR UniqueProcessId;       // PID    // ...    PEB* Peb;                        // Process Environment Block    // ...} EPROCESS;// PEB (Process Environment Block)typedef struct _PEB {    BOOLEAN InheritedAddressSpace;    BOOLEAN ReadImageFileExecOptions;    BOOLEAN BeingDebugged;           // Anti-debug check    // ...    PVOID ImageBaseAddress;          // Base address of executable    PPEB_LDR_DATA Ldr;              // Loader data (DLL list)    PRTL_USER_PROCESS_PARAMETERS ProcessParameters;    // ...} PEB;
```
```
typedef struct _MMVAD {    MMVAD_SHORT Core;    union {        ULONG LongFlags;        MMVAD_FLAGS VadFlags;    } u;    // ...    PVOID FirstPrototypePte;    PVOID LastContiguousPte;    // ...    PFILE_OBJECT FileObject;} MMVAD;// Memory protection flags#define PAGE_EXECUTE           0x10#define PAGE_EXECUTE_READ      0x20#define PAGE_EXECUTE_READWRITE 0x40#define PAGE_EXECUTE_WRITECOPY 0x80
```
```
typedef struct _MMVAD {    MMVAD_SHORT Core;    union {        ULONG LongFlags;        MMVAD_FLAGS VadFlags;    } u;    // ...    PVOID FirstPrototypePte;    PVOID LastContiguousPte;    // ...    PFILE_OBJECT FileObject;} MMVAD;// Memory protection flags#define PAGE_EXECUTE           0x10#define PAGE_EXECUTE_READ      0x20#define PAGE_EXECUTE_READWRITE 0x40#define PAGE_EXECUTE_WRITECOPY 0x80
```
```
# Malfind indicators# - PAGE_EXECUTE_READWRITE protection (suspicious)# - MZ header in non-image VAD region# - Shellcode patterns at allocation start# Common injection techniques# 1. Classic DLL Injection#    - VirtualAllocEx + WriteProcessMemory + CreateRemoteThread# 2. Process Hollowing#    - CreateProcess (SUSPENDED) + NtUnmapViewOfSection + WriteProcessMemory# 3. APC Injection#    - QueueUserAPC targeting alertable threads# 4. Thread Execution Hijacking#    - SuspendThread + SetThreadContext + ResumeThread
```
```
# Malfind indicators# - PAGE_EXECUTE_READWRITE protection (suspicious)# - MZ header in non-image VAD region# - Shellcode patterns at allocation start# Common injection techniques# 1. Classic DLL Injection#    - VirtualAllocEx + WriteProcessMemory + CreateRemoteThread# 2. Process Hollowing#    - CreateProcess (SUSPENDED) + NtUnmapViewOfSection + WriteProcessMemory# 3. APC Injection#    - QueueUserAPC targeting alertable threads# 4. Thread Execution Hijacking#    - SuspendThread + SetThreadContext + ResumeThread
```
```
# Compare process listsvol -f memory.raw windows.pslist > pslist.txtvol -f memory.raw windows.psscan > psscan.txtdiff pslist.txt psscan.txt  # Hidden processes# Check for DKOM (Direct Kernel Object Manipulation)vol -f memory.raw windows.callbacks# Detect hooked functionsvol -f memory.raw windows.ssdt  # System Service Descriptor Table# Driver analysisvol -f memory.raw windows.driverscanvol -f memory.raw windows.driverirp
```
```
# Compare process listsvol -f memory.raw windows.pslist > pslist.txtvol -f memory.raw windows.psscan > psscan.txtdiff pslist.txt psscan.txt  # Hidden processes# Check for DKOM (Direct Kernel Object Manipulation)vol -f memory.raw windows.callbacks# Detect hooked functionsvol -f memory.raw windows.ssdt  # System Service Descriptor Table# Driver analysisvol -f memory.raw windows.driverscanvol -f memory.raw windows.driverirp
```
```
# Dump hashes (requires hivelist first)vol -f memory.raw windows.hashdump# LSA secretsvol -f memory.raw windows.lsadump# Cached domain credentialsvol -f memory.raw windows.cachedump# Mimikatz-style extraction# Requires specific plugins/tools
```
```
# Dump hashes (requires hivelist first)vol -f memory.raw windows.hashdump# LSA secretsvol -f memory.raw windows.lsadump# Cached domain credentialsvol -f memory.raw windows.cachedump# Mimikatz-style extraction# Requires specific plugins/tools
```
```
rule Suspicious_Injection{    meta:        description = "Detects common injection shellcode"    strings:        // Common shellcode patterns        $mz = { 4D 5A }        $shellcode1 = { 55 8B EC 83 EC }  // Function prologue        $api_hash = { 68 ?? ?? ?? ?? 68 ?? ?? ?? ?? E8 }  // Push hash, call    condition:        $mz at 0 or any of ($shellcode*)}rule Cobalt_Strike_Beacon{    meta:        description = "Detects Cobalt Strike beacon in memory"    strings:        $config = { 00 01 00 01 00 02 }        $sleep = "sleeptime"        $beacon = "%s (admin)" wide    condition:        2 of them}
```
```
rule Suspicious_Injection{    meta:        description = "Detects common injection shellcode"    strings:        // Common shellcode patterns        $mz = { 4D 5A }        $shellcode1 = { 55 8B EC 83 EC }  // Function prologue        $api_hash = { 68 ?? ?? ?? ?? 68 ?? ?? ?? ?? E8 }  // Push hash, call    condition:        $mz at 0 or any of ($shellcode*)}rule Cobalt_Strike_Beacon{    meta:        description = "Detects Cobalt Strike beacon in memory"    strings:        $config = { 00 01 00 01 00 02 }        $sleep = "sleeptime"        $beacon = "%s (admin)" wide    condition:        2 of them}
```
```
# Scan all process memoryvol -f memory.raw windows.yarascan --yara-rules rules.yar# Scan specific processvol -f memory.raw windows.yarascan --yara-rules rules.yar --pid 1234# Scan kernel memoryvol -f memory.raw windows.yarascan --yara-rules rules.yar --kernel
```
```
# Scan all process memoryvol -f memory.raw windows.yarascan --yara-rules rules.yar# Scan specific processvol -f memory.raw windows.yarascan --yara-rules rules.yar --pid 1234# Scan kernel memoryvol -f memory.raw windows.yarascan --yara-rules rules.yar --kernel
```
```
# Basic string extractionstrings -a memory.raw > all_strings.txt# Unicode stringsstrings -el memory.raw >> all_strings.txt# Targeted extraction from process dumpvol -f memory.raw windows.memmap --pid 1234 --dumpstrings -a pid.1234.dmp > process_strings.txt# Pattern matchinggrep -E "(https?://|[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})" all_strings.txt
```
```
# Basic string extractionstrings -a memory.raw > all_strings.txt# Unicode stringsstrings -el memory.raw >> all_strings.txt# Targeted extraction from process dumpvol -f memory.raw windows.memmap --pid 1234 --dumpstrings -a pid.1234.dmp > process_strings.txt# Pattern matchinggrep -E "(https?://|[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})" all_strings.txt
```
```
# FLOSS extracts obfuscated stringsfloss malware.exe > floss_output.txt# From memory dumpfloss pid.1234.dmp
```
```
# FLOSS extracts obfuscated stringsfloss malware.exe > floss_output.txt# From memory dumpfloss pid.1234.dmp
```
Unlock the power of deep system analysis with the Memory Forensics agent skill. This capability equips your AI coding assistant to navigate the intricate landscape of system memory, crucial for uncovering hidden threats and understanding system states post-incident. By providing the tools and methodologies for memory acquisition and artifact extraction, this skill transforms your AI into an invaluable partner for cybersecurity investigations, enabling a meticulous examination of runtime data without altering the live system. It’s essential for modern threat hunting and digital investigations, ensuring no critical detail is overlooked.

# When to Use This Skill
- •Investigating a suspected malware infection by analyzing a RAM dump for malicious processes and injected code.
- •Performing post-mortem analysis of a crashed system to determine the root cause, identifying active processes and network connections at the time of the incident.
- •Extracting sensitive data, credentials, or encryption keys from memory images during a forensic investigation.
- •Analyzing live system memory snapshots to detect rootkits or stealthy persistent threats not visible through traditional file system scans.

# Pro Tips
- 💡Always ensure you have proper legal authorization and adhere to chain of custody protocols when acquiring memory dumps in real-world investigations.
- 💡Combine memory forensics with disk forensics to build a comprehensive timeline of events and correlate in-memory artifacts with on-disk persistence mechanisms.
- 💡Leverage Volatility's extensive plugin ecosystem; for specific tasks, research and use specialized plugins to enhance artifact extraction and analysis capabilities.

