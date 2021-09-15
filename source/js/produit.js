
/************* AFFICHAGE INDIVIDUEL DU PRODUIT SELECTIONNER PAR LUTILISATEUR ***************/

/* FONCTION PRINCIPALE */
/* Fonction recursive declare deux constantes fessant appel une entre elle, cette fonction s'appelle elle même après réponse du serveur grace au await */
(async function() {
 
    const produitId = getProduitId();
    const produit = await getProduit(produitId);

    majProduit(produit);

})()

/* BALISE MAIN en HTML OU SERRA AFFICHER LE PRODUIT */
const mySelection = document.querySelector('.main-produit');

/* URL PAR ID */
/* Recupere dans l'url existante une information placé en argument, en l'occurence on cherche a récupéré l'iD du produit, elle est souvent représenté de cette façon '?id=' dans l'url. cette fonction est donc stocker dans une variable et sert d'argument au moment de l'appel de l'url, ce qui permet de nous retourner une url + l'id */
function getProduitId() {

    return new URL(location.href).searchParams.get("id");

};

/* FETCH */
/* On récupere l'url comme sur l'ensemble des produits, a l'inverse, on y incrémente à la fin l'argument, cette argument fait appel a la fonction getproduitid() récupérant lid. Du coup cette fonction nous return l'url du produit selectionner via une promesse et retourne la reponse en json */
function getProduit(produitId) {

    return fetch(`http://localhost:3000/api/cameras/${produitId}`)
    .then(function(response) {

        return response.json()

    })
    .catch(function(error) {

        return console.log(error);

    })

};

/* CONVERSION CENTIME / EUROS */
function pricesSpace(prix) {

    return parseFloat(prix / 100);

};


/* LA STRUCTURE COMPLETE */
/* Creation produit - ajoute option - ecoute du clique et agit (voir detail) - Ajout au localStorage */
function majProduit(produit) {

    /**
     ******* 01: Création de la fiche produit individuel *******
     *  => Injection dans le html partie main, une section avec les differentes informations via l'URL
     * 
     ******* 02: Ajoute des lentilles pour chaque produit en option dynamiquement *******
     *  => Boucle FOR qui parcours toute les lentilles du tableau lenses pour chaque produit individuellement via l'id et les ajoute dans le select chaque option dynamiquement . Même si on en rajoute dans le tableau par le back-end.
     * 
     ******* 03: Listener qui ecoute l'ajoute du produit au clique et verifie certaine information *******
     *  => Tel que la quantité qui est envoyé au panier, l'option choisit, et pose une condition SI, l'option et l'id est le même n'ajoute que la quantité afin d'éviter les doublons. Affiche le panier est plein une fois celui ci arrivé a dix articles différents et empêche l'ajoute de tiers, et affiche un message de confirmation soit au singulier, soit pluriel avec le nom produit et l'option. Les produits sont stocker dans le local storage ou un ajout de quantité uniquement dans le local, grace a un systeme de mise a jour manuel de ce dernier.
     *  => la partie 03 est commenté en totalité Ainsi qu'une explication sur la logique de la condition d'ajout produit au localStorage
    */
    

    /* 01: Création de la fiche produit individuel */
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

    /* 02: Ajoute des lentilles pour chaque produit en option dynamiquement */
    let optionProduit = () => {

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

    optionProduit();
    


    /* 03: Listener qui ecoute l'ajoute du produit au clique et verifie certaine information  */
    document.getElementById('panier').addEventListener('click', (e) => {

        // stop le comportement par defaut du bouton
        e.preventDefault();

        // Element au stocker le message de confirmation ET panier plein SI il l'es
        let confirm = document.getElementById('confirmationAjoutPanier');
        // valeur quantité / option
        let valueInputQuantity = document.getElementById('inputQuantity').value;
        let valueInputLenses = document.getElementById('choiseLenses').value;

        // Object contenant le choix de l'utilisateur
        let selectionUtilisateur = {

            id : produit._id,
            picture : produit.imageUrl,
            name : produit.name,
            price : parseFloat(pricesSpace(produit.price)),
            quantity : valueInputQuantity,
            choice : valueInputLenses

        };
        
        // recuperation du local storage
        let mesProduitsEnregistrer = JSON.parse(localStorage.getItem("mon panier"));

        /* Fonction push dans le local storage l'objet selectionUtilisateur */  
        let localSto = (selection, enregistrer) => {

            enregistrer.push(selection);
            localStorage.setItem("mon panier", JSON.stringify(enregistrer));

        };
   
        // REND VISIBLE le message de confirmation 
        confirm.style.display = "block"; 
        
        // MESSAGE VISIBLE + Condition si un article est selectionner appliqué le singulier / Sinon pluriel
        let confirmationFonction = () => {

            confirm.style.background ="#32CD32";

            if(valueInputQuantity == 1) {
    
                confirm.textContent = `Merci pour votre confiance. Le ${produit.name} ${valueInputLenses} est ajouté au panier`; 
    
            } else {
    
                confirm.textContent = `Merci pour votre confiance. Les ${produit.name} ${valueInputLenses} sont ajoutés au panier`;
                
            };
    
            confirm.insertAdjacentHTML('beforeend', `<i class="far fa-check-square"></i>`);

        };

        // VERIFICATION DOUBLON - via le même ID et la même option : equivaut au même article add que la quantité
        
        /**
         * IF la key mon panier n'existe pas dans le local storage ALORS crée un tableau + fonction de confirmation + injecte le choix utlisateur dans le local storage
         * 
         * ELSE IF la key mon panier existe donc, elle est différente de null, du coup je parcours le tableau du local, et j'y repose une condition. Si le choix et lid que lutilisateur a selectionné sont identique a un article dans le local, alors je recupere le local dans un tableau, je met a jour la quantité, et le renvoi. la logique permet de parcourir tous le tableau intégralement, pour vérifier si lelement n'est pas existant. A la fin du tableau si cette element nest pas existant, alors il ajoute le produit au local storage
        */
        let verificationDesProduits = () => {
       
            if (mesProduitsEnregistrer == null) {

                mesProduitsEnregistrer = [];
                confirmationFonction();
                localSto(selectionUtilisateur, mesProduitsEnregistrer);

            } else if (mesProduitsEnregistrer != null) {

                for(let i = 0; i < mesProduitsEnregistrer.length; i++) {

                    if (mesProduitsEnregistrer[i].id === selectionUtilisateur.id && mesProduitsEnregistrer[i].choice === selectionUtilisateur.choice) {
                    
                        let totalQuantité = parseInt(mesProduitsEnregistrer[i].quantity, 10) + parseInt(selectionUtilisateur.quantity ,10);
                        
                        let updateStorage = mesProduitsEnregistrer;
            
                        updateStorage[i].quantity = totalQuantité;
            
                        mesProduitsEnregistrer = updateStorage;
                        
                        confirmationFonction();
                        localStorage.setItem('mon panier', JSON.stringify(mesProduitsEnregistrer));
            
                    } else if ( (i + 1) < mesProduitsEnregistrer.length) {

                        if (mesProduitsEnregistrer.length < 10) {

                            continue;

                        } else if ( mesProduitsEnregistrer.length == 10) {

                            confirm.style.background ="red";
                    
                            confirm.textContent = `VOTRE PANIER EST PLEIN`;
                            confirm.insertAdjacentHTML('beforeend', `<i class="far fa-times-circle"></i>`);
                
                            return;

                        };
    
                    } else if ((i + 1) == mesProduitsEnregistrer.length && mesProduitsEnregistrer[i].id != selectionUtilisateur.id || mesProduitsEnregistrer[i].choice != selectionUtilisateur.choice) {
    
                        confirmationFonction();
                        localSto(selectionUtilisateur, mesProduitsEnregistrer);

                    };

                    return;

                };

            };
  
        };

        verificationDesProduits();

    });

};
