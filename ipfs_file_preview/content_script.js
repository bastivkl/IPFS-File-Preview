// Inject IPFS.js library
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

// Add event listener to all links in the page
document.addEventListener("click", async (event) => {
  const target = event.target;
  if (target.tagName !== "A") return;

  // Check if the link is an IPFS link
  const link = target.href;
  if (!link.startsWith("https://ipfs.io/ipfs/") && !link.startsWith("https://ipfs.infura.io/ipfs/")) return;

  // Prevent default link behavior
  event.preventDefault();

  // Extract the IPFS hash from the link
  const hash = link.split("/ipfs/")[1];

  // Get the IPFS file using IPFS.js
  const file = await ipfs.cat(hash);

  // Preview the file based on its type
  switch (file.contentType) {
    case "image/jpeg":
    case "image/png":
    case "image/gif":
      previewImage(hash);
      break;
    case "application/pdf":
      previewPdf(hash);
      break;
    default:
      previewText(hash);
      break;
  }
});

// Preview an image file
const previewImage = (hash) => {
  const img = document.createElement("img");
  img.src = `https://ipfs.infura.io/ipfs/${hash}`;
  img.style.maxWidth = "100%";
  img.style.maxHeight = "100%";
  showPreview(img);
};

// Preview a PDF file
const previewPdf = (hash) => {
  const iframe = document.createElement("iframe");
  iframe.src = `https://ipfs.io/ipfs/${hash}`;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  showPreview(iframe);
};

// Preview a text file
const previewText = async (hash) => {
  const text = await ipfs.cat(hash);
  const pre = document.createElement("pre");
  pre.textContent = text;
  showPreview(pre);
};

// Show the preview
const showPreview = (element) => {
  const preview = document.createElement("div");
  preview.style.position = "fixed";
  preview.style.top = "0";
  preview.style.left = "0";
  preview.style.width = "100%";
  preview.style.height = "100%";
  preview.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  preview.style.zIndex = "99999999";
  preview.appendChild(element);
  document.body.appendChild(preview);
};
