/**
 * ClaimHeart — agents.js
 * Three LLM agents + orchestration pipeline.
 * All functions attached to window. No module syntax.
 * Uses Groq API (OpenAI-compatible). Key read from window.GROQ_API_KEY.
 */

// ─── Internal helper: call Groq (OpenAI-compatible) ──────────────────────────

async function _callGroq(systemPrompt, userMessage) {
  var apiKey = window.GROQ_API_KEY || '';
  if (!apiKey) {
    throw new Error('window.GROQ_API_KEY is not set.');
  }

  var response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify({
      model:      'meta-llama/llama-4-scout-17b-16e-instruct',
      max_tokens: 1000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage  }
      ]
    })
  });

  if (!response.ok) {
    var errText = await response.text();
    throw new Error('Groq API error ' + response.status + ': ' + errText);
  }

  var data = await response.json();
  var raw  = (data.choices && data.choices[0] && data.choices[0].message)
             ? data.choices[0].message.content
             : '{}';

  // Strip any accidental markdown fences
  raw = raw.trim().replace(/^```[a-z]*\n?/i, '').replace(/```$/, '').trim();

  return JSON.parse(raw);
}

// ─── Helper: format docs for prompt ─────────────────────────────────────────

function _formatDocs(documents) {
  if (!documents || typeof documents !== 'object') return '(no documents provided)';
  return Object.keys(documents).map(function(name) {
    return '=== ' + name + ' ===\n' + documents[name];
  }).join('\n\n');
}

// ─── Agent 1 — Policy RAG ────────────────────────────────────────────────────

window.runPolicyAgent = async function (patientData, documents, caseNumber) {
  try {
    var systemPrompt =
      'You are an insurance policy compliance checker. ' +
      'You will be given patient data including their policy start date, and one or more claim documents. ' +
      'You must check two rules only. ' +
      'Rule 1: if the claim involves general hospitalisation and the policy is less than 24 months old ' +
      'from the policy start date to today (01 April 2026), the claim violates the waiting period and must be flagged. ' +
      'Rule 2: no other policy rules apply for this demo. ' +
      'Return ONLY valid JSON with no markdown, no backticks, with exactly these keys: ' +
      'agentName (string, value "PolicyAgent"), ' +
      'status (string, either "PASS" or "FLAG"), ' +
      'reason (string, one to three sentences explaining your finding), ' +
      'confidence (string, one of "High", "Medium", "Low").';

    var userMessage =
      'Today\'s date is 01 April 2026.\n' +
      'Patient policy start date: ' + (patientData.policyStart || patientData.policyStartDate || 'unknown') + '\n' +
      'Case number: ' + caseNumber + '\n\n' +
      'Documents provided:\n' + _formatDocs(documents);

    var result = await _callGroq(systemPrompt, userMessage);
    result.agentName = 'PolicyAgent';
    return result;

  } catch (err) {
    return {
      agentName:  'PolicyAgent',
      status:     'ERROR',
      reason:     'Policy agent failed: ' + err.message,
      confidence: 'Low'
    };
  }
};

// ─── Agent 2 — Medical Protocol RAG ─────────────────────────────────────────

window.runMedicalAgent = async function (documents, caseNumber) {
  try {
    var systemPrompt =
      'You are a medical protocol compliance checker for insurance claims. ' +
      'You have one rule for this demo: Inj PlateMax IV may be administered a maximum of 2 times ' +
      'within any 24-hour period according to standard dengue treatment protocol. ' +
      'If the billing invoice shows 3 or more administrations of Inj PlateMax IV within a 24-hour period, ' +
      'flag it as fraud. If 2 or fewer administrations are billed, pass it. ' +
      'For Case 1 there is no injection protocol to check — always return PASS for Case 1. ' +
      'Return ONLY valid JSON with no markdown, no backticks, with exactly these keys: ' +
      'agentName (string, value "MedicalAgent"), ' +
      'status (string, either "PASS" or "FLAG"), ' +
      'reason (string, one to three sentences explaining your finding), ' +
      'confidence (string, one of "High", "Medium", "Low").';

    var userMessage =
      'Case number: ' + caseNumber + '\n\n' +
      'Documents provided:\n' + _formatDocs(documents);

    var result = await _callGroq(systemPrompt, userMessage);
    result.agentName = 'MedicalAgent';
    return result;

  } catch (err) {
    return {
      agentName:  'MedicalAgent',
      status:     'ERROR',
      reason:     'Medical agent failed: ' + err.message,
      confidence: 'Low'
    };
  }
};

// ─── Agent 3 — Cross-Validation RAG ─────────────────────────────────────────

window.runCrossValidationAgent = async function (documents, policyResult, medicalResult, caseNumber) {
  try {

    // Case-specific letter guidance injected into the prompt
    var letterGuidance = '';
    if (caseNumber === 1) {
      letterGuidance =
        'IMPORTANT — the decisionLetter MUST: ' +
        'be addressed to Riya Sharma; ' +
        'state the claim is DENIED due to a waiting period violation; ' +
        'cite her policy start date of 25 January 2025 and the request date of 01 April 2026 ' +
        '(only 14 months elapsed, less than the required 24 months); ' +
        'reference policy number HDFC-ERGO-2025-784512. ' +
        'finalDecision MUST be DENIED. ';
    } else if (caseNumber === 2) {
      letterGuidance =
        'IMPORTANT — the decisionLetter MUST: ' +
        'be addressed to City Care Hospital, Mumbai; ' +
        'state the claim is DENIED due to fraudulent billing; ' +
        'cite that Inj PlateMax IV was billed 3 times in one 24-hour period ' +
        '(08:00 AM, 02:00 PM, 09:00 PM on 05 April 2026) against a protocol maximum of 2; ' +
        'reference invoice CCH-INV-2026-003847 and rejected cashless claim of INR 22,150. ' +
        'finalDecision MUST be DENIED. ';
    } else if (caseNumber === 3) {
      letterGuidance =
        'IMPORTANT — the decisionLetter MUST: ' +
        'be addressed to Arjun Mehta; ' +
        'state the claim is APPROVED; ' +
        'confirm 2 administrations of Inj PlateMax IV comply with the dengue protocol; ' +
        'reference invoice CCH-INV-2026-003848; ' +
        'state cashless amount of INR 17,740 is approved for direct settlement with City Care Hospital. ' +
        'finalDecision MUST be APPROVED. ';
    }

    var systemPrompt =
      'You are a cross-validation agent for insurance fraud detection. ' +
      'You will receive the raw claim documents and the findings from two other agents: ' +
      'a Policy Agent and a Medical Agent. ' +
      'Your job is to: ' +
      '(1) Check for contradictions between the prescription and the billing invoice. ' +
      '(2) Identify whether the billing contains items or quantities not supported by the prescription or lab report. ' +
      '(3) Summarise whether the combined findings support approval, denial, or manual review. ' +
      letterGuidance +
      'Return ONLY valid JSON with no markdown, no backticks, with exactly these keys: ' +
      'agentName (string, value "CrossValidationAgent"), ' +
      'status (string, one of "PASS", "FLAG", or "REVIEW"), ' +
      'reason (string, one to three sentences summarising the cross-validation finding), ' +
      'confidence (string, one of "High", "Medium", "Low"), ' +
      'finalDecision (string, exactly one of "APPROVED", "DENIED", or "UNDER_REVIEW"), ' +
      'decisionLetter (string, a formal letter of approximately 150 words with the specific content described above).';

    var userMessage =
      'Case number: ' + caseNumber + '\n\n' +
      'Policy Agent finding:\n' +
      JSON.stringify(policyResult, null, 2) + '\n\n' +
      'Medical Agent finding:\n' +
      JSON.stringify(medicalResult, null, 2) + '\n\n' +
      'Raw documents:\n' + _formatDocs(documents);

    var result = await _callGroq(systemPrompt, userMessage);
    result.agentName = 'CrossValidationAgent';
    return result;

  } catch (err) {
    return {
      agentName:     'CrossValidationAgent',
      status:        'ERROR',
      reason:        'Cross-validation agent failed: ' + err.message,
      confidence:    'Low',
      finalDecision: 'UNDER_REVIEW',
      decisionLetter: 'Unable to generate decision letter due to a system error. Please contact support.'
    };
  }
};

// ─── Orchestrator — Full Pipeline ────────────────────────────────────────────

window.runFullPipeline = async function () {
  try {
    var patient = window.getPatient ? window.getPatient() : null;
    var claim   = window.getClaim   ? window.getClaim()   : null;

    if (!claim) {
      return {
        status:  'ERROR',
        reason:  'No claim found in localStorage. Please select a case in the Hospital Dashboard first.'
      };
    }

    var documents  = claim.documents  || {};
    var caseNumber = claim.caseNumber || 0;

    // Run agents sequentially
    var policyResult  = await window.runPolicyAgent(patient || {}, documents, caseNumber);
    var medicalResult = await window.runMedicalAgent(documents, caseNumber);
    var crossResult   = await window.runCrossValidationAgent(documents, policyResult, medicalResult, caseNumber);

    var bundle = {
      caseNumber:    caseNumber,
      caseLabel:     claim.caseLabel || '',
      patientName:   claim.patientName || (patient ? patient.fullName : ''),
      policyNumber:  claim.policyNumber || (patient ? patient.policyNumber : ''),
      policyResult:  policyResult,
      medicalResult: medicalResult,
      crossResult:   crossResult,
      finalDecision: crossResult.finalDecision || 'UNDER_REVIEW',
      letter:        crossResult.decisionLetter || '',
      completedAt:   new Date().toISOString()
    };

    if (window.saveResult) window.saveResult(bundle);

    // Mirror status onto the claim object
    if (window.saveClaim && claim) {
      var statusMap = {
        'APPROVED':     'Approved',
        'DENIED':       'Denied',
        'UNDER_REVIEW': 'Under Review'
      };
      claim.status = statusMap[bundle.finalDecision] || 'Under Review';
      window.saveClaim(claim);
    }

    return bundle;

  } catch (err) {
    return {
      status: 'ERROR',
      reason: 'Pipeline orchestration failed: ' + err.message
    };
  }
};
