var viewerElement = document.getElementById("viewer");

var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var filePath = urlParams.get("filePath");

console.log("This is the filepath being loaded: " + filePath);

WebViewer(
  {
    path: "/public/lib",
    initialDoc: filePath,
  },
  viewerElement
).then((instance) => {
  const { documentViewer, annotationManager } = instance.Core;

  instance.setHeaderItems(function (header) {
    header.push({
      type: "actionButton",
      img: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
      onClick: function () {
        saveDocument(filePath).then(function () {
          alert("Annotations saved to the document.");
        });
      },
    });
  });

/*
Created by: Kevin King Yabut
Description: This function saves the document to the temp folder.
*/
  var saveDocument = function (filename) {
    return new Promise(function (resolve) {
      annotationManager.exportAnnotations().then(function (xfdfString) {
        documentViewer
          .getDocument()
          .getFileData({ xfdfString })
          .then(function (data) {
            var arr = new Uint8Array(data);
            var blob = new Blob([arr], { type: "application/pdf" });

            var formData = new FormData();
            formData.append("pdfFile", blob);
            fetch(`/node/annotationHandler.js?filename=${filename}`, {
              method: "POST",
              body: formData,
            }).then(function (res) {
              if (res.status === 200) {
                resolve();
              }
            });
          });
      });
    });
  };


  const remarksInput = document.getElementById("remarks");
  const acceptButton = document.getElementById("acceptpdf-btn");
  acceptButton.addEventListener("click", async () => {
    const confirmAccept = window.confirm("Are you sure you want to accept?");
    if (confirmAccept) {
      const remarks = remarksInput.value.trim(); // Trim to remove leading and trailing whitespaces
      try {
        await saveDocument(filePath);
        await acceptDocument(filePath);

        const response = await fetch('/redirect-to-review-doc', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        await submitRemarks(filePath, remarks);

        if (response.ok) {
          window.location.href = '/review_doc';
        } else {
          console.error('Error redirecting to /review_doc');
        }
      } catch (error) {
        console.error("Error accepting document:", error);
      }
    }
  });

/*
Created by: Dominic Gabriel Ronquillo
Description: This function saves the remarks made by the reviewer
*/
  async function submitRemarks(filePath, remarks) {
    try {
      const response = await fetch('/submitRemarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath, remarks }),
      });

      if (!response.ok) {
        console.error('Error submitting remarks');
      }
    } catch (error) {
      console.error('Error submitting remarks:', error);
    }
  }


  const clearButton = document.getElementById("clearpdf-btn");
  clearButton.addEventListener("click", () => {
    const allAnnotations = annotationManager.getAnnotationsList();
    annotationManager.deleteAnnotations(allAnnotations);
  });

  const backButton = document.getElementById("backpdf-btn");
  backButton.addEventListener("click", async () => {
    const confirmBack = window.confirm("Are you sure you want to go back?");
    if (confirmBack) {
      try {
        const response = await fetch('/redirect-to-review-doc', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          window.location.href = '/review_doc';
        } else {
          console.error('Error redirecting to /review_doc');
        }
      } catch (error) {
        console.error("Error accepting document:", error);
      }
    }
  });

/*
Created by: Kevin King Yabut
Description: This function saves the document to the temp folder.
*/
  const rejectButton = document.getElementById("rejectpdf-btn");
  rejectButton.addEventListener("click", async () => {
    const confirmReject = window.confirm("Are you sure you want to reject?");
    if (confirmReject) {
      try {
        await saveDocument(filePath);
        await rejectDocument(filePath);

        const response = await fetch('/redirect-to-review-doc', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          window.location.href = '/review_doc';
        } else {
          console.error('Error redirecting to /review_doc');
        }
      } catch (error) {
        console.error("Error rejecting document:", error);
      }
    }
  });

/*
Created by: Dominic Gabriel O. Ronquillo
Description: Sends a request to the server to reject a document.
*/
  async function rejectDocument(filePath) {
    const response = await fetch("/rejectDocument", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath }),
    });

    const data = await response.json();
    console.log("Reject document response:", data);
  }

/*
Created by: Dominic Gabriel O. Ronquillo
Description: Sends a request to the server to accept a document.
*/
  async function acceptDocument(filePath) {
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

/*
Created by: Dominic Gabriel O. Ronquillo
Description: Sends a request to the server to receive remarks.
*/
async function retrieveRemarks(filePath) {
  try {
    const response = await fetch('/retrieveRemarks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filePath }),
    });

    if (response.ok) {
      const data = await response.json();

      if (data && typeof data.remarks !== 'undefined') {
        const displayRemarksDiv = document.getElementById("displayRemarks");
        displayRemarksDiv.textContent = `Remarks: ${data.remarks !== null ? data.remarks : 'No remarks'}`;
      } else {
        console.error('Invalid response format:', data);
      }
    } else {
      console.error('Error retrieving remarks. Status:', response.status);
    }
  } catch (error) {
    console.error('Error retrieving remarks:', error);
  }
}


retrieveRemarks(filePath)