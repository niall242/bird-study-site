# Import the Flask class from the flask package
from flask import Flask

# Create an instance of the Flask application
app = Flask(__name__)

# Define a route (the home page of the website)
# When someone visits http://localhost:5000/, this function will run
@app.route('/')
def home():
    # This is what the user will see on the page
    return "Hello from the Bird Study Website!"

# This tells Python to run the app only if this file is being run directly
if __name__ == '__main__':
    # Start the Flask development server
    # debug=True shows helpful error messages if something goes wrong
    app.run(debug=True)