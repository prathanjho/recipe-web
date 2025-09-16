const BACKEND_URL = 'http://3.94.163.181:3000';
const GEMINI_API_KEY = "AIzaSyAVNJJDkcvhDWBSSOIVt9XW6kE-7UB1Xpo";
document.getElementById('signUpModal').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const confirm_password = document.getElementById('signup-confirm-password').value;
    const errorUser = document.getElementById('username-not-acceptable');
    const errorPass = document.getElementById('final-stage-error');
    const Success = document.getElementById('success');
    const Successtext = document.getElementById('popup-message');
    errorPass.textContent = '';
    errorUser.textContent = '';
    let Char = false;
    let num = false;
    for (let i = 0; i < username.length; i++) {
        const ch = username[i];
        if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) Char = true;
        if (ch >= '0' && ch <= '9') num = true;
    }
    if (!Char || !num) {
        errorUser.textContent = "Username must contain both character and number";
        return;
    }
    if (password !== confirm_password) {
        errorPass.textContent = "Passwords do not match!";
        return;
    }
    Char = false;
    num = false;
    let length = (password.length >= 8);
    for (let i = 0; i < password.length; i++) {
        const ch = password[i];
        if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) Char = true;
        if (ch >= '0' && ch <= '9') num = true;
    }
    if (!Char || !num || !length) {
        errorPass.textContent = "password must contain both character, number, and have length of atleast eight";
        return;
    }
    const response = await fetch(`${BACKEND_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (data.error) {
        // Show backend error (e.g., username already exists)
        errorPass.textContent = 'Username has already exist';
    }
    else {

        Success.style.display = 'block';
        Successtext.textContent = 'Signup successful!';

    }
});
document.getElementById('signInModal').addEventListener('submit', async (e) => {

    e.preventDefault();

    const username = document.getElementById('signin-username').value;
    const password = document.getElementById('signin-password').value;
    const errorUser = document.getElementById('user-not-accept');
    const errorPass = document.getElementById('Pass-not-accept');
    const Success = document.getElementById('success');
    const Successtext = document.getElementById('popup-message');
    const loginBtn = document.getElementById('showLoginBtn');

    errorUser.textContent = '';
    errorPass.textContent = '';
    const response = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (data.message === "User not found") {
        errorUser.textContent = "Username doesn't exist";
        return;
    }
    if (data.message == "Wrong password") {
        errorPass.textContent = "Password do not match";
        return;
    }

    const modalOverlay = document.getElementById('modalOverlay');
    const signInModal = document.getElementById('signInModal');
    const signUpModal = document.getElementById('signUpModal');
    modalOverlay.classList.remove('active');
    signInModal.classList.remove('active');
    signUpModal.classList.remove('active');
    document.getElementById('signup-username').value = "";
    document.getElementById('signup-password').value = "";
    document.getElementById('signup-confirm-password').value = "";
    document.getElementById('signin-username').value = "";
    document.getElementById('signin-password').value = "";
    localStorage.setItem('username', username);
    // Change button text
    loginBtn.textContent = username;

});

const findBtn = document.querySelector('#recipe-page .btn-find-recipe-v2');

findBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const modalOverlay = document.getElementById('modalOverlay');
    const generatedRecipeModal = document.getElementById("generatedRecipeModal");
    const recipeResultContent = document.getElementById('result-content');
    const loadingSpinner = document.getElementById("loadingSpinner");

    const Menu = document.getElementById("menu-name").value;
    const req_food_allergy = document.getElementById("food-allergy").value;
    const req_description = document.getElementById("specific-descriptions").value;
    const age_range = document.getElementById("age").value;
    const selected_gender = document.getElementById("gender").value;
    const req_congenital_disease = document.getElementById("congenital-disease").value;
    // Open modal + show loading
    document.getElementById("modal-recipe-title").textContent = "Loading";
    document.getElementById("modal-description").textContent = "None";
    document.getElementById("modal-ingredients").textContent = "None";
    document.getElementById("modal-instructions").textContent = "None";

    modalOverlay.classList.add('active');
    generatedRecipeModal.classList.add('active');
    loadingSpinner.style.display = "block";
    recipeResultContent.style.display = "none";

    const response = await fetch(`${BACKEND_URL}/api/recipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            menu: Menu,
            food_allergy: req_food_allergy,
            description: req_description,
            age: age_range,
            gender: selected_gender,
            congenital_disease: req_congenital_disease
        })
    });

    let recipe = await response.json();
    console.log(recipe);

    if (!recipe) {
        recipe = {
            title: "Failed to fetch recipe",
            description: "The AI service is currently unavailable.",
            ingredients: [],
            instructions: []
        };
    }

    // --- Fill modal with recipe data ---
    document.getElementById("modal-recipe-title").textContent = recipe.title || Menu || "Untitled Recipe";
    document.getElementById("modal-allergy").textContent = req_food_allergy || "None";
    document.getElementById("modal-description").textContent = recipe.description || "None";

    const ingList = document.getElementById("modal-ingredients");
    ingList.innerHTML = recipe.ingredients?.length
        ? recipe.ingredients.map(i => `<li>${i}</li>`).join("")
        : "<li>None</li>";

    const instrList = document.getElementById("modal-instructions");
    instrList.innerHTML = recipe.instructions?.length
        ? recipe.instructions.map(s => `<li>${s}</li>`).join("")
        : "<li>None</li>";

    loadingSpinner.style.display = "none";
    recipeResultContent.style.display = "block";
});
