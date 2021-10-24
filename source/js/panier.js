
/************* AFFICHAGE PANIER ET MAJ + ENVOI BACK END ***************/

/* ########################################################### */
/* ---------------- VARIABLE / CONSTANTE --------------------- */
/* ########################################################### */
// Récupère le tableau du localstorage
let mesProduitsEnregistrer = JSON.parse(localStorage.getItem("mon panier"));

// L'endroit ou l'on injecte la partie visuel
let myPanier = document.getElementById('main-panier');
// permet de récupérer licone close du panier vide
let close = document.getElementById('closePop');

// Bouton commander affiche le formulaire 
let commander;

// Balise FORM
let formulaire;

// <Tbody> => injection produit selectionner par l'utilisateur
let bodyTab;

// Total du panier 
let totaux = 0; 

// variable SUPPRIMER SELECTION
let tab = [];
let supprimerSelection;

// ID POUR ENVOIE AU BACK END
let products = [];

let contact;
let MesInformationsPourLeBackEnd;

let validerCommande;
/* ########################################################### */
/* ----------------------------------------------------------- */



/* CONVERSION CENTIME / EUROS avec deux chiffres après la virgule */
const pricesSpace = (prix) => {

    return parseFloat(prix / 100).toFixed(2);

};


/* ----------------------- FONCTIONS  ------------------------ */

/* ########################################################### */
/* ---------------------    PANIER    ------------------------ */
/* ########################################################### */

// MESSAGE PANIER VIDE
const panierVide = () => {

    myPanier.innerHTML = (

        `
        <section class="panier-vide">
            <h2>
                Votre panier est actuellement vide. <br /> Vous pouvez vous rendre sur notre boutique en ligne.
            </h2>
            <p>
                Amicalement <strong> Ori <em>&</em> pix's .fr</strong>
            </p>
            <a href="./index.html" aria-label="Visiter notre boutique en ligne">
                Visiter notre boutique 
                <i class="fas fa-shopping-cart"></i>
            </a>
            <i id="closePop" class="fas fa-window-close" aria-label="fermer la fenêtre indiquant le panier vide"></i>
        </section>
        
        `

    );

};

// CALCULE TOTAL PANIER
let totalPanier = () => {

    for (let i = 0; i < mesProduitsEnregistrer.length; i++) {

        let price = parseFloat((mesProduitsEnregistrer[i].price)*(mesProduitsEnregistrer[i].quantity));

        totaux += price; 

    };

};

// CRÉATION d'un tableau HTML si des articles on était ajouté
let tableauHtml = () => {

    myPanier.innerHTML = (

        `
        <table>
            <thead>
            <tr class="tab-title">
                <th>Produit :</th>
                <th>Nom :</th>
                <th>Option :</th>
                <th>Quantité :</th>
                <th>Prix :</th>
                <th></th>
            </tr>
            </thead>
            <tbody id="bodyTab"></tbody>
            <tfoot>
            <tr>
                <td>TOTAL :</td>
                <td>${(totaux).toLocaleString("EUR", { style: "currency", currency: "EUR"})}</td>
            </tr>
            </tfoot>
        </table>
        <button id="commander" type="button">Commander</button>
        
        `
    );

};

// CHAQUE PRODUIT du localStorage, et ajouté dynamiquement dans <TBODY> via <TR> 
let ajoutProduitPanier = () => {

    for(let i = 0; i < mesProduitsEnregistrer.length; i++) {

        bodyTab.insertAdjacentHTML('beforeend', 
            
            `
            <tr data-content="${mesProduitsEnregistrer[i].id}">
                <td data-label="Produit :"><img class="produit-img" src="${mesProduitsEnregistrer[i].picture}" alt="produit selectionné" /></td>
                <td data-label="Nom :">${mesProduitsEnregistrer[i].name}</td>
                <td data-label="Option :">${mesProduitsEnregistrer[i].choice}</td>
                <td data-label="Quantité :">${mesProduitsEnregistrer[i].quantity}</td>
                <td data-label="Prix :">${parseFloat((mesProduitsEnregistrer[i].price)*(mesProduitsEnregistrer[i].quantity)).toLocaleString("EUR", { style: "currency", currency: "EUR"})}</td>
                <td data-label="Supprimer :" class="supprimerProduit"><i class="far fa-trash-alt"></i></td>
            </tr>
            
            `
        );

    };

};

// SUPPRESSION PRODUIT - VISUEL ET LOCALSTORAGE
let deleteProduit = () => {

    supprimerSelection = Array.from(document.querySelectorAll('.supprimerProduit'));

    for (let i = 0; i < supprimerSelection.length; i++) {

        supprimerSelection[i].addEventListener('click', () => {

            supprimerSelection[i].parentElement.style.display ="none";
                
            tab = mesProduitsEnregistrer;
            tab.splice([i], 1);
            
            mesProduitsEnregistrer = localStorage.setItem('mon panier', JSON.stringify(tab));

            window.location.href ="panier.html";

        });
    };
};
    
/* ########################################################### */
/* ----------------------------------------------------------- */





/* ########################################################### */
/* ------------------    FORMULAIRE    ----------------------- */
/* ########################################################### */
// INSERT LE FORMULAIRE AU CLIQUE SUR COMMANDER - Après la partie tableau
let insertFormulaire = () => {

    myPanier.insertAdjacentHTML('beforeend',

        `
        <form id="formulaireCommande">
            <div>
                <h2> Valider votre commande :</h2>
            </div>

            <div>
                <label for="lastName">Nom :</label>
                <input id="lastName" name="lastName" type="text" placeholder="nom" />
                <small></small>
            </div>
            <div>
                <label for="firstName">Prénom :</label>
                <input id="firstName" name="firstName" type="text" placeholder="prénom" />
                <small></small>
            </div>
            <div>
                <label for="email">E-mail :</label>
                <input id="email" name="email" type="text" placeholder="e-mail" />
                <small></small>
            </div>
            <div>
                <label for="address">Adresse :</label>
                <input id="address" name="address" type="text" placeholder="adresse" />
                <small></small>
            </div>
            <div>
                <label for="city">Ville :</label>
                <input id="city" name="city" type="text" placeholder="ville" />
                <small></small>
            </div>

            <button id="validerCommande" type="submit" aria-label="Valider la commande"> Valider la commande </button>
        </form>
        
        ` 
    
    );


};

// CONTROLE FORM VIA REGEX
const controleStrictForm = () => {

    formulaire.lastName.addEventListener('input', function() {

    validationLastName(this);

    });

    formulaire.firstName.addEventListener('input', function() {

    validationFirstName(this);

    });

    formulaire.email.addEventListener('input', function() {

    validationEmail(this);

    });

    formulaire.address.addEventListener('input', function() {

    validationAddress(this);

    });

    formulaire.city.addEventListener('input', function() {

    validationCity(this);

    });


    // LES REGEX et APPEL A CONDITION VALIDATION 
    /* on y place les conditions a verifier (regexp) - lentrer a tester - et lelement ou l'on va envoier le message si la condition n'est pas respecter  VIA LA FONCTION conditionValidation */  
    const validationLastName = (inputLastName) => {

        let lastNameRegex = new RegExp('^[^0-9][a-zA-Z.-]{3,25}[ ]{0,2}$', 'g');

        let testlastName = lastNameRegex.test(inputLastName.value);
        let affichage = inputLastName.nextElementSibling;

        conditionValidation(testlastName, inputLastName, affichage);

    };

    const validationFirstName = (inputFirstName) => {

        let FirstNameRegex = new RegExp('^[^0-9][a-zA-Z.-]{3,25}[ ]{0,2}$', 'g');

        let testFirstName = FirstNameRegex.test(inputFirstName.value);
        let affichage = inputFirstName.nextElementSibling;

        conditionValidation(testFirstName, inputFirstName, affichage);

    };

    const validationEmail = (inputEmail) => {

        let emailRegex = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}[ ]{0,2}$', 'g');

        let testEmail = emailRegex.test(inputEmail.value);
        let affichage = inputEmail.nextElementSibling;

        conditionValidation(testEmail, inputEmail, affichage);

    };

    const validationAddress = (inputAdress) => {

        let addressRegex = new RegExp('^[a-zA-Z0-9.,-_ ]{5,50}[ ]{0,2}$', 'g');

        let testAddress = addressRegex.test(inputAdress.value);
        let affichage = inputAdress.nextElementSibling;

        conditionValidation(testAddress, inputAdress, affichage);

    };

    const validationCity = (inputCity) => {

        let cityRegex = new RegExp('^[^0-9][a-zA-Z.-]{3,25}[ ]{0,2}$', 'g');

        let testCity = cityRegex.test(inputCity.value);
        let affichage = inputCity.nextElementSibling;

        conditionValidation(testCity, inputCity, affichage);

    };


    // AFFICHAGE DUN MESSAGE EN CAS DERREUR 
    /* Affiche un message d'erreur rouge et une bordure rouge si false, et l'input et vert si les conditions des regexp sont respectés */
    const conditionValidation = (elementTest, input, affichage) => {

        // si valeur vraie
        if (elementTest) {

            affichage.style.display ="none";
            affichage.style.color ="#32CD32";

            input.style.border ="4px solid #32CD32";

        // si aucune valeur    
        } else if (input.value.length == 0) {

            affichage.style.display ="none";
            input.style.border ="none";

        // si valeur fausse    
        } else if (!elementTest) {

            affichage.style.display ="inline-block";
            affichage.style.color ="red";
            input.style.border ="4px solid red";

            affichage.innerHTML = (

                `

                    "${input.value}" N'EST PAS VALIDE

                `

            );

        };

    };
};
/* ########################################################### */
/* ----------------------------------------------------------- */





/* ########################################################### */
/* -------------    VALIDATION COMMANDE    ------------------- */
/* ########################################################### */
// RECUPERATION DES DATA A ENVOYER :
let recuperationData = () => {

    // OBJET CONTACT :
    contact = {

        firstName: formulaire.firstName.value,
        lastName: formulaire.lastName.value,
        address: formulaire.address.value,
        city: formulaire.city.value,
        email: formulaire.email.value

    }

    // RECUPERE CHAQUE ID PRODUIT DU PANIER  
    for (let i = 0; i < mesProduitsEnregistrer.length; i++) {

        const produit = mesProduitsEnregistrer[i];
        
        products.push(produit.id);
        
    };

    // OBJET CONTENANT LES ELEMENTS A ENVOYER AU BACK END
    MesInformationsPourLeBackEnd = {

        contact: contact,
        products: products

    };


};

/* POST REQUEST pour envoyé les données au back END au format JSON et recupérer les erreurs possibles */
const postServer = async() => {

    return await fetch('http://localhost:3000/api/cameras/order', {

    method: 'POST',
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(MesInformationsPourLeBackEnd)


    // recuperation des informations orderId, nom, prenom, prix total 
    }).then(async function(response) {

        const laReponseDuBackEnd = await response.json();
            
        // Création dun objet contenant ces informations (orderID, nom, prénom, et prix total)
        let objetRetourAulocalStorage = new Object();
        objetRetourAulocalStorage["prix"] = totaux.toString();  
        objetRetourAulocalStorage["Numéros de commande"] = laReponseDuBackEnd.orderId;  
        objetRetourAulocalStorage["Nom"] = laReponseDuBackEnd.contact.lastName;  
        objetRetourAulocalStorage["Prénom"] = laReponseDuBackEnd.contact.firstName;  

        /* On stock c'est information une fraction de seconde dans le local storage => on récupère => on supprime instantanément  A SAVOIR que cette pratique d'envoyé les informations clients dans le local storage n'est pas une pratique sécurisé, il est fait dans cette exercice dans un but purement visuel */
        localStorage.setItem("commande", JSON.stringify(objetRetourAulocalStorage));

        // Redirection sur la page de validation 
        return window.location.href ="validation.html";
        

    }).catch(function(error) {

        return console.log(error);

    });
};

// Controle du form a la validation => recuperationData => envoi back-end + redirection page validation
const validationFinalFormulaire = () => {

    /* VERIFICATION QUE LE FORMULAIRE ET BIEN REMPLI AVANT LENVOI AU BACK-END */
    if (!new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}[ ]{0,2}$', 'g').test(formulaire.email.value) ||
        !new RegExp('^[^0-9][a-zA-Z.-]{3,25}[ ]{0,2}$', 'g').test(formulaire.city.value)  || 
        !new RegExp('^[^0-9][a-zA-Z.-]{3,25}[ ]{0,2}$', 'g').test(formulaire.firstName.value)  ||
        !new RegExp('^[^0-9][a-zA-Z.-]{3,25}[ ]{0,2}$', 'g').test(formulaire.lastName.value)  || 
        !new RegExp('^[a-zA-Z0-9.,-_ ]{5,50}[ ]{0,2}$', 'g').test(formulaire.address.value) ) {

        return;

    /* Si aucune des valeurs du formulaire ne renvoi FALSE , appliqué la request POST */ 
    } else { 
        
        recuperationData();
        postServer();

    };
    
};
/* ########################################################### */
/* ----------------------------------------------------------- */


/* FONCTION PANIER  */
const majPanier = () => {

    /* MESSAGE PAR DEFAUT SI PANIER VIDE */
    if (mesProduitsEnregistrer == null || mesProduitsEnregistrer == 0) {

        panierVide();
            
        /* UNE FOIS LES ARTICLE SUPPRIMER DU PANIER SI LE TABLEAU ET VIDE => SUPPRIMER LE LOCALSTORAGE */
        if (mesProduitsEnregistrer == 0) {

            localStorage.clear();

        }


    /* SINON par deduction le panier contiens des articles DONC le reste du code s'applique ici */
    } else {

        // CALCULE TOTAL PANIER
        totalPanier();
        // CRÉATION d'un tableau HTML
        tableauHtml();

        // ON RECUPERE <TBODY> en HTML crée via tableauHtml() 
        bodyTab = document.getElementById('bodyTab');

        // CHAQUE PRODUIT du localStorage, et ajouté dynamiquement dans <TBODY> via <TR> 
        ajoutProduitPanier();
        // SUPPRESSION PRODUIT - VISUEL ET LOCALSTORAGE
        deleteProduit();

        // AFFICHAGE FORMULAIRE
        commander = document.getElementById('commander');
        commander.addEventListener('click', (e) => {

            e.preventDefault();

            commander.style.display ='none';

            // INSERT LE FORMULAIRE AU CLIQUE SUR COMMANDER - Après la partie tableau
            insertFormulaire();
            
            /* balise FORM */
            formulaire = document.querySelector('#formulaireCommande');

            // CONTROLE FORM REGEX
            controleStrictForm();

            // FORMULAIRE - Valider la commande :
            /* Lors du clique, on verifie encore une fois que les éléments input sont tous TRUE */
            // button valider la commande
            validerCommande = document.getElementById('validerCommande');

            validerCommande.addEventListener('click', (e) => {

                e.preventDefault();

                validationFinalFormulaire();

            });

        });
    };
};

// Appel de la fonction global
majPanier();

