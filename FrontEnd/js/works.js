//Appel API pour récupérer tous les travaux

fetch("http://localhost:5678/api/works")
.then(response => response.json())
.then((works) => {

    for (let i = 0; i < works.length; i++) {
        const element = works[i];

        // Récupération de la class 
        const galleryWorks = document.querySelector(".gallery");
        // Création de la fiche pour un work
        const workElement = (document.createElement("figure"));
        // Création des éléments composant la fiche
        const imageElement = document.createElement("img");
        imageElement.src = element.imageUrl;
        const titreElement = document.createElement("figcaption");
        titreElement.innerText = element.title;
        
        // Rattachement des balises
        // On rattache la balise article à la section Fiches
                galleryWorks.appendChild(workElement)
                workElement.appendChild(imageElement);
                workElement.appendChild(titreElement);

    }
})

