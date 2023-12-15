-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 14, 2023 at 02:10 PM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `document_tracker_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
CREATE TABLE IF NOT EXISTS `departments` (
  `department_ID` int NOT NULL AUTO_INCREMENT,
  `department_Name` varchar(255) NOT NULL,
  `user_ID` int DEFAULT NULL,
  PRIMARY KEY (`department_ID`),
  KEY `user_ID` (`user_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_ID`, `department_Name`, `user_ID`) VALUES
(1, 'Office of Global Relations and Alumni Affairs', 3),
(2, 'Office of the Vice President for Academic Affairs', 4),
(3, 'Office of the Vice President for Finance', 5),
(4, 'Office for Legal Affairs', 6),
(5, 'Office of the Vice President for Administration', 7);

-- --------------------------------------------------------

--
-- Table structure for table `document_details`
--

DROP TABLE IF EXISTS `document_details`;
CREATE TABLE IF NOT EXISTS `document_details` (
  `document_ID` int NOT NULL AUTO_INCREMENT,
  `user_ID` int NOT NULL,
  `document_Title` varchar(255) NOT NULL,
  `pages` int NOT NULL,
  `status` varchar(255) NOT NULL,
  `upload_Date` datetime NOT NULL,
  `file` mediumblob NOT NULL,
  `revisions` int DEFAULT '0',
  PRIMARY KEY (`document_ID`),
  KEY `user_ID_doc_details` (`user_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=10067 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `document_logs`
--

DROP TABLE IF EXISTS `document_logs`;
CREATE TABLE IF NOT EXISTS `document_logs` (
  `document_ID` int NOT NULL,
  `department_ID` int NOT NULL,
  `user_ID` int NOT NULL,
  `referral_Date` datetime NOT NULL,
  `review_Date` datetime DEFAULT NULL,
  `received_file` mediumblob NOT NULL,
  `reviewed_file` mediumblob,
  `returned_file` mediumblob,
  `approved_file` mediumblob,
  `document_status` varchar(255) NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  KEY `document_ID` (`document_ID`),
  KEY `department_ID` (`department_ID`),
  KEY `user_ID` (`user_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_ID` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `last_Name` varchar(255) NOT NULL,
  `first_Name` varchar(255) NOT NULL,
  `middle_Name` varchar(255) NOT NULL,
  `department_ID` int NOT NULL,
  `position` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`user_ID`),
  KEY `department_ID` (`department_ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_ID`, `email`, `password`, `last_Name`, `first_Name`, `middle_Name`, `department_ID`, `position`, `role`, `status`) VALUES
(1, 'user1@slu.edu.ph', '123', 'Cariño', 'Diana Mae', 'De Leon', 4, 'Secretary', 'user', 'Online'),
(2, 'admin1@slu.edu.ph', '321', 'Zapanta', 'Adrienne Marie', 'Banday', 5, 'Admin', 'admin', 'Offline'),
(3, 'reviewer1@slu.edu.ph', '312', 'Ronquillo', 'Dominic Gabriel', 'Oaing', 1, 'Director', 'reviewer', 'Offline'),
(4, 'reviewer2@slu.edu.ph', '213', 'Daligdig', 'Hans Rafael', 'Pascual', 2, 'Vice President', 'reviewer', 'Online'),
(5, 'reviewer3@slu.edu.ph', '132', 'Yabut', 'Kevin King', 'Dela Cruz', 3, 'Vice President', 'reviewer', 'Offline'),
(6, 'reviewer4@slu.edu.ph', '231', 'Gigante', 'Elijah', 'Medina', 4, 'Director', 'reviewer', 'Offline'),
(7, 'reviewer5@slu.edu.ph', '143', 'Catapusan', 'Heto Nya', 'Ang', 5, 'Vice President', 'reviewer', 'Offline'),
(9, 'user2@slu.edu.ph', '000', 'Lang', 'Tess', 'Ting', 1, 'Staff', 'user', 'Offline'),
(10, 'user3@slu.edu.ph', '000', 'Talaga', 'Ito Na', 'Ba', 4, 'Teacher', 'user', 'Offline'),
(11, 'user4@slu.edu.ph', '000', 'Nga', 'Hito', 'Na ', 3, 'Treasurer', 'user', 'Offline');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `user_ID_dept` FOREIGN KEY (`user_ID`) REFERENCES `user` (`user_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `document_details`
--
ALTER TABLE `document_details`
  ADD CONSTRAINT `user_ID_doc_details` FOREIGN KEY (`user_ID`) REFERENCES `user` (`user_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `document_logs`
--
ALTER TABLE `document_logs`
  ADD CONSTRAINT `department_ID_doc_logs` FOREIGN KEY (`department_ID`) REFERENCES `departments` (`department_ID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `document_ID_doc_logs` FOREIGN KEY (`document_ID`) REFERENCES `document_details` (`document_ID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `user_ID_doc_logs` FOREIGN KEY (`user_ID`) REFERENCES `user` (`user_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `department_ID_user` FOREIGN KEY (`department_ID`) REFERENCES `departments` (`department_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
