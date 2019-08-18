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

-- Challenges
create table if not exists challenges
(
  id             serial            not null
    constraint challenges_pkey
    primary key,
  title          varchar(255),
  description    text,
  location       varchar(255),
  challenge_date date,
  points         integer default 0 not null,
  image_url      varchar(255)
);

-- User Challenges
create table if not exists user_challenges
(
  id           serial  not null
    constraint user_challenges_pkey
    primary key,
  user_id      integer not null
    constraint fk_uc_user
    references users
    on update cascade on delete cascade,
  challenge_id integer not null
    constraint fk_uc_challenge
    references challenges
    on update cascade on delete cascade,
  completed    smallint default '0' :: smallint
);


-- Insert Data
INSERT INTO users (id, full_name, email, title, image_url, password) VALUES (1, 'Gandalf The Grey', 'gandalf@theshire.com', 'Wizard', 'https://uncledanny1979.files.wordpress.com/2010/03/gandalf.jpg', MD5('You should not pass'));