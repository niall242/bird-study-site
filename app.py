from flask import Flask, render_template, session

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Replace with a strong secret key

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/register')
def register():
    # This route displays the user registration form
    # The form is styled using CSS and rendered from register.html
    return render_template('register.html')

@app.route('/login')
def login():
    # This route displays the login form
    return render_template('login.html')

@app.route('/upload')
def upload():
    # Render the bird sighting upload form
    return render_template('new_post.html')

#@app.route('/all-posts')
#def all_posts():
#    return render_template('all_posts.html')

@app.route('/all-posts')
def all_posts():
    # Simulate that a user is logged in
    session['user_id'] = 1
    session['username'] = 'nature_lover'

    # Simulated posts (normally you'd fetch from a DB)
    posts = [
        {
            'id': 1,
            'username': 'nature_lover',
            'species': 'Blackbird',
            'location': 'Marend',
            'datetime': '2025-04-14 07:45',
            'activity': 'Feeding',
            'duration': 15,
            'comment': 'A beautiful blackbird was eating berries near the park.',
            'image_url': 'https://source.unsplash.com/300x200/?blackbird'
        },
        {
            'id': 2,
            'username': 'birdwatch_girl',
            'species': 'Starling',
            'location': 'Docia',
            'datetime': '2025-04-13 18:20',
            'activity': 'Nesting',
            'duration': 30,
            'comment': 'Saw a small group building a nest near the library.',
            'image_url': 'https://source.unsplash.com/300x200/?starling'
        }
    ]

    return render_template('all_posts.html', posts=posts)

@app.route('/my-posts')
def my_posts():
    # Simulate the current user
    session['username'] = 'nature_lover'

    # Simulated database (same as before)
    all_posts = [
        {
            'id': 1,
            'username': 'nature_lover',
            'species': 'Blackbird',
            'location': 'Marend',
            'datetime': '2025-04-14 07:45',
            'activity': 'Feeding',
            'duration': 15,
            'comment': 'A beautiful blackbird was eating berries near the park.',
            'image_url': 'https://source.unsplash.com/300x200/?blackbird'
        },
        {
            'id': 2,
            'username': 'birdwatch_girl',
            'species': 'Starling',
            'location': 'Docia',
            'datetime': '2025-04-13 18:20',
            'activity': 'Nesting',
            'duration': 30,
            'comment': 'Saw a small group building a nest near the library.',
            'image_url': 'https://source.unsplash.com/300x200/?starling'
        }
    ]

    # Filter for posts that belong to the current user
    user_posts = [p for p in all_posts if p['username'] == session['username']]

    return render_template('my_posts.html', posts=user_posts)

@app.route('/logout')
def logout():
    # Clear the fake session to simulate logout
    session.clear()
    return "You have been logged out (simulated)."

if __name__ == '__main__':
    app.run(debug=True)
