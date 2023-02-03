// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // If the message is to preview an IPFS file
    if (request.action === "previewIpfsFile") {
      const { fileCid, fileName } = request.data;
      // Construct the URL to retrieve the file from the IPFS gateway
      const fileUrl = `https://ipfs.io/ipfs/${fileCid}/${fileName}`;
  
      // Check if the IPFS gateway is available
      fetch(fileUrl)
        .then(response => {
          if (response.ok) {
            // Open a new tab with the file URL
            chrome.tabs.create({ url: fileUrl });
          } else {
            throw new Error("IPFS gateway returned an error");
          }
        })
        .catch(error => {
          // Show an error message in the console
          console.error("Error previewing IPFS file:", error);
          // Notify the user that the IPFS gateway is unavailable
          alert("IPFS gateway is unavailable. Please try again later.");
        });
    }
  });
  