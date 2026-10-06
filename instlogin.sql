CREATE DATABASE IF NOT EXISTS instlogin;
USE instlogin;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL
);

INSERT INTO usuarios (email, senha) VALUES
("professor@email.com", "1234"),
("admin@email.com", "1234"),
("jessica@email.com", "1234");