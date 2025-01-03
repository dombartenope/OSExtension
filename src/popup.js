// REGEX FOR VALIDATION
const uuid_re =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const email_re = /@.{1,}/;

const form = document.querySelector("#form");
const input = document.querySelector("#id");
const output = document.querySelector("#output");
const select = document.querySelector(".selector"); // Now has only one option: "Input"
const emailURL = "https://dashboard.onesignal.com/super-user?email=";
const uuidURL = "https://dashboard.onesignal.com/super-user/identify?search=";

form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Evaluate user input against both regex patterns
  const uuid_ok = uuid_re.test(input.value);
  const email_ok = email_re.test(input.value);

  console.log("Searching for input on submit");

  // First, check UUID
  if (uuid_ok) {
    output.textContent = "UUID Validated, one moment...";
    window.open(`${uuidURL}${input.value}`);
  }
  // If not a UUID, check Email
  else if (email_ok) {
    output.textContent = "Email Validated, one moment...";
    window.open(`${emailURL}${input.value}`);
  }
  // Otherwise, report invalid input
  else {
    output.textContent = "Invalid input!";
    console.log("Validation Error");
  }
});
