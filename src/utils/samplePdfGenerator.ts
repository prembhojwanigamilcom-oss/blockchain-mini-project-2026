/**
 * Generates sample academic marksheets for demonstration and testing.
 */

export function downloadSampleMarksheet(studentName: string, rollNumber: string, course: string, session: string) {
  // Create an authentic-looking academic marksheet HTML document that users can save as PDF or print
  const marksheetHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Academic Marksheet - ${studentName}</title>
  <style>
    body { font-family: 'Times New Roman', serif; margin: 40px; color: #182C2A; background: #FAF9F5; }
    .border-container { border: 3px double #9C815D; padding: 30px; position: relative; }
    .header { text-align: center; border-bottom: 2px solid #182C2A; padding-bottom: 15px; margin-bottom: 25px; }
    .univ-title { font-size: 26px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }
    .sub-title { font-size: 14px; font-style: italic; margin-top: 5px; color: #555; }
    .doc-title { font-size: 20px; font-weight: bold; margin-top: 15px; text-decoration: underline; }
    .info-table { width: 100%; margin-bottom: 25px; font-size: 14px; }
    .info-table td { padding: 6px 4px; }
    .grades-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
    .grades-table th, .grades-table td { border: 1px solid #182C2A; padding: 8px 10px; text-align: left; }
    .grades-table th { background: #F3F0E8; text-transform: uppercase; font-size: 12px; }
    .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 13px; }
    .seal { width: 90px; height: 90px; border: 2px dashed #9C815D; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; color: #9C815D; text-align: center; margin: 0 auto; }
    .auth-box { border: 1px solid #D8D2C5; padding: 10px; font-family: monospace; font-size: 11px; margin-top: 25px; background: #F3F0E8; }
  </style>
</head>
<body>
  <div class="border-container">
    <div class="header">
      <div class="univ-title">Metropolitan Institute of Technology & Sciences</div>
      <div class="sub-title">Autonomous Institution • Accredited with 'A++' Grade</div>
      <div class="doc-title">OFFICIAL GRADE REPORT & MARKSHEET</div>
    </div>

    <table class="info-table">
      <tr>
        <td><strong>Student Name:</strong> ${studentName}</td>
        <td><strong>Roll Number:</strong> ${rollNumber}</td>
      </tr>
      <tr>
        <td><strong>Degree / Program:</strong> ${course}</td>
        <td><strong>Academic Session:</strong> ${session}</td>
      </tr>
      <tr>
        <td><strong>Semester:</strong> VIII (Final)</td>
        <td><strong>Examination Month:</strong> May 2026</td>
      </tr>
    </table>

    <table class="grades-table">
      <thead>
        <tr>
          <th>Course Code</th>
          <th>Course Title</th>
          <th>Credits</th>
          <th>Grade</th>
          <th>Performance</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>CS-801</td>
          <td>Blockchain Application Development & Smart Contracts</td>
          <td>4</td>
          <td>A+</td>
          <td>Outstanding</td>
        </tr>
        <tr>
          <td>CS-802</td>
          <td>Applied Cryptography & Zero-Knowledge Proofs</td>
          <td>4</td>
          <td>A+</td>
          <td>Outstanding</td>
        </tr>
        <tr>
          <td>CS-803</td>
          <td>Decentralized Finance & Consensus Protocols</td>
          <td>3</td>
          <td>A</td>
          <td>Excellent</td>
        </tr>
        <tr>
          <td>CS-804</td>
          <td>Distributed Systems & Peer-to-Peer Networks</td>
          <td>3</td>
          <td>A</td>
          <td>Excellent</td>
        </tr>
        <tr>
          <td>CS-805</td>
          <td>Major Capstone Project: VERITAS Verification Engine</td>
          <td>6</td>
          <td>O</td>
          <td>Exceptional</td>
        </tr>
      </tbody>
    </table>

    <div style="font-size: 14px; margin-bottom: 25px;">
      <strong>Cumulative Grade Point Average (CGPA):</strong> 9.85 / 10.00 &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Result:</strong> FIRST CLASS WITH DISTINCTION
    </div>

    <div class="footer">
      <div style="text-align: center;">
        <div>________________________</div>
        <div style="margin-top: 5px;">Controller of Examinations</div>
      </div>
      <div class="seal">
        OFFICIAL<br>UNIVERSITY<br>SEAL
      </div>
      <div style="text-align: center;">
        <div>________________________</div>
        <div style="margin-top: 5px;">Dean of Academic Affairs</div>
      </div>
    </div>

    <div class="auth-box">
      <strong>VERITAS Blockchain Verification Note:</strong><br>
      This document's binary payload is registered on the Ethereum Blockchain. Verify authentic status by uploading this file to the VERITAS public portal.
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([marksheetHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Official_Marksheet_${rollNumber}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
