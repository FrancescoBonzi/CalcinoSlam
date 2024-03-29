CREATE TABLE IF NOT EXISTS players (
	id integer PRIMARY KEY AUTOINCREMENT,
	username text NOT NULL UNIQUE,
	password text DEFAULT 'versicalabresi',
	image text,
	role text,
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
(1, 'Checco', 'versicalabresi', 'http://localhost:3003/profile.png', 'M', "Spericolato nelle giocate, come la sua preferita, la cannonata dal portiere; è difensore estroso col vizio del gol se gioca dietro e attaccante prolifico se gioca davanti. Si sottopone ad allenamenti estenuanti contro il parere di medici e famiglia  per arrivare sempre più tonico e imponente ai tornei in modo da intimorire gli avversari all’eventuale squizball da giocarsi chiaramente a torso nudo. Ossessionato dai suoi ricci, di una bellezza esagerata, I capelli vengono riempiti di almeno una decina di prodotti seguiti da attenzioni maniacali per ore al giorno. Contro questi vizi decisamente troppo moderni e mondani per un giocatore di calcino che dovrebbe dedicarsi unicamente al miglioramento della performance si schiera la matriarca della famiglia nonna Giuditta la quale ricorda spesso a Checco che assomigliare a “Nostro Signore” nei grandi slam del calcino, serve a poco.\nCuriosità: ha un fratello, Alessandro anch’egli professionista con il quale ha disputato sia in coppia sia come avversario diverse partite ufficiali.", NULL, NULL, NULL),
(2, 'Ale', 'versicalabresi', 'http://localhost:3003/profile.png', 'M', "Forse il giocatore più cresciuto e migliorato nel tempo, Bonzino si presenta oggi come uno dei migliori difensori del circuito. Solido, attento e con grande senso della posizione riesce a tenere livelli di concentrazione in grado di fiaccare qualsiasi attacco. Quando la squadra avversaria raggiunge il punteggio di 9 riesce ad aumentare a dismisura la propria determinazione per andare ad agguantare la squizball ed eventualmente, la vittoria.\nGli abitanti di Pisa hanno spesso il piacere di vederlo allenarsi sulle rive dell’Arno in compagnia della sua inseparabile canoa.\nCuriosità: ha un fratello, Francesco anch’egli professionista con il quale ha disputato sia in coppia sia come avversario diverse partite ufficiali.", NULL, NULL, NULL),
(3, 'Fede', 'versicalabresi', 'http://localhost:3003/profile.png', 'M', "Insieme a Wilson tra i migliori marcatori della sua generazione, è dotato di velocità e potenza che gli permettono di mettere in difficoltà tutte le difese. Se costretto a giocare in difesa riesce a segnare anche da questa posizione.  é però spesso distratto in fase difensiva dove è vittima di errori che un portiere esperto non commetterebbe.\nOspita lo slam dell’alta bergullonia.\nControversie: risultato borderline ad alcuni valori in un test antidoping della federazione si è giustificato asserendo di fare uno sporadico uso di sostanze a scopo ricreativo. Per la giustizia sportiva il caso è ancora aperto.", NULL, NULL, NULL),
(4, 'Wilson', 'versicalabresi', 'http://localhost:3003/profile.png', 'M', "Senza dubbio uno dei migliori giocatori in circolazione, Il Mirro cresce a pere e calcino fin da bambino, dovendo scegliere su quale di queste due passioni costruire la sua carriera agonistica, opta infine per il calciobalilla pur concedendosi ancora oggi qualche raccolta sporadica di William o di Abate.\nAttaccante imprevedibile e veloce, raffinato ma all’occasione potente, non esiste portiere che non lo tema. Quando costretto a giocare in porta si trasforma in difensore preciso e talvolta pericoloso anche offensivamente parlando.", NULL, NULL, NULL),
(5, 'Gambo', 'versicalabresi', 'http://localhost:3003/profile.png', 'M', "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur.", NULL, NULL, NULL),
(6, 'Chimico', 'versicalabresi', 'http://localhost:3003/profile.png', 'M', "Oberato di studio fin dalla nascita, e inizialmente riluttante alla partecipazione di tornei di questo nobile sport, il chimico riscopre nel calcino uno sfogo prezioso e con entusiasmo crescente si appassiona al professionismo fino a farne completamente parte. Portiere attento e, se in giornata, difficilmente penetrabile, è consigliabile non infastidirlo mentre si arriccia i corti capelli. Potrebbe infatti stare svolgendo una delle attività che più sono importanti per lui come l’acquisto di nuove calzature firmate sulla ultranota piattaforma di Jeff Bezos.", NULL, NULL, NULL),
(7, 'Macca', 'versicalabresi', 'http://localhost:3003/profile.png', 'M', "Attaccante letale capace di rapidi movimenti che imprimono alla pallina alte velocità, Macca gioca in casa  uno degli slam del calcino più antichi, nel centro storico di Imola. Potrebbe facilmente migliorare le sue prestazioni se non avesse un vizio che con lo sport non va d’accordo, è infatti risaputo che sia “uno che beve”.", NULL, NULL, NULL),
(8, 'Gulli', 'versicalabresi', 'http://localhost:3003/profile.png', 'M', "Bergullese d’origine, Gulli si appassiona in tenera età al calcino sviluppando ben presto mani grandi e forti con cui ghermire le amate manopole. Non dotato di tecnica sopraffina o di particolare velocità sopperisce le sue mancanze con una volontà e determinazione d’acciaio e un cuore sconfinato. I suoi colpi speciali sono caricati a lungo arrotolando intorno alla stecca quasi tutto l’arto superiore e rilasciati a una velocità che non di rado infrange la barriera del suono lasciando storditi gli avversari e qualche volta anche il compagno di squadra. Insieme al connazionale bergullese Fede forma una coppia patriottica imbrobabile quanto efficace. Soffre particolarmente gli attacchi di Checco quando questi si palesano accompagnati dall’urlo di battaglia GULLIBAM!", NULL, NULL, NULL),
(9, 'Gollo', 'versicalabresi', 'http://localhost:3003/profile.png', 'M', "Estremamente attento nella preparazione muscolare, Gollo vanta tiri speciali di potenza non indifferente denominati da lui stesso “Bombate”. Non ha posizioni preferite sul campo da gioco, è solito infatti disertare le lezioni tattiche dei suoi allenatori preferendo a queste ultime eventi mondani o piaceri lussuriosi. ", NULL, NULL, NULL),
(10, 'Cami', 'versicalabresi', 'http://localhost:3003/profile.png', 'F', "Unica rappresentante del gentil sesso a cimentarsi regolarmente nei tornei, Camilla non fa del suo punto di Forza la potenza o la velocità d’esecuzione quanto l’astuzia e l’imprevedibilità delle giocate. In grado di segnare a tutti i portieri in circolazione,  è dotata di un carattere piuttosto irascibile e burrascoso che la porta a condotte di gara accese e non sempre pacifiche, tanto che in carriera ha già ricevuto vari richiami disciplinari dalla FIGC (Federazione Italiana Giuoco Calcino).\nPunto debole: alle feste o ritrovi dove ci siano salatini non può avvicinarsi al calcino causa probabile presenza di noccioline o frutta a guscio che svolgono per Camilla la stessa funzione che la Kriptonite svolge per Superman.", NULL, NULL, NULL),
(11, 'Guido', 'versicalabresi', 'http://localhost:3003/profile.png', 'M', "Uno dei talenti scoperti più recentemente, è passato dal non giocare mai a comprare il proprio calcino e istituire uno degli slam più giocati, quello del LandiLand, confermando così i tre monti come zona caldissima del biliardino. Difensore concentrato, può tenere testa a tutti gli attaccanti. Ha scelto di fare esperienza fuori regione firmando un contratto annuale per una squadra milanese dove militerà per tutto il 2022.", NULL, NULL, NULL),
(12, 'Vero', 'versicalabresi', 'http://localhost:3003/profile.png', 'F', "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur.", NULL, NULL, NULL),
(13, 'Pala', 'versicalabresi', 'http://localhost:3003/profile.png', 'F', "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur.", NULL, NULL, NULL);

INSERT INTO locations
(id, name, image, comment)
VALUES
(1, 'Alta Bergullonia', '../locations/1.png', ''),
(2, 'Imola Centro Storico', '../locations/2.png', ''),
(3, 'Landiland', '../locations/3.png', ''),
(4, 'Tiro A Segno', '../locations/4.png', ''),
(5, 'Porta Romagna', '../locations/5.png', ''),
(6, 'Cuccia', '../locations/6.png', '');

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