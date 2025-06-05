// main.js

// This script toggles the navigation menu on small screens
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("menu-toggle");
    const navbar = document.getElementById("navbar").querySelector("ul");

    toggleBtn.addEventListener("click", () => {
        navbar.classList.toggle("show");
    });
});

// 🔒 Registration form validation
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");

    // Only run validation if the registration form exists on the current page
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            // Get input values from the form
            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirm = document.getElementById("confirm").value;

            // Validation checks
            let errors = [];

            // Check for minimum username length
            if (username.length < 3) {
                errors.push("Username must be at least 3 characters long.");
            }

            // Check for valid-looking email (very basic check)
            if (!email.includes("@") || !email.includes(".")) {
                errors.push("Please enter a valid email address.");
            }

            // Check for at least one number in the password
            if (!/\d/.test(password)) {
            errors.push("Password must contain at least one number.");
            }

            // Check that password and confirm password match
            if (password !== confirm) {
                errors.push("Passwords do not match.");
            }

            // If there are errors, stop form submission and alert the user
            if (errors.length > 0) {
                event.preventDefault(); // Prevent the form from submitting
                alert(errors.join("\n")); // Show all errors in a pop-up
            }
        });
    }
});

// 🔐 Login form validation
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    // Only run if we're on the login page
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            const username = document.getElementById("login-username").value.trim();
            const password = document.getElementById("login-password").value;

            let errors = [];

            // Check for empty fields
            if (username === "") {
                errors.push("Username or email is required.");
            }

            if (password === "") {
                errors.push("Password is required.");
            }

            // If any errors, stop submission and alert user
            if (errors.length > 0) {
                event.preventDefault();
                alert(errors.join("\n"));
            }
        });
    }
});

// 🐦 New post form validation
document.addEventListener("DOMContentLoaded", () => {
    const postForm = document.getElementById("post-form");
 
    let errors = [];

    if (postForm) {
        postForm.addEventListener("submit", function (event) {
            const species = document.getElementById("species").value;
            const location = document.getElementById("location").value;
            const activity = document.getElementById("activity").value;
            const duration = document.getElementById("duration").value;
            const date = document.getElementById("date").value;
            const time = document.getElementById("time").value;

            if (!date) {
                errors.push("Please select a date for the sighting.");
            }

            if (!time) {
                errors.push("Please select a time for the sighting.");
            }
            const photo = document.getElementById("photo").files[0];

            // Duration must be a number and greater than 0
            if (isNaN(duration) || duration < 1) {
                errors.push("Please enter a valid duration in minutes.");
            }

            // Photo (if provided) must be under 1.2MB
            if (photo && photo.size > 1200000) {
                errors.push("Image must be 1.2 MB or less.");
            }

            if (errors.length > 0) {
                event.preventDefault();
                alert(errors.join("\n"));
            }
        });
    }
});

// 🔍 Filter posts based on search input
document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.getElementById("search");
    const posts = document.querySelectorAll(".post-card");

    if (searchBox) {
        searchBox.addEventListener("input", function () {
            const query = searchBox.value.toLowerCase();

            posts.forEach(post => {
                const text = post.textContent.toLowerCase();
                post.style.display = text.includes(query) ? "block" : "none";
            });
        });
    }
});

// 🧪 Simulate Edit/Delete actions
document.addEventListener("DOMContentLoaded", () => {
    // DELETE simulation
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", function () {
            if (confirm("Are you sure you want to delete this post?")) {
                // Remove the entire post-card div
                const post = this.closest(".post-card");
                post.remove();
            }
        });
    });

    // EDIT simulation
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", function () {
            const post = this.closest(".post-card");

            // Replace post content with a simple editing form
            const existingComment = post.querySelector("p:last-of-type").textContent;

            post.innerHTML = `
                <h3>Edit Your Post</h3>
                <label for="edit-comment">Comment:</label>
                <textarea id="edit-comment" rows="4">${existingComment}</textarea>
                <br>
                <button class="save-edit-btn">Save</button>
                <button class="cancel-edit-btn">Cancel</button>
            `;

            // Add save functionality
            post.querySelector(".save-edit-btn").addEventListener("click", () => {
                const newComment = post.querySelector("#edit-comment").value;
                post.innerHTML = `
                    <h3>Post Updated</h3>
                    <p>${newComment}</p>
                    <p><em>This was a simulation – no data was saved.</em></p>
                `;
            });

            // Cancel = reload page to restore original post
            post.querySelector(".cancel-edit-btn").addEventListener("click", () => {
                location.reload();
            });
        });
    });
});

// 🖼️ Image preview for uploaded photo
document.addEventListener("DOMContentLoaded", () => {
    const photoInput = document.getElementById("photo");
    const preview = document.getElementById("preview");

    if (photoInput) {
        photoInput.addEventListener("change", function () {
            const file = this.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    preview.src = e.target.result;
                    preview.style.display = "block";
                };

                reader.readAsDataURL(file);
            } else {
                preview.src = "#";
                preview.style.display = "none";
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const facts = [
        "Birds are the only animals with feathers!",
        "Some birds can sleep while flying.",
        "Hummingbirds can flap their wings up to 80 times per second.",
        "Owls can rotate their heads 270 degrees.",
        "The Arctic Tern migrates over 40,000 miles a year!",
        "Crows are known to use tools and solve puzzles."
    ];

    const factContainers = document.querySelectorAll(".fun-fact");

    factContainers.forEach(container => {
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        container.textContent = `🐦 Fun Fact: ${randomFact}`;
    });
});

function confirmDelete(postId) {
    if (confirm("Are you sure you want to delete this post?")) {
        window.location.href = "/delete-post/" + postId;
    }
}

