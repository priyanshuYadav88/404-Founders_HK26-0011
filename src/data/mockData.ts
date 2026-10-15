import {
  SecurityEvent,
  Incident,
  StorylineNode,
  DetectionLabItem,
  MitreTechnique,
  Asset,
  ResponsePlaybook,
  DetectionQualityMetric
} from '../types';

export const MOCK_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: 'EVT-8941',
    timestamp: '2026-10-15 12:48:12 UTC',
    eventType: 'Privilege Escalation',
    sourceIp: '198.51.100.44',
    destinationIp: '10.0.1.15 (auth-prod-srv01)',
    severity: 'critical',
    status: 'investigating',
    details: 'User svc_backup modified /etc/sudoers.d/99-wheel with ALL=(ALL) NOPASSWD',
    mitreTechnique: 'T1548.003 - Sudo Caching / Sudoers',
    payloadSnippet: 'sudo echo "svc_backup ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers.d/99-ops'
  },
  {
    id: 'EVT-8935',
    timestamp: '2026-10-15 12:41:05 UTC',
    eventType: 'Suspicious Login',
    sourceIp: '198.51.100.44',
    destinationIp: '10.0.1.15 (auth-prod-srv01)',
    severity: 'high',
    status: 'investigating',
    details: 'Interactive session established for service account svc_backup from non-standard external ASN',
    mitreTechnique: 'T1078.003 - Local Accounts',
    payloadSnippet: 'SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.4 login success (publickey)'
  },
  {
    id: 'EVT-8910',
    timestamp: '2026-10-15 12:35:22 UTC',
    eventType: 'Failed Login',
    sourceIp: '198.51.100.44',
    destinationIp: '10.0.1.15 (auth-prod-srv01)',
    severity: 'medium',
    status: 'detected',
    details: '142 consecutive failed SSH password attempts within 90 seconds against root, admin, ubuntu',
    mitreTechnique: 'T1110.001 - Password Guessing',
    payloadSnippet: 'pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.44'
  },
  {
    id: 'EVT-8874',
    timestamp: '2026-10-15 12:18:04 UTC',
    eventType: 'Port Scan',
    sourceIp: '198.51.100.44',
    destinationIp: '10.0.1.15 (auth-prod-srv01)',
    severity: 'low',
    status: 'mitigated',
    details: 'TCP SYN scan across 1,024 well-known ports; ports 22, 80, 443 identified as open',
    mitreTechnique: 'T1046 - Network Service Discovery',
    payloadSnippet: 'TCP SYN flag seq 39481912 win 1024 -> ports 20..1024'
  },
  {
    id: 'EVT-8850',
    timestamp: '2026-10-15 12:05:30 UTC',
    eventType: 'SQL Injection',
    sourceIp: '203.0.113.89',
    destinationIp: '10.0.2.80 (api-gateway-01)',
    severity: 'high',
    status: 'investigating',
    details: 'Union-based SQL injection attempt detected in query parameter "tenant_id"',
    mitreTechnique: 'T1190 - Exploit Public-Facing Application',
    payloadSnippet: 'GET /api/v1/billing?tenant_id=1%27%20UNION%20SELECT%20null%2Ctable_name%20FROM%20information_schema.tables--'
  },
  {
    id: 'EVT-8812',
    timestamp: '2026-10-15 11:52:19 UTC',
    eventType: 'DDoS Probe',
    sourceIp: '192.0.2.77',
    destinationIp: '10.0.2.80 (api-gateway-01)',
    severity: 'medium',
    status: 'detected',
    details: 'HTTP/2 Rapid Reset stream cancellation flood test (3,400 rps burst)',
    mitreTechnique: 'T1498 - Network Denial of Service',
    payloadSnippet: 'RST_STREAM frames received with NO_ERROR immediately post HEADERS'
  },
  {
    id: 'EVT-8799',
    timestamp: '2026-10-15 11:30:45 UTC',
    eventType: 'Suspicious Login',
    sourceIp: '10.0.99.12',
    destinationIp: '10.0.4.10 (dev-bastion-test01)',
    severity: 'low',
    status: 'false_positive',
    details: 'Intern dev environment SSH login during scheduled staging deployment window',
    mitreTechnique: 'T1078 - Valid Accounts',
    payloadSnippet: 'Accepted publickey for dev_intern from 10.0.99.12 port 52310'
  }
];

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-9041',
    title: 'Multi-Stage Privilege Escalation via Sudoers Abuse',
    severity: 'P1',
    confidence: 96,
    affectedAsset: 'auth-prod-srv01',
    affectedAssetIp: '10.0.1.15',
    timestamp: '2026-10-15 12:48 UTC',
    status: 'Active',
    attackChainStep: 'Privilege Escalation (Step 4/4)',
    summary: 'Correlated attack chain originating from external reconnaissance, successful credential compromise on svc_backup, and subsequent privileged sudoers modification.',
    eventsCount: 4,
    mitreTechnique: 'T1548.003 / T1078',
    recommendedAction: 'Immediate host isolation from VPC and revocation of svc_backup public keys.',
    assignedAnalyst: 'SecOps Team Alpha'
  },
  {
    id: 'INC-2026-8912',
    title: 'SQL Injection Enumeration on Billing Endpoint',
    severity: 'P2',
    confidence: 91,
    affectedAsset: 'api-gateway-01',
    affectedAssetIp: '10.0.2.80',
    timestamp: '2026-10-15 12:05 UTC',
    status: 'Investigating',
    attackChainStep: 'Initial Access (Step 1/2)',
    summary: 'Automated injection fuzzing targeting relational database metadata endpoints. Blocked at perimeter WAF rule candidate.',
    eventsCount: 6,
    mitreTechnique: 'T1190',
    recommendedAction: 'Deploy parameterized query hotfix and rate-limit source subnet.',
    assignedAnalyst: 'AppSec Tier 2'
  },
  {
    id: 'INC-2026-8804',
    title: 'HTTP/2 Rapid Reset Volumetric Probe',
    severity: 'P3',
    confidence: 84,
    affectedAsset: 'api-gateway-01',
    affectedAssetIp: '10.0.2.80',
    timestamp: '2026-10-15 11:52 UTC',
    status: 'Contained',
    attackChainStep: 'Impact Testing',
    summary: 'Abrupt burst of RST_STREAM frames detected by ingress proxy; dropped by upstream edge mitigation filter.',
    eventsCount: 12,
    mitreTechnique: 'T1498',
    recommendedAction: 'Verify reverse-proxy timeout buffers and monitor ingress saturation.',
    assignedAnalyst: 'Infra Sec'
  },
  {
    id: 'INC-2026-8740',
    title: 'Anomalous SSH Lateral Jump in Development Bastion',
    severity: 'P4',
    confidence: 72,
    affectedAsset: 'dev-bastion-test01',
    affectedAssetIp: '10.0.4.10',
    timestamp: '2026-10-15 11:30 UTC',
    status: 'Resolved',
    attackChainStep: 'Reconnaissance / Lateral Movement',
    summary: 'Unusual off-hours connection to sandbox instance. Confirmed as approved internal QA automation drill.',
    eventsCount: 2,
    mitreTechnique: 'T1078',
    recommendedAction: 'Mark alert rule whitelist for staging test runner IP.',
    assignedAnalyst: 'SOC L1'
  }
];

export const MOCK_STORYLINE_NODES: StorylineNode[] = [
  {
    id: 'node-1',
    stepNumber: 1,
    title: 'Port Scan',
    category: 'Reconnaissance',
    timestamp: '12:18:04 UTC',
    source: '198.51.100.44 (External Attacker)',
    target: '10.0.1.15:22,80,443 (auth-prod-srv01)',
    evidenceSummary: 'SYN packets sent across 1024 ports within 12 seconds. Ingress gateway identified rapid handshake teardowns.',
    techniqueId: 'T1046',
    techniqueName: 'Network Service Discovery',
    indicators: ['SYN Flag Only', 'Port Sweep', 'External IP 198.51.100.44'],
    isSimulated: true,
    statusText: 'Simulated Evidence'
  },
  {
    id: 'node-2',
    stepNumber: 2,
    title: 'Failed Login Attempts',
    category: 'Credential Access',
    timestamp: '12:35:22 UTC',
    source: '198.51.100.44',
    target: '10.0.1.15:22 (SSHD)',
    evidenceSummary: '142 brute force SSH password attempts cycling common usernames before attempting service accounts.',
    techniqueId: 'T1110.001',
    techniqueName: 'Password Guessing',
    indicators: ['High Velocity Auth Failure', 'Dictionary Wordlist', 'Targeting svc_backup'],
    isSimulated: true,
    statusText: 'Simulated Evidence'
  },
  {
    id: 'node-3',
    stepNumber: 3,
    title: 'Suspicious Login',
    category: 'Initial Access',
    timestamp: '12:41:05 UTC',
    source: '198.51.100.44',
    target: 'svc_backup session on auth-prod-srv01',
    evidenceSummary: 'Accepted SSH key authentication for svc_backup from an IP address with zero prior behavioral history in 90 days.',
    techniqueId: 'T1078.003',
    techniqueName: 'Valid Accounts: Local Accounts',
    indicators: ['Anomalous GeoIP/ASN', 'Service Account Interactive TTY', 'Stolen Key Signature'],
    isSimulated: true,
    statusText: 'Simulated Evidence'
  },
  {
    id: 'node-4',
    stepNumber: 4,
    title: 'Privilege Change',
    category: 'Privilege Escalation',
    timestamp: '12:48:12 UTC',
    source: 'svc_backup (PID 48211)',
    target: '/etc/sudoers.d/99-ops',
    evidenceSummary: 'File integrity monitor alerted on unauthorized addition of NOPASSWD root permissions for svc_backup.',
    techniqueId: 'T1548.003',
    techniqueName: 'Sudo and Sudoers Elevation',
    indicators: ['Integrity Monitor Alert', 'NOPASSWD Escalation', 'Direct Bash Child Process'],
    isSimulated: true,
    statusText: 'Simulated Evidence'
  }
];

export const MOCK_DETECTION_LAB_ITEMS: DetectionLabItem[] = [
  {
    id: 'LAB-01',
    name: 'SSH Distributed Password Brute Force Detector',
    engineType: 'Known Attack Detection',
    category: 'Brute Force',
    confidenceScore: 94,
    anomalyScore: 0.18,
    detectionMechanism: 'Stateful Sliding-Window Signature',
    ruleOrModel: 'Rule #SEC-BF-091: Threshold > 25 failed auths / 60s per subnet',
    testVector: '140 failed SSH handshakes within 90s from single external source',
    notes: 'Deterministic trigger based on standard pam_unix authentication failure syslog patterns.'
  },
  {
    id: 'LAB-02',
    name: 'High-Volume TCP SYN Sweep Classifier',
    engineType: 'Anomaly Detection',
    category: 'Port Scan',
    confidenceScore: 89,
    anomalyScore: 0.86,
    detectionMechanism: 'Statistical Entropy & Unanswered SYN Ratio',
    ruleOrModel: 'Isolation Forest ML Model v2.4 (Unsupervised behavioral cluster)',
    testVector: '1,024 half-open SYN packets over 12 seconds with RST acknowledgments',
    notes: 'Identifies behavioral deviation against baseline network traffic distributions.'
  },
  {
    id: 'LAB-03',
    name: 'Grammar-Based SQL Injection Parser',
    engineType: 'Known Attack Detection',
    category: 'SQL Injection',
    confidenceScore: 98,
    anomalyScore: 0.08,
    detectionMechanism: 'Abstract Syntax Tree (AST) Tokenizer',
    ruleOrModel: 'LibInjection Token Pattern Matcher (SQLi Signature Set v4.1)',
    testVector: "tenant_id=1' UNION SELECT null,table_name FROM information_schema--",
    notes: 'Detects structural tautologies and schema enumeration constructs in HTTP parameters.'
  },
  {
    id: 'LAB-04',
    name: 'HTTP/2 Rapid Reset & Multiplex Anomaly Monitor',
    engineType: 'Anomaly Detection',
    category: 'DDoS',
    confidenceScore: 92,
    anomalyScore: 0.94,
    detectionMechanism: 'Dynamic Time Warping (DTW) Traffic Deviation',
    ruleOrModel: 'Autoencoder Volumetric Neural Estimator (Threshold > 3.5 std dev)',
    testVector: '3,400 concurrent RST_STREAM frames following immediate request dispatch',
    notes: 'Flags high variance between request initiation and abrupt teardown cadence.'
  }
];

export const MOCK_MITRE_TECHNIQUES: MitreTechnique[] = [
  {
    id: 'mitre-1',
    techniqueId: 'T1110',
    name: 'Brute Force',
    tactic: 'Credential Access',
    detectionCount: 148,
    mappingType: 'Suggested',
    description: 'Adversaries may use brute force techniques to attempt authentication credentials when passwords or hashes are unknown.',
    associatedAlerts: ['EVT-8910', 'INC-2026-9041 (Step 2)'],
    detectionGuidance: 'Monitor authentication logs for bursts of failed attempts across single or multiple user IDs.'
  },
  {
    id: 'mitre-2',
    techniqueId: 'T1046',
    name: 'Network Service Discovery',
    tactic: 'Discovery',
    detectionCount: 84,
    mappingType: 'Suggested',
    description: 'Adversaries may attempt to get a listing of services running on hosts by scanning IP ranges and standard listening ports.',
    associatedAlerts: ['EVT-8874', 'INC-2026-9041 (Step 1)'],
    detectionGuidance: 'Analyze netflow or stateful firewall drop logs for high-frequency connection attempts with minimal payload data.'
  },
  {
    id: 'mitre-3',
    techniqueId: 'T1078',
    name: 'Valid Accounts',
    tactic: 'Initial Access / Persistence',
    detectionCount: 42,
    mappingType: 'Illustrative',
    description: 'Adversaries may obtain and abuse credentials of existing accounts as a means of gaining Initial Access or maintaining Persistence.',
    associatedAlerts: ['EVT-8935', 'EVT-8799'],
    detectionGuidance: 'Baseline user login hours, geolocations, and compare service account usage against automated task schedules.'
  },
  {
    id: 'mitre-4',
    techniqueId: 'T1548',
    name: 'Abuse Elevation Control Mechanism',
    tactic: 'Privilege Escalation',
    detectionCount: 19,
    mappingType: 'Illustrative',
    description: 'Adversaries may circumvent mechanisms designed to control elevation of privileges to gain higher-level permissions.',
    associatedAlerts: ['EVT-8941', 'INC-2026-9041 (Step 4)'],
    detectionGuidance: 'Audit changes to /etc/sudoers, /etc/sudoers.d, and monitor execution of setuid binaries via auditd.'
  },
  {
    id: 'mitre-5',
    techniqueId: 'T1190',
    name: 'Exploit Public-Facing Application',
    tactic: 'Initial Access',
    detectionCount: 63,
    mappingType: 'Illustrative',
    description: 'Adversaries may attempt to exploit vulnerabilities in Internet-facing software (such as SQL injection or buffer overflows).',
    associatedAlerts: ['EVT-8850', 'INC-2026-8912'],
    detectionGuidance: 'Inspect web application firewall (WAF) logs and application exception traces for syntax parsing errors.'
  }
];

export const MOCK_ASSETS: Asset[] = [
  {
    id: 'asset-1',
    name: 'auth-prod-srv01',
    ipAddress: '10.0.1.15',
    environment: 'Production',
    criticality: 'Critical',
    riskScore: 92,
    activeIncidents: 1,
    os: 'Ubuntu 22.04 LTS (Harden v3)',
    type: 'Auth Service',
    lastScanned: '10 mins ago'
  },
  {
    id: 'asset-2',
    name: 'api-gateway-01',
    ipAddress: '10.0.2.80',
    environment: 'Production',
    criticality: 'High',
    riskScore: 68,
    activeIncidents: 2,
    os: 'Alpine Linux 3.19 / Envoy Proxy',
    type: 'API Gateway',
    lastScanned: '25 mins ago'
  },
  {
    id: 'asset-3',
    name: 'db-primary-cluster',
    ipAddress: '10.0.3.50',
    environment: 'Production',
    criticality: 'Critical',
    riskScore: 34,
    activeIncidents: 0,
    os: 'RHEL 9.3 Enterprise',
    type: 'Database Cluster',
    lastScanned: '1 hour ago'
  },
  {
    id: 'asset-4',
    name: 'k8s-worker-prod-03',
    ipAddress: '10.0.2.113',
    environment: 'Production',
    criticality: 'Medium',
    riskScore: 24,
    activeIncidents: 0,
    os: 'Container Linux 36.2024',
    type: 'Kubernetes Node',
    lastScanned: '2 hours ago'
  },
  {
    id: 'asset-5',
    name: 'dev-bastion-test01',
    ipAddress: '10.0.4.10',
    environment: 'Development',
    criticality: 'Low',
    riskScore: 45,
    activeIncidents: 0,
    os: 'Debian 12 Bookworm',
    type: 'Internal Dev Bastion',
    lastScanned: '4 hours ago'
  },
  {
    id: 'asset-6',
    name: 'staging-web-frontend',
    ipAddress: '10.0.5.22',
    environment: 'Staging',
    criticality: 'Low',
    riskScore: 18,
    activeIncidents: 0,
    os: 'Ubuntu 24.04 LTS',
    type: 'API Gateway',
    lastScanned: '6 hours ago'
  }
];

export const MOCK_RESPONSE_PLAYBOOKS: ResponsePlaybook[] = [
  {
    id: 'PB-001',
    name: 'Automated Host Isolation via VPC Security Group',
    triggerCondition: 'Multi-stage P1 Critical Incident (Active Privilege Escalation confirmed)',
    suggestedAction: 'Isolate host 10.0.1.15 (auth-prod-srv01) by applying quarantine security group sg-quarantine-01.',
    reason: 'Prevents lateral movement while preserving volatile memory for forensic analysis.',
    approvalStatus: 'Pending Review',
    targetAsset: 'auth-prod-srv01 (10.0.1.15)',
    impactRisk: 'High',
    reviewNotes: 'Will disrupt ongoing authentication requests. Failover cluster auth-prod-srv02 must accept warm traffic.'
  },
  {
    id: 'PB-002',
    name: 'Revoke Compromised Service Account Session & Keys',
    triggerCondition: 'Account Credential Stuffing / Anomalous Session established',
    suggestedAction: 'Terminate active SSH sessions for svc_backup and temporarily disable authorized_keys entries.',
    reason: 'Stops attacker persistence mechanism immediately without taking the host offline.',
    approvalStatus: 'Approved',
    targetAsset: 'auth-prod-srv01 (svc_backup)',
    impactRisk: 'Medium',
    reviewNotes: 'Verified that nightly backup cron job has completed. Safe to cycle credentials.'
  },
  {
    id: 'PB-003',
    name: 'Dynamic Edge Firewall Subnet Drop Rule',
    triggerCondition: 'Repeated high-volume brute force from single ASN (> 100 failed auths)',
    suggestedAction: 'Append drop rule to edge firewall filter for subnet 198.51.100.0/24 for 4 hours.',
    reason: 'Mitigates external network scanning and brute force probes before reaching internal hosts.',
    approvalStatus: 'Pending Review',
    targetAsset: 'Perimeter Edge WAF / Firewall',
    impactRisk: 'Low',
    reviewNotes: 'External subnet contains no known customer or partner IP allocations.'
  },
  {
    id: 'PB-004',
    name: 'WAF Parameter Sanitization Hot-Patch',
    triggerCondition: 'Verified SQL Injection pattern matched on public endpoint',
    suggestedAction: 'Apply strict regex validation filter on parameter "tenant_id" at Cloud Ingress.',
    reason: 'Blocks SQL injection vectors while developer team prepares parameterized code patch.',
    approvalStatus: 'Executed (Simulated)',
    targetAsset: 'api-gateway-01',
    impactRisk: 'Low',
    reviewNotes: 'Filter applied and tested against test payload. No false-positives observed in staging.'
  }
];

export const MOCK_DETECTION_QUALITY_METRICS: DetectionQualityMetric[] = [
  {
    metric: 'Precision (PPV)',
    value: '94.2%',
    subValue: '+1.4% vs baseline',
    benchmark: 'SOC Target: > 90.0%',
    status: 'optimal',
    description: 'Percentage of alerted incidents that represented authentic adversarial behavior in benchmark suite.'
  },
  {
    metric: 'Recall (Sensitivity)',
    value: '91.8%',
    subValue: '+2.1% vs baseline',
    benchmark: 'SOC Target: > 88.0%',
    status: 'optimal',
    description: 'Percentage of simulated attack scenarios successfully captured across all MITRE matrices.'
  },
  {
    metric: 'False-Positive Rate',
    value: '2.1%',
    subValue: '-0.8% reduction',
    benchmark: 'SOC Target: < 5.0%',
    status: 'optimal',
    description: 'Rate at which legitimate administrative actions were incorrectly flagged as malicious.'
  },
  {
    metric: 'Detection Latency (p95)',
    value: '142 ms',
    subValue: 'Median: 78 ms',
    benchmark: 'SOC Target: < 300 ms',
    status: 'optimal',
    description: 'End-to-end processing duration from event ingestion to alert synthesis in the detection pipeline.'
  }
];

export const MOCK_INCIDENT_SEVERITY_BREAKDOWN = [
  { severity: 'P1 - Critical', count: 1, color: '#EF4444' },
  { severity: 'P2 - High', count: 1, color: '#F97316' },
  { severity: 'P3 - Medium', count: 1, color: '#F59E0B' },
  { severity: 'P4 - Low', count: 1, color: '#3B82F6' },
];

export const MOCK_TIMELINE_ACTIVITY = [
  { time: '12:00', count: 4 },
  { time: '12:10', count: 9 },
  { time: '12:20', count: 22 },
  { time: '12:30', count: 18 },
  { time: '12:40', count: 65 },
  { time: '12:50', count: 88 },
];
