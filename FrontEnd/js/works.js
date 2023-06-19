async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
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
    allButton.addEventListener("click", () => {
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
        imageElement.setAttribute("alt", `${element.title}`);
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
      filterButton.addEventListener("click", () => {
        const filteredWorks = works.filter(
          (work) => category === work.category.name
        );

        const galleryWorks = document.querySelector(".gallery");
        galleryWorks.innerHTML = "";

        // Affichage des works filtrés
        for (let i = 0; i < filteredWorks.length; i++) {
          const element = filteredWorks[i];

          // Création de la fiche pour un work
          const workElement = document.createElement("figure");
          // Création des éléments composant la fiche
          const imageElement = document.createElement("img");
          imageElement.src = element.imageUrl;
          imageElement.setAttribute("alt", `${element.title}`);
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
    const closeModalButton = document.querySelector(".closeModalButton");
    const workList = document.querySelector("#workList");
    const addWork = document.querySelector("#addWork");

    //Ecoute du bouton open
    openModalButton.addEventListener("click", function () {
      openModal();
    });

    //Ecoute du bouton close
    if (closeModalButton) {
      closeModalButton.addEventListener("click", function () {
        closeModal();
      });
    }

    //Afficher les travaux dans la modale
    function showModalGallery() {
      for (let i = 0; i < works.length; i++) {
        const element = works[i];
        const newElement = document.createElement("figure");
        newElement.setAttribute("data-id", element.id);
        const newElementImg = document.createElement("img");
        newElementImg.src = element.imageUrl;
        const newElementTitle = document.createElement("figcaption");
        newElementTitle.innerText = "éditer";

        // Conteneur supplémentaire pour l'image et l'icône de la corbeille
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");

        // Création de l'icône de corbeille
        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fa-solid", "fa-trash-can");

        // écouteur d'évènement sur les icones poubelles pour supprimer une image
        trashIcon.addEventListener("click", function (e) {
          e.preventDefault(); // Empêche la fermeture de la modale
          const workId = newElement.getAttribute("data-id");
          deleteWork(workId, newElement);
        });

        //Rattachement des balises
        modalGallery.appendChild(newElement);
        newElement.appendChild(imageContainer);
        imageContainer.appendChild(newElementImg);
        imageContainer.appendChild(trashIcon);
        newElement.appendChild(newElementTitle);
      }
    }
    //fonction ouvrir la modale
    const openModal = function () {
      modal.style.display = "flex";
      addWork.style.display = "none";

      showModalGallery();
    };

    // fonction fermer la modale
    const closeModal = function () {
      modal.style.display = "none";
      modalGallery.innerHTML = "";
    };

    // Ecouteur d'événement pour fermer la modale lorsque l'utilisateur clique en dehors
    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la récupération des travaux :",
      error
    );
  }

  // fonction pour supprimer les travaux
  async function deleteWork(workId, works) {
    const userToken = localStorage.getItem("jwt"); // Récupération du token
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (response.ok) {
      works.remove();
      document.querySelector(`figure[data-id="${workId}"]`).remove();
    }
  }

  // Modale ajouter des travaux

  const workList = document.querySelector("#workList");
  const addWork = document.querySelector("#addWork");
  const returnToWorkList = document.querySelector("#returnToWorkList");
  const selectPhoto = document.querySelector("#buttonAddPhoto");

  //ecouteur d'evenement pour aller sur la page 2 de la modale
  document
    .getElementById("ajouterPhoto")
    .addEventListener("click", function () {
      workList.style.display = "none";
      addWork.style.display = "flex";
    });

  //ecouteur d'évenement pour retourner sur la page 1 de la modale
  returnToWorkList.addEventListener("click", function () {
    workList.style.display = "flex";
    addWork.style.display = "none";
  });

  //Ecouteur d'évenement sur le clic du bouton ajout photo
  const photoInput = document.querySelector("#photoInput");
  const uploadButton = document.querySelector("#uploadButton");

  uploadButton.addEventListener("click", (event) => {
    event.preventDefault();
    photoInput.click();
  });

  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = function () {
        const previewImage = document.createElement("img");
        previewImage.src = reader.result;
        previewImage.classList.add("preview-image");
        previewImage.style.width = "130px";
        previewImage.style.height = "170px";

        // prévisualisation dans la modale
        const previewContainer = document.querySelector(".preview-container");
        const addPreviewBlock = document.querySelector(".addPhotoBlock");
        addPreviewBlock.style.display = "none";
        previewContainer.style.display = "flex";
        previewContainer.innerHTML = "";
        previewContainer.appendChild(previewImage);
      };

      reader.readAsDataURL(file);
    }
  });

  function validateFields() {
    const image = document.querySelector("#photoInput");
    const titre = document.querySelector("#titreAjoutPhoto");
    const categorie = document.querySelector("#categorieAjoutPhoto");
    const acceptAddPhoto = document.querySelector("#acceptAddPhoto");

    if (
      image.value.length > 0 &&
      titre.value.length > 0 &&
      categorie.value.length > 0
    ) {
      acceptAddPhoto.style.backgroundColor = "#1D6154";
    } else {
      acceptAddPhoto.style.backgroundColor = "#A7A7A7";
    }
  }

  // écouteur d'évènement pour confirmer tous les champs avant la validation
  Array.from(document.querySelector(".inputForm")).forEach(function (element) {
    element.addEventListener("change", function () {
      validateFields();
    });
  });

  // Fonction ajouter une nouvelle photo
  async function postNewPhoto() {
    const formData = new FormaData(document.querySelector("#photoInput"));
    const photoPosted = await fetch(`http://localhost:5678/api/work`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: formData,
    });
    const response = await photoPosted.json();

    if (response) {
      // création des constantes dans la modale
      const newPostModal = document.createElement("figure");
      newPostModal.setAttribute("data-id", response.id);
      const newPostModalImg = document.createElement("img");
      newPostModalImg.src = response.imageUrl;
      const newPostModalTitle = document.createElement("figcaption");
      newPostModalTitle.innerText = "éditer";

      modalGallery.appendChild(newPostModal);
      newPostModal.appendChild(newPostModalImg);
      newPostModal.appendChild(newPostModalTitle);

      //création des constantes dans la gallerie
      const newPost = document.createElement("figure");
      newPost.setAttribute("data-id", response.id);
      const newPostImg = document.createElement("img");
      newPostImg.src = response.imageUrl;
      const newPostTitle = document.createElement("figcaption");
      newPostTitle.innerHTML = response.title;
      newWork.setAttribute("categoryId", response.categoryId);

      galleryWorks.appendChild(newPost);
      newPost.appendChild(newPostImg);
      newPost.appendChild(newPostTitle);
    }
  }

  // ecouteur d'évènement envoi du formulaire
  document
    .querySelector("#photoInput")
    .addEventListener("submit", function (event) {
      event.preventDefault();
    });
}

fetchWorks();
