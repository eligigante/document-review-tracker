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

// const overlay = document.createElement('span');
// const overlayAdd = document.createElement('span');
// const showBtn = document.querySelector('.logout');
// const addBtn = document.querySelector('.btn-add');
// const cancelBtn = document.querySelector('.cancel-btn');
// const closeBtn = document.querySelector('.close-btn');

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
  const addUserBtn = document.querySelector(".btn-add");
  const revokeBtn = document.querySelector(".revoke-btn");
  const editBtn = document.querySelector(".edit-btn");
  const reviewBtn = document.querySelector(".review-btn");
  const createBtn = document.querySelector(".create-btn");
  const edtBtn = document.querySelector(".edt-btn");

  logoutBtn.addEventListener("click", function (event) {
    event.preventDefault();
    createLogoutModal();
  });

  createBtn.addEventListener("click", function (event) {
    event.preventDefault();
    sendAddUserServerRequest();
  });

  edtBtn.addEventListener("click", function (event) {
    event.preventDefault();
  });

});


function sendAddUserServerRequest() {
  fetch("/add_user_request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
}

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

function sendSortUserAscendingRequest() {
  fetch("/sort_users_ascending", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
}

function sendSortUserDescendingRequest() {
  fetch("/sort_users_descending", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
}

function sendFilterUsersOfflineRequest() {
  fetch("/filter_users_offline", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
}

function sendFilterUsersOnlineRequest() {
  fetch("/filter_users_online", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
}

//SPA
// function loadContent(page) {
// 	fetch(`../../php/content.php?page=${page}`)
// 		.then(response => response.text())
// 		.then(data => document.getElementById('tite').innerHTML = data)
// 		.catch(error => console.error('Error:', error));
// }

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

//dashboard papakita
// window.onload = function () {
//   loadContent("home");
// };

// Toggle dropdown function
const toggleDropdown = function () {
  dropdownMenu.classList.toggle("show");
};

// Toggle dropdown open/close when dropdown button is clicked
dropdownBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  toggleDropdown();
});

// Close dropdown when dom element is clicked
document.documentElement.addEventListener("click", function () {
  if (dropdownMenu.classList.contains("show")) {
    toggleDropdown();
  }
});

//notif asynch
// function getNotifications() {
// 	$.ajax({
// 		type: "GET",
// 		url: "../../php/notification.php",
// 		dataType: "html",
// 		success: function (response) {
// 			$('#dropdown').html(response);
// 		},
// 		error: function (xhr, status, error) {
// 			console.error(status + ": " + error);
// 		}
// 	});
// }

// function getDocs() {
// 	$.ajax({
// 		type: "GET",
// 		url: "../../php/document.php",
// 		dataType: "html",
// 		success: function (response) {
// 			$('#tbody').html(response);
// 		},
// 		error: function (xhr, status, error) {
// 			console.error(status + ": " + error);
// 		}
// 	});
// }

// function getRecentDocs() {
// 	$.ajax({
// 		type: "GET",
// 		url: "../../php/recentDocument.php",
// 		dataType: "html",
// 		success: function (response) {
// 			$('#tbading').html(response);
// 		},
// 		error: function (xhr, status, error) {
// 			console.error(status + ": " + error);
// 		}
// 	});
// }

// getNotifications();

// setInterval(getNotifications, 10);

// getDocs();

// setInterval(getDocs, 10);

// getRecentDocs();

// setInterval(getRecentDocs, 10)

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
  const newWindow = window.open(relativePath, "_blank");

  if (!newWindow) {
    alert("Popup Failed.");
  }
}
