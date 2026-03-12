# protocol-reverse-engineering
Source: https://antigravity.codes/agent-skills/security/protocol-reverse-engineering

## AI Worker Instructions
When the user requests functionality related to protocol-reverse-engineering, follow these guidelines and utilize this context.

## Scraped Content

# protocol-reverse-engineering
```
# Capture on specific interfacewireshark -i eth0 -k# Capture with filterwireshark -i eth0 -k -f "port 443"# Capture to filetshark -i eth0 -w capture.pcap# Ring buffer capture (rotate files)tshark -i eth0 -b filesize:100000 -b files:10 -w capture.pcap
```
```
# Capture on specific interfacewireshark -i eth0 -k# Capture with filterwireshark -i eth0 -k -f "port 443"# Capture to filetshark -i eth0 -w capture.pcap# Ring buffer capture (rotate files)tshark -i eth0 -b filesize:100000 -b files:10 -w capture.pcap
```
```
# Basic capturetcpdump -i eth0 -w capture.pcap# With filtertcpdump -i eth0 port 8080 -w capture.pcap# Capture specific bytestcpdump -i eth0 -s 0 -w capture.pcap  # Full packet# Real-time displaytcpdump -i eth0 -X port 80
```
```
# Basic capturetcpdump -i eth0 -w capture.pcap# With filtertcpdump -i eth0 port 8080 -w capture.pcap# Capture specific bytestcpdump -i eth0 -s 0 -w capture.pcap  # Full packet# Real-time displaytcpdump -i eth0 -X port 80
```
```
# mitmproxy for HTTP/HTTPSmitmproxy --mode transparent -p 8080# SSL/TLS interceptionmitmproxy --mode transparent --ssl-insecure# Dump to filemitmdump -w traffic.mitm# Burp Suite# Configure browser proxy to 127.0.0.1:8080
```
```
# mitmproxy for HTTP/HTTPSmitmproxy --mode transparent -p 8080# SSL/TLS interceptionmitmproxy --mode transparent --ssl-insecure# Dump to filemitmdump -w traffic.mitm# Burp Suite# Configure browser proxy to 127.0.0.1:8080
```
```
# Display filterstcp.port == 8080http.request.method == "POST"ip.addr == 192.168.1.1tcp.flags.syn == 1 && tcp.flags.ack == 0frame contains "password"# Following streamsRight-click > Follow > TCP StreamRight-click > Follow > HTTP Stream# Export objectsFile > Export Objects > HTTP# DecryptionEdit > Preferences > Protocols > TLS  - (Pre)-Master-Secret log filename  - RSA keys list
```
```
# Display filterstcp.port == 8080http.request.method == "POST"ip.addr == 192.168.1.1tcp.flags.syn == 1 && tcp.flags.ack == 0frame contains "password"# Following streamsRight-click > Follow > TCP StreamRight-click > Follow > HTTP Stream# Export objectsFile > Export Objects > HTTP# DecryptionEdit > Preferences > Protocols > TLS  - (Pre)-Master-Secret log filename  - RSA keys list
```
```
# Extract specific fieldstshark -r capture.pcap -T fields -e ip.src -e ip.dst -e tcp.port# Statisticstshark -r capture.pcap -q -z conv,tcptshark -r capture.pcap -q -z endpoints,ip# Filter and extracttshark -r capture.pcap -Y "http" -T json > http_traffic.json# Protocol hierarchytshark -r capture.pcap -q -z io,phs
```
```
# Extract specific fieldstshark -r capture.pcap -T fields -e ip.src -e ip.dst -e tcp.port# Statisticstshark -r capture.pcap -q -z conv,tcptshark -r capture.pcap -q -z endpoints,ip# Filter and extracttshark -r capture.pcap -Y "http" -T json > http_traffic.json# Protocol hierarchytshark -r capture.pcap -q -z io,phs
```
```
from scapy.all import *# Read pcappackets = rdpcap("capture.pcap")# Analyze packetsfor pkt in packets:    if pkt.haslayer(TCP):        print(f"Src: {pkt[IP].src}:{pkt[TCP].sport}")        print(f"Dst: {pkt[IP].dst}:{pkt[TCP].dport}")        if pkt.haslayer(Raw):            print(f"Data: {pkt[Raw].load[:50]}")# Filter packetshttp_packets = [p for p in packets if p.haslayer(TCP)                and (p[TCP].sport == 80 or p[TCP].dport == 80)]# Create custom packetspkt = IP(dst="target")/TCP(dport=80)/Raw(load="GET / HTTP/1.1\r\n")send(pkt)
```
```
from scapy.all import *# Read pcappackets = rdpcap("capture.pcap")# Analyze packetsfor pkt in packets:    if pkt.haslayer(TCP):        print(f"Src: {pkt[IP].src}:{pkt[TCP].sport}")        print(f"Dst: {pkt[IP].dst}:{pkt[TCP].dport}")        if pkt.haslayer(Raw):            print(f"Data: {pkt[Raw].load[:50]}")# Filter packetshttp_packets = [p for p in packets if p.haslayer(TCP)                and (p[TCP].sport == 80 or p[TCP].dport == 80)]# Create custom packetspkt = IP(dst="target")/TCP(dport=80)/Raw(load="GET / HTTP/1.1\r\n")send(pkt)
```
```
HTTP        - "HTTP/1." or "GET " or "POST " at startTLS/SSL     - 0x16 0x03 (record layer)DNS         - UDP port 53, specific header formatSMB         - 0xFF 0x53 0x4D 0x42 ("SMB" signature)SSH         - "SSH-2.0" bannerFTP         - "220 " response, "USER " commandSMTP        - "220 " banner, "EHLO" commandMySQL       - 0x00 length prefix, protocol versionPostgreSQL  - 0x00 0x00 0x00 startup lengthRedis       - "*" RESP array prefixMongoDB     - BSON documents with specific header
```
```
HTTP        - "HTTP/1." or "GET " or "POST " at startTLS/SSL     - 0x16 0x03 (record layer)DNS         - UDP port 53, specific header formatSMB         - 0xFF 0x53 0x4D 0x42 ("SMB" signature)SSH         - "SSH-2.0" bannerFTP         - "220 " response, "USER " commandSMTP        - "220 " banner, "EHLO" commandMySQL       - 0x00 length prefix, protocol versionPostgreSQL  - 0x00 0x00 0x00 startup lengthRedis       - "*" RESP array prefixMongoDB     - BSON documents with specific header
```
```
+--------+--------+--------+--------+|  Magic number / Signature         |+--------+--------+--------+--------+|  Version       |  Flags          |+--------+--------+--------+--------+|  Length        |  Message Type   |+--------+--------+--------+--------+|  Sequence Number / Session ID     |+--------+--------+--------+--------+|  Payload...                       |+--------+--------+--------+--------+
```
```
+--------+--------+--------+--------+|  Magic number / Signature         |+--------+--------+--------+--------+|  Version       |  Flags          |+--------+--------+--------+--------+|  Length        |  Message Type   |+--------+--------+--------+--------+|  Sequence Number / Session ID     |+--------+--------+--------+--------+|  Payload...                       |+--------+--------+--------+--------+
```
```
# Common patterns in binary protocols# Length-prefixed messagestruct Message {    uint32_t length;      # Total message length    uint16_t msg_type;    # Message type identifier    uint8_t  flags;       # Flags/options    uint8_t  reserved;    # Padding/alignment    uint8_t  payload[];   # Variable-length payload};# Type-Length-Value (TLV)struct TLV {    uint8_t  type;        # Field type    uint16_t length;      # Field length    uint8_t  value[];     # Field data};# Fixed header + variable payloadstruct Packet {    uint8_t  magic[4];    # "ABCD" signature    uint32_t version;    uint32_t payload_len;    uint32_t checksum;    # CRC32 or similar    uint8_t  payload[];};
```
```
# Common patterns in binary protocols# Length-prefixed messagestruct Message {    uint32_t length;      # Total message length    uint16_t msg_type;    # Message type identifier    uint8_t  flags;       # Flags/options    uint8_t  reserved;    # Padding/alignment    uint8_t  payload[];   # Variable-length payload};# Type-Length-Value (TLV)struct TLV {    uint8_t  type;        # Field type    uint16_t length;      # Field length    uint8_t  value[];     # Field data};# Fixed header + variable payloadstruct Packet {    uint8_t  magic[4];    # "ABCD" signature    uint32_t version;    uint32_t payload_len;    uint32_t checksum;    # CRC32 or similar    uint8_t  payload[];};
```
```
import structfrom dataclasses import dataclass@dataclassclass MessageHeader:    magic: bytes    version: int    msg_type: int    length: int    @classmethod    def from_bytes(cls, data: bytes):        magic, version, msg_type, length = struct.unpack(            ">4sHHI", data[:12]        )        return cls(magic, version, msg_type, length)def parse_messages(data: bytes):    offset = 0    messages = []    while offset < len(data):        header = MessageHeader.from_bytes(data[offset:])        payload = data[offset+12:offset+12+header.length]        messages.append((header, payload))        offset += 12 + header.length    return messages# Parse TLV structuredef parse_tlv(data: bytes):    fields = []    offset = 0    while offset < len(data):        field_type = data[offset]        length = struct.unpack(">H", data[offset+1:offset+3])[0]        value = data[offset+3:offset+3+length]        fields.append((field_type, value))        offset += 3 + length    return fields
```
```
import structfrom dataclasses import dataclass@dataclassclass MessageHeader:    magic: bytes    version: int    msg_type: int    length: int    @classmethod    def from_bytes(cls, data: bytes):        magic, version, msg_type, length = struct.unpack(            ">4sHHI", data[:12]        )        return cls(magic, version, msg_type, length)def parse_messages(data: bytes):    offset = 0    messages = []    while offset < len(data):        header = MessageHeader.from_bytes(data[offset:])        payload = data[offset+12:offset+12+header.length]        messages.append((header, payload))        offset += 12 + header.length    return messages# Parse TLV structuredef parse_tlv(data: bytes):    fields = []    offset = 0    while offset < len(data):        field_type = data[offset]        length = struct.unpack(">H", data[offset+1:offset+3])[0]        value = data[offset+3:offset+3+length]        fields.append((field_type, value))        offset += 3 + length    return fields
```
```
def hexdump(data: bytes, width: int = 16):    """Format binary data as hex dump."""    lines = []    for i in range(0, len(data), width):        chunk = data[i:i+width]        hex_part = ' '.join(f'{b:02x}' for b in chunk)        ascii_part = ''.join(            chr(b) if 32 <= b < 127 else '.'            for b in chunk        )        lines.append(f'{i:08x}  {hex_part:<{width*3}}  {ascii_part}')    return '\n'.join(lines)# Example output:# 00000000  48 54 54 50 2f 31 2e 31  20 32 30 30 20 4f 4b 0d  HTTP/1.1 200 OK.# 00000010  0a 43 6f 6e 74 65 6e 74  2d 54 79 70 65 3a 20 74  .Content-Type: t
```
```
def hexdump(data: bytes, width: int = 16):    """Format binary data as hex dump."""    lines = []    for i in range(0, len(data), width):        chunk = data[i:i+width]        hex_part = ' '.join(f'{b:02x}' for b in chunk)        ascii_part = ''.join(            chr(b) if 32 <= b < 127 else '.'            for b in chunk        )        lines.append(f'{i:08x}  {hex_part:<{width*3}}  {ascii_part}')    return '\n'.join(lines)# Example output:# 00000000  48 54 54 50 2f 31 2e 31  20 32 30 30 20 4f 4b 0d  HTTP/1.1 200 OK.# 00000010  0a 43 6f 6e 74 65 6e 74  2d 54 79 70 65 3a 20 74  .Content-Type: t
```
```
# Entropy analysis - high entropy suggests encryption/compressionimport mathfrom collections import Counterdef entropy(data: bytes) -> float:    if not data:        return 0.0    counter = Counter(data)    probs = [count / len(data) for count in counter.values()]    return -sum(p * math.log2(p) for p in probs)# Entropy thresholds:# < 6.0: Likely plaintext or structured data# 6.0-7.5: Possibly compressed# > 7.5: Likely encrypted or random# Common encryption indicators# - High, uniform entropy# - No obvious structure or patterns# - Length often multiple of block size (16 for AES)# - Possible IV at start (16 bytes for AES-CBC)
```
```
# Entropy analysis - high entropy suggests encryption/compressionimport mathfrom collections import Counterdef entropy(data: bytes) -> float:    if not data:        return 0.0    counter = Counter(data)    probs = [count / len(data) for count in counter.values()]    return -sum(p * math.log2(p) for p in probs)# Entropy thresholds:# < 6.0: Likely plaintext or structured data# 6.0-7.5: Possibly compressed# > 7.5: Likely encrypted or random# Common encryption indicators# - High, uniform entropy# - No obvious structure or patterns# - Length often multiple of block size (16 for AES)# - Possible IV at start (16 bytes for AES-CBC)
```
```
# Extract TLS metadatatshark -r capture.pcap -Y "ssl.handshake" \    -T fields -e ip.src -e ssl.handshake.ciphersuite# JA3 fingerprinting (client)tshark -r capture.pcap -Y "ssl.handshake.type == 1" \    -T fields -e ssl.handshake.ja3# JA3S fingerprinting (server)tshark -r capture.pcap -Y "ssl.handshake.type == 2" \    -T fields -e ssl.handshake.ja3s# Certificate extractiontshark -r capture.pcap -Y "ssl.handshake.certificate" \    -T fields -e x509sat.printableString
```
```
# Extract TLS metadatatshark -r capture.pcap -Y "ssl.handshake" \    -T fields -e ip.src -e ssl.handshake.ciphersuite# JA3 fingerprinting (client)tshark -r capture.pcap -Y "ssl.handshake.type == 1" \    -T fields -e ssl.handshake.ja3# JA3S fingerprinting (server)tshark -r capture.pcap -Y "ssl.handshake.type == 2" \    -T fields -e ssl.handshake.ja3s# Certificate extractiontshark -r capture.pcap -Y "ssl.handshake.certificate" \    -T fields -e x509sat.printableString
```
```
# Pre-master secret log (browser)export SSLKEYLOGFILE=/tmp/keys.log# Configure Wireshark# Edit > Preferences > Protocols > TLS# (Pre)-Master-Secret log filename: /tmp/keys.log# Decrypt with private key (if available)# Only works for RSA key exchange# Edit > Preferences > Protocols > TLS > RSA keys list
```
```
# Pre-master secret log (browser)export SSLKEYLOGFILE=/tmp/keys.log# Configure Wireshark# Edit > Preferences > Protocols > TLS# (Pre)-Master-Secret log filename: /tmp/keys.log# Decrypt with private key (if available)# Only works for RSA key exchange# Edit > Preferences > Protocols > TLS > RSA keys list
```
```
# Protocol Name Specification## OverviewBrief description of protocol purpose and design.## Transport- Layer: TCP/UDP- Port: XXXX- Encryption: TLS 1.2+## Message Format### Header (12 bytes)| Offset | Size | Field   | Description             || ------ | ---- | ------- | ----------------------- || 0      | 4    | Magic   | 0x50524F54 ("PROT")     || 4      | 2    | Version | Protocol version (1)    || 6      | 2    | Type    | Message type identifier || 8      | 4    | Length  | Payload length in bytes |### Message Types| Type | Name      | Description            || ---- | --------- | ---------------------- || 0x01 | HELLO     | Connection initiation  || 0x02 | HELLO_ACK | Connection accepted    || 0x03 | DATA      | Application data       || 0x04 | CLOSE     | Connection termination |### Type 0x01: HELLO| Offset | Size | Field      | Description              || ------ | ---- | ---------- | ------------------------ || 0      | 4    | ClientID   | Unique client identifier || 4      | 2    | Flags      | Connection flags         || 6      | var  | Extensions | TLV-encoded extensions   |## State Machine
```
```
# Protocol Name Specification## OverviewBrief description of protocol purpose and design.## Transport- Layer: TCP/UDP- Port: XXXX- Encryption: TLS 1.2+## Message Format### Header (12 bytes)| Offset | Size | Field   | Description             || ------ | ---- | ------- | ----------------------- || 0      | 4    | Magic   | 0x50524F54 ("PROT")     || 4      | 2    | Version | Protocol version (1)    || 6      | 2    | Type    | Message type identifier || 8      | 4    | Length  | Payload length in bytes |### Message Types| Type | Name      | Description            || ---- | --------- | ---------------------- || 0x01 | HELLO     | Connection initiation  || 0x02 | HELLO_ACK | Connection accepted    || 0x03 | DATA      | Application data       || 0x04 | CLOSE     | Connection termination |### Type 0x01: HELLO| Offset | Size | Field      | Description              || ------ | ---- | ---------- | ------------------------ || 0      | 4    | ClientID   | Unique client identifier || 4      | 2    | Flags      | Connection flags         || 6      | var  | Extensions | TLV-encoded extensions   |## State Machine
```
```
## Examples### Connection Establishment
```
```
## Examples### Connection Establishment
```
```

```
```

```
```
-- custom_protocol.lualocal proto = Proto("custom", "Custom Protocol")-- Define fieldslocal f_magic = ProtoField.string("custom.magic", "Magic")local f_version = ProtoField.uint16("custom.version", "Version")local f_type = ProtoField.uint16("custom.type", "Type")local f_length = ProtoField.uint32("custom.length", "Length")local f_payload = ProtoField.bytes("custom.payload", "Payload")proto.fields = { f_magic, f_version, f_type, f_length, f_payload }-- Message type nameslocal msg_types = {    [0x01] = "HELLO",    [0x02] = "HELLO_ACK",    [0x03] = "DATA",    [0x04] = "CLOSE"}function proto.dissector(buffer, pinfo, tree)    pinfo.cols.protocol = "CUSTOM"    local subtree = tree:add(proto, buffer())    -- Parse header    subtree:add(f_magic, buffer(0, 4))    subtree:add(f_version, buffer(4, 2))    local msg_type = buffer(6, 2):uint()    subtree:add(f_type, buffer(6, 2)):append_text(        " (" .. (msg_types[msg_type] or "Unknown") .. ")"    )    local length = buffer(8, 4):uint()    subtree:add(f_length, buffer(8, 4))    if length > 0 then        subtree:add(f_payload, buffer(12, length))    endend-- Register for TCP portlocal tcp_table = DissectorTable.get("tcp.port")tcp_table:add(8888, proto)
```
```
-- custom_protocol.lualocal proto = Proto("custom", "Custom Protocol")-- Define fieldslocal f_magic = ProtoField.string("custom.magic", "Magic")local f_version = ProtoField.uint16("custom.version", "Version")local f_type = ProtoField.uint16("custom.type", "Type")local f_length = ProtoField.uint32("custom.length", "Length")local f_payload = ProtoField.bytes("custom.payload", "Payload")proto.fields = { f_magic, f_version, f_type, f_length, f_payload }-- Message type nameslocal msg_types = {    [0x01] = "HELLO",    [0x02] = "HELLO_ACK",    [0x03] = "DATA",    [0x04] = "CLOSE"}function proto.dissector(buffer, pinfo, tree)    pinfo.cols.protocol = "CUSTOM"    local subtree = tree:add(proto, buffer())    -- Parse header    subtree:add(f_magic, buffer(0, 4))    subtree:add(f_version, buffer(4, 2))    local msg_type = buffer(6, 2):uint()    subtree:add(f_type, buffer(6, 2)):append_text(        " (" .. (msg_types[msg_type] or "Unknown") .. ")"    )    local length = buffer(8, 4):uint()    subtree:add(f_length, buffer(8, 4))    if length > 0 then        subtree:add(f_payload, buffer(12, length))    endend-- Register for TCP portlocal tcp_table = DissectorTable.get("tcp.port")tcp_table:add(8888, proto)
```
```
from boofuzz import *def main():    session = Session(        target=Target(            connection=TCPSocketConnection("target", 8888)        )    )    # Define protocol structure    s_initialize("HELLO")    s_static(b"\x50\x52\x4f\x54")  # Magic    s_word(1, name="version")       # Version    s_word(0x01, name="type")       # Type (HELLO)    s_size("payload", length=4)     # Length field    s_block_start("payload")    s_dword(0x12345678, name="client_id")    s_word(0, name="flags")    s_block_end()    session.connect(s_get("HELLO"))    session.fuzz()if __name__ == "__main__":    main()
```
```
from boofuzz import *def main():    session = Session(        target=Target(            connection=TCPSocketConnection("target", 8888)        )    )    # Define protocol structure    s_initialize("HELLO")    s_static(b"\x50\x52\x4f\x54")  # Magic    s_word(1, name="version")       # Version    s_word(0x01, name="type")       # Type (HELLO)    s_size("payload", length=4)     # Length field    s_block_start("payload")    s_dword(0x12345678, name="client_id")    s_word(0, name="flags")    s_block_end()    session.connect(s_get("HELLO"))    session.fuzz()if __name__ == "__main__":    main()
```
```
from scapy.all import *# Replay captured trafficpackets = rdpcap("capture.pcap")for pkt in packets:    if pkt.haslayer(TCP) and pkt[TCP].dport == 8888:        send(pkt)# Modify and replayfor pkt in packets:    if pkt.haslayer(Raw):        # Modify payload        original = pkt[Raw].load        modified = original.replace(b"client", b"CLIENT")        pkt[Raw].load = modified        # Recalculate checksums        del pkt[IP].chksum        del pkt[TCP].chksum        send(pkt)
```
```
from scapy.all import *# Replay captured trafficpackets = rdpcap("capture.pcap")for pkt in packets:    if pkt.haslayer(TCP) and pkt[TCP].dport == 8888:        send(pkt)# Modify and replayfor pkt in packets:    if pkt.haslayer(Raw):        # Modify payload        original = pkt[Raw].load        modified = original.replace(b"client", b"CLIENT")        pkt[Raw].load = modified        # Recalculate checksums        del pkt[IP].chksum        del pkt[TCP].chksum        send(pkt)
```
Unlocking the secrets of network communication is a critical skill in today's digital landscape. The Protocol Reverse Engineering Agent Skill empowers AI coding assistants to delve deep into data streams, revealing the hidden logic and structure of any network exchange, whether standard or proprietary. This capability is essential for uncovering vulnerabilities, ensuring interoperability between systems, and meticulous debugging of complex distributed applications. By transforming raw packet data into actionable insights, this skill enhances an agent's ability to diagnose issues, build compatible interfaces, and fortify defenses against sophisticated threats.

# When to Use This Skill
- •Analyzing proprietary communication between client and server applications to develop compatible third-party tools.
- •Debugging complex network issues by dissecting packet flows to identify malformed requests or unexpected responses.
- •Conducting security assessments to uncover hidden command-and-control channels or unauthorized data exfiltration.
- •Documenting undocumented internal protocols to improve system maintainability and knowledge transfer.

# Pro Tips
- 💡Always start with a clear objective: what information are you trying to extract? This will guide your capture filters and analysis techniques.
- 💡Leverage `tshark` for automated, scriptable packet analysis on large datasets, integrating it into your CI/CD pipelines for continuous monitoring.
- 💡Combine traffic capture with dynamic analysis (e.g., process monitoring) to correlate network events with application behavior and system calls.

