document.addEventListener('DOMContentLoaded', () => {

    // Get all necessary elements from the DOM
    const showLoginBtn = document.getElementById('showLoginBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const signInModal = document.getElementById('signInModal');
    const signUpModal = document.getElementById('signUpModal');
    const closeButtons = document.querySelectorAll('.close-btn');
    const showSignUpLink = document.getElementById('showSignUpLink');
    const showSignInLink = document.getElementById('showSignInLink');
    const signupSuccess = document.getElementById('success');
    const passwordToggles = document.querySelectorAll('.toggle-password');
    const savedUser = localStorage.getItem('username');
    const logoutModal = document.getElementById('logoutModal');
    const confirmLogout = document.getElementById('confirmLogout');
    const cancelLogout = document.getElementById('cancelLogout');
    const HistoryPage = document.getElementById('History');
    const RecipePage = document.getElementById('Recipe');
    const savedPage = localStorage.getItem('activePage');
    const recipePopup = document.getElementById('recipe-page');
    const HistoryPopup = document.getElementById('history-page');
    const gotorecipe = document.getElementById('go-recipe');
    const viewmodal = document.getElementById("viewRecipeModal");
    const deletemodal = document.getElementById("confirmDeleteModal");
    // Open modal




    //history
    function showRecipeModal(recipe) {
        //console.log(recipe);
        const viewModal = document.getElementById('viewRecipeModal');
        document.getElementById("recipe-title").textContent = recipe.menuname;
        document.getElementById("allergy").textContent = recipe.food_allergy;
        document.getElementById("description").textContent = recipe.description;
        const ingList = document.getElementById("ingredients");
        ingList.innerHTML = "";

        // Convert ingredient string to array (split by commas)
        const ingredientsArray = recipe.ingredient
            ? recipe.ingredient.split("\n").map(i => i.trim())
            : [];

        ingredientsArray.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            ingList.appendChild(li);
        });

        if (ingredientsArray.length === 0) {
            ingList.innerHTML = "<li>None</li>";
        }

        // Instructions
        const instrList = document.getElementById("instructions");
        instrList.innerHTML = "";

        // Convert instruction string to array (split by newline or comma)
        const instructionsArray = recipe.instruction
            ? recipe.instruction.split("\n").map(s => s.trim())
            : [];

        instructionsArray.forEach(step => {
            const li = document.createElement("li");
            li.textContent = step;
            instrList.appendChild(li);
        });

        if (instructionsArray.length === 0) {
            instrList.innerHTML = "<li>None</li>";
        }
        modalOverlay.classList.add('active');
        viewModal.classList.add('active');
    }
    async function loadHistory() {
        const username = localStorage.getItem('username');
        const historyListInner = document.querySelector('.history-list-inner');
        const text = document.getElementById("text-to-show");

        const res = await fetch(`${BACKEND_URL}/history/${username}`);
        const data = await res.json();
        recipes = data.storeData || []; // assign to global

        // Clear previous items
        historyListInner.innerHTML = '';

        if (recipes.length === 0) {
            text.style.display = 'flex';
            return;
        }
        text.style.display = 'none';

        recipes.forEach((item, index) => {
            const div = document.createElement('div');
            div.classList.add('history-item');
            div.innerHTML = `
            <div class="item-info">
                <h3>${item.menuname}</h3>
                <p>Generated on: ${new Date(item.createdAt).toLocaleDateString()}</p>
            </div>
            <div class="item-actions">
                <button class="btn-view" data-index="${index}">View</button>
                <button class="btn-delete" data-index="${index}">&times;</button>
            </div>
        `;
            historyListInner.appendChild(div);
        });

        // Add click listeners for view buttons
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = btn.dataset.index;
                showRecipeModal(recipes[idx]); // now recipes is accessible globally
            });
        });
        document.querySelectorAll('.btn-delete').forEach((button, index) => {
            button.addEventListener("click", () => {
                modalOverlay.classList.add('active');
                deletemodal.classList.add('active');

                // YES button click
                document.getElementById("confirmYesBtn").onclick = async () => {
                    const username = localStorage.getItem('username');
                    const itemIndex = button.dataset.index;

                    // Show loading spinner
                    const deleteSpinner = document.getElementById("deleteLoadingSpinner");
                    deleteSpinner.style.display = "block";

                    try {
                        const res = await fetch(`${BACKEND_URL}/itemdelete/${username}/${itemIndex}`, {
                            method: 'DELETE',
                        });
                        const result = await res.json();
                        console.log('Delete result:', result);

                        // Remove item from UI
                        button.closest('.history-item').remove();

                        // Close modal
                        modalOverlay.classList.remove('active');
                        deletemodal.classList.remove('active');
                        loadHistory();


                    } catch (err) {
                        console.error('Delete failed:', err);
                        alert("Delete failed, please try again.");
                    } finally {
                        // Hide loading spinner
                        deleteSpinner.style.display = "none";
                    }
                };
            });
        });

        // NO button
        document.getElementById("confirmNoBtn").addEventListener("click", () => {
            modalOverlay.classList.remove('active');
        });

    }
    function openModal(ElementSend) {
        modalOverlay.classList.add('active');
        ElementSend.classList.add('active');
    }

    function switch_to_history() {
        HistoryPage.classList.add('active');
        RecipePage.classList.remove('active');
        recipePopup.style.display = 'none';
        HistoryPopup.style.display = 'block';
        loadHistory();
    }
    function switch_to_recipe() {
        RecipePage.classList.add('active');
        HistoryPage.classList.remove('active');
        recipePopup.style.display = 'block';
        HistoryPopup.style.display = 'none';

    }
    if (savedPage === 'history') {

        switch_to_history()
    } else {
        switch_to_recipe()
    }
    if (savedUser) {
        showLoginBtn.textContent = savedUser; // show username
    }
    // Function to open the modal overlay and a specific modal

    // Function to close all modals and the overlay
    function closeModal() {
        modalOverlay.classList.remove('active');
        signInModal.classList.remove('active');
        signUpModal.classList.remove('active');
        viewmodal.classList.remove('active');
        deletemodal.classList.remove('active');
        document.getElementById('signup-username').value = "";
        document.getElementById('signup-password').value = "";
        document.getElementById('signup-confirm-password').value = "";
        document.getElementById('signin-username').value = "";
        document.getElementById('signin-password').value = "";
    }

    // --- Event Listeners ---

    // Show Sign In modal when header button is clicked

    showLoginBtn.addEventListener('click', () => {
        const currentUser = localStorage.getItem('username');
        if (currentUser) {
            logoutModal.style.display = 'flex';
        }
        else {
            openModal(signInModal);
        }
    });
    confirmLogout.addEventListener('click', () => {
        localStorage.removeItem('username');
        showLoginBtn.textContent = "Log in";
        logoutModal.style.display = 'none';
        const savedPage = localStorage.getItem('activePage');
        if (savedPage === 'history') {
            switch_to_recipe();
            localStorage.setItem('activePage', 'recipe');
        }
    });

    // Cancel logout
    cancelLogout.addEventListener('click', () => {
        logoutModal.style.display = 'none';
    });
    // Switch from Sign In to Sign Up
    showSignUpLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent link from navigating
        signInModal.classList.remove('active');
        signUpModal.classList.add('active');
    });

    // Switch from Sign Up to Sign In
    showSignInLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent link from navigating
        signUpModal.classList.remove('active');
        signInModal.classList.add('active');
    });

    // Close modal when any close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    // Close modal when clicking on the overlay (outside the modal content)

    // Toggle password visibility
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const passwordInput = toggle.previousElementSibling;
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggle.classList.remove('fa-eye-slash');
                toggle.classList.add('fa-eye');
            } else {
                passwordInput.type = 'password';
                toggle.classList.remove('fa-eye');
                toggle.classList.add('fa-eye-slash');
            }
        });
    });
    //Ok button
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'ok-button') {
            closeModal();
            signupSuccess.style.display = 'none';
        }
    });
    HistoryPage.addEventListener('click', (e) => {
        e.preventDefault(); // prevent default link behavior if it's <a>

        const currentUser = localStorage.getItem('username');

        if (!currentUser) {
            // user not logged in → show login modal
            openModal(signInModal);
            return; // stop here
        }

        // If user is logged in → toggle active classes
        if (!HistoryPage.classList.contains('active')) {
            switch_to_history();
            localStorage.setItem('activePage', 'history');

        }
    });
    RecipePage.addEventListener('click', (e) => {
        e.preventDefault(); // prevent default link behavior if it's <a>

        // If user is logged in → toggle active classes
        if (!RecipePage.classList.contains('active')) {
            switch_to_recipe();
            localStorage.setItem('activePage', 'recipe');
        }
    });
    gotorecipe.addEventListener('click', () => {
        switch_to_recipe();
    });

    const saveBtn = document.querySelector('#generatedRecipeModal .btn-save');

    // Get the form element
    saveBtn.addEventListener('click', async (e) => {
        e.preventDefault(); // prevent page refresh


        const currentUser = localStorage.getItem('username');
        if (!currentUser) {
            // user not logged in → show login modal
            console.log('yes');
            const generatedRecipeModal = document.getElementById("generatedRecipeModal");
            const signInModal = document.getElementById('signInModal');
            const modalOverlay = document.getElementById('modalOverlay');
            modalOverlay.classList.add('active');
            generatedRecipeModal.classList.remove('active');
            signInModal.classList.add('active');
            return; // stop here
        }
        const store_ingredientList = Array.from(document.querySelectorAll('#modal-ingredients li'))
            .map(li => li.textContent)
            .join('\n');  // join as a single string

        const store_instructionList = Array.from(document.querySelectorAll('#modal-instructions li'))
            .map(li => li.textContent)
            .join('\n');


        // Collect form data
        const formData = {
            username: currentUser,
            menuname: document.getElementById('modal-recipe-title').textContent,
            food_allergy: document.getElementById('modal-allergy').textContent,
            description: document.getElementById("modal-description").textContent,
            ingredient: store_ingredientList,
            instruction: store_instructionList,

        };

        console.log('Form Data:', formData);

        // Example: send to backend using fetch

        const response = await fetch(`${BACKEND_URL}/itemadd`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log('Recipe Result:', result);

        // TODO: display result in your modal or page
        const generatedRecipeModal = document.getElementById("generatedRecipeModal");
        const recipeResultContent = document.getElementById('result-content');
        modalOverlay.classList.remove('active');
        generatedRecipeModal.classList.remove('active');
    });
});
