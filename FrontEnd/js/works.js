async function fetchWorks() {
    try {
      const response = await fetch('http://localhost:5678/api/works');
      const works = await response.json();

      // Création de l'objet catégories
      const categories = new Set();
  
      for (let i = 0; i < works.length; i++) {
        const work = works[i];
        const category = work.category.name;
        console.log(category);

        // Ajout de la catégorie obtenue à l'objet Set pour obtenir les catégories uniques
        categories.add(category); 
      }
      
      // Création de la barre de filtres
      const filterBar = document.querySelector(".filter");

      // Création du bouton Tous
      const allButton = document.createElement("p");
      allButton.textContent = "Tous";
      filterBar.appendChild(allButton);
      
      //Affichage de tous les works au clic sur bouton tous
      allButton.addEventListener('click', () => {
        const galleryWorks = document.querySelector(".gallery");
        galleryWorks.innerHTML = "";

        //Récupération des works depuis l'api
        for (let i = 0; i < works.length; i++) {
          const element = works[i];
          console.log(element);
    
          // Création de la fiche pour un work
          const workElement = document.createElement("figure");
          // Création des éléments composant la fiche
          const imageElement = document.createElement("img");
          imageElement.src = element.imageUrl;
          imageElement.setAttribute("alt",`${element.title}`);
          const titreElement = document.createElement("figcaption");
          titreElement.innerText = element.title;
            
          // Rattachement des balises
          // On rattache la balise article à la section Fiches
          galleryWorks.appendChild(workElement);
          workElement.appendChild(imageElement);
          workElement.appendChild(titreElement);
        }
      });

      allButton.click();

      // Création des boutons de filtre pour chaque catégorie récupérée via l'objet set
      categories.forEach((category) => {
         const filterButton = document.createElement("p");
         filterButton.textContent = category;
         filterBar.appendChild(filterButton);

        //Filtrer les works selon la catégorie cliquée
         filterButton.addEventListener('click', () => {
          const filteredWorks = works.filter((work) => category === work.category.name);
        
          const galleryWorks = document.querySelector(".gallery");
          galleryWorks.innerHTML = "";

  
          // Affichage des works filtrés
          for (let i = 0; i < filteredWorks.length; i++) {
            const element = filteredWorks[i]

            // Création de la fiche pour un work
            const workElement = document.createElement("figure");
            // Création des éléments composant la fiche
            const imageElement = document.createElement("img");
            imageElement.src = element.imageUrl;
            imageElement.setAttribute("alt",`${element.title}`);
            const titreElement = document.createElement("figcaption");
            titreElement.innerText = element.title;
        
            // Rattachement des balises
            // On rattache la balise article à la section Fiches
            galleryWorks.appendChild(workElement);
            workElement.appendChild(imageElement);
            workElement.appendChild(titreElement);
          }
        });
      });

      //MODALE 
      //création des constantes
      const modal = document.querySelector("#worksModal");
      const modalContent = document.querySelector(".modalContent");
      const openModalButton = document.querySelector(".openModalButton");
      const modalGallery = document.querySelector(".modalGallery");

      //Ecoute du bouton submit
      openModalButton.addEventListener('click', function() {
        openModal();
      })

      //Afficher les travaux dans la modale
      function showModalGallery () {
        for (let i = 0; i < works.length; i++) {
          const element = works[i];
          const newElement = document.createElement("figure");
          newElement.setAttribute("data-id", element.id);
          const newElementImg = document.createElement("img");
          newElementImg.src = element.imageUrl;
          const newElementTitle = document.createElement("figcaption");
          newElementTitle.innerText = "éditer";

          //Rattachement des balises
          modalGallery.appendChild(newElement);
          newElement.appendChild(newElementImg);
          newElement.appendChild(newElementTitle);
        }
      }
      //fonction ouvrir la modale
      const openModal = function(){
      modal.style.display = "flex";

      showModalGallery()
      }

  } catch (error) {
  console.error("Une erreur est survenue lors de la récupération des travaux :", error);
  }
}

fetchWorks();

