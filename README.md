# ThreatPulse AI

> **Intelligent Cyber Threat Detection & Investigation Platform**  
> *Security Operations Center (SOC) Console — Checkpoint 1: Frontend UI*

---

## Overview

**ThreatPulse AI** is a Security Operations Center (SOC) platform designed for real-time cyber threat detection, triage, and multi-stage attack storyline correlation. 

This repository currently houses **Checkpoint 1: Frontend UI**, delivering a dark-navy/charcoal cybersecurity dashboard engineered with React 18, TypeScript, Vite, and Tailwind CSS.

> [!NOTE]
> **Checkpoint 1 Scope — Frontend Demonstration Mode**  
> All security telemetry, events, anomaly scores, and attack sequences displayed in Checkpoint 1 are **synthetic and simulated** for interface and workflow validation. No active background network scanning, destructive remediation commands, or live AI model serving are executed in this checkpoint. Checkpoint 2 will integrate the live FastAPI backend.

---

## Design System & UX Standards

- **Color Palette**:
  - Background: Dark Charcoal & Deep Navy (`#0B0F17`, `#0E1626`, `#111A2D`)
  - Accent: Professional Cyan (`#06B6D4`, `#0891B2`)
  - Status Indicators: Restrained Critical Red (`#EF4444`), Warning Amber (`#F59E0B`), and Nominal Green (`#10B981`)
- **Typography**: Clean monospace fonts (`JetBrains Mono` / `monospace`) for hashes, IPs, and identifiers; high-legibility sans-serif (`Inter`) for analysis notes.
- **Icons**: Lucide React vector icons.
- **Layout**: Desktop-first responsive layout with persistent, collapsible sidebar navigation.
- **Interactivity**: Every visible button triggers a real action (filtering, modal inspection, simulated execution ledger updates, or simulation event generation).

---

## Completed Pages & Modules

| # | Page / Module | Key Features & Implementation |
|---|---|---|
| **A** | **Overview Dashboard** | Real-time KPI metrics (Total Events: 1,428, Active Incidents: 4, Critical Alerts: 1, Nominal Status), 1-Hour Telemetry Volume trend bar chart, Incident Severity Distribution, Top Asset Risk summary, and Recent Events feed. |
| **B** | **Live Threat Monitor** | Searchable security event table, multi-faceted filtering by Severity, Attack Type, and Status, interactive event details drawer with raw payload inspector, and "Simulate Stream Event" injector. |
| **C** | **Incidents Management** | Triage table with P1, P2, P3, and P4 priority filters, AI confidence meters, status updating workflow (Active, Investigating, Contained, Resolved), and deep-dive incident modal with playbook cross-linking. |
| **D** | **Attack Storyline** | Visual 4-stage progression sequence: `Port Scan` &rarr; `Failed Login Attempts` &rarr; `Suspicious Login` &rarr; `Privilege Change`. Connecting directional arrows, forensic timestamps, extracted IoC indicators, and explicit non-factual inference disclaimers. |
| **E** | **Detection Lab** | Dual-section proving ground for **Known Attack Detection** (AST parser & rule signatures) and **Anomaly Detection** (Isolation Forest & Autoencoder models). Covers Brute Force, Port Scan, SQL Injection, and DDoS with simulated test-vector harness. |
| **F** | **MITRE ATT&CK® Mapping** | Techniques mapped against observed heuristics, prominently highlighting **T1110 (Brute Force)** and **T1046 (Network Service Discovery)**, with explicit "Suggested" and "Illustrative" mapping tags. |
| **G** | **Asset Inventory** | Comprehensive fleet overview covering Production, Staging, and Development assets. Displays Hostname, IP, Enclave, Criticality, Risk Exposure Index (0–100), and connected incident correlation. |
| **H** | **Response Playbooks** | Suggested defensive mitigations with blast radius and disruption analysis. Features mandatory **Analyst Review Step**, approval workflow (`Pending Review` &rarr; `Approved` &rarr; `Executed (Simulated)`), with zero destructive commands. |
| **I** | **Detection Quality** | Quality and observability metrics: Precision (94.2%), Recall (91.8%), False-Positive Rate (2.1%), and Detection Latency (142 ms p95), accompanied by a 2,500-sample evaluation confusion matrix. |

---

## Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or later (tested on `v24.21.0`)
- **npm**: `v9.0.0` or later (tested on `v12.0.2`)

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/priyanshuYadav88/404-Founders_HK26-0011.git
   cd 404-Founders_HK26-0011
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser to [http://localhost:5173](http://localhost:5173).

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build locally**:
   ```bash
   npm run preview
   ```

---

## Project Structure

```
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── test.py                  # Preserved from initial commit
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── App.tsx              # Root app coordinator & page router
    ├── index.css            # Tailwind base directives & dark scrollbars
    ├── main.tsx             # React entry point
    ├── types/
    │   └── index.ts         # TypeScript interfaces & domain models
    ├── data/
    │   └── mockData.ts      # Structured synthetic SOC telemetry
    └── components/
        ├── common/
        │   ├── Badge.tsx         # Severity & status badge tags
        │   ├── DemoBanner.tsx    # Persistent simulation banner
        │   ├── MetricCard.tsx    # SOC KPI card with trend indicator
        │   └── Modal.tsx         # Accessible dialog for incident/playbook reviews
        ├── layout/
        │   ├── Header.tsx        # Top status bar with live UTC clock & refresh
        │   └── Sidebar.tsx       # Collapsible persistent navigation with 9 pages
        └── pages/
            ├── OverviewPage.tsx         # Page A: High-level SOC cockpit
            ├── LiveMonitorPage.tsx      # Page B: Telemetry buffer & search
            ├── IncidentsPage.tsx        # Page C: Incident triage & P1-P4 filters
            ├── AttackStorylinePage.tsx  # Page D: 4-stage progression chain
            ├── DetectionLabPage.tsx     # Page E: Known attack & anomaly ML lab
            ├── MitreAttackPage.tsx      # Page F: MITRE ATT&CK technique matrix
            ├── AssetInventoryPage.tsx   # Page G: Defended assets & posture
            ├── PlaybooksPage.tsx        # Page H: Defensive response approval
            └── DetectionQualityPage.tsx # Page I: Pipeline accuracy & latency
```

---

## Checkpoint 2 Roadmap: Backend Integration

The following components are scheduled for **Checkpoint 2**:
1. **FastAPI Detection Engine**: Python backend implementing real-time syslog and NetFlow ingestion.
2. **WebSocket Telemetry Stream**: Bidirectional channel replacing synthetic client timers with live event feeds.
3. **ML Inference Pipeline**: Live scoring models (Isolation Forest, autoencoder anomaly detectors, and regex-based AST parsers).
4. **MITRE ATT&CK Verification**: Cryptographic evidence attachment to elevate "Suggested" mappings into verified detections.
5. **Secure Execution Gateway**: Sandboxed API connector for actual firewall rule and security group dispatch.
