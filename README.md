# Document Review Tracker Web Application

## Overview

The Document Review Tracker is a web application designed to streamline document reviews within a collaborative environment. This application facilitates the submission of documents, allows reviewers to provide comments on PDFs, and enables efficient communication between reviewers, document owners, and administrators. The system includes user authentication, user roles (admin, reviewer, user), session management, and features sorting and filtering capabilities.

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
- Token-based authentication for enhanced security.

### 4. Document Submission

- Users can submit documents for review.
- Supported file formats include PDF, DOCX, and TXT.

### 5. Commenting System

- Reviewers can leave comments on specific sections of a document.
- Document owners and submitters receive notifications about new comments.
- Seamless communication between document owners, reviewers, and submitters.

### 6. Document Status

- Track the status of each document, including "Submitted," "In Review," "Approved," and "Returned for Editing."
- Users receive notifications when the document status changes.

### 7. Sorting and Filtering

- Users can sort documents based on criteria such as submission date, review status, and document owner.
- Filter documents based on various parameters to easily locate specific files.

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB database set up

### Installation

1. Clone the repository: `git clone https://github.com/your-username/document-review-tracker.git`
2. Navigate to the project folder: `cd document-review-tracker`
3. Install dependencies: `npm install`
4. Configure environment variables: Create a `.env` file and set the necessary variables (see `.env.example` for reference).
5. Start the application: `npm start`

## Usage

1. Access the application at `http://localhost:3000` in your web browser.
2. Sign in with your credentials or create a new account.
3. Upload documents for review.
4. Track the status of submitted documents.
5. Reviewers can provide comments and send back the document.
6. Receive notifications about document status changes.


