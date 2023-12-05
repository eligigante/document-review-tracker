<<<<<<< HEAD
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
const section = document.querySelector("section");
const firstSection = document.getElementById("sidebar");
const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

// TOGGLE NOTIFICATION POP UP
=======
const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");
const section = document.querySelector("section"),
  overlay = document.querySelector(".overlay"),
  showBtn = document.querySelector(".logout"),
  closeBtn = document.querySelector(".close-btn");
const searchButton = document.querySelector(
  "#content nav form .form-input button"
);
const searchButtonIcon = document.querySelector(
  "#content nav form .form-input button .bx"
);
const searchForm = document.querySelector("#content nav form");
>>>>>>> b4cbe43d2fa49b002a435ee76a0206c7cc9cc496
const dropdownBtn = document.getElementById("drop-btn");
const dropdownMenu = document.getElementById("dropdown");
const toggleArrow = document.getElementById("arrow");

// TOGGLE SIDEBAR
const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");
const switchMode = document.getElementById("switch-mode");

<<<<<<< HEAD

allSideMenu.forEach(item => {
	const li = item.parentElement;
=======
allSideMenu.forEach((item) => {
  const li = item.parentElement;
>>>>>>> b4cbe43d2fa49b002a435ee76a0206c7cc9cc496

  item.addEventListener("click", function () {
    allSideMenu.forEach((i) => {
      i.parentElement.classList.remove("active");
    });
    li.classList.add("active");
  });
});

<<<<<<< HEAD
menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})

let overlayLogoutAdded = null;
=======
menuBar.addEventListener("click", function () {
  sidebar.classList.toggle("hide");
});
>>>>>>> b4cbe43d2fa49b002a435ee76a0206c7cc9cc496

function createLogoutModal() {
    const overlay = document.createElement('span');
    overlay.classList.add('overlay');
    firstSection.insertBefore(overlay, firstSection.firstChild);

<<<<<<< HEAD
    // Show the overlay immediately
    firstSection.classList.add('active');

    // Remove existing overlay if present
    if (overlayLogoutAdded) {
        firstSection.removeChild(overlayLogoutAdded);
        overlayLogoutAdded = null;
    }

    if (!overlayLogoutAdded) {
        const modalBox = document.createElement('div');
        modalBox.classList.add('modal-box');
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

        const closeBtn = modalBox.querySelector('.close-btn');
        const logoutBtn = modalBox.querySelector('.logout-btn');

        closeBtn.addEventListener('click', () => {
            firstSection.removeChild(modalBox);
            firstSection.removeChild(overlay);
            overlayLogoutAdded = null;
            firstSection.classList.remove('active');
        });

        logoutBtn.addEventListener('click', () => {
            // Perform logout action here
            firstSection.removeChild(modalBox);
            firstSection.removeChild(overlay);
            overlayLogoutAdded = null;
            firstSection.classList.remove('active');
        });
    }

    const showBtn = document.querySelector('.logout');
    const closeBtn = document.querySelector('.close-btn');
    let isActive = false; // Flag to track the active state

    function toggleActiveClass() {
        if (!isActive) {
            firstSection.classList.add('active');
        } else {
            firstSection.classList.remove('active');
        }
        isActive = !isActive; // Toggle the active state
    }

    showBtn.addEventListener('click', () => firstSection.classList.add("active"));
    overlay.addEventListener('click', () => firstSection.classList.remove("active"));
    closeBtn.addEventListener('click', () => firstSection.classList.remove("active"));
}

let overlayAdded = null;

function createAddUserModal() {
	const overlayAdd = document.createElement('span');
	overlayAdd.classList.add('overlay-add');
	firstSection.insertBefore(overlayAdd, firstSection.firstChild);
	
	// Show the overlay immediately
	firstSection.classList.add('active');

	// Remove existing overlay if present
	if (overlayAdded) {
		firstSection.removeChild(overlayAdded);
		overlayAdded = null;
	}

	if (!overlayAdded) {
		const modalBoxAdd = document.createElement('div');
		modalBoxAdd.classList.add('modal-box-add');
		modalBoxAdd.innerHTML = `
	<h2>Add New User</h2>
	<div class="form-container">
		<form name="frmContact" id="" frmContact"" method="post" action="" enctype=""
			onsubmit="">
			<div class="first-row">
				<div class="inline-block right-margin">
					<div class="label">
						User ID <span id="firstName-info" class="info"></span>
					</div>
					<input type="text" class="input-field" name="contact-first-name" id="contact-first-name" />
				</div>
				<div class="inline-block responsive">
					<div class="label">
						Password <span id="lastName-info" class="info"></span>
					</div>
					<input type="text" class="input-field" name="contact-last-name" id="contact-last-name" />
				</div>
			</div>
			<div class="second-row">
				<div class="inline-block right-margin">
					<div class="label">
						First Name <span id="email-info" class="info"></span>
					</div>
					<input type="text" class="input-field" name="contact-email" id="contact-email" />
				</div>
				<div class="inline-block responsive">
					<div class="label">
						Middle Name <span id="phone-info" class="info"></span>
					</div>
					<input type="text" class="input-field" name="contact-phone" id="contact-phone" />
				</div>
			</div>
			<div class="third-row">
				<div class="inline-block right-margin">
					<div class="label">
						Last Name <span id="subject-info" class="info"></span>
					</div>
					<input type="text" class="input-field" name="contact-phone" id="contact-phone" />
				</div>
			</div>
			<div class="fourth-row">
				<div class="inline-block right-margin">
					<div class="label">
						Email <span id="firstName-info" class="info"></span>
					</div>
					<input type="text" class="input-field" name="contact-first-name" id="contact-first-name" />
				</div>
				<div class="inline-block responsive">
					<div class="label">
						Position <span id="lastName-info" class="info"></span>
					</div>
					<select id="department" name="department">
						<option value="OGRAA">OGRAA</option>
						<option value="OVPAA">OVPAA</option>
						<option value="OVPF">OVPF</option>
						<option value="OLA">OLA</option>
						<option value="OVPA">OVPA</option>
					</select>
				</div>
			</div>
		</form>
		<div class="buttons">
		<a class="cancel-btn">Cancel</a>
		<a class="create-btn">
			<i class='bx bx-log-in'></i>
			<span>Create</span>
		</a>
		</div>
	</div>
    `;
		firstSection.appendChild(modalBoxAdd);
		overlayAdded = modalBoxAdd;

		// Additional logic for form submission or other actions
		const cancelBtn = modalBoxAdd.querySelector('.cancel-btn');
		const createBtn = modalBoxAdd.querySelector('.create-btn');

		cancelBtn.addEventListener('click', () => {
			firstSection.removeChild(modalBoxAdd);
			firstSection.removeChild(overlayAdd);
			overlayAdded = null;
			firstSection.classList.remove('active');
		});

		createBtn.addEventListener('click', () => {
			// Perform create action here
			firstSection.removeChild(modalBoxAdd);
			firstSection.removeChild(overlayAdd)
			overlayAdded = null;
			firstSection.classList.remove('active');
		});
	}

	const addBtn = document.querySelector('.btn-add');
	const cancelBtn = document.querySelector('.cancel-btn');
	let isActive = false; // Flag to track the active state

	function toggleActiveClass() {
		if (!isActive) {
			firstSection.classList.add('active');
		} else {
			firstSection.classList.remove('active');
		}
		isActive = !isActive; // Toggle the active state
	}

	addBtn.addEventListener('click', () => firstSection.classList.add("active"));
    overlayAdd.addEventListener('click', () => firstSection.classList.remove("active"));
    cancelBtn.addEventListener('click', () => firstSection.classList.remove("active"));
}

document.addEventListener('DOMContentLoaded', function () {
	const logoutBtn = document.querySelector('.logout');
	const addUserBtn = document.querySelector('.btn-add');

	logoutBtn.addEventListener('click', function (event) {
		event.preventDefault();
		createLogoutModal();
	});

	addUserBtn.addEventListener('click', function (event) {
		event.preventDefault();
		createAddUserModal();
	});
});


=======
overlay.addEventListener("click", () => section.classList.remove("active"));

closeBtn.addEventListener("click", () => section.classList.remove("active"));

searchButton.addEventListener("click", function (e) {
  if (window.innerWidth < 576) {
    e.preventDefault();
    searchForm.classList.toggle("show");
    if (searchForm.classList.contains("show")) {
      searchButtonIcon.classList.replace("bx-search", "bx-x");
    } else {
      searchButtonIcon.classList.replace("bx-x", "bx-search");
    }
  }
});

if (window.innerWidth < 768) {
  sidebar.classList.add("hide");
} else if (window.innerWidth > 576) {
  searchButtonIcon.classList.replace("bx-x", "bx-search");
  searchForm.classList.remove("show");
}

window.addEventListener("resize", function () {
  if (this.innerWidth > 576) {
    searchButtonIcon.classList.replace("bx-x", "bx-search");
    searchForm.classList.remove("show");
  }
});

switchMode.addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
});
>>>>>>> b4cbe43d2fa49b002a435ee76a0206c7cc9cc496

//SPA
function loadContent(page) {
  fetch(`../../php/content.php?page=${page}`)
    .then((response) => response.text())
    .then((data) => (document.getElementById("tite").innerHTML = data))
    .catch((error) => console.error("Error:", error));
}

<<<<<<< HEAD
function reset(e) {
	e.wrap('<form>').closest('form').get(0).reset();
	e.unwrap();
}

$(".dropzone").change(function () {
	readFile(this);
});

$('.dropzone-wrapper').on('dragover', function (e) {
	e.preventDefault();
	e.stopPropagation();
	$(this).addClass('dragover');
});

$('.dropzone-wrapper').on('dragleave', function (e) {
	e.preventDefault();
	e.stopPropagation();
	$(this).removeClass('dragover');
});

$('.remove-preview').on('click', function () {
	var boxZone = $(this).parents('.preview-zone').find('.box-body');
	var previewZone = $(this).parents('.preview-zone');
	var dropzone = $(this).parents('.form-group').find('.dropzone');
	boxZone.empty();
	previewZone.addClass('hidden');
	reset(dropzone);
});
=======
// Upload File
function readFile(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
>>>>>>> b4cbe43d2fa49b002a435ee76a0206c7cc9cc496

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

<<<<<<< HEAD
//dashboard papakita
window.onload = function () {
	loadContent('home');
=======
      wrapperZone.removeClass("dragover");
      previewZone.removeClass("hidden");
      boxZone.empty();
      boxZone.append(htmlPreview);
    };

    reader.readAsDataURL(input.files[0]);
  }
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

//dashboard papakita
window.onload = function () {
  loadContent("home");
>>>>>>> b4cbe43d2fa49b002a435ee76a0206c7cc9cc496
};

// Toggle dropdown function
const toggleDropdown = function () {
  dropdownMenu.classList.toggle("show");
};

// Toggle dropdown open/close when dropdown button is clicked
dropdownBtn.addEventListener("click", function (e) {
<<<<<<< HEAD
	e.stopPropagation();
	toggleDropdown();

=======
  e.stopPropagation();
  toggleDropdown();
>>>>>>> b4cbe43d2fa49b002a435ee76a0206c7cc9cc496
});

// Close dropdown when dom element is clicked
document.documentElement.addEventListener("click", function () {
  if (dropdownMenu.classList.contains("show")) {
    toggleDropdown();
  }
});

<<<<<<< HEAD

//notif asynch
function getNotifications() {
	$.ajax({
		type: "GET",
		url: "../../php/notification.php",
		dataType: "html",
		success: function (response) {
			$('#dropdown').html(response);
		},
		error: function (xhr, status, error) {
			console.error(status + ": " + error);
		}
	});
}

function getDocs() {
	$.ajax({
		type: "GET",
		url: "../../php/document.php",
		dataType: "html",
		success: function (response) {
			$('#tbody').html(response);
		},
		error: function (xhr, status, error) {
			console.error(status + ": " + error);
		}
	});
}

function getRecentDocs() {
	$.ajax({
		type: "GET",
		url: "../../php/recentDocument.php",
		dataType: "html",
		success: function (response) {
			$('#tbading').html(response);
		},
		error: function (xhr, status, error) {
			console.error(status + ": " + error);
		}
	});
}


getNotifications();


setInterval(getNotifications, 10);

getDocs();

setInterval(getDocs, 10);

getRecentDocs();

setInterval(getRecentDocs, 10)


// Upload File
function readFile(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (e) {
			var htmlPreview =
				'<img width="200" src="' + e.target.result + '" />' +
				'<p>' + input.files[0].name + '</p>';
			var wrapperZone = $(input).parent();
			var previewZone = $(input).parent().parent().find('.preview-zone');
			var boxZone = $(input).parent().parent().find('.preview-zone').find('.box').find('.box-body');

			wrapperZone.removeClass('dragover');
			previewZone.removeClass('hidden');
			boxZone.empty();
			boxZone.append(htmlPreview);
		};

		reader.readAsDataURL(input.files[0]);
	}
}

=======
function download(documentId) {
  fetch(`/downloadAndConvert/${documentId}`)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);

      window.open(`../public/pdfviewer.html?blobUrl=${encodeURIComponent(blobUrl)}`, '_blank');
    })
    .catch((error) => {
      console.error("Error downloading and converting Blob to PDF:", error);
    });
}

// For destroying session once tab is closed
>>>>>>> b4cbe43d2fa49b002a435ee76a0206c7cc9cc496
$(window).unload(function () {
	$.get('/destroy');
});