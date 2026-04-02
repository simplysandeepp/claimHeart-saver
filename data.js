/**
 * ClaimHeart — data.js
 * Shared synthetic document data and localStorage helpers.
 * Everything is attached to window so all pages can access it without modules.
 */

// ─── API Key Bootstrap ────────────────────────────────────────────────────────
// Read once on page load so agents.js can use window.GROQ_API_KEY anywhere.
window.GROQ_API_KEY = localStorage.getItem('claimheart_api_key') || 'YOUR_GROQ_API';

// ─── Synthetic Documents ──────────────────────────────────────────────────────

window.SYNTHETIC_DATA = {

  preAuthForm: `PRE-AUTHORISATION REQUEST FORM
Hospital Medical Claims Adjudication System

--- PATIENT INFORMATION ---
Patient Name       : Riya Sharma
Policy Number      : HDFC-ERGO-2025-784512
Policy Start Date  : 25 January 2025

--- HOSPITAL INFORMATION ---
Hospital Name      : City Care Hospital, Mumbai
Registration No.   : MH-2019-HC-00472

--- REQUEST DETAILS ---
Date of Request    : 01 April 2026
Proposed Admission : 02 April 2026
Ward Type          : General Ward
Estimated Cost     : INR 28,000

--- CLINICAL INFORMATION ---
Diagnosis          : Acute Febrile Illness
ICD-10 Code        : R50.9
Attending Doctor   : Dr Priya Menon
MCI Registration   : MCI-2014-88721

--- DECLARATION ---
We hereby request pre-authorisation for the above-mentioned patient's hospitalisation
under the specified policy. All clinical information provided is accurate to the best
of our knowledge.

Authorised Signatory: _______________________
Hospital Stamp:       [City Care Hospital, Mumbai — MH-2019-HC-00472]`,

  denguePrescription: `PRESCRIPTION
City Care Hospital, Mumbai | MH-2019-HC-00472
Date: 05 April 2026

--- PATIENT INFORMATION ---
Patient Name   : Arjun Mehta
Age / Gender   : 32 years / Male
OPD Number     : CCH-OPD-2026-09341

--- DIAGNOSIS ---
Dengue Fever with Thrombocytopenia
ICD-10 Code: A97.1

--- MEDICINES PRESCRIBED ---
1. Paracetamol 650 mg
   Dosage   : Three times daily (TDS)
   Duration : 5 days
   Route    : Oral

2. Electral Syrup 200 ml
   Dosage   : Twice daily (BD)
   Duration : 5 days
   Route    : Oral

3. Inj. PlateMax IV
   Dosage   : One vial per administration
   Frequency: As per dengue platelet protocol (refer billing)
   Route    : Intravenous

4. Pantoprazole 40 mg
   Dosage   : Once daily (OD)
   Duration : 5 days
   Route    : Oral

--- DOCTOR INFORMATION ---
Dr Rakesh Iyer
MBBS, MD (Internal Medicine)
MCI Registration: MCI-2011-44892
City Care Hospital, Mumbai

Signature: ___________________    Date: 05 April 2026`,

  plateletReport: `LABORATORY REPORT
Metro Diagnostics
NABL Accredited Laboratory | Reg. No. MH-LAB-2018-00234

Date of Collection : 05 April 2026
Date of Report     : 05 April 2026

--- PATIENT INFORMATION ---
Patient Name       : Arjun Mehta
Referred By        : Dr Rakesh Iyer, City Care Hospital, Mumbai

--- COMPLETE BLOOD COUNT (CBC) ---
Test                    Result              Reference Range      Flag
---------------------------------------------------------------------------
Haemoglobin             13.2 g/dL           13.0 – 17.0 g/dL     NORMAL
Total WBC Count         3,200 cells/mcL     4,000 – 11,000       LOW
Platelet Count          68,000 /mcL         1,50,000 – 4,00,000  CRITICALLY LOW
Haematocrit (PCV)       41%                 40 – 54%             NORMAL

--- DENGUE SEROLOGY ---
Test                    Result
------------------------------------------
NS1 Antigen             POSITIVE
IgM Anti-Dengue         POSITIVE
IgG Anti-Dengue         NEGATIVE

--- REMARKS ---
Platelet count is critically low. Immediate clinical supervision is strongly
recommended. Results are consistent with acute primary dengue fever.
Please correlate clinically.

Authorised By: Dr Sunita Rao, MD Pathology
Lab Stamp: [Metro Diagnostics — MH-LAB-2018-00234]`,

  billingFraud: `HOSPITAL BILLING INVOICE
City Care Hospital, Mumbai | MH-2019-HC-00472
Invoice No.    : CCH-INV-2026-003847
Invoice Date   : 06 April 2026

--- PATIENT INFORMATION ---
Patient Name   : Arjun Mehta
IP Number      : CCH-IP-2026-00892
Policy Number  : HDFC-ERGO-2025-991203
Admission Date : 05 April 2026
Discharge Date : 06 April 2026

--- ITEMISED BILLING ---
Sl.  Description                                  Qty   Unit Rate   Amount (INR)
---------------------------------------------------------------------------------
1.   Room Charges — General Ward (1 night)          1     2,500.00     2,500.00
2.   Doctor Consultation                            2       700.00     1,400.00
3.   Nursing Charges                                1       800.00       800.00
4.   IV Fluids NS 500 ml                            3       300.00       900.00
5.   Paracetamol 650 mg (tablet)                   15        15.00       225.00
6.   Pantoprazole 40 mg (tablet)                    2        40.00        80.00
7.   Electral Syrup 200 ml                          2        70.00       140.00
8.   Inj. PlateMax IV — Admin 1 (05 Apr, 08:00 AM)  1     4,200.00     4,200.00
9.   Inj. PlateMax IV — Admin 2 (05 Apr, 02:00 PM)  1     4,200.00     4,200.00
10.  Inj. PlateMax IV — Admin 3 (05 Apr, 09:00 PM)  1     4,200.00     4,200.00
11.  Diagnostic Tests (Outsourced — Metro Diagnostics)1   1,800.00     1,800.00
12.  Consumables                                    1       650.00       650.00
---------------------------------------------------------------------------------
                                          Sub-Total (INR)              21,095.00
                                          GST @ 5%                      1,055.00
                                          GRAND TOTAL (INR)            22,150.00

Cashless Claim Amount Requested: INR 22,150
Authorised Signatory: _______________________
Hospital Stamp: [City Care Hospital, Mumbai — MH-2019-HC-00472]`,

  billingClean: `HOSPITAL BILLING INVOICE
City Care Hospital, Mumbai | MH-2019-HC-00472
Invoice No.    : CCH-INV-2026-003848
Invoice Date   : 06 April 2026

--- PATIENT INFORMATION ---
Patient Name   : Arjun Mehta
IP Number      : CCH-IP-2026-00892
Policy Number  : HDFC-ERGO-2025-991203
Admission Date : 05 April 2026
Discharge Date : 06 April 2026

--- ITEMISED BILLING ---
Sl.  Description                                  Qty   Unit Rate   Amount (INR)
---------------------------------------------------------------------------------
1.   Room Charges — General Ward (1 night)          1     2,500.00     2,500.00
2.   Doctor Consultation                            2       700.00     1,400.00
3.   Nursing Charges                                1       800.00       800.00
4.   IV Fluids NS 500 ml                            3       300.00       900.00
5.   Paracetamol 650 mg (tablet)                   15        15.00       225.00
6.   Pantoprazole 40 mg (tablet)                    2        40.00        80.00
7.   Electral Syrup 200 ml                          2        70.00       140.00
8.   Inj. PlateMax IV — Admin 1 (05 Apr, 08:00 AM)  1     4,200.00     4,200.00
9.   Inj. PlateMax IV — Admin 2 (05 Apr, 02:00 PM)  1     4,200.00     4,200.00
11.  Diagnostic Tests (Outsourced — Metro Diagnostics)1   1,800.00     1,800.00
12.  Consumables                                    1       650.00       650.00
---------------------------------------------------------------------------------
                                          Sub-Total (INR)              16,895.00
                                          GST @ 5%                        845.00
                                          GRAND TOTAL (INR)            17,740.00

Cashless Claim Amount Requested: INR 17,740
Authorised Signatory: _______________________
Hospital Stamp: [City Care Hospital, Mumbai — MH-2019-HC-00472]`

};

// ─── localStorage Helpers ─────────────────────────────────────────────────────

/** Save a patient profile object to localStorage. */
window.savePatient = function (data) {
  localStorage.setItem('claimheart_patient', JSON.stringify(data));
};

/** Retrieve the patient profile from localStorage, or null if absent. */
window.getPatient = function () {
  const raw = localStorage.getItem('claimheart_patient');
  return raw ? JSON.parse(raw) : null;
};

/** Save the current claim object to localStorage. */
window.saveClaim = function (data) {
  localStorage.setItem('claimheart_current_claim', JSON.stringify(data));
};

/** Retrieve the current claim from localStorage, or null if absent. */
window.getClaim = function () {
  const raw = localStorage.getItem('claimheart_current_claim');
  return raw ? JSON.parse(raw) : null;
};

/** Save an adjudication result object to localStorage. */
window.saveResult = function (data) {
  localStorage.setItem('claimheart_result', JSON.stringify(data));
};

/** Retrieve the adjudication result from localStorage, or null if absent. */
window.getResult = function () {
  const raw = localStorage.getItem('claimheart_result');
  return raw ? JSON.parse(raw) : null;
};
