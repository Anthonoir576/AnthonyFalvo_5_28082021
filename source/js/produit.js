
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
/*  */
function majProduit(produit) {

    
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
                            <select name="choix" id="choiseLenses"></select>
                        </div>
                        <div>
                            <label for="inputQuantity">
                                Quantité :
                            </label>
                            <input type="number" name="quantité" aria-label="quantité de produit" id="inputQuantity" value="1" min="1" max="100" />
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

    /* Boucle qui parcours toute les lentilles du tableau lenses pour chaque produit individuellement et les ajoute dans le select chaque option dynamiquement . Même si on en rajoute dans le tableau :D */
    for(let i = 0; i < produit.lenses.length; i++) {

        let lentille = produit.lenses[i];
        const choixLentilles = document.getElementById('choiseLenses');

        choixLentilles.insertAdjacentHTML('afterbegin',

            `
            <option value="${lentille}" name="choiseLenses" aria-label="choix de lentille format ${lentille}">${lentille}</option>
            
            `

        );

    };

    /* Element qui permet de confirmer lenvoi dans le panier avec un message de confirmation  */
    document.getElementById('panier').addEventListener('click', (e) => {

        /**
            * e.preventDefault() stoppe le comportement pas defaut, en l'occurence me permet de pas quitter la page lors de l'envoi via le btn
            * 
            * confirm = Valeur de la quantité selectionné par l'utilisateur et la selection de la lentille.
            * 
            * valueInputQuantity = valeur de l'input quantité choissit par l'utilisateur.
            * 
            * valueIputLenses = valeur de l'input Modèles choissit par l'utilisateur.
            * 
            * selectionUtilisateur =  objet créer au clique, permettant d'avoir les données du produit, ainsi que la quantité et le choix de l'utilisateur.
            * 
            * // 01 = affiche le message grace au changement de display, LE ou LES par rapport à la quantité, affiche le nom produit, ainsi que la lentille choisis dans le select, petit plus, injecte une icone de validation.
            * 
            * // 02 = regarde si le produit ajouter au local existe ou non, si il existe, il push le produit uniquement, mais si il existe pas il en crée un tableau, et l'injecte . JSON.stringify permet de convertir du js en json, et inversement pour JSON.parse.
        */

        e.preventDefault();


        let confirm = document.getElementById('confirmationAjoutPanier');
        let valueInputQuantity = document.getElementById('inputQuantity').value;
        let valueInputLenses = document.getElementById('choiseLenses').value;

        let selectionUtilisateur = {

            id : produit._id,
            picture : produit.imageUrl,
            name : produit.name,
            price : parseFloat(pricesSpace(produit.price)),
            quantity : valueInputQuantity,
            choice : valueInputLenses

        };
        


        let mesProduitsEnregistrer = JSON.parse(localStorage.getItem("mon panier"));

        /* Fonction afin de push dans le local storage afin deviter de repeter le code deux fois */  
        let localSto = (selection, enregistrer) => {

            enregistrer.push(selection);
            localStorage.setItem("mon panier", JSON.stringify(enregistrer));

        };
   
        confirm.style.display = "block"; 
        // la confirmation du panier a était mise en fonction pour evité les repetitions 
        let confirmationFonction = () => {

            confirm.style.background ="#32CD32";

            if(valueInputQuantity == 1) {
    
                confirm.textContent = `Merci pour votre confiance. Le ${produit.name} ${valueInputLenses} est ajouté au panier`; 
    
            } else {
    
                confirm.textContent = `Merci pour votre confiance. Les ${produit.name} ${valueInputLenses} sont ajoutés au panier`;
                
            };
    
            confirm.insertAdjacentHTML('beforeend', `<i class="far fa-check-square"></i>`);

        };

        // VERIFICATION DOUBLON !!!! 
        // condition qui permet de pas avoir de doublon darticle via lid et loption choisis . et limite aussi le panier a 10 artiques différent. avec une quantité max de 100 pour chacun directement dans linput
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
  
    });     
};
