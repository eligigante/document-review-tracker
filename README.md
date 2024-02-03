# DocFlow: An Intuitive Web-based Application for Tracking Document Reviews 

## Overview

DocFlow is a web application designed to streamline document reviews within a collaborative environment. This application facilitates the submission of documents, allows reviewers to provide comments on PDFs, and enables efficient communication between reviewers and document owners. The system includes user authentication, user roles (admin, reviewer, user), session management, and sorting and filtering capabilities.

## Technologies Used

### Front End

- **HTML:** The markup language for structuring the application's content.
- **CSS:** Stylesheets to enhance the visual presentation and layout.
- **JavaScript:** Used for dynamic and interactive elements on the client side.

### Back End

- **PHP:** A server-side scripting language for handling backend logic and interactions.
- **Node.js:** A JavaScript runtime that enables server-side development, enhancing the web application's scalability and responsiveness.

## Features

### 1. User Authentication

- Login functionality to access the system securely.

### 2. User Roles

- **Admins:** 
  - Create and manage user accounts.
  - View login activity.
- **Reviewers:**
  - Review submitted documents.
  - Provide comments on specific sections of the document.
  - Send reviewed documents back to document owners.
- **Requesters:**
  - Submit documents for review.
  - Receive notifications about the status of submitted documents.
  - Track the review process.

### 3. Session Management

- Secure session management to ensure user authentication and authorization.

### 4. Document Submission

- Requesters can submit documents for review.
- Supported file formats only includes PDF.

### 5. Commenting System

- Reviewers can leave comments on specific sections of a document.

### 6. Document Status

- Track the status of each document, including "Submitted," "In Review," "Approved," and "Returned for Editing."
- Users receive notifications when the document status changes.

### 7. Sorting and Filtering

- Requesters can sort all of their documents based on criteria such as submission date and review status.
- Reviewers can also sort documents based on criteria such as submission date and review status.
- Admins can also sort and filter users based on role and position.
- Filter documents based on various parameters to easily locate specific files.


# Installation Instructions

## How to setup database
- Login to localhost/phpmyadmin/ and import the sql file and name the table as teamang-final

## How to run the client
- On your wamp64 folder go into the www folder and put the project there
- http://localhost/document-review-tracker/

## How to run the reviewer/admin
- Go to Visual Studio Code and go to terminal
- Type "cd node" and then "npx nodemon app.js"
- http://localhost:8001/

# How to host the project

## Hosting the reviewer
- Go to cmd and get the ip address of the terminal hosting the server.
- Go to server.js and add the ip address beside the port number '8001'
- it should look something like
function startServer(app) {
    app.listen('8001', 'ipaddress' () => {
        console.log('Server has connected to port 8001');
    })
}
- afterwards go to the site by typing in ipaddress:8001

## Hosting the Client
- Add the website as a virtual host in wamp by going to localhost
- Once the website is hosted go to wamp and edit the apache httpd.vhosts.conf
- Just change the require to 'require all granted'
<VirtualHost *:80>
	ServerName documentreviewer.com
	DocumentRoot "c:/wamp64/www/document-review-tracker"
	<Directory  "c:/wamp64/www/document-review-tracker/">
		Options +Indexes +Includes +FollowSymLinks +MultiViews
		AllowOverride All
		Require all granted
	</Directory>
</VirtualHost>
- Next go to firewall and go to advanced settings
- Allow wamp in the firewall
- If wamp is not allowed create an inbound and outbound rule for port 80
- Check the connection if it says allowed
- Go to the host file and add the website by typing ipadress websitename.com
- For example 192.168.23.195 teamang-finals.com
- Save and then visit the website and you should be able to use the web app

## In case you encounter the "Does not have access to the database" error when logging in
- Just go to the phpmyadmin and edit the priveleges
- change the hostname to % and set it as any host
- leave the password to be blank
- Click on go and you should be able to login properly

