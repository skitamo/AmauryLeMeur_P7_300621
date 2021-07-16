SET NAMES utf8;

DROP DATABASE IF EXISTS dbGroupomania;

CREATE DATABASE dbGroupomania CHARACTER SET utf8mb4;

CREATE USER 'adminGroupomania' IDENTIFIED BY 'Groupomania';
GRANT ALL
ON dbGroupomania.*
TO 'adminGroupomania';

CREATE TABLE 'user' (
`userId` int unsigned NOT NULL AUTO_INCREMENT,
`email` varchar(255) NOT NULL,
`password` varchar(255) NOT NULL,
`firstName` varchar(255) DEFAULT NULL,
`lastName` varchar(255) DEFAULT NULL,
`resume` text DEFAULT NULL,
`job` varchar(255) DEFAULT NULL,
`role` varchar(255) DEFAULT NULL,
`dateCreation` datetime NOT NULL,
PRIMARY KEY (`userId`),
UNIQUE KEY `email` (`email`),
UNIQUE KEY `password` (`password`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;

CREATE TABLE `post` (
`postId` int unsigned NOT NULL AUTO_INCREMENT,
`userId` int unsigned DEFAULT NULL,
`contentText` text DEFAULT NULL,
`contentMediaUrl` varchar(255) DEFAULT NULL,
`dateCreation` datetime NOT NULL,
PRIMARY KEY (`postId`),
KEY `fk_post_user` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8;

CREATE TABLE `comment` (
`commentId` int unsigned NOT NULL AUTO_INCREMENT,
`userId` int unsigned NOT NULL,
`postId` int unsigned NOT NULL,
`contentText` text DEFAULT NULL,
`dateCreation` datetime NOT NULL,
PRIMARY KEY (`commentId`),
KEY `fk_user_comment_id` (`userId`),
KEY `fk_post_comment_id` (`postId`),
CONSTRAINT `fk_post_comment` FOREIGN KEY (`postId`) REFERENCES `post` (`postId`) ON DELETE CASCADE,
CONSTRAINT `fk_user_comment` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8;

CREATE TABLE `like` (
`userId` int unsigned NOT NULL,
`postId` int unsigned NOT NULL,
`likeId` int unsigned NOT NULL DEFAULT '1',
`dateCreation` datetime NOT NULL,
KEY `fk_post_like_id` (`postId`),
KEY `fk_user_like_id` (`userId`),
CONSTRAINT `fk_post_like` FOREIGN KEY (`postId`) REFERENCES `post` (`postId`) ON DELETE CASCADE,
CONSTRAINT `fk_user_like` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `dislike` (
`userId` int unsigned NOT NULL,
`postId` int unsigned NOT NULL,
`dislikeId` int unsigned NOT NULL DEFAULT '1',
`dateCreation` datetime NOT NULL,
KEY `fk_post_dislike_id` (`postId`),
KEY `fk_user_dislike_id` (`userId`),
CONSTRAINT `fk_post_dislike` FOREIGN KEY (`postId`) REFERENCES `post` (`postId`) ON DELETE CASCADE,
CONSTRAINT `fk_user_dislike` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--Pour donner les droits d'administrateur à un utilisateur--
UPDATE `user`
SET `role` = `admin`
WHERE `userId` = 1 --(userId de l'utilisateur à qui on veut donner les droit d'administrateur)--