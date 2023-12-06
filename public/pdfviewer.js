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

});
