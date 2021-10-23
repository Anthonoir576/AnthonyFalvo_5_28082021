
/*  ******* APPEL ET AFFICHAGE DES ELEMENTS CONTENU DANS L'API VIA LE BOUTON => 'Voir nos produits' ******** */

/* ---------------- VARIABLE / CONSTANTE --------------------- */
// URL API
let cameras;
// BOUTIQUE AFFICHAGE
const showShop = document.getElementById('myBoutique');
// BOUTON AFFICHAGE/MASQUAGE BOUTIQUE
const buttonShop = document.getElementById('buttonShop');
/* ----------------------------------------------------------- */


/* -------------------    FONCTION    ------------------------ */

/* FETCH par defaut (get) */
const fetchCameras = async() => {

    cameras = await fetch('http://localhost:3000/api/cameras/').then(res => res.json());
    
};

/* ATTENTE fetchCameras => Puis ajoute chaque élément en HTML via MAP */
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

/* CALCULE PRIX et CONVERSION  */
const pricesSpace = (prix) => {

    let calcule = (prix / 100);  
    
    return calcule.toLocaleString("EUR", { style: "currency", currency: "EUR"});

};
/* ----------------------------------------------------------- */


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
