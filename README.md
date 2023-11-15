# Document Review Tracker Web Application

## Overview

The Document Review Tracker is a web application designed to streamline document reviews within a collaborative environment. This application facilitates the submission of documents, allows reviewers to provide comments on PDFs, and enables efficient communication between reviewers and document owners. The system includes user authentication, user roles (admin, reviewer, user), session management, and features sorting and filtering capabilities.

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

- Users can create accounts with unique credentials.
- Login functionality to access the system securely.

### 2. User Roles

- **Admins:** 
  - Create and manage user accounts.
  - View login activity.
  - Delete user accounts.
- **Reviewers:**
  - Review submitted documents.
  - Provide comments on specific sections.
  - Send reviewed documents back to document owners.
- **Normal Users:**
  - Submit documents for review.
  - Receive notifications about the status of submitted documents.
  - Track the review process.

### 3. Session Management

- Secure session management to ensure user authentication and authorization.
- Automatic logout after a period of inactivity.

### 4. Document Submission

- Users can submit documents for review.
- Supported file formats only includes PDF.

### 5. Commenting System

- Reviewers can leave comments on specific sections of a document.

### 6. Document Status

- Track the status of each document, including "Submitted," "In Review," "Approved," and "Returned for Editing."
- Users receive notifications when the document status changes.

### 7. Sorting and Filtering

- Users can sort documents based on criteria such as submission date, review status, and document owner.
- Filter documents based on various parameters to easily locate specific files.
