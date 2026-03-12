# binary-analysis-patterns
Source: https://antigravity.codes/agent-skills/security/binary-analysis-patterns

## AI Worker Instructions
When the user requests functionality related to binary-analysis-patterns, follow these guidelines and utilize this context.

## Scraped Content

# binary-analysis-patterns
```
; Standard prologuepush rbp           ; Save base pointermov rbp, rsp       ; Set up stack framesub rsp, 0x20      ; Allocate local variables; Leaf function (no calls); May skip frame pointer setupsub rsp, 0x18      ; Just allocate locals; Standard epiloguemov rsp, rbp       ; Restore stack pointerpop rbp            ; Restore base pointerret; Leave instruction (equivalent)leave              ; mov rsp, rbp; pop rbpret
```
```
; Standard prologuepush rbp           ; Save base pointermov rbp, rsp       ; Set up stack framesub rsp, 0x20      ; Allocate local variables; Leaf function (no calls); May skip frame pointer setupsub rsp, 0x18      ; Just allocate locals; Standard epiloguemov rsp, rbp       ; Restore stack pointerpop rbp            ; Restore base pointerret; Leave instruction (equivalent)leave              ; mov rsp, rbp; pop rbpret
```
```
; Arguments: RDI, RSI, RDX, RCX, R8, R9, then stack; Return: RAX (and RDX for 128-bit); Caller-saved: RAX, RCX, RDX, RSI, RDI, R8-R11; Callee-saved: RBX, RBP, R12-R15; Example: func(a, b, c, d, e, f, g)mov rdi, [a]       ; 1st argmov rsi, [b]       ; 2nd argmov rdx, [c]       ; 3rd argmov rcx, [d]       ; 4th argmov r8, [e]        ; 5th argmov r9, [f]        ; 6th argpush [g]           ; 7th arg on stackcall func
```
```
; Arguments: RDI, RSI, RDX, RCX, R8, R9, then stack; Return: RAX (and RDX for 128-bit); Caller-saved: RAX, RCX, RDX, RSI, RDI, R8-R11; Callee-saved: RBX, RBP, R12-R15; Example: func(a, b, c, d, e, f, g)mov rdi, [a]       ; 1st argmov rsi, [b]       ; 2nd argmov rdx, [c]       ; 3rd argmov rcx, [d]       ; 4th argmov r8, [e]        ; 5th argmov r9, [f]        ; 6th argpush [g]           ; 7th arg on stackcall func
```
```
; Arguments: RCX, RDX, R8, R9, then stack; Shadow space: 32 bytes reserved on stack; Return: RAX; Example: func(a, b, c, d, e)sub rsp, 0x28      ; Shadow space + alignmentmov rcx, [a]       ; 1st argmov rdx, [b]       ; 2nd argmov r8, [c]        ; 3rd argmov r9, [d]        ; 4th argmov [rsp+0x20], [e] ; 5th arg on stackcall funcadd rsp, 0x28
```
```
; Arguments: RCX, RDX, R8, R9, then stack; Shadow space: 32 bytes reserved on stack; Return: RAX; Example: func(a, b, c, d, e)sub rsp, 0x28      ; Shadow space + alignmentmov rcx, [a]       ; 1st argmov rdx, [b]       ; 2nd argmov r8, [c]        ; 3rd argmov r9, [d]        ; 4th argmov [rsp+0x20], [e] ; 5th arg on stackcall funcadd rsp, 0x28
```
```
; Arguments: X0-X7; Return: X0 (and X1 for 128-bit); Frame pointer: X29; Link register: X30; Function prologuestp x29, x30, [sp, #-16]!  ; Save FP and LRmov x29, sp                 ; Set frame pointer; Function epilogueldp x29, x30, [sp], #16    ; Restore FP and LRret
```
```
; Arguments: X0-X7; Return: X0 (and X1 for 128-bit); Frame pointer: X29; Link register: X30; Function prologuestp x29, x30, [sp, #-16]!  ; Save FP and LRmov x29, sp                 ; Set frame pointer; Function epilogueldp x29, x30, [sp], #16    ; Restore FP and LRret
```
```
; Arguments: R0-R3, then stack; Return: R0 (and R1 for 64-bit); Link register: LR (R14); Function prologuepush {fp, lr}add fp, sp, #4; Function epiloguepop {fp, pc}    ; Return by popping PC
```
```
; Arguments: R0-R3, then stack; Return: R0 (and R1 for 64-bit); Link register: LR (R14); Function prologuepush {fp, lr}add fp, sp, #4; Function epiloguepop {fp, pc}    ; Return by popping PC
```
```
; if (a == b)cmp eax, ebxjne skip_block; ... if body ...skip_block:; if (a < b) - signedcmp eax, ebxjge skip_block    ; Jump if greater or equal; ... if body ...skip_block:; if (a < b) - unsignedcmp eax, ebxjae skip_block    ; Jump if above or equal; ... if body ...skip_block:
```
```
; if (a == b)cmp eax, ebxjne skip_block; ... if body ...skip_block:; if (a < b) - signedcmp eax, ebxjge skip_block    ; Jump if greater or equal; ... if body ...skip_block:; if (a < b) - unsignedcmp eax, ebxjae skip_block    ; Jump if above or equal; ... if body ...skip_block:
```
```
; for (int i = 0; i < n; i++)xor ecx, ecx           ; i = 0loop_start:cmp ecx, [n]           ; i < njge loop_end; ... loop body ...inc ecx                ; i++jmp loop_startloop_end:; while (condition)jmp loop_checkloop_body:; ... body ...loop_check:cmp eax, ebxjl loop_body; do-whileloop_body:; ... body ...cmp eax, ebxjl loop_body
```
```
; for (int i = 0; i < n; i++)xor ecx, ecx           ; i = 0loop_start:cmp ecx, [n]           ; i < njge loop_end; ... loop body ...inc ecx                ; i++jmp loop_startloop_end:; while (condition)jmp loop_checkloop_body:; ... body ...loop_check:cmp eax, ebxjl loop_body; do-whileloop_body:; ... body ...cmp eax, ebxjl loop_body
```
```
; Jump table patternmov eax, [switch_var]cmp eax, max_caseja default_casejmp [jump_table + eax*8]; Sequential comparison (small switch)cmp eax, 1je case_1cmp eax, 2je case_2cmp eax, 3je case_3jmp default_case
```
```
; Jump table patternmov eax, [switch_var]cmp eax, max_caseja default_casejmp [jump_table + eax*8]; Sequential comparison (small switch)cmp eax, 1je case_1cmp eax, 2je case_2cmp eax, 3je case_3jmp default_case
```
```
; array[i] - 4-byte elementsmov eax, [rbx + rcx*4]        ; rbx=base, rcx=index; array[i] - 8-byte elementsmov rax, [rbx + rcx*8]; Multi-dimensional array[i][j]; arr[i][j] = base + (i * cols + j) * element_sizeimul eax, [cols]add eax, [j]mov edx, [rbx + rax*4]
```
```
; array[i] - 4-byte elementsmov eax, [rbx + rcx*4]        ; rbx=base, rcx=index; array[i] - 8-byte elementsmov rax, [rbx + rcx*8]; Multi-dimensional array[i][j]; arr[i][j] = base + (i * cols + j) * element_sizeimul eax, [cols]add eax, [j]mov edx, [rbx + rax*4]
```
```
struct Example {    int a;      // offset 0    char b;     // offset 4    // padding  // offset 5-7    long c;     // offset 8    short d;    // offset 16};
```
```
struct Example {    int a;      // offset 0    char b;     // offset 4    // padding  // offset 5-7    long c;     // offset 8    short d;    // offset 16};
```
```
; Accessing struct fieldsmov rdi, [struct_ptr]mov eax, [rdi]         ; s->a (offset 0)movzx eax, byte [rdi+4] ; s->b (offset 4)mov rax, [rdi+8]       ; s->c (offset 8)movzx eax, word [rdi+16] ; s->d (offset 16)
```
```
; Accessing struct fieldsmov rdi, [struct_ptr]mov eax, [rdi]         ; s->a (offset 0)movzx eax, byte [rdi+4] ; s->b (offset 4)mov rax, [rdi+8]       ; s->c (offset 8)movzx eax, word [rdi+16] ; s->d (offset 16)
```
```
; while (node != NULL)list_loop:test rdi, rdi          ; node == NULL?jz list_done; ... process node ...mov rdi, [rdi+8]       ; node = node->next (assuming next at offset 8)jmp list_looplist_done:
```
```
; while (node != NULL)list_loop:test rdi, rdi          ; node == NULL?jz list_done; ... process node ...mov rdi, [rdi+8]       ; node = node->next (assuming next at offset 8)jmp list_looplist_done:
```
```
; strlen patternxor ecx, ecxstrlen_loop:cmp byte [rdi + rcx], 0je strlen_doneinc ecxjmp strlen_loopstrlen_done:; ecx contains length; strcpy patternstrcpy_loop:mov al, [rsi]mov [rdi], altest al, aljz strcpy_doneinc rsiinc rdijmp strcpy_loopstrcpy_done:; memcpy using rep movsbmov rdi, destmov rsi, srcmov rcx, countrep movsb
```
```
; strlen patternxor ecx, ecxstrlen_loop:cmp byte [rdi + rcx], 0je strlen_doneinc ecxjmp strlen_loopstrlen_done:; ecx contains length; strcpy patternstrcpy_loop:mov al, [rsi]mov [rdi], altest al, aljz strcpy_doneinc rsiinc rdijmp strcpy_loopstrcpy_done:; memcpy using rep movsbmov rdi, destmov rsi, srcmov rcx, countrep movsb
```
```
; Multiplication by constant; x * 3lea eax, [rax + rax*2]; x * 5lea eax, [rax + rax*4]; x * 10lea eax, [rax + rax*4]  ; x * 5add eax, eax            ; * 2; Division by power of 2 (signed)mov eax, [x]cdq                     ; Sign extend to EDX:EAXand edx, 7              ; For divide by 8add eax, edx            ; Adjust for negativesar eax, 3              ; Arithmetic shift right; Modulo power of 2and eax, 7              ; x % 8
```
```
; Multiplication by constant; x * 3lea eax, [rax + rax*2]; x * 5lea eax, [rax + rax*4]; x * 10lea eax, [rax + rax*4]  ; x * 5add eax, eax            ; * 2; Division by power of 2 (signed)mov eax, [x]cdq                     ; Sign extend to EDX:EAXand edx, 7              ; For divide by 8add eax, edx            ; Adjust for negativesar eax, 3              ; Arithmetic shift right; Modulo power of 2and eax, 7              ; x % 8
```
```
; Test specific bittest eax, 0x80          ; Test bit 7jnz bit_set; Set bitor eax, 0x10            ; Set bit 4; Clear bitand eax, ~0x10          ; Clear bit 4; Toggle bitxor eax, 0x10           ; Toggle bit 4; Count leading zerosbsr eax, ecx            ; Bit scan reversexor eax, 31             ; Convert to leading zeros; Population count (popcnt)popcnt eax, ecx         ; Count set bits
```
```
; Test specific bittest eax, 0x80          ; Test bit 7jnz bit_set; Set bitor eax, 0x10            ; Set bit 4; Clear bitand eax, ~0x10          ; Clear bit 4; Toggle bitxor eax, 0x10           ; Toggle bit 4; Count leading zerosbsr eax, ecx            ; Bit scan reversexor eax, 31             ; Convert to leading zeros; Population count (popcnt)popcnt eax, ecx         ; Count set bits
```
```
; Local variable at rbp-8mov qword [rbp-8], rax  ; Store to localmov rax, [rbp-8]        ; Load from local; Stack-allocated arraylea rax, [rbp-0x40]     ; Array starts at rbp-0x40mov [rax], edx          ; array[0] = valuemov [rax+4], ecx        ; array[1] = value
```
```
; Local variable at rbp-8mov qword [rbp-8], rax  ; Store to localmov rax, [rbp-8]        ; Load from local; Stack-allocated arraylea rax, [rbp-0x40]     ; Array starts at rbp-0x40mov [rax], edx          ; array[0] = valuemov [rax+4], ecx        ; array[1] = value
```
```
; Identify parameters by register usagefunc:    ; rdi used as first param (System V)    mov [rbp-8], rdi    ; Save param to local    ; rsi used as second param    mov [rbp-16], rsi    ; Identify return by RAX at end    mov rax, [result]    ret
```
```
; Identify parameters by register usagefunc:    ; rdi used as first param (System V)    mov [rbp-8], rdi    ; Save param to local    ; rsi used as second param    mov [rbp-16], rsi    ; Identify return by RAX at end    mov rax, [result]    ret
```
```
; 1-byte operations suggest char/boolmovzx eax, byte [rdi]   ; Zero-extend bytemovsx eax, byte [rdi]   ; Sign-extend byte; 2-byte operations suggest shortmovzx eax, word [rdi]movsx eax, word [rdi]; 4-byte operations suggest int/floatmov eax, [rdi]movss xmm0, [rdi]       ; Float; 8-byte operations suggest long/double/pointermov rax, [rdi]movsd xmm0, [rdi]       ; Double
```
```
; 1-byte operations suggest char/boolmovzx eax, byte [rdi]   ; Zero-extend bytemovsx eax, byte [rdi]   ; Sign-extend byte; 2-byte operations suggest shortmovzx eax, word [rdi]movsx eax, word [rdi]; 4-byte operations suggest int/floatmov eax, [rdi]movss xmm0, [rdi]       ; Float; 8-byte operations suggest long/double/pointermov rax, [rdi]movsd xmm0, [rdi]       ; Double
```
```
// In Ghidra scripting// Fix function signatureFunction func = getFunctionAt(toAddr(0x401000));func.setReturnType(IntegerDataType.dataType, SourceType.USER_DEFINED);// Create structure typeStructureDataType struct = new StructureDataType("MyStruct", 0);struct.add(IntegerDataType.dataType, "field_a", null);struct.add(PointerDataType.dataType, "next", null);// Apply to memorycreateData(toAddr(0x601000), struct);
```
```
// In Ghidra scripting// Fix function signatureFunction func = getFunctionAt(toAddr(0x401000));func.setReturnType(IntegerDataType.dataType, SourceType.USER_DEFINED);// Create structure typeStructureDataType struct = new StructureDataType("MyStruct", 0);struct.add(IntegerDataType.dataType, "field_a", null);struct.add(PointerDataType.dataType, "next", null);// Apply to memorycreateData(toAddr(0x601000), struct);
```
```
# Find all calls to dangerous functionsfor func in currentProgram.getFunctionManager().getFunctions(True):    for ref in getReferencesTo(func.getEntryPoint()):        if func.getName() in ["strcpy", "sprintf", "gets"]:            print(f"Dangerous call at {ref.getFromAddress()}")
```
```
# Find all calls to dangerous functionsfor func in currentProgram.getFunctionManager().getFunctions(True):    for ref in getReferencesTo(func.getEntryPoint()):        if func.getName() in ["strcpy", "sprintf", "gets"]:            print(f"Dangerous call at {ref.getFromAddress()}")
```
```
import idaapiimport idautilsimport idc# Find all function callsdef find_calls(func_name):    for func_ea in idautils.Functions():        for head in idautils.Heads(func_ea, idc.find_func_end(func_ea)):            if idc.print_insn_mnem(head) == "call":                target = idc.get_operand_value(head, 0)                if idc.get_func_name(target) == func_name:                    print(f"Call to {func_name} at {hex(head)}")# Rename functions based on stringsdef auto_rename():    for s in idautils.Strings():        for xref in idautils.XrefsTo(s.ea):            func = idaapi.get_func(xref.frm)            if func and "sub_" in idc.get_func_name(func.start_ea):                # Use string as hint for naming                pass
```
```
import idaapiimport idautilsimport idc# Find all function callsdef find_calls(func_name):    for func_ea in idautils.Functions():        for head in idautils.Heads(func_ea, idc.find_func_end(func_ea)):            if idc.print_insn_mnem(head) == "call":                target = idc.get_operand_value(head, 0)                if idc.get_func_name(target) == func_name:                    print(f"Call to {func_name} at {hex(head)}")# Rename functions based on stringsdef auto_rename():    for s in idautils.Strings():        for xref in idautils.XrefsTo(s.ea):            func = idaapi.get_func(xref.frm)            if func and "sub_" in idc.get_func_name(func.start_ea):                # Use string as hint for naming                pass
```
```
jmp
```
```
call
```
```
ret
```
Dive deep into the intricate world of compiled software with the Binary Analysis Patterns Agent Skill. This comprehensive guide equips you with the foundational knowledge and advanced techniques required to decipher executable binaries. From understanding assembly language fundamentals like function prologues and calling conventions to advanced concepts such as control flow analysis and code pattern recognition, this skill is indispensable for anyone performing reverse engineering, security research, or simply seeking a deeper understanding of how software operates at the machine code level. Enhance your ability to inspect, comprehend, and troubleshoot low-level code effectively.

# When to Use This Skill
- •Reverse engineering proprietary software or unknown binaries to understand their functionality.
- •Performing security audits and vulnerability research on compiled applications.
- •Debugging complex issues in low-level system code or drivers where source code is unavailable.
- •Optimizing performance by understanding compiler output and machine code execution paths.

# Pro Tips
- 💡Always start with high-level control flow graphs (CFGs) before diving into individual assembly instructions to grasp the overall program structure.
- 💡Utilize interactive disassemblers like Ghidra or IDA Pro to automate pattern recognition and cross-referencing, significantly speeding up your analysis.
- 💡Pay close attention to calling conventions specific to the architecture and operating system, as they dictate argument passing and stack management.

