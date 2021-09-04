
/* Fonction qui sappelle elle meme */
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
    .then(function (articles) {

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




/* lecriture sur le html du resultat final apres selection du produit */
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

        let confirm = document.getElementById('confirmationAjoutPanier');

        e.preventDefault();

        confirm.textContent = "Merci pour votre confiance. La selection est ajouté au panier";
        confirm.style.display = "block";


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