
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


/* Fonction qui fait appel a l'api */
const showCameras = async() => {

    await fetchCameras();

    showShop.innerHTML = (

        cameras
            .filter(camera => camera.name.toLowerCase())
            .map(camera => (

                `
                
                <div class="camera-item">
                    <img class="camera-img" src="${camera.imageUrl}" alt="article en vente" />
                    <div class="camera-info">
                        <h2 class="camera-name">${camera.name}</h2>
                        <p class="camera-price">${camera.price}</p>
                    </div>
                </div>

                `

            )).join('')
    );

};


/* Ma fonction permet au click d'afficher la boutique via le bouton voir nos produits */
buttonShop.addEventListener('click', (e) => {

    e.preventDefault();
    showCameras();
    

    accueil.innerHTML = (

        `
        <h2>
            Canon EOS 5D Mark IV
        </h2>
        <p>
            Nos Produits N'ont Rien À Envier Aux Dernières Générations
        </p>
        <button id="buttonShop" type="button" aria-label="Voir nos produits sur le site">
            FERMER
        </button> 

        
        `

    );

    
});



/*

        <button id="closeShop">
            <i class="fas fa-window-close" aria-label="fermer la fenêtre de la boutique"></i>
        </button>

*/