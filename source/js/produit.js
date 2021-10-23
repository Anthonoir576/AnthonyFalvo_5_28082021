
/************* AFFICHAGE INDIVIDUEL DU PRODUIT SELECTIONNER PAR LUTILISATEUR ***************/

/* ########################################################### */
/* ---------------- VARIABLE / CONSTANTE --------------------- */
/* ########################################################### */
// L'endroit ou l'on injecte le html
const mySelection = document.querySelector('.main-produit');

// Message visuel de confirmation
let confirm;

// Choix option / Quantité de l'utilisateur
let valueInputLenses;
let valueInputQuantity;

// recuperation du local storage
let mesProduitsEnregistrer = JSON.parse(localStorage.getItem("mon panier"));

// Objet utilisateur qui contiendra le choix produit
let selectionUtilisateur;
/* ########################################################### */
/* ----------------------------------------------------------- */





/* ----------------------- FONCTIONS  ------------------------ */

/* ########################################################### */
/* ---------  RECUPERATION ID PRODUIT INDIVIDUEL  ------------ */
/* ########################################################### */
// 01. Recuperation ID produit via URL injecter dans la balise <a href="./produit.html?id=${camera._id}"
const getProduitId = () => {

    return new URL(location.href).searchParams.get("id");

};

// 02. REQUETE FETCH (GET) dynamique en injectant l'id afin d'avoir le produit selectionner
const getProduit = (produitId) => {

    return fetch(`http://localhost:3000/api/cameras/${produitId}`)
    .then((response) => {

        return response.json()

    })
    .catch((error) => {

        return console.log(error);

    })

};
/* ########################################################### */
/* ----------------------------------------------------------- */





/* ########################################################### */
/* ------------  AFFICHAGE PRODUIT + OPTION   ---------------- */
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

// 02: Ajout des options produit dynamiquement
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

// 02. Fonction push dans le local storage l'objet selectionUtilisateur
const localSto = (selection, enregistrer) => {

    enregistrer.push(selection);
    localStorage.setItem("mon panier", JSON.stringify(enregistrer));

};

// 03. Verification du produit selectionner dans le local storage
const verificationDesProduits = (produit) => {

    // si aucun elements n'est present dans le local
    if (mesProduitsEnregistrer == null && valueInputQuantity >= 0) {

        mesProduitsEnregistrer = [];
        confirmationFonction(produit);
        localSto(selectionUtilisateur, mesProduitsEnregistrer);

    // verification valeur negative input quantité
    } else if (valueInputQuantity <= 0) {

        confirm.style.background ="red";

        confirm.textContent = `Le nombre ne peut être negatif ...`;
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

        // stop le comportement par defaut du bouton
        e.preventDefault();

        // Element au stocker le message de confirmation ET panier plein SI il l'es
        confirm = document.getElementById('confirmationAjoutPanier');

        // valeur quantité / option
        valueInputQuantity = document.getElementById('inputQuantity').value;
        valueInputLenses = document.getElementById('choiseLenses').value;

        // Objet contenant le choix de l'utilisateur
        selectionUtilisateur = {

            id : produit._id,
            picture : produit.imageUrl,
            name : produit.name,
            price : parseFloat(pricesSpace(produit.price)),
            quantity : valueInputQuantity,
            choice : valueInputLenses

        };

        // Comfirmation visuel d'ajout au panier
        confirm.style.display = "block";

        // Verification produit ET la selection utilisateur => PUIS INJECTION LOCAL STORAGE
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

    // Recuperation id => assigne dans fetch dynamiquement
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