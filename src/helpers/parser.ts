export type ParsedEmail = {
  customer: string;
  siteUrl: string;
  environment: string;
  majorVersion: string;
  updateNumber: string;
  caseNumber: string;
};

export function parseEmail(subject: string, body: string): ParsedEmail {
  const result: ParsedEmail = {
    customer: "",
    siteUrl: "",
    environment: "Production",
    majorVersion: "",
    updateNumber: "",
    caseNumber: "",
  };

  // Customer: everything before first " - " in subject
  const customerMatch = subject.match(/^(.+?)\s*-\s/);
  if (customerMatch) {
    result.customer = customerMatch[1].trim();
  }

  // Site URL: look for jamisprime.com URLs in body
  const urlMatch = body.match(/https?:\/\/[\w.-]+\.jamisprime\.com/i);
  if (urlMatch) {
    result.siteUrl = urlMatch[0];
  }

  // Version + Update number from subject
  // e.g., "v8.0_20251107.1 Update 15" or "9.0_20260108.2 Update 4"
  const versionMatch = subject.match(/v?(\d+)\.\d+_\S+\s+Update\s+(\d+)/i);
  if (versionMatch) {
    result.majorVersion = versionMatch[1];
    result.updateNumber = versionMatch[2];
  }

  // Environment: check for TEST in subject (case-insensitive)
  // Default is Production unless TEST is found
  if (/\bTEST\b/i.test(subject) || /\bCreate\s+.*TEST/i.test(subject)) {
    result.environment = "TEST";
  }

  // Case number from subject: "Case #086703" or "Case #86703"
  const caseMatch = subject.match(/Case\s*#?\s*(\d+)/i);
  if (caseMatch) {
    result.caseNumber = caseMatch[1];
  }

  return result;
}
