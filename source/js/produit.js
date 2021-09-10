/************* PARTIE AFFICHAGE INDIVIDUEL DU PRODUIT SELECTIONNER ***************/

/* Fonction qui sappelle elle meme declare deux variables et fait appelle a la fonction majProduit() */
(async function() {

    
    const produitId = getProduitId();
    const produit = await getProduit(produitId);

    majProduit(produit);


})()


// Mes variables est constantes 
/* Lendroit ou afficher le resultat */
const mySelection = document.querySelector('.main-produit');

/* Recupere dans lURL l'id en l'occurence chaque article serra celui cliqué */
function getProduitId() {

    return new URL(location.href).searchParams.get("id");

};

/* on nous retourne le produit selection en fonction de sont id grace a la fonction getProduitId */
function getProduit(produitId) {

    return fetch(`http://localhost:3000/api/cameras/${produitId}`)
    .then(function(response) {

        return response.json()

    })
    .catch(function(error) {

        return console.log(error);

    })

};

/* Mon parse de prix le même que sur lindex */
function pricesSpace(prix) {

    return parseFloat(prix / 100).toFixed(2);

};


/* lecriture sur le html du resultat final apres selection du produit ainsi qu'une boucle qui recupere dynamiquement chaque option presente pour le produit, même si on en ajoute via le back-end, au clique sur le btn panier retourne un message de confirmation dajout panier avec le nom du produit implémenté dynamiquement . jannule le comportement par defaut du clique avec e.preventDefault fonction afin de pas quitter la page par defaut lors dun clique sur un bouton */
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
                    <p class="camera-price">${pricesSpace(produit.price)} € <span> /<em>Unité</em></span></p>
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
            price : parseFloat(pricesSpace(produit.price) * valueInputQuantity).toFixed(2),
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



 
//  ******************* TEST ************************

//console.log(selectionUtilisateur.id);  
//console.log(mesProduitsEnregistrer[0].id);  
//console.log(selectionUtilisateur.choice);
//console.log(selectionUtilisateur.quantity);
//console.log(mesProduitsEnregistrer[0].quantity);
//console.log(parseInt(mesProduitsEnregistrer[0].quantity, 10) + parseInt( selectionUtilisateur.quantity, 10));
//console.log(JSON.parse(selectionUtilisateur.name));  


// UNE FOIS la quantité et le choix selectionné, direction automatique au panier !
//window.location.href ="panier.html";
