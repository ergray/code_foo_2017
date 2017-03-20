-- create database:

CREATE DATABASE ign_article_video;


-- switch to database

USE ign_article_video;


-- create a couple tables

CREATE TABLE article (
	id INT NOT NULL AUTO_INCREMENT,
	url VARCHAR(500) NOT NULL,
	longtitle VARCHAR(500) NOT NULL,
	description VARCHAR(500) NOT NULL,
	published VARCHAR(500) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE video (
	id INT NOT NULL AUTO_INCREMENT,
	url VARCHAR(500) NOT NULL,
	longtitle VARCHAR(500) NOT NULL,
	description VARCHAR(500) NOT NULL,
	PRIMARY KEY (id)
);

--insertions handled by node server

-- (delete all from table if necessary:)
-- TRUNCATE TABLE video
