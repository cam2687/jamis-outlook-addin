export type TemplateData = {
  customer: string;
  siteUrl: string;
  environment: string;
  majorVersion: string;
  updateNumber: string;
  caseNumber: string;
  build: string;
  dbVersion: string;
  downtime: string;
};

/**
 * Generate the reply subject line.
 * Format: RE: [Customer] - Update to [build] Update [#] - [Day], [MM/DD] at [time] ET - Case #[number]
 */
export function generateSubject(data: TemplateData): string {
  const now = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = days[now.getDay()];
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  // Format time as h:mma ET (e.g., "8am", "2:30pm")
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  const timeStr = minutes === 0 ? `${hours}${ampm}` : `${hours}:${String(minutes).padStart(2, "0")}${ampm}`;

  let subject = `RE: ${data.customer} - Update to ${data.build} Update ${data.updateNumber} - ${dayName}, ${month}/${day} at ${timeStr} ET`;

  if (data.caseNumber) {
    subject += `  - Case #${data.caseNumber}`;
  }

  return subject;
}

/**
 * Generate the HTML body matching the exact template from the screenshot.
 */
export function generateBody(data: TemplateData): string {
  const versionLine = `JAMIS Prime ERP v${data.majorVersion}.0 Update ${data.updateNumber}`;
  const buildLine = `Build: ${data.build} | DB Version: ${data.dbVersion}`;

  return `
<div style="font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #000000;">
  <p><strong>JAMIS Prime Update Maintenance Completed</strong><br>
  The scheduled maintenance for your JAMIS Prime environment is now complete, and your site is back online.<br>
  Everything looks good on our end, and you may begin testing the system at your convenience.</p>

  <p><strong>Upgrade Summary:</strong></p>
  <ul style="margin: 0; padding-left: 20px;">
    <li>Environment: ${data.environment}</li>
    <li>Site URL: <a href="${data.siteUrl}">${data.siteUrl}</a></li>
    <li>Current Version: ${versionLine}<br>
    ${buildLine}</li>
    <li>Total Downtime: ${data.downtime}</li>
  </ul>

  <p><strong>Action Required:</strong> Please let us know <strong>immediately</strong> if you encounter any issues or notice anything unexpected.</p>

  <p>Thank you,</p>
</div>`.trim();
}
