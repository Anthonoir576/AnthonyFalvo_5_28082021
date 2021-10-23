
/*  ******* APPEL ET AFFICHAGE DES ELEMENTS CONTENU DANS L'API VIA LE BOUTON => 'Voir nos produits' ******** */



/* ########################################################### */
/* ---------------- VARIABLE / CONSTANTE --------------------- */
/* ########################################################### */
// URL API
let cameras;
// BOUTIQUE AFFICHAGE
const showShop = document.getElementById('myBoutique');
// BOUTON AFFICHAGE/MASQUAGE BOUTIQUE
const buttonShop = document.getElementById('buttonShop');
/* ########################################################### */
/* ----------------------------------------------------------- */



/* ########################################################### */
/* ----------------    ECOUTE EVENEMENT    ------------------- */
/* ########################################################### */
// AFFICHER / MASQUER => Boutique 
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
/* ########################################################### */
/* ----------------------------------------------------------- */



/* ########################################################### */
/* -------------------    FONCTION    ------------------------ */
/* ########################################################### */
/* PRIX => Convertion centime en euros */
const pricesSpace = (prix) => {

    let calcule = (prix / 100);  
    
    return calcule.toLocaleString("EUR", { style: "currency", currency: "EUR"});

};

/* ----------------    LOGIQUE REQUETE     ------------------- */
/* 01. URL API via FETCH (GET) par defaut */
const fetchCameras = async() => {

    cameras = await fetch('http://localhost:3000/api/cameras/').then(res => res.json());
    
};

/* 02. ATTENTE la réponse de fetchCameras() => Puis ajoute chaque élément en HTML via MAP */
const showCameras = async() => {

    await fetchCameras();

    showShop.innerHTML = (

        cameras
            //.filter(camera => camera)
            .map(camera => (

                `
                <a href="./produit.html?id=${camera._id}" aria-label="Votre selection produit" data-id="${camera._id}">
                    <div class="camera-item">
                        <img class="camera-img" src="${camera.imageUrl}" alt="article en vente" />
                        <div class="camera-info">
                            <h2 class="camera-name">${camera.name}</h2>
                            <p class="camera-price">${pricesSpace(camera.price)}</p>
                        </div>
                    </div>
                </a>

                `

            )).join('')
    );


};
/* ########################################################### */
/* ----------------------------------------------------------- */