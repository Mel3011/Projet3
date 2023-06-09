async function loginUser() {
  //requete HTTP POST API
  const formConnect = document.querySelector("#form");
  const formData = new FormData(formConnect);
  console.log(formData);
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: formData.get("email"),
      password: formData.get("password"),
    }),
  });

  if (response.status === 200) {
    // statut 200, connexion réussie
    // obtenir le corps de réponse (méthode ci-dessus)
    const data = await response.json();
    console.log("Connexion réussie !");
    // Stockage du token
    const token = data.token;
    localStorage.setItem("jwt", token);
    // Renvoi à la page d'accueil si connexion réussie
    window.location.href = "index.html";

    console.log("Connexion réussie !");
  } else if (response.status === 401) {
    // erreur 401, identifiants invalides
    alert("Login ou mot de passe incorrect");
  } else if (response.status === 404) {
    // erreur 404, utilisateur non trouvé
    alert("Utilisateur non trouvé");
  } else {
    // autres cas
    alert("Erreur lors de la connexion, veuillez réessayer ultérieurement");
  }
}

//Ecoute du bouton submit
const form = document.querySelector("#form");
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // empeche le rechargement de la page par défaut
  console.log("demande envoyée");

  loginUser();
});
