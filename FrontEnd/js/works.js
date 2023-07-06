// Récupère les données des travaux 
async function fetchWorksData() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la récupération des travaux :",
      error
    );
  }
}

// Récupère les données des travaux et effectue les actions nécessaires pour afficher les travaux
async function fetchWorks() {
  const works = await fetchWorksData();
  const categories = createCategoriesSet(works); // recupere les catégories depuis la fonction createCategoriesSet
  const filterBar = createFilterBar();
  const allButton = createAllButton(filterBar, works);
  createFilterButtons(filterBar, categories, works);
  return works;
}

// Actualise la galerie des travaux en récupérant les données et en initialisant la fenêtre modale
async function refreshWorksGallery() {
  const works = await fetchWorks();
  const modalGallery = document.querySelector(".modalGallery");
  modalGallery.innerHTML = "";
  initializeModal(works);
}

// Crée un ensemble de catégories à partir des données des travaux
function createCategoriesSet(works) {
  const categories = new Set();

  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    const category = work.category.name;
    categories.add(category);
  }

  return categories;
}

// Crée la barre de filtrage des travaux
function createFilterBar() {
  const filterBar = document.querySelector(".filter");
  return filterBar;
}

// Crée le bouton "Tous" dans la barre de filtrage des travaux
function createAllButton(filterBar, works) {
  const allButton = document.createElement("p");
  allButton.textContent = "Tous";
  filterBar.appendChild(allButton);

  // Affiche tous les travaux lorsque le bouton "Tous" est cliqué
  allButton.addEventListener("click", (event) => {
    event.preventDefault();
    const galleryWorks = document.querySelector(".gallery");
    galleryWorks.innerHTML = "";
    displayWorks(works);
  });

  allButton.click();

  return allButton;
}

// Filtre les travaux par catégorie
function filterWorksByCategory(category, works) {
  return works.filter((work) => category === work.category.name);
}

// Crée les boutons de filtrage des travaux pour chaque catégorie
function createFilterButtons(filterBar, categories, works) {
  categories.forEach((category) => {
    const filterButton = document.createElement("p");
    filterButton.textContent = category;
    filterBar.appendChild(filterButton);

    // Affiche les travaux correspondants lorsque le bouton de filtrage est cliqué
    filterButton.addEventListener("click", (event) => {
      event.preventDefault(); // permet de ne pas recharger la page au clic
      const filteredWorks = filterWorksByCategory(category, works);
      const galleryWorks = document.querySelector(".gallery");
      galleryWorks.innerHTML = ""; // pour reinitialiser l'affichage
      displayWorks(filteredWorks);
    });
  });
}

// Affiche les travaux dans la galerie
function displayWorks(works) {
  const galleryWorks = document.querySelector(".gallery");

  for (let i = 0; i < works.length; i++) {
    const element = works[i];

    const workElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = element.imageUrl;
    imageElement.setAttribute("alt", `${element.title}`);
    const titreElement = document.createElement("figcaption");
    titreElement.innerText = element.title;

    galleryWorks.appendChild(workElement);
    workElement.appendChild(imageElement);
    workElement.appendChild(titreElement);
  }
}

// Permet de raffraichir la gallerie après une action (maj fetch)
async function updateWorksGallery() {
  const works = await fetchWorks();
  const modalGallery = document.querySelector(".modalGallery");
  modalGallery.innerHTML = "";
  showModalGallery(works);
}

// Initialise la fenêtre modale avec les travaux
async function initializeModal(works ) {

  const modal = document.querySelector("#worksModal");
  const openModalButton = document.querySelector(".openModalButton");
  const modalGallery = document.querySelector(".modalGallery");
  const closeModalButton = document.querySelector(".closeModalButton");

  // Affiche la fenêtre modale et la galerie des travaux lors du clic sur le bouton d'ouverture
  openModalButton.addEventListener("click", async function (e) {
    e.preventDefault();
    modal.style.display = "flex";
    addWork.style.display = "none";
    showModalGallery(works); // lancer la fonction qui permet de visualiser les works dans la galerie
    workModal(); // modal pour ajouter les images
  });

  // Ferme la fenêtre modale lors du clic sur le bouton de fermeture
  if (closeModalButton) {
    closeModalButton.addEventListener("click", function (e) {
      e.preventDefault();
      modal.style.display = "none";
      modalGallery.innerHTML = "";
    });
  }

  // Ferme la fenêtre modale lors du clic en dehors du contenu de la modale
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      modalGallery.innerHTML = "";
    }
  });
}


// Affiche la galerie des travaux dans la fenêtre modale
async function showModalGallery(works) {
  const modalGallery = document.querySelector(".modalGallery");

  modalGallery.innerHTML = "";

  // Vérifie si l'événement de clic est déjà attaché à la galerie des travaux
  const isModalGalleryClickHandlerAttached =
    modalGallery.getAttribute("data-click-handler");

  if (!isModalGalleryClickHandlerAttached) {
    // Gère les clics sur la galerie des travaux, y compris la suppression d'un travail
    const modalGalleryClickHandler = async function (event) {
      event.preventDefault();
      const trashIcon = event.target.closest(".deleteTrashIcon");
      if (trashIcon) {
        const workId = trashIcon.getAttribute("data-work-id");
        if (confirm("Voulez-vous supprimer l'image?")) {
          const userToken = localStorage.getItem("jwt");
          const response = await fetch(
            "http://localhost:5678/api/works/" + workId,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json; charset=utf-8",
                authorization: `Bearer ${userToken}`,
              },
            }
          );

          if (response.ok) {
            removeWorkFromDOM(workId); // Supprime l'image du DOM de la page d'accueil
            updateWorksGallery(); // Met à jour la galerie des travaux dans la fenêtre modale
          } else {
            console.log(
              "Une erreur s'est produite lors de la suppression du projet."
            );
          }
        }
      }
    };

    modalGallery.addEventListener("click", modalGalleryClickHandler);

    // Ajoute l'attribut pour indiquer que l'événement de clic est attaché
    modalGallery.setAttribute("data-click-handler", "true");
  }

  for (let i = 0; i < works.length; i++) {
    const element = works[i];
    const newElement = document.createElement("figure");
    newElement.setAttribute("data-id", element.id);
    const newElementImg = document.createElement("img");
    newElementImg.src = element.imageUrl;
    const newElementTitle = document.createElement("figcaption");
    newElementTitle.innerText = "éditer";

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");

    const trashIcon = document.createElement("i");
    trashIcon.classList.add(
      "deleteTrashIcon",
      "fa",
      "fa-solid",
      "fa-trash-can"
    );
    trashIcon.setAttribute("data-work-id", element.id);

    modalGallery.appendChild(newElement);
    newElement.appendChild(imageContainer);
    imageContainer.appendChild(newElementImg);
    imageContainer.appendChild(trashIcon);
    newElement.appendChild(newElementTitle);
  }
}

// Supprime un travail du DOM
function removeWorkFromDOM(workId) {
  const workElement = document.querySelector(`figure[data-id="${workId}"]`);
  if (workElement) {
    workElement.remove(); // Permet de suprrimer depuis le DOM sans recharger la page
  }
}

// Fonction pour gérer la fenêtre modale
function workModal(e) {
  const workList = document.querySelector("#workList");
  const addWork = document.querySelector("#addWork");
  const returnToWorkList = document.querySelector("#returnToWorkList");
  const close = document.querySelector(".closeModalButton");

  document
    .getElementById("ajouterPhoto")
    .addEventListener("click", function (e) {
      workList.style.display = "none";
      addWork.style.display = "flex";
    });

  returnToWorkList.addEventListener("click", function (e) {
    workList.style.display = "flex";
    addWork.style.display = "none";
    updateWorksGallery();
  });

  const photoInput = document.querySelector("#photoInput");
  const uploadButton = document.querySelector("#uploadButton");

  uploadButton.addEventListener("click", (event) => {
    event.preventDefault();
    photoInput.click();
  });

  photoInput.addEventListener("change", handlePhotoInputChange);

  const inputFields = document.querySelectorAll(".inputForm");
  inputFields.forEach((element) => {
    element.addEventListener("change", validateFields);
  });

  // Bouton de validation du formulaire d'ajout de travaux
  const addWorkForm = document.querySelector("#newPhotoForm");
  addWorkForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Empêcher le comportement par défaut du formulaire

    const form = event.target;
    const formData = new FormData(form);

    const userToken = localStorage.getItem("jwt");
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + userToken);

    try {
      const response = await fetch("http://localhost:5678/api/works/", {
        method: "POST",
        headers: headers,
        body: formData,
      });

      if (response.ok) {
        alert("L'ajout de l'image a été réalisé avec succès");
        form.reset(); // Réinitialiser le formulaire
        clearPreviewImage()
        const responseData = await response.json();
        // Traiter la réponse JSON si nécessaire
        refreshWorksGallery(); // Mettre à jour la galerie des travaux sans rechargement
      } else  {
        alert("Veuillez ajouter un titre ou une image");
        console.log("Action impossible");
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la publication du travail :",
        error
      );
    }
  });
}

// Gère le changement de l'entrée de photo
function handlePhotoInputChange() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function () {

      const previewImage = document.createElement("img");
      previewImage.src = reader.result;
      previewImage.classList.add("preview-image");
      previewImage.style.width = "130px";
      previewImage.style.height = "170px";

      const previewContainer = document.querySelector(".preview-container");
      const addPreviewBlock = document.querySelector(".addPhotoBlock");
      addPreviewBlock.style.display = "none";
      previewContainer.style.display = "flex";
      previewContainer.appendChild(previewImage);
    };

    reader.readAsDataURL(file);
  }
}

//Fonction pour raffraichir l'image de preview
function clearPreviewImage() {
  const previewContainer = document.querySelector(".preview-container");
  const addPreviewBlock = document.querySelector(".addPhotoBlock");
  const previewImage = document.querySelector(".preview-image");

  addPreviewBlock.style.display = "flex";
  previewContainer.style.display = "none";

  if (previewImage) {
    previewImage.remove();
  }
}

// Valide les champs du formulaire
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

refreshWorksGallery();
