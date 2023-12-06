const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
const section = document.querySelector("section"),
	overlay = document.querySelector(".overlay"),
	showBtn = document.querySelector(".logout"),
	closeBtn = document.querySelector(".close-btn");
const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');
const dropdownBtn = document.getElementById("drop-btn");
const dropdownMenu = document.getElementById("dropdown");
const toggleArrow = document.getElementById("arrow");

// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');
const switchMode = document.getElementById('switch-mode');

allSideMenu.forEach(item => {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i => {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});


menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})


// Modal Pop Up
showBtn.addEventListener("click", () => section.classList.add("active"));

overlay.addEventListener("click", () =>
	section.classList.remove("active")
);

closeBtn.addEventListener("click", () =>
	section.classList.remove("active")
);


 //SPA 
 function loadContent(page) {
	fetch(`../../php/content.php?page=${page}`)
 		.then(response => response.text())
 		.then(data => document.getElementById('tite').innerHTML = data)
 		.catch(error => console.error('Error:', error));
 }

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


//dashboard papakita
 window.onload = function () {
 	loadContent('home');
 };

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


function getNotifications() {
    $.ajax({
        type: "GET",
        url: "../../php/notification.php",
        dataType: "html",
        success: function (response) {
         
            if (response.trim() !== "") {
                $('#dropdown').html(response);
            } else {
               
                $('#dropdown').html('<div class="notify_item"><div class="notify_info"><p>You currently have no notifications</p><span class="notify_time"></span></div></div>');
            }
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
            console.error('getDocs error:', status, error);
            console.error('Response:', xhr.responseText);
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
            console.error('getRecentDocs error:', status, error);
            console.error('Response:', xhr.responseText);
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
  
	  reader.onload = function(e) {
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