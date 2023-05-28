//Appel API pour récupérer toutes les catégories

fetch("http://localhost:5678/api/categories")
.then(response => response.json())
.then((categories) => {

    for (let i = 0; i < categories.length; i++) {
        const element = categories[i];
        console.log(element);
        // Récupération de la class 
        const allCategories = document.querySelector(".filter");
        // Création des éléments composant le filtre
        const titreElement = document.createElement("p");
        titreElement.innerText = element.name;
        
        // Rattachement des balises
        // On rattache la balise article à la section Fiches
                allCategories.appendChild(titreElement)
       }
}
// création de la fonction filtre
    //const boutonFiltrer = document.querySelector(".filter");
    //boutonFiltrer.addEventListener("click",function () {
    //const worksFiltres = p.filter(function (work) {
       // return work.categories.name == "Objets";
        //})
    //});
)
