export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type IncidentPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type EventStatus = 'detected' | 'investigating' | 'mitigated' | 'false_positive';
export type IncidentStatus = 'Active' | 'Investigating' | 'Contained' | 'Resolved';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: 'Port Scan' | 'Failed Login' | 'Suspicious Login' | 'Privilege Escalation' | 'SQL Injection' | 'DDoS Probe' | 'Malware Beacon';
  sourceIp: string;
  destinationIp: string;
  severity: Severity;
  status: EventStatus;
  details: string;
  mitreTechnique: string;
  payloadSnippet?: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: IncidentPriority;
  confidence: number;
  affectedAsset: string;
  affectedAssetIp: string;
  timestamp: string;
  status: IncidentStatus;
  attackChainStep: string;
  summary: string;
  eventsCount: number;
  mitreTechnique: string;
  recommendedAction: string;
  assignedAnalyst?: string;
}

export interface StorylineNode {
  id: string;
  stepNumber: number;
  title: string;
  category: string;
  timestamp: string;
  source: string;
  target: string;
  evidenceSummary: string;
  techniqueId: string;
  techniqueName: string;
  indicators: string[];
  isSimulated: boolean;
  statusText: string;
}

export interface DetectionLabItem {
  id: string;
  name: string;
  engineType: 'Known Attack Detection' | 'Anomaly Detection';
  category: 'Brute Force' | 'Port Scan' | 'SQL Injection' | 'DDoS';
  confidenceScore: number;
  anomalyScore: number;
  detectionMechanism: string;
  ruleOrModel: string;
  testVector: string;
  notes: string;
}

export interface MitreTechnique {
  id: string;
  techniqueId: string;
  name: string;
  tactic: string;
  detectionCount: number;
  mappingType: 'Suggested' | 'Illustrative';
  description: string;
  associatedAlerts: string[];
  detectionGuidance: string;
}

export interface Asset {
  id: string;
  name: string;
  ipAddress: string;
  environment: 'Production' | 'Staging' | 'Development';
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  riskScore: number;
  activeIncidents: number;
  os: string;
  type: 'API Gateway' | 'Auth Service' | 'Database Cluster' | 'Internal Dev Bastion' | 'Kubernetes Node';
  lastScanned: string;
}

export interface ResponsePlaybook {
  id: string;
  name: string;
  triggerCondition: string;
  suggestedAction: string;
  reason: string;
  approvalStatus: 'Pending Review' | 'Approved' | 'Executed (Simulated)' | 'Rejected';
  targetAsset: string;
  impactRisk: 'Low' | 'Medium' | 'High';
  reviewNotes: string;
}

export interface DetectionQualityMetric {
  metric: string;
  value: string;
  subValue: string;
  benchmark: string;
  status: 'optimal' | 'warning' | 'nominal';
  description: string;
}
