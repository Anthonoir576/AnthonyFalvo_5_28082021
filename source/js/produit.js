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
    .then(function(articles) {

        return articles

    })
    .catch(function(error) {

        return console.log(error);

    })

};

/* Mon parse de prix le même que sur lindex */
function pricesSpace(prix) {

    return parseFloat(prix.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')).toFixed(2);

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
            * 
        */

        e.preventDefault();

        let confirm = document.getElementById('confirmationAjoutPanier');
        let valueInputQuantity = document.getElementById('inputQuantity').value;
        let valueInputLenses = document.getElementById('choiseLenses').value;
        let selectionUtilisateur = {

            id : produit._id,
            picture : produit.imageUrl,
            name : produit.name,
            price : pricesSpace(produit.price),
            quantity : valueInputQuantity,
            choise : valueInputLenses

        };
        
        
        // --- 01 ---
        confirm.style.display = "block";

        if(valueInputQuantity == 1) {

            confirm.textContent = `Merci pour votre confiance. Le ${produit.name} ${valueInputLenses} est ajouté au panier`; 

        } else {

            confirm.textContent = `Merci pour votre confiance. Les ${produit.name} ${valueInputLenses} sont ajoutés au panier`;
            
        };

        confirm.insertAdjacentHTML('beforeend', `<i class="far fa-check-square"></i>`);
        // -----------


        let mesProduitsEnregistrer = [];

        if (mesProduitsEnregistrer === true) {



        }else{

            mesProduitsEnregistrer.push(selectionUtilisateur);
            localStorage.setItem("mon panier", JSON.stringify(mesProduitsEnregistrer))

        }

        console.log(mesProduitsEnregistrer);
        //console.log(JSON.stringify(selectionUtilisateur));  
        //console.log(JSON.parse(selectionUtilisateur.name));  

    });



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
      
};




/************* PARTIE STOCKAGE DU PANIER AU CLIQUE DANS LE LOCALSTORAGE ***************/