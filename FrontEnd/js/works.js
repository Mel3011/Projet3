async function fetchWorks() {
    try {
      const response = await fetch('http://localhost:5678/api/works');
      const works = await response.json();


      // Création de l'objet catégories
      const categories = new Set();
  
      for (let i = 0; i < works.length; i++) {
        const work = works[i];
        const category = work.category.name;
  
        categories.add(category); // Ajout de la catégorie à l'objet Set pour obtenir les catégories uniques
      }

      // Parcourir les catégories uniques
        categories.forEach((category) => {
        });
        console.log(categories);

        // Création de la barre de filtres
        const filterBar = document.createElement('div');
        filterBar.classList.add('filter');
        // Création des boutons de filtre pour chaque catégorie
        categories.forEach((category) => {
         const filterButton = document.createElement('button');
         filterButton.textContent = category;
         

        filterButton.addEventListener('click', () => {
        // Filtrer les works en fonction de la catégorie sélectionnée
        const filteredWorks = works.filter((work) => work.category === category);
         console.log(filteredWorks);
        // Faites quelque chose avec les works filtrés, comme les afficher sur la page
        });
  
        filterBar.appendChild(filterButton);

        
     });

    // Récupération de la class 
    const filterContainer = document.querySelector(".filter");
    filterContainer.appendChild(filterBar);
  
    //Création des fiches works
    // Récupération de la class 
    const galleryWorks = document.querySelector(".gallery");

      for (let i = 0; i < works.length; i++) {
        const element = works[i];
        console.log(element); // Afficher le work

        // Création de la fiche pour un work
        const workElement = document.createElement("figure");
        // Création des éléments composant la fiche
        const imageElement = document.createElement("img");
        imageElement.src = element.imageUrl;
        imageElement.setAttribute("alt",`${element.title}`)
        const titreElement = document.createElement("figcaption");
        titreElement.innerText = element.title;
        
        
        // Rattachement des balises
        // On rattache la balise article à la section Fiches
                galleryWorks.appendChild(workElement)
                workElement.appendChild(imageElement);
                workElement.appendChild(titreElement);
    
        }
        } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des travaux :', error);
    

  }
} 
fetchWorks()
  

