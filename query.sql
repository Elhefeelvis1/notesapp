CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    UNIQUE (email)
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    title TEXT,
    content TEXT,
    last_updated date,
    favourite BOOLEAN,
    completed BOOLEAN,
    user_id INTEGER REFERENCES users(id),
    UNIQUE (title, content)
);

INSERT INTO notes (
	title, content, last_updated, favourite, completed,
	user_id
) VALUES ("Test Note 3", "This is a test note for user test2", "2/2/2025", true, true, 3)