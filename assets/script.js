const inputFile = document.querySelector("#file_input");
const inputText = document.getElementById("upload_text");
const copyBtn = document.querySelector(".copy_btn");
const form = document.getElementById("form");
const extractedText = document.querySelector("#extracted_text");
const uploadBtn = document.querySelector("#upload_btn");

inputFile.addEventListener("change", () => {
  inputText.textContent = inputFile?.files[0]?.name || "Unknown";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!inputFile?.files[0]) return;
  try {
    uploadBtn.textContent = "Uploading...";
    const formData = new FormData();
    formData.append("pdf_file", inputFile?.files[0]);
    const res = await fetch("/upload", {
      method: "POST",
      body: formData,
    });
    const text = await res.json();
    extractedText.textContent = text.extracted_text.toString();
    document
      .querySelector(".extracted_text_section")
      .classList.replace("hidden", "visible");
    inputText.textContent = "Upload PDF";
    window.alert("Text extracted successfully");
  } catch (err) {
    window.alert("Extraction failed");
  } finally {
    uploadBtn.textContent = "Upload";
  }
});

copyBtn.addEventListener("click", (e) => {
  navigator.clipboard
    .writeText(extractedText?.textContent || "")
    .then(() => {
      e.target.textContent = "Copied";
      setTimeout(() => (e.target.textContent = "Copy Text"), 2000);
    })
    .catch(() => alert("Failed to copy"));
});
