CREATE TABLE IF NOT EXISTS players (
	id integer PRIMARY KEY AUTOINCREMENT,
	name text NOT NULL UNIQUE,
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
	active integer NOT NULL,
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
	image text
);

CREATE TABLE IF NOT EXISTS matches (
	id integer PRIMARY KEY AUTOINCREMENT,
	datetime datetime NOT NULL,
	team1_player1 integer NOT NULL,
	team1_player2 integer NOT NULL,
	team2_player1 integer NOT NULL,
	team2_player2 integer NOT NULL,
	team1_score integer NOT NULL,
	team2_score integer NOT NULL,
	CONSTRAINT fk_players_team1_player1
    	FOREIGN KEY (team1_player1)
    	REFERENCES players(id)
	CONSTRAINT fk_players_team1_player2
    	FOREIGN KEY (team1_player2)
    	REFERENCES players(id)
	CONSTRAINT fk_players_team2_player1
    	FOREIGN KEY (team2_player1)
    	REFERENCES players(id)
	CONSTRAINT fk_players_team2_player2
    	FOREIGN KEY (team2_player2)
    	REFERENCES players(id)
);

CREATE TABLE IF NOT EXISTS championships_matches (
	id_championship integer NOT NULL,
	id_match integer NOT NULL,
	team1_points integer NOT NULL,
	team2_points integer NOT NULL,
	tournament text,
	CONSTRAINT primary_keys PRIMARY KEY (id_championship, id_match),
	CONSTRAINT fk_championships
    	FOREIGN KEY (id_championship)
    	REFERENCES championships(id),
	CONSTRAINT fk_matches
    	FOREIGN KEY (id_match)
    	REFERENCES matches(id)
);

CREATE TABLE IF NOT EXISTS championships_players (
	id_championship integer NOT NULL,
	id_player integer NOT NULL,
	place integer NOT NULL,
	score float NOT NULL,
	CONSTRAINT primary_keys PRIMARY KEY (id_championship, id_player),
	CONSTRAINT fk_championships
    	FOREIGN KEY (id_championship)
    	REFERENCES championships(id),
	CONSTRAINT fk_players
    	FOREIGN KEY (id_player)
    	REFERENCES players(id)
);

INSERT INTO players
(id, name, image,  sex, biography, mail, address, city)
VALUES
(NULL, 'Checco', '/CalcinoSlam/images/player.png', 'M', NULL, NULL, NULL, NULL),
(NULL, 'Ale', '/CalcinoSlam/images/player.png', 'M', NULL, NULL, NULL, NULL),
(NULL, 'Fede', '/CalcinoSlam/images/player.png', 'M', NULL, NULL, NULL, NULL),
(NULL, 'Wilson', '/CalcinoSlam/images/player.png', 'M', NULL, NULL, NULL, NULL),
(NULL, 'Gambo', '/CalcinoSlam/images/player.png', 'M', NULL, NULL, NULL, NULL),
(NULL, 'Il Chimico', '/CalcinoSlam/images/player.png', 'M', NULL, NULL, NULL, NULL),
(NULL, 'Macca', '/CalcinoSlam/images/player.png', 'M', NULL, NULL, NULL, NULL),
(NULL, 'Gulli', '/CalcinoSlam/images/player.png', 'M', NULL, NULL, NULL, NULL),
(NULL, 'Gollo', '/CalcinoSlam/images/player.png', 'M', NULL, NULL, NULL, NULL),
(NULL, 'Cami', '/CalcinoSlam/images/player.png', 'F', NULL, NULL, NULL, NULL);

INSERT INTO locations
(id, name, image)
VALUES
(1, 'Bergullonia Alta', '/CalcinoSlam/images/location.png'),
(2, 'Imola City Centre', '/CalcinoSlam/images/location.png');

INSERT INTO championships
(id, type, date, organizer, name, location, image, active, season, comment)
VALUES
(1, 'GIRONI', date('now'), 1, 'BIG SLAM 1', 1, '/CalcinoSlam/images/championship.png', 0, 1, NULL),
(2, 'GIRONI', date('now'), 2, 'BIG SLAM 2', 1, '/CalcinoSlam/images/championship.png', 0, 1, NULL),
(3, 'ELIMINAZIONE', date('now'), 1, 'BIG SLAM 3', 1, '/CalcinoSlam/images/championship.png', 0, 1, NULL),
(4, 'ELIMINAZIONE', date('now'), 3, 'BIG SLAM 4', 1, '/CalcinoSlam/images/championship.png', 0, 1, NULL),
(5, 'ELIMINAZIONE', date('now'), 3, 'BIG SLAM 6', 1, '/CalcinoSlam/images/championship.png', 1, 1, NULL);

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

-- classifica
/*
SELECT AVG(score)
FROM championships_players
GROUP BY id_player
*/