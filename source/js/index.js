
// Mes variables est constantes 

/* declarations de ma variable en globale */
let cameras;
const showShop = document.getElementById('myBoutique');
const buttonShop = document.getElementById('buttonShop');


/* constantes stockant ma fonction pour récupérer les données de l'api */
const fetchCameras = async() => {

    cameras = await fetch('http://localhost:3000/api/cameras/').then(res => res.json());

};

/* Fonction qui fait appel a l'api et l'ecrit sous forme html */
const showCameras = async() => {

    await fetchCameras();

    showShop.innerHTML = (

        cameras
            .filter(camera => camera)
            .map(camera => (

                `
                <a href="./produit.html?id=${camera._id}" aria-label="Votre selection produit" data-id="${camera._id}">
                    <div class="camera-item">
                        <img class="camera-img" src="${camera.imageUrl}" alt="article en vente" />
                        <div class="camera-info">
                            <h2 class="camera-name">${camera.name}</h2>
                            <p class="camera-price">${pricesSpace(camera.price)} €</p>
                        </div>
                    </div>
                </a>

                `

            )).join('')
    );

};

/* dans un premier temps la fonction utilise un separateur de millier et remplace par un point tous les trois chiffre on parle de tostring et replace. Ensuite on emglobe cette methode dans un parsefloat, suivi dun tous fixed avec pour argument 2 . parseFloat transforme une chaine de caractère en nombre, et to fixed nous donne 2 chiffres après la virgule grace a largument 2. Si javais mis 5, j'en aurait donc .... 5 */
function pricesSpace(prix) {

    return parseFloat(prix.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')).toFixed(2);

};

/* Ma fonction permet au click d'afficher la boutique via le bouton voir nos produits et créer un bouton fermer pour la masqué */
buttonShop.addEventListener("click", () => {

    if(getComputedStyle(showShop).display != "none") {

        showShop.style.display = "none";
        buttonShop.innerHTML = (

            `Voir nos produits`

        );

    } else {

        showCameras();

        showShop.style.display = "grid";
        buttonShop.innerHTML = (

            `FERMER`

        );

    };

});

