from flask import Flask, render_template, request, redirect, url_for, flash, session
import sqlite3
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Replace with a strong secret key

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 6 * 1024 * 1024  # 6 MB
print("Max upload size set to:", app.config['MAX_CONTENT_LENGTH'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

import subprocess
if not os.path.exists('data.db'):
    subprocess.run(['python', 'init_db.py'])

@app.route('/')
def home():
    with sqlite3.connect('data.db') as conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("""
            SELECT id, image_filename 
            FROM posts 
            WHERE image_filename IS NOT NULL 
            ORDER BY id DESC 
            LIMIT 3
        """)
        images = c.fetchall()

    return render_template('index.html', images=images)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']

        with sqlite3.connect('data.db') as conn:
            c = conn.cursor()
            try:
                c.execute("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", 
                          (username, password, email))
                conn.commit()
                flash('Registration successful! Please log in.')
                return redirect(url_for('login'))
            except sqlite3.IntegrityError:
                flash('Username already taken.')

    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        with sqlite3.connect('data.db') as conn:
            c = conn.cursor()
            c.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password))
            user = c.fetchone()

        if user:
            session['user_id'] = user[0]      # user.id
            session['username'] = user[1]     # user.username
            return redirect(url_for('all_posts'))
        else:
            flash("Invalid credentials.")

    return render_template('login.html')


@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if 'user_id' not in session:
        flash("You need to log in to post.")
        return redirect(url_for('login'))

    if request.method == 'POST':
        user_id = session['user_id']
        location = request.form['location']
        bird_species = request.form['bird_species']
        activity = request.form['activity']
        duration = request.form['duration']
        date = request.form['date']
        time = request.form['time']
        comments = request.form['comments']
        
        image = request.files['image']
        filename = None

        if image and image.filename != "":
            if allowed_file(image.filename):
                filename = secure_filename(image.filename)
                image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            else:
                flash("Your file is not supported (JPG or PNG required). You can also upload without a picture.")
                return render_template('new_post.html')

        with sqlite3.connect('data.db') as conn:
            c = conn.cursor()
            c.execute('''INSERT INTO posts 
                (user_id, location, bird_species, activity, duration, date, time, comments, image_filename)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (user_id, location, bird_species, activity, duration, date, time, comments, filename))
            conn.commit()

        flash("Post uploaded successfully.")
        return redirect(url_for('all_posts'))

    return render_template('new_post.html')


@app.route('/all-posts')
def all_posts():
    print("Logged in as:", session.get('username'))

    with sqlite3.connect('data.db') as conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute('''
            SELECT posts.*, users.username 
            FROM posts 
            JOIN users ON posts.user_id = users.id 
            ORDER BY posts.id DESC
        ''')
        posts = c.fetchall()
    
    return render_template('all_posts.html', posts=posts)

@app.route('/my-posts')
def my_posts():
    if 'user_id' not in session:
        flash("You must be logged in to view your posts.")
        return redirect(url_for('login'))

    user_id = session['user_id']

    with sqlite3.connect('data.db') as conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute('''
            SELECT posts.*, users.username 
            FROM posts 
            JOIN users ON posts.user_id = users.id 
            WHERE users.id = ? 
            ORDER BY posts.id DESC
        ''', (user_id,))
        posts = c.fetchall()

    return render_template('my_posts.html', posts=posts)

    # Filter for posts that belong to the current user
    user_posts = [p for p in all_posts if p['username'] == session['username']]

    return render_template('my_posts.html', posts=user_posts)

@app.route('/logout')
def logout():
    session.clear()
    flash("You have been logged out.")
    return redirect(url_for('login'))

@app.route('/reset-session')
def reset_session():
    session.clear()
    return "Session cleared. You can now log in fresh."

@app.route('/edit-post/<int:post_id>', methods=['GET', 'POST'])
def edit_post(post_id):
    if 'user_id' not in session:
        flash("You must be logged in to edit posts.")
        return redirect(url_for('login'))

    with sqlite3.connect('data.db') as conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()

        # Only select the post if it belongs to the logged-in user
        c.execute("SELECT * FROM posts WHERE id = ? AND user_id = ?", (post_id, session['user_id']))
        post = c.fetchone()

        if not post:
            flash("Post not found or access denied.")
            return redirect(url_for('all_posts'))

        if request.method == 'POST':
            location = request.form['location']
            bird_species = request.form['bird_species']
            activity = request.form['activity']
            duration = request.form['duration']
            date = request.form['date']
            time = request.form['time']
            comments = request.form['comments']

            c.execute('''
                UPDATE posts
                SET location = ?, bird_species = ?, activity = ?, duration = ?, date = ?, time = ?, comments = ?
                WHERE id = ?
            ''', (location, bird_species, activity, duration, date, time, comments, post_id))
            conn.commit()

            flash("Post updated successfully.")
            return redirect(url_for('all_posts'))

    return render_template('edit_post.html', post=post)


@app.route('/delete-post/<int:post_id>')
def delete_post(post_id):
    if 'user_id' not in session:
        flash("You must be logged in to delete posts.")
        return redirect(url_for('login'))

    with sqlite3.connect('data.db') as conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()

        # Make sure the post belongs to the logged-in user
        c.execute("SELECT * FROM posts WHERE id = ? AND user_id = ?", (post_id, session['user_id']))
        post = c.fetchone()

        if not post:
            flash("Post not found or access denied.")
            return redirect(url_for('my_posts'))

        # Delete the image file if it exists
        if post['image_filename']:
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], post['image_filename'])
            if os.path.exists(image_path):
                os.remove(image_path)

        # Delete the post from the database
        c.execute("DELETE FROM posts WHERE id = ?", (post_id,))
        conn.commit()

    flash("Post deleted successfully.")
    return redirect(url_for('all_posts'))




if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)

