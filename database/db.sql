SET NAMES utf8;

DROP DATABASE IF EXISTS GroupomaniaDB;

CREATE DATABASE GroupomaniaDB CHARACTER SET utf8mb4;

CREATE USER 'Groupoadmin' IDENTIFIED BY 'GroupoPW';
GRANT ALL
ON GroupomaniaDB.*
TO 'Groupoadmin';

USE GroupomaniaDB;

CREATE TABLE `users` (
  `userId` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `photoProfil` varchar(255) NOT NULL DEFAULT 'http://localhost:3000/images/photoProfil_default.jpg',
  `dateCreation` datetime NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `password` (`password`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;

CREATE TABLE `articles` (
  `articleId` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` int unsigned DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL,
  `mediaUrl` varchar(255) DEFAULT NULL,
  `dateCreation` datetime NOT NULL,
  PRIMARY KEY (`articleId`),
  KEY `fk_article_user` (`userId`),
  CONSTRAINT `fk_article_user` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8;

CREATE TABLE `comments` (
  `commentId` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` int unsigned NOT NULL,
  `articleId` int unsigned NOT NULL,
  `text` text,
  `dateCreation` datetime NOT NULL,
  PRIMARY KEY (`commentId`),
  KEY `fk_user_comment_idx` (`userId`),
  KEY `fk_article_comment_idx` (`articleId`),
  CONSTRAINT `fk_article_comment` FOREIGN KEY (`articleId`) REFERENCES `articles` (`articleId`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_comment` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8;

CREATE TABLE `likes` (
  `userId` int unsigned NOT NULL,
  `articleId` int unsigned NOT NULL,
  `likeId` int unsigned NOT NULL DEFAULT '1',
  `dateCreation` datetime NOT NULL,
  KEY `fk_article_like_idx` (`articleId`),
  KEY `fk_user_like_idx` (`userId`),
  CONSTRAINT `fk_article_like` FOREIGN KEY (`articleId`) REFERENCES `articles` (`articleId`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_like` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# Pour donner les droits d'administrateur à un utilisateur
UPDATE `users`
SET `role` = 'Administrateur'
WHERE `userId` = 1 #(userId de l'utilisateur à qui on veut donner les droits d'administrateur)