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

// Event Listener
document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.querySelector(".logout");

  logoutBtn.addEventListener("click", function (event) {
    event.preventDefault();
    createLogoutModal();
  });
});

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

function reset(e) {
  e.wrap("<form>").closest("form").get(0).reset();
  e.unwrap();
}

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

function openNewPageWithPDF(filename) {
  const relativePath = `/pdfviewer?filePath=/temp/${encodeURIComponent(
    filename
  )}`;
  console.log("This is the path: " + relativePath);
  window.location.href = relativePath;
}
