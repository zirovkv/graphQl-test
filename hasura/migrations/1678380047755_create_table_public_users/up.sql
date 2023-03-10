CREATE TABLE users(id serial NOT NULL, first_name text, last_name text, gender text, PRIMARY KEY (id));
CREATE TABLE user_traking(id serial NOT NULL, lat float, lng float, user_id int, PRIMARY KEY (id) FOREIGN KEY (user_id) REFERENCES Persons(id));
