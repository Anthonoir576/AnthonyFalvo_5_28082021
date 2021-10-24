
/************* AFFICHAGE INDIVIDUEL DU PRODUIT SELECTIONNER PAR LUTILISATEUR ***************/

/* ########################################################### */
/* ---------------- VARIABLE / CONSTANTE --------------------- */
/* ########################################################### */
// DIV Html ou le produit serra afficher
const mySelection = document.querySelector('.main-produit');

// MESSAGE Visuel ajout panier
let confirm;

// CHOIX Option / Quantité de l'utilisateur
let valueInputLenses;
let valueInputQuantity;

// RECUPERATION du local storage
let mesProduitsEnregistrer = JSON.parse(localStorage.getItem("mon panier"));

// OBJET utilisateur qui contiendra le choix produit
let selectionUtilisateur;
/* ########################################################### */
/* ----------------------------------------------------------- */





/* ----------------------- FONCTIONS  ------------------------ */

/* ########################################################### */
/* ---------  RECUPERATION ID PRODUIT INDIVIDUEL  ------------ */
/* ########################################################### */
// 01. RECUPERATION ID produit via URL injecter dans la balise <a href="./produit.html?id=${camera._id}"
const getProduitId = () => {

    return new URL(location.href).searchParams.get("id");

};

// 02. REQUETE FETCH (GET) dynamique en injectant l'id afin d'avoir le produit selectionner
const getProduit = (produitId) => {

    return fetch(`http://localhost:3000/api/cameras/${produitId}`)
    .then((response) => {

        return response.json();

    })
    .catch((error) => {

        if (error) {

            document.body.classList.add('error_404');
            document.querySelector('.main-produit').classList.add('messageError_404');
            document.querySelector('.main-produit').innerHTML = (
                `
                <span class="errorMesg">404</span> 
                <span class="errorMesg">ERROR</span>
                <a href="index.html"> ACTUALISER LA PAGE </a>
    
                `
            );

        };

    });

};
/* ########################################################### */
/* ----------------------------------------------------------- */





/* ########################################################### */
/* ------------   AFFICHAGE PRODUIT + OPTION   --------------- */
/* ########################################################### */
// 01. AFFICHAGE Produit de facon visuel
const produitSeul = (produit) => {

    mySelection.innerHTML = (

        `
        <section class="produit">
            <div class="camera-item">
                <img class="camera-img" src="${produit.imageUrl}" alt="appareil photo en vente" />
                <div class="camera-info">
                    <h2 class="camera-name">${produit.name}</h2>
                    <div class="camera-description">
                        <p>Description :</p>
                        <p> ${produit.description}</p>
                    </div>
                    <p class="camera-price">${(produit.price / 100).toLocaleString("EUR", { style: "currency", currency: "EUR"})}<span> /<em>Unité</em></span></p>
                </div>
                <form class="choiseForCart">
                    <div class="cartQuantity">
                        <div>
                            <label for="choiseLenses">
                                Modèles optiques :
                            </label>
                            <select name="choiseLenses" id="choiseLenses"></select>
                        </div>
                        <div>
                            <label for="inputQuantity">
                                Quantité :
                            </label>
                            <input type="number" name="inputQuantity" aria-label="quantité de produit" id="inputQuantity" value="1" min="1" max="10" />
                        </div>
                    </div>
                    <p id="confirmationAjoutPanier"></p>
                    <button id="panier" type="submit" aria-label="ajouter votre appareil-photo au panier">
                        Ajouter au panier
                    </button>
                </form>
            </div>
        </section>

        `

    );

};

// 02: AJOUT Options produit dynamiquement
const optionProduit = (produit) => {

    for(let i = 0; i < produit.lenses.length; i++) {

        let lentille = produit.lenses[i];
        const choixLentilles = document.getElementById('choiseLenses');

        choixLentilles.insertAdjacentHTML('afterbegin',

            `
            <option value="${lentille}" name="choiseLenses" aria-label="choix de lentille format ${lentille}">${lentille}</option>

            `

        );

    };

};
/* ########################################################### */
/* ----------------------------------------------------------- */





/* ########################################################### */
/* -----------------   MISE A JOUR PANIER   ------------------ */
/* ########################################################### */
// 00. CONVERSION en euros la selection utilisateur 
const pricesSpace = (prix) => {

    return parseFloat(prix / 100);

};

// 01. MESSAGE VISUEL + Condition si singulier = 1 / Sinon pluriel
const confirmationFonction = (produit) => {

    confirm.style.background ="#32CD32";

    if(valueInputQuantity == 1) {

        confirm.textContent = `Merci pour votre confiance. Le ${produit.name} ${valueInputLenses} est ajouté au panier`;

    } else {

        confirm.textContent = `Merci pour votre confiance. Les ${produit.name} ${valueInputLenses} sont ajoutés au panier`;

    };

    confirm.insertAdjacentHTML('beforeend', `<i class="far fa-check-square"></i>`);

};

// 02. PUSH Selection utilisateur => LocalStorage
const localSto = (selection, enregistrer) => {

    enregistrer.push(selection);
    localStorage.setItem("mon panier", JSON.stringify(enregistrer));

};

// 03. VERIFICATION du produit selectionner dans le local storage
const verificationDesProduits = (produit) => {

    // si aucun elements n'est present dans le local
    if (mesProduitsEnregistrer == null && valueInputQuantity >= 0) {

        mesProduitsEnregistrer = [];
        confirmationFonction(produit);
        localSto(selectionUtilisateur, mesProduitsEnregistrer);

    // verification valeur negative input quantité
    } else if (valueInputQuantity <= 0) {

        confirm.style.background ="red";

        confirm.textContent = `Le nombre ne peut être nul ou négatif ...`;
        confirm.insertAdjacentHTML('beforeend', `<i class="far fa-times-circle"></i>`);

        return;

    // si un tableau et present et valeur positive
    } else if (mesProduitsEnregistrer != null && valueInputQuantity > 0) {

        for(let i = 0; i < mesProduitsEnregistrer.length; i++) {

            // si un produit ID et une meme OPTION sont déjà present alors => MAJ quantité
            if (mesProduitsEnregistrer[i].id === selectionUtilisateur.id && mesProduitsEnregistrer[i].choice === selectionUtilisateur.choice) {

                let totalQuantité = parseInt(mesProduitsEnregistrer[i].quantity, 10) + parseInt(selectionUtilisateur.quantity ,10);
                let updateStorage = mesProduitsEnregistrer;

                updateStorage[i].quantity = totalQuantité;

                mesProduitsEnregistrer = updateStorage;

                confirmationFonction(produit);
                localStorage.setItem('mon panier', JSON.stringify(mesProduitsEnregistrer));

            // tant que l'on a pas fini de parcourir le tableau
            } else if ( (i + 1) < mesProduitsEnregistrer.length) {

                // Tant que le nombre et inférieur a 10 & supérieur a 0 => on relance l'itération
                if (mesProduitsEnregistrer.length < 10 && mesProduitsEnregistrer.length > 0) {

                    continue;

                // 10 ARTICLE DIFFERENT MAXIMUM
                } else if ( mesProduitsEnregistrer.length == 10) {

                    confirm.style.background ="red";

                    confirm.textContent = `VOTRE PANIER EST PLEIN`;
                    confirm.insertAdjacentHTML('beforeend', `<i class="far fa-times-circle"></i>`);

                    return;

                };

            // si le tableau et parcourus en integralité, et que aucun produit nest identique sur lid ou le choix on add
            } else if ((i + 1) == mesProduitsEnregistrer.length && mesProduitsEnregistrer[i].id != selectionUtilisateur.id || mesProduitsEnregistrer[i].choice != selectionUtilisateur.choice) {

                confirmationFonction(produit);
                localSto(selectionUtilisateur, mesProduitsEnregistrer);

            };

            return;

        };

    };

};

// 04. ECOUTE EVENEMENT => AU CLIQUE : mettant a jour le localStorage + Message visuel
const majProduit = (produit) => {

    document.getElementById('panier').addEventListener('click', (e) => {

        // STOP le comportement par defaut du bouton
        e.preventDefault();

        // MESSAGE VISUEL AJOUT PANIER
        confirm = document.getElementById('confirmationAjoutPanier');

        // VALEUR quantité / option <= INPUT
        valueInputQuantity = document.getElementById('inputQuantity').value;
        valueInputLenses = document.getElementById('choiseLenses').value;

        // OBJET contenant le choix de l'utilisateur
        selectionUtilisateur = {

            id : produit._id,
            picture : produit.imageUrl,
            name : produit.name,
            price : parseFloat(pricesSpace(produit.price)),
            quantity : valueInputQuantity,
            choice : valueInputLenses

        };

        // CONFIRMATION visuel d'ajout au panier
        confirm.style.display = "block";

        // VERIFICATION produit ET la selection utilisateur => PUIS INJECTION LOCAL STORAGE
        verificationDesProduits(produit);

    });

};
/* ########################################################### */
/* ----------------------------------------------------------- */





/* ########################################################### */
/* -----------------  LOGIQUE PAGE PRODUIT  ------------------ */
/* ########################################################### */
// LOGIQUE DE ROOTING
const recuperationProduitSeul = async() => {

    // RECUPERATION id => INJECTER dans fetch dynamiquement
    const produitId = getProduitId();
    const produit = await getProduit(produitId);

    // affichage produit + option
    produitSeul(produit);
    optionProduit(produit);

    // MAJ produit en clique
    majProduit(produit);

};

recuperationProduitSeul();

/* ########################################################### */
/* ----------------------------------------------------------- */