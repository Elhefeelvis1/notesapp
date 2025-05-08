CREATE TABLE users (
    id PRIMARY KEY SERIAL,
    name VARCHAR(45) NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    UNIQUE (email)
);

CREATE TABLE notes (
    id PRIMARY KEY SERIAL,
    title TEXT,
    content TEXT,
    last_updated date,
    favourite BOOLEAN,
    completed BOOLEAN,
    user_id INTEGER REFERENCES users(id),
    UNIQUE (title, content)
);

