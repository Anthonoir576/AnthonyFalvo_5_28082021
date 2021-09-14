
/*  ******* APPEL ET AFFICHAGE DES ELEMENTS CONTENU DANS L'API VIA LE BOUTON => 'Voir nos produits' ******** */

/* VARIABLE / CONSTANTE */
/* declarations de mes variables en globale */
let cameras;
const showShop = document.getElementById('myBoutique');
const buttonShop = document.getElementById('buttonShop');


/* FETCH par defaut (get) */
/* constantes stockant ma fonction pour récupérer les données de l'api en json dans la variable cameras, avec une fonction asynchrone et attend la réponse grace a await renvoi le resultat grace a une promesse. Par defaut lors de la methode fetch, on récupère en get, on peux aussi utilisé le post pour l'envoi via cette methode, certaine information sont a saisir pour utilisé cette methode afin de palier au comportement par defaut */
const fetchCameras = async() => {

    cameras = await fetch('http://localhost:3000/api/cameras/').then(res => res.json());

};

/* Fonction ASYNC ou Asynchrone / Methode d'affichage via L'appel de FETCH => FILTER => MAP */
/* Fonction qui fait appel a l'api et attend la réponse de celle-ci, une fois faite parcours chaque element de l'api et en crée un element unique en html, ce qui a pours effet de faire apparaitre chaque element de l'api + si d'autre venez a y être ajouté . En temps normal le innerHTML aurait ecrasé lelement déjà présent, mais grace a la combinaison de MAP et filter methode, on a pas ce problème. Join permet en concaténant tous les éléments d'un tableau ou similaire au tableau en chaine de caractère, permettant ici l'assemblage des éléments récupérés via l'api */
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
                            <p class="camera-price">${pricesSpace(camera.price)}</p>
                        </div>
                    </div>
                </a>

                `

            )).join('')
    );

};

/* CALCULE PRIX et CONVERSION  */
/* Le prix est afficher en centime, cette fonction me permet dans un premier temps de convertir les prix en les divisants par 100, 100 centimes fait ... 01 euros, et me return un resultat sous forme d'euros grace a la methode toLocalString(). Elle permet de le faire d'en d'autre devise. */
function pricesSpace(prix) {

    let calcule = (prix / 100);  
    
    return calcule.toLocaleString("EUR", { style: "currency", currency: "EUR"});

};

/* PETIT BONUS !!!!! */
/* Mon Listener permet au click d'afficher la boutique via le bouton voir nos produits et créer un bouton fermer pour la masqué, rien de compliqué mon choix était purement estetique, le choix de la methode getComputedStyle() ma permis de palier au problème rencontré avec .style qui me forcer a cliquer deux fois dessus, une fois pour créer un display, qui netait pas présent dans le html (normal) et l'autre fois pour lui attribué "none", pas évident pour un utilisateur */
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
