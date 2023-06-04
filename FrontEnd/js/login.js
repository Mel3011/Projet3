async function loginUser() {

    //requete HTTP POST API
    const formConnect = document.querySelector("#login form");
    const formData = new FormData(formConnect);
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json"},
        body: JSON.stringify ({
            "email": "string",
            "password": "string"
          }),
    });

    if (response.status === 200) { // statut 200, connexion réussie
        // obtenir le corps de réponse (méthode ci-dessus)
        const userId = await response.json();
        console.log("Connexion réussie !");
    } else if (response.status === 401) { // erreur 401, identifiants invalides
        alert("HTTP-Error: " + response.status);
        console.error("Login ou mot de passe incorrect");
    } else if (response.status === 404) { // erreur 404, utilisateur non trouvé
        alert("HTTP-Error: " + response.status);
        console.error("Utilisateur non trouvé");
    } else { // autres cas
        alert("HTTP-Error: " + response.status);
        console.error("Erreur lors de la connexion, veuillez réessayer ultérieurement");

      }
}
    
    //Ecoute du bouton submit
    const form = document.querySelector("#login form");
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // empeche le rechargement de la page par défaut
        console.log("demande envoyée");

    const email = document.querySelector("#login-email").value;
    const paswword = document.querySelector("#login-password").value;

    loginUser();
    });

