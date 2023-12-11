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
	  const href = this.getAttribute('href'); 
  
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
// End of loader

/*
Created by: Diana Mae Carino
Description: This is the action in toggling the sidebar of each webpage.
*/
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
}) // end of toggle sidebar

/*
Created by: Hans Rafael Daligdig
Description: This is the event listener for triggering the modal pop up for the logout screen 
			 when the user presses the logout button.
*/

// Modal Pop Up
showBtn.addEventListener("click", () => section.classList.add("active"));

overlay.addEventListener("click", () =>
	section.classList.remove("active")
);

closeBtn.addEventListener("click", () =>
	section.classList.remove("active")
); // end of modal pop up

/*
Created by: Kevin Yabut
Description: a single-page application content loading by making an asynchronous
HTTP request to the server-side PHP script 'content.php' that contains the html contents, with 'page' as
parameter. The fetched content is then inserted into the html element with the ID 'doc' if successful.
			
             
*/
// Single Page Application content loading
function loadContent(page) {
 
    fetch(`../../php/content.php?page=${page}`)
        .then(response => response.text())
        .then(data => document.getElementById('doc').innerHTML = data)
        .catch(error => console.error('Error:', error));
}


/*
Created by: 
Description: 
*/ 
function reset(e) {
	e.wrap('<form>').closest('form').get(0).reset();
	e.unwrap();
}

/*
Created by: 
Description: 
*/
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


 window.onload = function () {
 	loadContent('home');
 };


/*
Created by: Hans Rafael Daligdig
Description: This dropdown function is used for the notification bell in the webpage to show a list of 
			 notifications that were received by the user.
*/ 
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

/*
Created by: Kevin king Yabut
Description: makes an asynchronous ajax request to the server side php script notification.php
to retrieve the notifications of the documents associated with the user. If successfull it will 
update the content of the dropdown element with the received HTML response. If there are no notifications, displays a default message.
*/
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

/*
Created by: Kevin king Yabut
Description: makes an asynchronous ajax request to the server side php script document.php
to retrieve the notifications of the documents associated with the user. If successfull it will 
update the content of the table element with the received HTML response.
*/
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

getNotifications();
setInterval(getNotifications, 100);
getDocs();
setInterval(getDocs, 100);

/*
Created by: 
Description: 
*/
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