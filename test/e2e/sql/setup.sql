-- Create tables

-- Companies
create table if not exists companies
(
  id        serial not null
    constraint companies_pkey
    primary key,
  name      varchar(255),
  url       varchar(255),
  image_url varchar(255)
);

-- Users
create table if not exists users
(
  id  serial  not null
    constraint users_pkey
    primary key,
  full_name  varchar(255),
  email      varchar(255) not null unique,
  title      varchar(255),
  image_url  varchar(255),
  company_id integer
    constraint users_company
    references companies
    on delete cascade,
  password   varchar(255) not null
);

-- Insert Data
INSERT INTO users (full_name, email, title, image_url, password) VALUES ('Gandalf The Grey', 'gandalf@theshire.com', 'Wizard', 'https://uncledanny1979.files.wordpress.com/2010/03/gandalf.jpg', MD5('You should not pass'));