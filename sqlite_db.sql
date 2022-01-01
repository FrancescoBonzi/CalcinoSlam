CREATE TABLE IF NOT EXISTS players (
	id integer PRIMARY KEY AUTOINCREMENT,
	username text NOT NULL UNIQUE,
	password text DEFAULT 'versicalabresi',
	image text,
	sex text,
	biography text,
	mail text,
	address text,
	city text
);

CREATE TABLE IF NOT EXISTS championships (
	id integer PRIMARY KEY AUTOINCREMENT,
	type text NOT NULL,
	date datetime NOT NULL,
	organizer integer NOT NULL,
	name text,
	location integer,
	image text,
	in_progress integer NOT NULL,
	season integer NOT NULL,
	comment text,
	CONSTRAINT fk_players
    	FOREIGN KEY (organizer)
    	REFERENCES players(id)
	CONSTRAINT fk_locations
    	FOREIGN KEY (location)
    	REFERENCES locations(id)
);

CREATE TABLE IF NOT EXISTS locations (
	id integer PRIMARY KEY AUTOINCREMENT,
	name text NOT NULL UNIQUE,
	image text,
	comment text
);

CREATE TABLE IF NOT EXISTS matches (
	id integer PRIMARY KEY AUTOINCREMENT,
	datetime datetime,
	team1 integer NOT NULL,
	team2 integer NOT NULL,
	to_be_played integer NOT NULL,
	team1_score integer,
	team2_score integer,
	CHECK((to_be_played == 0 AND
			team1_score IS NOT NULL AND
			team2_score IS NOT NULL) OR to_be_played == 1)
);

CREATE TABLE IF NOT EXISTS championships_matches (
	id_championship integer NOT NULL,
	id_match integer NOT NULL,
	to_be_played integer NOT NULL,
	team1_points integer,
	team2_points integer,
	id_noticeboard integer NOT NULL,
	CONSTRAINT primary_keys PRIMARY KEY (id_championship, id_match),
	CONSTRAINT fk_championships
    	FOREIGN KEY (id_championship)
    	REFERENCES championships(id),
	CONSTRAINT fk_matches
    	FOREIGN KEY (id_match)
    	REFERENCES matches(id),
	CHECK((to_be_played == 0 AND
			team1_points IS NOT NULL AND
			team2_points IS NOT NULL) OR to_be_played == 1)
);

CREATE TABLE IF NOT EXISTS championships_players (
	id_championship integer NOT NULL,
	id_player integer NOT NULL,
	place integer,
	score float,
	CONSTRAINT primary_keys PRIMARY KEY (id_championship, id_player),
	CONSTRAINT fk_championships
    	FOREIGN KEY (id_championship)
    	REFERENCES championships(id),
	CONSTRAINT fk_players
    	FOREIGN KEY (id_player)
    	REFERENCES players(id)
);

CREATE TABLE IF NOT EXISTS championships_teams (
	id_championship integer NOT NULL,
	num_team integer NOT NULL,
	player1 integer,
	player2 integer,
	CONSTRAINT primary_keys PRIMARY KEY (id_championship, num_team),
	CONSTRAINT fk_championships
    	FOREIGN KEY (id_championship)
    	REFERENCES championships(id),
	CONSTRAINT fk_player1
    	FOREIGN KEY (player1)
    	REFERENCES players(id),
	CONSTRAINT fk_player2
    	FOREIGN KEY (player2)
    	REFERENCES players(id)
);

INSERT INTO players
(id, username, password, image, sex, biography, mail, address, city)
VALUES
(NULL, 'Checco', 'versicalabresi', 'http://localhost:3003/profile.png', 'M', "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur.", NULL, NULL, NULL),
(NULL, 'Ale', 'versicalabresi', 'http://localhost:3003/profile.png', 'M', "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur.", NULL, NULL, NULL),
(NULL, 'Fede', 'versicalabresi', 'http://localhost:3003/profile.png', 'M', "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur.", NULL, NULL, NULL),
(NULL, 'Wilson', 'versicalabresi', 'http://localhost:3003/profile.png', 'M', "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur.", NULL, NULL, NULL),
(NULL, 'Gambo', 'versicalabresi', 'http://localhost:3003/profile.png', 'M', "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur.", NULL, NULL, NULL),
(NULL, 'Il Chimico', 'versicalabresi', 'http://localhost:3003/profile.png', 'M', "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur.", NULL, NULL, NULL),
(NULL, 'Macca', 'versicalabresi', 'http://localhost:3003/profile.png', 'M', "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur.", NULL, NULL, NULL),
(NULL, 'Gulli', 'versicalabresi', 'http://localhost:3003/profile.png', 'M', "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur.", NULL, NULL, NULL),
(NULL, 'Gollo', 'versicalabresi', 'http://localhost:3003/profile.png', 'M', "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur.", NULL, NULL, NULL),
(NULL, 'Cami', 'versicalabresi', 'http://localhost:3003/profile.png', 'F', "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur.", NULL, NULL, NULL);

INSERT INTO locations
(id, name, image, comment)
VALUES
(1, 'Bergullonia Alta', '/CalcinoSlam/images/location.png', ''),
(2, 'Imola City Centre', '/CalcinoSlam/images/location.png', '');

INSERT INTO championships
(id, type, date, organizer, name, location, image, in_progress, season, comment)
VALUES
(1, 'GIRONE', date('now'), 1, 'BIG SLAM 1', 1, '/CalcinoSlam/images/championship.png', 1, 1, NULL),
(2, 'GIRONE', date('now'), 2, 'BIG SLAM 2', 1, '/CalcinoSlam/images/championship.png', 0, 1, NULL),
(3, 'ELIMINAZIONE', date('now'), 1, 'BIG SLAM 3', 1, '/CalcinoSlam/images/championship.png', 0, 1, NULL),
(4, 'ELIMINAZIONE', date('now'), 3, 'BIG SLAM 4', 1, '/CalcinoSlam/images/championship.png', 0, 1, NULL),
(5, 'ELIMINAZIONE', date('now'), 3, 'BIG SLAM 6', 1, '/CalcinoSlam/images/championship.png', 1, 1, NULL);

INSERT INTO matches
(id, datetime, team1, team2, to_be_played, team1_score, team2_score)
VALUES
(NULL, NULL, 0, 1, 1, NULL, NULL),
(NULL, NULL, 2, 3, 1, NULL, NULL),
(NULL, NULL, 4, 5, 1, NULL, NULL),
(NULL, NULL, 1, 3, 1, NULL, NULL);

INSERT INTO championships_matches
(id_championship, id_match, to_be_played, team1_points, team2_points, id_noticeboard)
VALUES
(1, 1, 1, NULL, NULL, 0),
(1, 2, 1, NULL, NULL, 1),
(1, 3, 1, NULL, NULL, 2),
(1, 4, 1, NULL, NULL, 3);

INSERT INTO championships_teams
(id_championship, num_team, player1, player2)
VALUES
(1, 0, 1, 8),
(1, 1, 2, 3),
(1, 2, 4, 5),
(1, 3, 6, 7);

INSERT INTO championships_players
(id_championship, id_player, place, score)
VALUES
(1, 8, 1, 10),
(1, 1, 2, 9),
(1, 2, 3, 8),
(1, 3, 4, 7),
(1, 4, 5, 6),
(1, 5, 6, 5),
(1, 6, 7, 4),
(1, 7, 8, 3),

(2, 6, 1, 10),
(2, 1, 3, 8),
(2, 2, 5, 5),
(2, 3, 1, 7),
(2, 4, 2, 9),
(2, 5, 4, 6),

(3, 4, 4, 7),
(3, 1, 3, 8),
(3, 2, 2, 9),
(3, 3, 1, 10),

(4, 8, 1, 10),
(4, 1, 2, 9),
(4, 2, 3, 8),
(4, 3, 4, 7),
(4, 4, 5, 6),
(4, 5, 6, 5),
(4, 6, 7, 4),
(4, 7, 8, 3);