import WebViewer from "../@pdftron/webviewer";

var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var filePath = urlParams.get('filePath');

console.log("This is the filepath being loaded: " + filePath)
document.getElementById("viewer")
WebViewer(
  {
    path: "/public", 
  },
).then(instance => {
  instance.UI.loadDocument(filePath)
  // window.open(filePath);
})