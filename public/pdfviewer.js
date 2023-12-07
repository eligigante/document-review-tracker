var viewerElement = document.getElementById("viewer");

var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var filePath = urlParams.get("filePath");

console.log("This is the filepath being loaded: " + filePath);

WebViewer(
  {
    initialDoc: filePath,
  },
  viewerElement
).then((instance) => {
  const acceptButton = document.getElementById("accept-btn");
  acceptButton.addEventListener("click", () => {
    // Display a confirmation pop-up
    const confirmAccept = window.confirm("Are you sure you want to accept?");
    if (confirmAccept) {
      acceptDocument(filePath);
    }
  });

  function acceptDocument(filePath) {
    fetch("/acceptDocument", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Accept document response:", data);
      })
      .catch((error) => {
        console.error("Error accepting document:", error);
      });
  }
});
