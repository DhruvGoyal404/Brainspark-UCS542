/**
 * COMPUTER NETWORKS QUIZZES SEED DATA
 * Contains Networking quizzes
 * Run: node seeds/quizzes-networks.seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Quiz = require('../models/Quiz');
const User = require('../models/User');

const networksQuizzes = [
    // ===== NETWORKS BASICS - EASY =====
    {
        id: 'networks-basics',
        title: 'Computer Networks Basics',
        description: 'Learn networking fundamentals and protocols',
        category: 'networks',
        difficulty: 'easy',
        metadata: {
            estimatedTime: 20,
            totalQuestions: 15,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What does HTTP stand for?',
                options: [
                    { id: 'A', text: 'HyperText Transfer Protocol', isCorrect: true },
                    { id: 'B', text: 'High Transfer Text Protocol', isCorrect: false },
                    { id: 'C', text: 'Hyper Transfer Text Protocol', isCorrect: false },
                    { id: 'D', text: 'Home Tool Transfer Protocol', isCorrect: false }
                ],
                explanation: 'HTTP stands for HyperText Transfer Protocol, used for transmitting web pages.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the default port for HTTPS?',
                options: [
                    { id: 'A', text: '80', isCorrect: false },
                    { id: 'B', text: '443', isCorrect: true },
                    { id: 'C', text: '8080', isCorrect: false },
                    { id: 'D', text: '22', isCorrect: false }
                ],
                explanation: 'HTTPS uses port 443 by default, while HTTP uses port 80.',
                difficulty: 'easy'
            },
            {
                questionText: 'What does TCP stand for?',
                options: [
                    { id: 'A', text: 'Transfer Control Protocol', isCorrect: false },
                    { id: 'B', text: 'Transmission Control Protocol', isCorrect: true },
                    { id: 'C', text: 'Transport Control Protocol', isCorrect: false },
                    { id: 'D', text: 'Technical Control Protocol', isCorrect: false }
                ],
                explanation: 'TCP stands for Transmission Control Protocol, a connection-oriented protocol.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the purpose of DNS?',
                options: [
                    { id: 'A', text: 'To encrypt data', isCorrect: false },
                    { id: 'B', text: 'To translate domain names to IP addresses', isCorrect: true },
                    { id: 'C', text: 'To route packets', isCorrect: false },
                    { id: 'D', text: 'To compress data', isCorrect: false }
                ],
                explanation: 'DNS (Domain Name System) translates human-readable domain names to IP addresses.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is an IP address?',
                options: [
                    { id: 'A', text: 'A physical address of a device', isCorrect: false },
                    { id: 'B', text: 'A logical address assigned to a device on a network', isCorrect: true },
                    { id: 'C', text: 'A domain name', isCorrect: false },
                    { id: 'D', text: 'A port number', isCorrect: false }
                ],
                explanation: 'An IP address is a unique logical identifier for a device on a network.',
                difficulty: 'easy'
            },
            {
                questionText: 'How many layers are in the OSI model?',
                options: [
                    { id: 'A', text: '4', isCorrect: false },
                    { id: 'B', text: '5', isCorrect: false },
                    { id: 'C', text: '7', isCorrect: true },
                    { id: 'D', text: '6', isCorrect: false }
                ],
                explanation: 'The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.',
                difficulty: 'easy'
            },
            {
                questionText: 'What does LAN stand for?',
                options: [
                    { id: 'A', text: 'Large Area Network', isCorrect: false },
                    { id: 'B', text: 'Local Area Network', isCorrect: true },
                    { id: 'C', text: 'Long Area Network', isCorrect: false },
                    { id: 'D', text: 'Linked Area Network', isCorrect: false }
                ],
                explanation: 'LAN stands for Local Area Network - a network in a small geographical area.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a MAC address?',
                options: [
                    { id: 'A', text: 'An IP address for Apple devices', isCorrect: false },
                    { id: 'B', text: 'A unique hardware identifier for network interfaces', isCorrect: true },
                    { id: 'C', text: 'A website address', isCorrect: false },
                    { id: 'D', text: 'A memory address', isCorrect: false }
                ],
                explanation: 'MAC (Media Access Control) address is a unique hardware identifier assigned to network interface cards.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a router?',
                options: [
                    { id: 'A', text: 'A device that connects computer to monitor', isCorrect: false },
                    { id: 'B', text: 'A device that forwards packets between networks', isCorrect: true },
                    { id: 'C', text: 'A type of cable', isCorrect: false },
                    { id: 'D', text: 'A software program', isCorrect: false }
                ],
                explanation: 'A router is a networking device that forwards data packets between computer networks.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a switch in networking?',
                options: [
                    { id: 'A', text: 'A power switch', isCorrect: false },
                    { id: 'B', text: 'A device that connects devices within a LAN', isCorrect: true },
                    { id: 'C', text: 'A type of cable', isCorrect: false },
                    { id: 'D', text: 'A firewall', isCorrect: false }
                ],
                explanation: 'A switch connects devices within a LAN and forwards frames based on MAC addresses.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a firewall?',
                options: [
                    { id: 'A', text: 'A wall that prevents fire', isCorrect: false },
                    { id: 'B', text: 'A security system that monitors network traffic', isCorrect: true },
                    { id: 'C', text: 'A type of router', isCorrect: false },
                    { id: 'D', text: 'A cable type', isCorrect: false }
                ],
                explanation: 'A firewall is a security system that monitors and controls incoming/outgoing network traffic.',
                difficulty: 'easy'
            },
            {
                questionText: 'What does WAN stand for?',
                options: [
                    { id: 'A', text: 'Wireless Area Network', isCorrect: false },
                    { id: 'B', text: 'Wide Area Network', isCorrect: true },
                    { id: 'C', text: 'Web Area Network', isCorrect: false },
                    { id: 'D', text: 'Wired Area Network', isCorrect: false }
                ],
                explanation: 'WAN stands for Wide Area Network - a network spanning large geographical areas.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is bandwidth?',
                options: [
                    { id: 'A', text: 'Width of a cable', isCorrect: false },
                    { id: 'B', text: 'Maximum data transfer rate of a network', isCorrect: true },
                    { id: 'C', text: 'A type of music', isCorrect: false },
                    { id: 'D', text: 'Storage capacity', isCorrect: false }
                ],
                explanation: 'Bandwidth is the maximum rate at which data can be transferred over a network.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is latency?',
                options: [
                    { id: 'A', text: 'Data transfer speed', isCorrect: false },
                    { id: 'B', text: 'Time delay between sending and receiving data', isCorrect: true },
                    { id: 'C', text: 'Storage capacity', isCorrect: false },
                    { id: 'D', text: 'Network security', isCorrect: false }
                ],
                explanation: 'Latency is the time delay between the cause and effect of a physical change (ping time).',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a ping used for?',
                options: [
                    { id: 'A', text: 'Playing games', isCorrect: false },
                    { id: 'B', text: 'Testing network connectivity', isCorrect: true },
                    { id: 'C', text: 'Downloading files', isCorrect: false },
                    { id: 'D', text: 'Sending emails', isCorrect: false }
                ],
                explanation: 'Ping is a network utility to test reachability and measure round-trip time to a host.',
                difficulty: 'easy'
            }
        ]
    },

    // ===== OSI & TCP/IP MODEL - MEDIUM =====
    {
        id: 'networks-osi-tcpip',
        title: 'OSI & TCP/IP Model',
        description: 'Master the networking models and their layers',
        category: 'networks',
        difficulty: 'medium',
        metadata: {
            estimatedTime: 25,
            totalQuestions: 12,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'Which layer of the OSI model is responsible for routing?',
                options: [
                    { id: 'A', text: 'Data Link Layer', isCorrect: false },
                    { id: 'B', text: 'Network Layer', isCorrect: true },
                    { id: 'C', text: 'Transport Layer', isCorrect: false },
                    { id: 'D', text: 'Application Layer', isCorrect: false }
                ],
                explanation: 'The Network Layer (Layer 3) handles routing of data packets between networks.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the difference between TCP and UDP?',
                options: [
                    { id: 'A', text: 'TCP is connectionless, UDP is connection-oriented', isCorrect: false },
                    { id: 'B', text: 'TCP is connection-oriented and reliable, UDP is connectionless', isCorrect: true },
                    { id: 'C', text: 'They are the same', isCorrect: false },
                    { id: 'D', text: 'UDP is slower than TCP', isCorrect: false }
                ],
                explanation: 'TCP provides reliable, ordered delivery while UDP is faster but unreliable.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is a subnet mask used for?',
                options: [
                    { id: 'A', text: 'To encrypt network traffic', isCorrect: false },
                    { id: 'B', text: 'To divide an IP address into network and host portions', isCorrect: true },
                    { id: 'C', text: 'To speed up connections', isCorrect: false },
                    { id: 'D', text: 'To block websites', isCorrect: false }
                ],
                explanation: 'A subnet mask determines which portion of an IP address is the network and which is the host.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is ARP used for?',
                options: [
                    { id: 'A', text: 'To resolve IP addresses to MAC addresses', isCorrect: true },
                    { id: 'B', text: 'To resolve domain names to IP addresses', isCorrect: false },
                    { id: 'C', text: 'To encrypt data', isCorrect: false },
                    { id: 'D', text: 'To compress packets', isCorrect: false }
                ],
                explanation: 'ARP (Address Resolution Protocol) maps IP addresses to MAC addresses.',
                difficulty: 'medium'
            },
            {
                questionText: 'Which OSI layer handles encryption?',
                options: [
                    { id: 'A', text: 'Transport Layer', isCorrect: false },
                    { id: 'B', text: 'Presentation Layer', isCorrect: true },
                    { id: 'C', text: 'Session Layer', isCorrect: false },
                    { id: 'D', text: 'Network Layer', isCorrect: false }
                ],
                explanation: 'The Presentation Layer (Layer 6) handles encryption, compression, and data translation.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the Transport Layer responsible for?',
                options: [
                    { id: 'A', text: 'Physical transmission', isCorrect: false },
                    { id: 'B', text: 'End-to-end communication and reliability', isCorrect: true },
                    { id: 'C', text: 'Routing packets', isCorrect: false },
                    { id: 'D', text: 'Email delivery', isCorrect: false }
                ],
                explanation: 'Transport Layer (Layer 4) provides end-to-end communication, error recovery, and flow control.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the Data Link Layer responsible for?',
                options: [
                    { id: 'A', text: 'Routing between networks', isCorrect: false },
                    { id: 'B', text: 'Node-to-node delivery and MAC addressing', isCorrect: true },
                    { id: 'C', text: 'Email formatting', isCorrect: false },
                    { id: 'D', text: 'Session management', isCorrect: false }
                ],
                explanation: 'Data Link Layer handles frame transmission between adjacent nodes using MAC addresses.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the TCP three-way handshake?',
                options: [
                    { id: 'A', text: 'Three computers connecting', isCorrect: false },
                    { id: 'B', text: 'SYN, SYN-ACK, ACK sequence to establish connection', isCorrect: true },
                    { id: 'C', text: 'Three packets sent together', isCorrect: false },
                    { id: 'D', text: 'Three retransmissions', isCorrect: false }
                ],
                explanation: 'TCP three-way handshake: Client sends SYN, Server responds SYN-ACK, Client sends ACK.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is ICMP primarily used for?',
                options: [
                    { id: 'A', text: 'Transferring files', isCorrect: false },
                    { id: 'B', text: 'Error reporting and diagnostics (ping, traceroute)', isCorrect: true },
                    { id: 'C', text: 'Email delivery', isCorrect: false },
                    { id: 'D', text: 'Web browsing', isCorrect: false }
                ],
                explanation: 'ICMP (Internet Control Message Protocol) is used for error reporting and network diagnostics.',
                difficulty: 'medium'
            },
            {
                questionText: 'How many layers does the TCP/IP model have?',
                options: [
                    { id: 'A', text: '7', isCorrect: false },
                    { id: 'B', text: '4', isCorrect: true },
                    { id: 'C', text: '5', isCorrect: false },
                    { id: 'D', text: '3', isCorrect: false }
                ],
                explanation: 'TCP/IP has 4 layers: Network Access, Internet, Transport, and Application.',
                difficulty: 'easy'
            },
            {
                questionText: 'Which protocol operates at the Application Layer?',
                options: [
                    { id: 'A', text: 'IP', isCorrect: false },
                    { id: 'B', text: 'TCP', isCorrect: false },
                    { id: 'C', text: 'HTTP', isCorrect: true },
                    { id: 'D', text: 'Ethernet', isCorrect: false }
                ],
                explanation: 'HTTP, FTP, SMTP, DNS operate at the Application Layer (Layer 7).',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the PDU (Protocol Data Unit) at the Transport Layer?',
                options: [
                    { id: 'A', text: 'Bits', isCorrect: false },
                    { id: 'B', text: 'Frames', isCorrect: false },
                    { id: 'C', text: 'Packets', isCorrect: false },
                    { id: 'D', text: 'Segments (TCP) / Datagrams (UDP)', isCorrect: true }
                ],
                explanation: 'Transport Layer PDU is Segment for TCP and Datagram for UDP.',
                difficulty: 'medium'
            }
        ]
    },

    // ===== PROTOCOLS AND SERVICES - MEDIUM =====
    {
        id: 'networks-protocols',
        title: 'Network Protocols & Services',
        description: 'Deep dive into network protocols and services',
        category: 'networks',
        difficulty: 'medium',
        metadata: {
            estimatedTime: 25,
            totalQuestions: 12,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'What port does FTP use?',
                options: [
                    { id: 'A', text: '20 and 21', isCorrect: true },
                    { id: 'B', text: '22', isCorrect: false },
                    { id: 'C', text: '25', isCorrect: false },
                    { id: 'D', text: '80', isCorrect: false }
                ],
                explanation: 'FTP uses port 20 for data transfer and port 21 for control commands.',
                difficulty: 'medium'
            },
            {
                questionText: 'What port does SSH use?',
                options: [
                    { id: 'A', text: '21', isCorrect: false },
                    { id: 'B', text: '22', isCorrect: true },
                    { id: 'C', text: '23', isCorrect: false },
                    { id: 'D', text: '25', isCorrect: false }
                ],
                explanation: 'SSH (Secure Shell) uses port 22 for secure remote access.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is DHCP used for?',
                options: [
                    { id: 'A', text: 'Encrypting data', isCorrect: false },
                    { id: 'B', text: 'Automatically assigning IP addresses', isCorrect: true },
                    { id: 'C', text: 'Sending emails', isCorrect: false },
                    { id: 'D', text: 'Browsing websites', isCorrect: false }
                ],
                explanation: 'DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses to devices.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is NAT used for?',
                options: [
                    { id: 'A', text: 'Encrypting traffic', isCorrect: false },
                    { id: 'B', text: 'Translating private IPs to public IPs', isCorrect: true },
                    { id: 'C', text: 'Blocking websites', isCorrect: false },
                    { id: 'D', text: 'Speeding up connections', isCorrect: false }
                ],
                explanation: 'NAT (Network Address Translation) maps private IP addresses to public IPs for internet access.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is SMTP used for?',
                options: [
                    { id: 'A', text: 'Receiving emails', isCorrect: false },
                    { id: 'B', text: 'Sending emails', isCorrect: true },
                    { id: 'C', text: 'Browsing web', isCorrect: false },
                    { id: 'D', text: 'File transfer', isCorrect: false }
                ],
                explanation: 'SMTP (Simple Mail Transfer Protocol) is used for sending emails. Port 25.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the difference between POP3 and IMAP?',
                options: [
                    { id: 'A', text: 'They are the same', isCorrect: false },
                    { id: 'B', text: 'IMAP keeps emails on server, POP3 downloads and deletes', isCorrect: true },
                    { id: 'C', text: 'POP3 is faster', isCorrect: false },
                    { id: 'D', text: 'IMAP is for sending', isCorrect: false }
                ],
                explanation: 'IMAP keeps emails on server (sync), POP3 downloads emails and typically removes from server.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is TLS/SSL used for?',
                options: [
                    { id: 'A', text: 'Faster data transfer', isCorrect: false },
                    { id: 'B', text: 'Encrypting data in transit', isCorrect: true },
                    { id: 'C', text: 'Compressing files', isCorrect: false },
                    { id: 'D', text: 'Routing packets', isCorrect: false }
                ],
                explanation: 'TLS/SSL encrypts data transmitted over networks to ensure confidentiality.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is a VPN?',
                options: [
                    { id: 'A', text: 'Very Private Network', isCorrect: false },
                    { id: 'B', text: 'Virtual Private Network', isCorrect: true },
                    { id: 'C', text: 'Virtual Public Network', isCorrect: false },
                    { id: 'D', text: 'Verified Private Network', isCorrect: false }
                ],
                explanation: 'VPN creates an encrypted tunnel for secure communication over public networks.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the difference between HTTP and HTTPS?',
                options: [
                    { id: 'A', text: 'Speed', isCorrect: false },
                    { id: 'B', text: 'HTTPS is encrypted with TLS/SSL', isCorrect: true },
                    { id: 'C', text: 'Port number only', isCorrect: false },
                    { id: 'D', text: 'HTTPS is older', isCorrect: false }
                ],
                explanation: 'HTTPS uses TLS/SSL encryption, while HTTP transmits data in plain text.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is SNMP used for?',
                options: [
                    { id: 'A', text: 'Sending emails', isCorrect: false },
                    { id: 'B', text: 'Network device management and monitoring', isCorrect: true },
                    { id: 'C', text: 'Web browsing', isCorrect: false },
                    { id: 'D', text: 'File transfer', isCorrect: false }
                ],
                explanation: 'SNMP (Simple Network Management Protocol) manages and monitors network devices.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is Telnet?',
                options: [
                    { id: 'A', text: 'A telephone network', isCorrect: false },
                    { id: 'B', text: 'Unencrypted remote terminal access protocol', isCorrect: true },
                    { id: 'C', text: 'A video protocol', isCorrect: false },
                    { id: 'D', text: 'An email protocol', isCorrect: false }
                ],
                explanation: 'Telnet provides remote terminal access but without encryption (use SSH instead).',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the purpose of a proxy server?',
                options: [
                    { id: 'A', text: 'Store websites locally', isCorrect: false },
                    { id: 'B', text: 'Act as intermediary between client and server', isCorrect: true },
                    { id: 'C', text: 'Speed up CPU', isCorrect: false },
                    { id: 'D', text: 'Create backups', isCorrect: false }
                ],
                explanation: 'Proxy server acts as intermediary, providing caching, filtering, and anonymity.',
                difficulty: 'medium'
            }
        ]
    },

    // ===== IP ADDRESSING & SUBNETTING - HARD =====
    {
        id: 'networks-ip-subnetting',
        title: 'IP Addressing & Subnetting',
        description: 'Master IP addressing and subnet calculations',
        category: 'networks',
        difficulty: 'hard',
        metadata: {
            estimatedTime: 30,
            totalQuestions: 12,
            passingScore: 70
        },
        questions: [
            {
                questionText: 'How many bits are in an IPv4 address?',
                options: [
                    { id: 'A', text: '16 bits', isCorrect: false },
                    { id: 'B', text: '32 bits', isCorrect: true },
                    { id: 'C', text: '64 bits', isCorrect: false },
                    { id: 'D', text: '128 bits', isCorrect: false }
                ],
                explanation: 'IPv4 addresses are 32 bits long, typically written as 4 octets (8 bits each).',
                difficulty: 'easy'
            },
            {
                questionText: 'How many bits are in an IPv6 address?',
                options: [
                    { id: 'A', text: '32 bits', isCorrect: false },
                    { id: 'B', text: '64 bits', isCorrect: false },
                    { id: 'C', text: '128 bits', isCorrect: true },
                    { id: 'D', text: '256 bits', isCorrect: false }
                ],
                explanation: 'IPv6 addresses are 128 bits long, allowing for many more unique addresses.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the CIDR notation /24 equivalent subnet mask?',
                options: [
                    { id: 'A', text: '255.0.0.0', isCorrect: false },
                    { id: 'B', text: '255.255.0.0', isCorrect: false },
                    { id: 'C', text: '255.255.255.0', isCorrect: true },
                    { id: 'D', text: '255.255.255.255', isCorrect: false }
                ],
                explanation: '/24 means 24 bits for network = 255.255.255.0 (3 octets of 1s).',
                difficulty: 'medium'
            },
            {
                questionText: 'How many usable host addresses are in a /24 network?',
                options: [
                    { id: 'A', text: '256', isCorrect: false },
                    { id: 'B', text: '254', isCorrect: true },
                    { id: 'C', text: '255', isCorrect: false },
                    { id: 'D', text: '252', isCorrect: false }
                ],
                explanation: '/24 has 256 addresses, but 2 reserved (network and broadcast), so 254 usable.',
                difficulty: 'medium'
            },
            {
                questionText: 'What class is the IP address 192.168.1.1?',
                options: [
                    { id: 'A', text: 'Class A', isCorrect: false },
                    { id: 'B', text: 'Class B', isCorrect: false },
                    { id: 'C', text: 'Class C', isCorrect: true },
                    { id: 'D', text: 'Class D', isCorrect: false }
                ],
                explanation: 'Class C: 192.0.0.0 to 223.255.255.255. First octet 192-223.',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the private IP range for Class A?',
                options: [
                    { id: 'A', text: '10.0.0.0 to 10.255.255.255', isCorrect: true },
                    { id: 'B', text: '172.16.0.0 to 172.31.255.255', isCorrect: false },
                    { id: 'C', text: '192.168.0.0 to 192.168.255.255', isCorrect: false },
                    { id: 'D', text: '127.0.0.0 to 127.255.255.255', isCorrect: false }
                ],
                explanation: 'Class A private: 10.0.0.0/8 (10.0.0.0 - 10.255.255.255).',
                difficulty: 'medium'
            },
            {
                questionText: 'What is the loopback address?',
                options: [
                    { id: 'A', text: '192.168.1.1', isCorrect: false },
                    { id: 'B', text: '127.0.0.1', isCorrect: true },
                    { id: 'C', text: '10.0.0.1', isCorrect: false },
                    { id: 'D', text: '0.0.0.0', isCorrect: false }
                ],
                explanation: '127.0.0.1 is the loopback address, used to test local network stack.',
                difficulty: 'easy'
            },
            {
                questionText: 'What is the broadcast address for 192.168.1.0/24?',
                options: [
                    { id: 'A', text: '192.168.1.0', isCorrect: false },
                    { id: 'B', text: '192.168.1.1', isCorrect: false },
                    { id: 'C', text: '192.168.1.254', isCorrect: false },
                    { id: 'D', text: '192.168.1.255', isCorrect: true }
                ],
                explanation: 'Broadcast address is the last address in the subnet: 192.168.1.255 for /24.',
                difficulty: 'medium'
            },
            {
                questionText: 'How many subnets can you create by borrowing 3 bits?',
                options: [
                    { id: 'A', text: '4', isCorrect: false },
                    { id: 'B', text: '6', isCorrect: false },
                    { id: 'C', text: '8', isCorrect: true },
                    { id: 'D', text: '16', isCorrect: false }
                ],
                explanation: 'Borrowing 3 bits = 2³ = 8 subnets.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is VLSM?',
                options: [
                    { id: 'A', text: 'Virtual Local Security Mode', isCorrect: false },
                    { id: 'B', text: 'Variable Length Subnet Mask', isCorrect: true },
                    { id: 'C', text: 'Very Large Subnet Mask', isCorrect: false },
                    { id: 'D', text: 'Virtual LAN Subnet Mode', isCorrect: false }
                ],
                explanation: 'VLSM allows subnets of different sizes within the same network, optimizing IP usage.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is the network address of 10.5.12.67/16?',
                options: [
                    { id: 'A', text: '10.0.0.0', isCorrect: false },
                    { id: 'B', text: '10.5.0.0', isCorrect: true },
                    { id: 'C', text: '10.5.12.0', isCorrect: false },
                    { id: 'D', text: '10.5.12.64', isCorrect: false }
                ],
                explanation: '/16 means first 16 bits are network, so network address is 10.5.0.0.',
                difficulty: 'hard'
            },
            {
                questionText: 'What is supernetting (CIDR)?',
                options: [
                    { id: 'A', text: 'Dividing network into smaller subnets', isCorrect: false },
                    { id: 'B', text: 'Combining multiple networks into one larger network', isCorrect: true },
                    { id: 'C', text: 'Adding more hosts', isCorrect: false },
                    { id: 'D', text: 'Encrypting networks', isCorrect: false }
                ],
                explanation: 'Supernetting/CIDR combines contiguous networks into a larger one for efficient routing.',
                difficulty: 'hard'
            }
        ]
    }
];

const seedNetworksQuizzes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            admin = await User.create({
                username: 'admin',
                email: 'admin@brainspark.com',
                password: 'admin123',
                role: 'admin'
            });
        }

        await Quiz.deleteMany({ category: 'networks' });
        console.log('🗑️  Cleared existing Networks quizzes');

        const quizzesWithCreator = networksQuizzes.map(quiz => ({
            ...quiz,
            createdBy: admin._id
        }));

        await Quiz.insertMany(quizzesWithCreator);

        const totalQuestions = networksQuizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);

        console.log(`✅ Seeded ${networksQuizzes.length} Networks quizzes with ${totalQuestions} total questions!`);
        console.log('\n📊 Networks Quiz Summary:');
        networksQuizzes.forEach(quiz => {
            console.log(`   - ${quiz.title}: ${quiz.questions.length} questions (${quiz.difficulty})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding Networks quizzes:', error);
        process.exit(1);
    }
};

seedNetworksQuizzes();
