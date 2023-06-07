// accès au mode édition si connexion réussie
// récupération du token dans le local Storage
const userToken = localStorage.getItem('jwt');
console.log(userToken);
function login() {
    if (userToken) { // user reconnu et connecté
        //afficher la top bar "edition"
        const topBar = document.querySelector(".edition");
        topBar.style.display = "flex";

        //Supprimer la barre des filtres
        const filterBar = document.querySelector(".filter");
        filterBar.style.display = "none";

        //Afficher le bouton Modifier au niveau de mes projets
        const modifyButton = document.querySelector(".openModalButton");
        modifyButton.style.display = "flex";

        //Afficher le bouton Modifier au niveau de la photo d'accueil
        const modPicture = document.querySelector(".modifyPicture");
        modPicture.style.display = "flex";

        // modifition du menu login en logout
        const loginButton = document.querySelector("#loginButton");
        loginButton.innerHTML = "logout";

    } else {
        // utilisateur non connecté
    }
}
login()


  

