import "./taskpane.css";
import { parseEmail } from "../helpers/parser";
import { getBuildForVersion, getDbVersionForVersion } from "../helpers/config";
import { generateSubject, generateBody, type TemplateData } from "../helpers/template";

// DOM Elements
const loadingEl = document.getElementById("loading")!;
const formEl = document.getElementById("form")!;
const successEl = document.getElementById("success")!;
const errorEl = document.getElementById("error")!;

const customerInput = document.getElementById("customer") as HTMLInputElement;
const siteUrlInput = document.getElementById("siteUrl") as HTMLInputElement;
const environmentSelect = document.getElementById("environment") as HTMLSelectElement;
const updateNumberInput = document.getElementById("updateNumber") as HTMLInputElement;
const caseNumberInput = document.getElementById("caseNumber") as HTMLInputElement;
const buildInput = document.getElementById("build") as HTMLInputElement;
const dbVersionInput = document.getElementById("dbVersion") as HTMLInputElement;
const downtimeInput = document.getElementById("downtime") as HTMLInputElement;

const generateBtn = document.getElementById("generateBtn") as HTMLButtonElement;
const reParseBtn = document.getElementById("reParseBtn") as HTMLButtonElement;
const resetBtn = document.getElementById("resetBtn") as HTMLButtonElement;

let currentMajorVersion = "";

Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    readAndParseEmail();
  }
});

function readAndParseEmail(): void {
  showLoading();

  const item = Office.context.mailbox.item;
  if (!item) {
    showError("No email selected.");
    showForm();
    return;
  }

  const subject = item.subject || "";

  item.body.getAsync(Office.CoercionType.Text, (result: Office.AsyncResult<string>) => {
    if (result.status !== Office.AsyncResultStatus.Succeeded) {
      showError("Could not read email body.");
      showForm();
      return;
    }

    const body = result.value || "";
    const parsed = parseEmail(subject, body);

    // Fill form fields
    customerInput.value = parsed.customer;
    siteUrlInput.value = parsed.siteUrl;
    environmentSelect.value = parsed.environment;
    updateNumberInput.value = parsed.updateNumber;
    caseNumberInput.value = parsed.caseNumber;

    // Lookup build and DB version
    currentMajorVersion = parsed.majorVersion;
    buildInput.value = getBuildForVersion(parsed.majorVersion);
    dbVersionInput.value = getDbVersionForVersion(parsed.majorVersion);

    showForm();
  });
}

function getFormData(): TemplateData {
  return {
    customer: customerInput.value.trim(),
    siteUrl: siteUrlInput.value.trim(),
    environment: environmentSelect.value,
    majorVersion: currentMajorVersion || "9",
    updateNumber: updateNumberInput.value.trim(),
    caseNumber: caseNumberInput.value.trim(),
    build: buildInput.value.trim(),
    dbVersion: dbVersionInput.value.trim(),
    downtime: downtimeInput.value.trim(),
  };
}

function handleGenerate(): void {
  hideError();

  const data = getFormData();

  // Validate required fields
  if (!data.customer) return showError("Customer is required.");
  if (!data.siteUrl) return showError("Site URL is required.");
  if (!data.updateNumber) return showError("Update # is required.");
  if (!data.build) return showError("Build is required.");
  if (!data.downtime) return showError("Total Downtime is required.");

  const htmlBody = generateBody(data);
  const subject = generateSubject(data);

  const item = Office.context.mailbox.item;
  if (!item) {
    showError("No email selected.");
    return;
  }

  // Use displayReplyAllForm to compose Reply All with the template
  (item as Office.MessageRead).displayReplyAllForm({
    htmlBody: htmlBody,
  });

  // Show success
  formEl.classList.add("hidden");
  successEl.classList.remove("hidden");

  // Log the generated subject for user to copy if needed
  console.log("Generated subject:", subject);
}

// Event listeners
generateBtn.addEventListener("click", handleGenerate);
reParseBtn.addEventListener("click", () => {
  hideError();
  readAndParseEmail();
});
resetBtn.addEventListener("click", () => {
  successEl.classList.add("hidden");
  readAndParseEmail();
});

// UI helpers
function showLoading(): void {
  loadingEl.classList.remove("hidden");
  formEl.classList.add("hidden");
  successEl.classList.add("hidden");
}

function showForm(): void {
  loadingEl.classList.add("hidden");
  formEl.classList.remove("hidden");
}

function showError(msg: string): void {
  errorEl.textContent = msg;
  errorEl.classList.remove("hidden");
}

function hideError(): void {
  errorEl.classList.add("hidden");
}
