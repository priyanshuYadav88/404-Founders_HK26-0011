# ThreatPulse AI

> **Intelligent Cyber Threat Detection & Investigation Platform**  
> *Security Operations Center (SOC) Console — Interactive In-Browser Prototype*

---

## Quick Hackathon Demo Instructions (Under 2 Minutes)

### 1. Launch the Application
```bash
# Start local Vite development server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 2. Demonstrate the End-to-End Threat Lifecycle (3-Step Demo)

1. **Simulate Live Threat Detection**:
   - In the top **Demo Controls** bar, click **"Simulate Event"** or click **"+ SQLi" / "+ Failed Login"** on the **Live Threat Monitor** page.
   - Notice the **Live Threat Monitor** immediately ingests the event, runs the local rule engine (`RULE-APP-003`, `RULE-AUTH-001`, `RULE-NET-002`, `RULE-VOL-004`, or `RULE-PRIV-005`), explains **why the rule triggered**, and computes the **multi-factor Risk Score (Severity × Criticality × Confidence)**.

2. **Inspect Correlated Incidents & Storyline**:
   - Navigate to **Incidents**: Notice high-severity detections automatically promoted to correlated incidents (e.g., P1/P2) with auto-assigned playbooks and target host attribution.
   - Navigate to **Attack Storyline**: Observe the 4-stage progression (`Port Scan` &rarr; `Failed Login` &rarr; `Suspicious Login` &rarr; `Privilege Change`). Click any node to see live matched telemetry from the demo buffer.

3. **Execute Defensive Playbook & Review Quality**:
   - Navigate to **Response Playbooks**: Click **"Review Step & Details"**, authorize the action, and click **"Execute (Simulated)"** to observe the containment workflow.
   - Navigate to **Detection Quality**: Watch Precision (PPV), Recall (Sensitivity), and False-Positive Rate update dynamically from the event buffer.
   - In the top bar, click **"Streaming ON"** to let the demo generate simulated traffic automatically during presentations, or click **"Reset"** to return to baseline.

---

## Technical Architecture & In-Browser Engine

- **Framework**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Rule Engine (`src/services/detectionEngine.ts`)**:
  - `RULE-AUTH-001`: High-velocity authentication failure heuristic with sliding window.
  - `RULE-NET-002`: Half-open TCP SYN port sweep classifier.
  - `RULE-APP-003`: AST token pattern matcher for SQL injection tautologies.
  - `RULE-VOL-004`: Volumetric traffic deviation and rapid stream reset anomaly detector.
  - `RULE-PRIV-005`: File integrity and unauthorized sudoers elevation monitor.
- **Multi-Factor Risk Scoring**:
  $$\text{Risk Score} = (0.45 \times \text{Severity Weight} + 0.35 \times \text{Asset Criticality} + 0.20 \times \text{Confidence}) \times 100$$
- **Local Persistence**: State automatically persists across page refreshes via `localStorage` and can be reset with the top **"Reset"** button.

---

## Build Verification

```bash
# Compile TypeScript and generate production distribution
npm run build

# Preview production build locally
npm run preview
```
Production build compiles with 0 errors in under 4 seconds.
