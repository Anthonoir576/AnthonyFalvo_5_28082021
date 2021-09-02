
/* Fonction qui sappelle elle meme */
(async function() {

    
    const produitId = getProduitId();
    const produit = await getProduit(produitId);

    majProduit(produit);


})()

// Mes variables est constantes 
/* Lendroit ou afficher le resultat */
const mySelection = document.querySelector('.main-produit');



// fonction

/* Recupere dans lURL l'id */
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
                <img class="camera-img" src="${produit.imageUrl}" alt="article en vente" />
                <div class="camera-info">
                    <h2 class="camera-name">${produit.name}</h2>
                    <p class="camera-description">${produit.description}</p>
                    <p class="camera-price">${pricesSpace(produit.price)} €</p>
                </div>
                <label for="quantityProduit">Quantité :</label>
                <input type="number" name="quantityProduit" aria-label="quantité de produit" id="inputQuantity" min="1" />
                <button id="panier" type="button" aria-label="ajouter votre appareil-photo au panier">
                Ajouter au panier</button>
            </div>
        </section>
        
        `

    )
    
};
