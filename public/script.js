const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");
const section = document.querySelector("section");
const firstSection = document.getElementById("sidebar");
const secondSection = document.getElementById("content");
const searchButton = document.querySelector(
  "#content nav form .form-input button"
);
const searchButtonIcon = document.querySelector(
  "#content nav form .form-input button .bx"
);
const searchForm = document.querySelector("#content nav form");

// TOGGLE NOTIFICATION POP UP
const dropdownBtn = document.getElementById("drop-btn");
const dropdownMenu = document.getElementById("dropdown");
const toggleArrow = document.getElementById("arrow");


// Text Field Validation
  document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission for this example
  
  // Get input values
  const firstName = document.getElementById('firstName').value.trim();
  const middleName = document.getElementById('middleName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  
  // Construct full name
  const fullName = `${firstName} ${middleName} ${lastName}`.trim().replace(/\s+/g, ' ');
  
  // Regular expression pattern for validating name
  const namePattern = /^[a-zA-Z\s]+$/; // Modify the pattern as needed
  
  // Validation
  if (!namePattern.test(fullName)) {
    alert('Invalid name. Please enter a valid name.');
    return;
  }
  
  // Form is valid, continue with submission or other actions
  console.log('Full name:', fullName);
});


// Password Eye icon 
// const passwordInput = document.querySelector("#contact-password")
// const eye = document.querySelector("#eye")

// eye.addEventListener("click", function(){
//   this.classList.toggle("fa-eye-slash")
//   const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
//   passwordInput.setAttribute("type", type)
// })

/*
Created by: Hans Rafael Daligdig
Description: This event listener is responsible for triggering the loader after visiting a link. It will show a loader to show that the 
			 page that will be visited is being loaded properly.
*/
// Loader after visiting a link
document.addEventListener('DOMContentLoaded', function() {
  const loader = document.querySelector('.typewriter');
  const loaderOverlay = document.querySelector('.loader-container');
  const specificLinks = document.querySelectorAll('a.brand, ul.side-menu.top a, a.btn-add, a.edit-btn, a.cancel-btn, a.create-btn');

  function showLoader() {
    loader.style.display = 'block'; // Show the loader
    loaderOverlay.style.opacity = '1';
  }

  function hideLoader() {
    loader.classList.add('fade-out'); // Add fade-out class
    loaderOverlay.classList.add('fade-out');
    setTimeout(() => {
      loader.style.display = 'none'; // Hide loader after fade-out animation
      loaderOverlay.style.display = 'none';
    }, 500); // Wait for the fade-out transition to complete before hiding
  }

  function handleLinkClick(event) {
    event.preventDefault(); // Prevent default link behavior
    const href = this.getAttribute('href'); // Get the href attribute of the clicked link

    showLoader(); // Show the loader before navigating
    setTimeout(() => {
      window.location.href = href; // Navigate to the new page after a delay
    }, 1000); // Adjust the delay as needed

    // Hide the loader after a certain time (you can adjust this)
    setTimeout(hideLoader, 3000);
  }

  // Attach click event to specific anchor tags
  specificLinks.forEach(link => {
    link.addEventListener('click', handleLinkClick);
  });
});


/*
Created by: Diana Mae Carino
Description: This is the event listener for hiding the sidebar of the webpage.
*/
// TOGGLE SIDEBAR
const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");
const switchMode = document.getElementById("switch-mode");

allSideMenu.forEach((item) => {
  const li = item.parentElement;

  item.addEventListener("click", function () {
    allSideMenu.forEach((i) => {
      i.parentElement.classList.remove("active");
    });
    li.classList.add("active");
  });
});

menuBar.addEventListener("click", function () {
  sidebar.classList.toggle("hide");
});

let overlayLogoutAdded = null;


/*
Created by: Hans Rafael Daligdig 
Description: This is the function for creating a logout pop up modal that shows the 
             confirmation message with buttons named "cancel" and "logout", once the
             logout button is pressed the user will be logged out and will be redirected
             to the login page.
*/
function createLogoutModal() {
  const overlay = document.createElement("span");
  overlay.classList.add("overlay");
  firstSection.insertBefore(overlay, firstSection.firstChild);

  // Show the overlay immediately
  firstSection.classList.add("active");

  // Remove existing overlay if present
  if (overlayLogoutAdded) {
    firstSection.removeChild(overlayLogoutAdded);
    overlayLogoutAdded = null;
  }

  if (!overlayLogoutAdded) {
    const modalBox = document.createElement("div");
    modalBox.classList.add("modal-box");
    modalBox.innerHTML = `
            <div class="modal-box">
                <h2>Confirmation</h2>
                <h3>Are you sure you want to logout?</h3>
                <div class="buttons">
                    <a class="close-btn">Cancel</a>
                    <a class="logout-btn">
                    <i class='bx bx-log-out'></i>
                    <span>Logout</span>
                    </a>
                </div>
            </div>
        `;
    firstSection.appendChild(modalBox);
    overlayLogoutAdded = modalBox;

    const closeBtn = modalBox.querySelector(".close-btn");
    const logoutBtn = modalBox.querySelector(".logout-btn");

    closeBtn.addEventListener("click", () => {
      firstSection.removeChild(modalBox);
      firstSection.removeChild(overlay);
      overlayLogoutAdded = null;
      firstSection.classList.remove("active");
    });

    logoutBtn.addEventListener("click", () => {
      // Perform logout action here
      firstSection.removeChild(modalBox);
      firstSection.removeChild(overlay);
      overlayLogoutAdded = null;
      firstSection.classList.remove("active");
      sendLogoutUserServerRequest();
    });
  }

  const showBtn = document.querySelector(".logout");
  const closeBtn = document.querySelector(".close-btn");
  let isActive = false; // Flag to track the active state

  function toggleActiveClass() {
    if (!isActive) {
      firstSection.classList.add("active");
    } else {
      firstSection.classList.remove("active");
    }
    isActive = !isActive; // Toggle the active state
  }

  showBtn.addEventListener("click", () => firstSection.classList.add("active"));
  overlay.addEventListener("click", () =>
    firstSection.classList.remove("active")
  );
  closeBtn.addEventListener("click", () =>
    firstSection.classList.remove("active")
  );
}

/*
Created by: Hans Rafael Daligdig
Description: This is the event listener for the logout button in the webpage. If the logout 
             button is pressed it will trigger the event listener to perform logout actions. 
*/
// Event Listener
document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.querySelector(".logout");

  logoutBtn.addEventListener("click", function (event) {
    event.preventDefault();
    createLogoutModal();
  });
});

/*
Created by: 
Description: 
*/
function sendEditUserServerRequest() {
  fetch("/edit_user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
}

/*
Created by: 
Description: 
*/
function sendLogoutUserServerRequest() {
  fetch("/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ logout: true }),
  })
    .then((response) => {
      if (response.redirected) {
        console.log("Redirecting to:", response.url);
        window.location.href = response.url;
      } else {
        return response.text().then((data) => {
          console.log("Response data:", data);
        });
      }
    })
    .catch((error) => console.error("Error:", error));
}

/*
Created by: Hans Rafael Daligdig
Description: This function handles the reset function of a completed web form
             It clears all of the input fields after the user has completed
             submitting the web form.
*/
function reset(e) {
  e.wrap("<form>").closest("form").get(0).reset();
  e.unwrap();
}

/*
Created by: Hans Rafael Daligdig
Description: This event listener is responsible for creating a drag and drop
             upload field also showing the preview of the file name when the
             file is uploaded
*/
$(".dropzone").change(function () {
  readFile(this);
});

$(".dropzone-wrapper").on("dragover", function (e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).addClass("dragover");
});

$(".dropzone-wrapper").on("dragleave", function (e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).removeClass("dragover");
});

$(".remove-preview").on("click", function () {
  var boxZone = $(this).parents(".preview-zone").find(".box-body");
  var previewZone = $(this).parents(".preview-zone");
  var dropzone = $(this).parents(".form-group").find(".dropzone");
  boxZone.empty();
  previewZone.addClass("hidden");
  reset(dropzone);
});

/*
Created by: Kevin King Yabut
Description: This function handles the processing of files by reading the
             file that was uploaded by the user and also creating a preview
             icon.
*/
// Upload File
function readFile(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var htmlPreview =
        '<img width="200" src="' +
        e.target.result +
        '" />' +
        "<p>" +
        input.files[0].name +
        "</p>";
      var wrapperZone = $(input).parent();
      var previewZone = $(input).parent().parent().find(".preview-zone");
      var boxZone = $(input)
        .parent()
        .parent()
        .find(".preview-zone")
        .find(".box")
        .find(".box-body");

      wrapperZone.removeClass("dragover");
      previewZone.removeClass("hidden");
      boxZone.empty();
      boxZone.append(htmlPreview);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

/*
Created by: Dominic Gabriel O. Ronquillo
Description: This calls the downloadPDF function once the review button is clicked
*/
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM content loaded");
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("review-btn")) {
      console.log("Review button clicked");
      var documentId = event.target.dataset.documentId;
      console.log("Document ID:", documentId);
      downloadPDF(documentId);
    }
  });
});

/*
Created by: Dominic Gabriel O. Ronquillo
Description: This sends a request to the server to download and convert a blob file from the database.
*/
function downloadPDF(documentId) {
  fetch(`/downloadAndConvert/${documentId}`)
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const filename = `document_${documentId}.pdf`;
      console.log(filename);
      return { filename, blob: response.blob() };
    })
    .then(({ filename, blob }) => {
      openNewPageWithPDF(filename);
    })
    .catch((error) => {
      console.error("Error downloading and converting Blob to PDF:", error);
    });
}

/*
Created by: Dominic Gabriel O. Ronquillo
Description: Once a pdf file is downloaded in the temp folder this will change the current window to view the pdf.
*/
function openNewPageWithPDF(filename) {
  const relativePath = `/pdfviewer?filePath=/temp/${encodeURIComponent(
    filename
  )}`;
  console.log("This is the path: " + relativePath);
  window.location.href = relativePath;
}
