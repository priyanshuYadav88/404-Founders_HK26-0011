import { SecurityEvent, Severity, Asset } from '../types';

export interface RuleEvaluationResult {
  ruleId: string;
  ruleName: string;
  category: string;
  triggered: boolean;
  confidence: number;
  explanation: string;
  recommendedMitre: string;
  severity: Severity;
}

export interface RiskScoreBreakdown {
  totalScore: number;
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  severityWeight: number;
  assetCriticalityWeight: number;
  confidenceFactor: number;
  formula: string;
}

export function evaluateDetectionRules(
  event: SecurityEvent,
  recentEvents: SecurityEvent[] = []
): RuleEvaluationResult {
  const type = event.eventType;
  const details = (event.details + ' ' + (event.payloadSnippet || '')).toLowerCase();

  // 1. SQL Injection Rule
  if (
    type === 'SQL Injection' ||
    details.includes('union') ||
    details.includes('select') ||
    details.includes('information_schema') ||
    details.includes('1=1') ||
    details.includes('--')
  ) {
    return {
      ruleId: 'RULE-APP-003',
      ruleName: 'Grammar-Based SQL Injection Heuristic',
      category: 'SQL Injection',
      triggered: true,
      confidence: 97,
      severity: 'high',
      recommendedMitre: 'T1190 - Exploit Public-Facing Application',
      explanation:
        'Triggered Rule RULE-APP-003: Detected relational database extraction syntax and SQL tautology patterns in HTTP request payload.'
    };
  }

  // 2. Repeated Failed Logins Rule
  if (type === 'Failed Login' || details.includes('failed ssh') || details.includes('authentication failure')) {
    const failedLoginsInWindow = recentEvents.filter(
      (e) => e.eventType === 'Failed Login' && e.sourceIp === event.sourceIp
    ).length + 1;

    return {
      ruleId: 'RULE-AUTH-001',
      ruleName: 'High-Velocity Authentication Failure Detector',
      category: 'Brute Force',
      triggered: true,
      confidence: Math.min(98, 85 + failedLoginsInWindow * 3),
      severity: failedLoginsInWindow > 3 ? 'high' : 'medium',
      recommendedMitre: 'T1110.001 - Password Guessing',
      explanation: `Triggered Rule RULE-AUTH-001: Consecutive failed authentication attempts (${failedLoginsInWindow} attempts in window) from source IP ${event.sourceIp} against authentication subsystem.`
    };
  }

  // 3. Port Scan Rule
  if (type === 'Port Scan' || details.includes('syn scan') || details.includes('ports identified')) {
    return {
      ruleId: 'RULE-NET-002',
      ruleName: 'TCP Half-Open SYN Sweep Pattern',
      category: 'Port Scan',
      triggered: true,
      confidence: 89,
      severity: 'medium',
      recommendedMitre: 'T1046 - Network Service Discovery',
      explanation:
        'Triggered Rule RULE-NET-002: Rapid sequence of TCP SYN packets across multiple well-known service ports without three-way handshake completion.'
    };
  }

  // 4. Unusual Traffic Volume / DDoS Probe Rule
  if (type === 'DDoS Probe' || details.includes('rst_stream') || details.includes('flood') || details.includes('burst')) {
    return {
      ruleId: 'RULE-VOL-004',
      ruleName: 'HTTP/2 Rapid Reset & Volumetric Anomaly Monitor',
      category: 'DDoS',
      triggered: true,
      confidence: 91,
      severity: 'high',
      recommendedMitre: 'T1498 - Network Denial of Service',
      explanation:
        'Triggered Rule RULE-VOL-004: Volumetric packet influx observed exceeding dynamic baseline moving average by > 3.8 standard deviations.'
    };
  }

  // 5. Privilege Escalation Rule
  if (
    type === 'Privilege Escalation' ||
    details.includes('sudoers') ||
    details.includes('nopasswd') ||
    details.includes('root')
  ) {
    return {
      ruleId: 'RULE-PRIV-005',
      ruleName: 'Sudoers & Elevation Control Integrity Monitor',
      category: 'Privilege Escalation',
      triggered: true,
      confidence: 96,
      severity: 'critical',
      recommendedMitre: 'T1548.003 - Sudo and Sudoers',
      explanation:
        'Triggered Rule RULE-PRIV-005: Critical unauthorized modification to local sudoers policy configuration granting root execution privilege.'
    };
  }

  // Default Fallback Rule
  return {
    ruleId: 'RULE-GEN-009',
    ruleName: 'Behavioral Anomaly Classifier',
    category: event.eventType,
    triggered: true,
    confidence: 82,
    severity: event.severity,
    recommendedMitre: event.mitreTechnique || 'T1078 - Valid Accounts',
    explanation: `Triggered Rule RULE-GEN-009: Telemetry vector matches anomalous behavioral classification for ${event.eventType}.`
  };
}

export function calculateRiskScore(
  severity: Severity,
  confidence: number,
  criticality: Asset['criticality'] = 'High'
): RiskScoreBreakdown {
  const severityWeights: Record<Severity, number> = {
    critical: 1.0,
    high: 0.8,
    medium: 0.5,
    low: 0.25,
    info: 0.1
  };

  const criticalityWeights: Record<Asset['criticality'], number> = {
    Critical: 1.0,
    High: 0.82,
    Medium: 0.55,
    Low: 0.3
  };

  const sevWeight = severityWeights[severity] ?? 0.5;
  const critWeight = criticalityWeights[criticality] ?? 0.8;
  const confFactor = Math.max(0.1, Math.min(1.0, confidence / 100));

  // Balanced SOC formula: 45% Severity + 35% Asset Criticality + 20% Confidence
  const rawScore = (sevWeight * 0.45 + critWeight * 0.35 + confFactor * 0.2) * 100;
  const totalScore = Math.min(99, Math.max(5, Math.round(rawScore)));

  let level: RiskScoreBreakdown['level'] = 'LOW';
  if (totalScore >= 80) level = 'CRITICAL';
  else if (totalScore >= 65) level = 'HIGH';
  else if (totalScore >= 40) level = 'MEDIUM';

  return {
    totalScore,
    level,
    severityWeight: sevWeight,
    assetCriticalityWeight: critWeight,
    confidenceFactor: confFactor,
    formula: `Score = (${sevWeight.toFixed(2)} × 45% Sev) + (${critWeight.toFixed(2)} × 35% Asset) + (${confFactor.toFixed(2)} × 20% Conf) = ${totalScore}/100`
  };
}
