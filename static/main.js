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

            // Photo (if provided) must be under 6MB
            if (photo && photo.size > 6000000) {
                errors.push("Image must be 6 MB or less.");
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
        "Peregrine falcons are the fastest animals on Earth, diving at over 240 mph.",
        "Hummingbirds can fly backward and hover in place.",
        "Some birds can sleep while flying.",
        "Owls can rotate their heads up to 270 degrees but can't move their eyes.",
        "Flamingos are born gray — their pink color comes from their diet.",
        "Chickens have over 200 distinct vocalizations.",
        "Kiwi birds have nostrils at the tip of their beaks.",
        "White bellbirds are the loudest birds, hitting 125 decibels.",
        "Penguins are excellent swimmers but can't fly.",
        "Northern shrikes impale prey on thorns or wire to store food.",
        "Cockatoos in Sydney have learned to use public water fountains.",
        "Albatrosses have a wingspan of up to 11 feet.",
        "Bee hummingbirds are the smallest birds — only about 2 inches long.",
        "Ostriches are the largest birds and can sprint at 45 mph.",
        "Emus, the second-largest birds, can run up to 30 mph.",
        "Kakapos are nocturnal, flightless parrots from New Zealand.",
        "Penguins use their wings as flippers for underwater travel.",
        "Birds are the only living animals with feathers.",
        "Birds breathe with a one-way airflow system through their lungs.",
        "Some birds, like the white-throated sparrow, have color-based personalities.",
        "Black-capped chickadees grow bigger brains in autumn to remember food caches.",
        "Bird bones are hollow, making them light enough to fly.",
        "The Arctic tern migrates over 44,000 miles every year.",
        "Lyrebirds can mimic chainsaws and camera shutters.",
        "Common swifts can stay airborne for 10 months straight.",
        "Secretary birds hunt snakes by stomping them to death.",
        "Oilbirds use echolocation to navigate dark caves.",
        "Harpy eagles have talons as strong as a bear’s grip.",
        "Bearded vultures eat bones for the marrow inside.",
        "American woodcocks perform aerial “sky dances” to attract mates.",
        "Eurasian wrynecks twist their heads like snakes when threatened.",
        "Red-capped manakins dance like they’re moonwalking.",
        "Wilson’s bird-of-paradise cleans its display court to impress females.",
        "Blue-footed boobies use their colorful feet in mating dances.",
        "Great potoos are masters of camouflage, looking like broken branches.",
        "Tawny frogmouths blend perfectly with tree bark.",
        "European cuckoos lay eggs in other birds’ nests.",
        "Bar-tailed godwits fly nonstop from Alaska to New Zealand.",
        "Crows are known to use tools and solve puzzles."
    ];

    // Shuffle the facts array
    for (let i = facts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [facts[i], facts[j]] = [facts[j], facts[i]];
    }

    // Assign each shuffled fact to a .fun-fact element
    const factContainers = document.querySelectorAll(".fun-fact");

    factContainers.forEach((container, i) => {
        container.textContent = `🐦 Fun Fact: ${facts[i % facts.length]}`;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const posts = document.querySelectorAll('.post-wrapper');

    searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase();

        posts.forEach(post => {
            const text = post.innerText.toLowerCase();
            post.style.display = text.includes(term) ? '' : 'none';
        });
    });
});

function confirmDelete(postId) {
    if (confirm("Are you sure you want to delete this post?")) {
        window.location.href = "/delete-post/" + postId;
    }
}

