var viewerElement = document.getElementById("viewer");

var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var filePath = urlParams.get("filePath");

console.log("This is the filepath being loaded: " + filePath);

WebViewer(
  {
    path: "/lib",
    initialDoc: filePath,
  },
  viewerElement
).then((instance) => {
  const {documentViewer, annotationManager} = instance.Core;

  instance.setHeaderItems(function(header) {
    header.push({
      type: 'actionButton',
      img: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
      onClick: function() {
     
        saveDocument(filePath).then(function() {
          alert('Annotations saved to the document.');
        });
      }
    
  });
});


  var saveDocument = function(filename) {
    return new Promise(function(resolve) {
      annotationManager.exportAnnotations().then(function(xfdfString) {
        documentViewer.getDocument().getFileData({ xfdfString }).then(function(data) {
          var arr = new Uint8Array(data);
          var blob = new Blob([ arr ], { type: 'application/pdf' });
   
          var formData = new FormData();
          formData.append('blob', blob);
          fetch(`/node/annotationHandler.js?filename=${filename}`, {
            method: 'POST',
            body: formData
          }).then(function(res) {
            if (res.status === 200) {
              resolve();
            }
          });
        });
      });
    });
  };
  
  const acceptButton = document.getElementById("accept-btn");
  acceptButton.addEventListener("click", () => {
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
