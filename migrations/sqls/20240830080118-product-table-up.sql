/* Replace with your SQL commands */
CREATE TABLE Products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price FLOAT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0
);