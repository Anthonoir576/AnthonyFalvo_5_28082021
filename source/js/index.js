
// Mes variables est constantes 

/* declarations de ma variable en globale */
let cameras;
const accueil = document.querySelector('.accueil-info');
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
                
                <div class="camera-item">
                    <img class="camera-img" src="${camera.imageUrl}" alt="article en vente" />
                    <div class="camera-info">
                        <h2 class="camera-name">${camera.name}</h2>
                        <p class="camera-price">${camera.price} €</p>
                    </div>
                </div>

                `

            )).join('')
    );

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


