import sqlite3

conn = sqlite3.connect('data.db')
c = conn.cursor()

# Create users table
c.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
''')

# Create posts table 
c.execute('''
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        location TEXT,
        bird_species TEXT,
        activity TEXT,
        duration INTEGER,
        date TEXT,
        time TEXT,
        comments TEXT,
        image_filename TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
''')

conn.commit()
conn.close()
print("Database initialized.")
