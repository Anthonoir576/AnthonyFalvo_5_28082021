(async function() {

    
    const produitId = getProduitId();
    const produit = await getProduit(produitId);

    majPanier(produit);


})()

let mesProduitsEnregistrer = JSON.parse(localStorage.getItem("mon panier"));
console.log(mesProduitsEnregistrer);

let myPanier = document.getElementById('main-panier');
let close = document.getElementById('closePop');



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

    return parseFloat(prix.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')).toFixed(2);

};

function majPanier(produit) {

    // si la page panier ne contient rien, afficher ce message :
    if (mesProduitsEnregistrer == null) {

        myPanier.innerHTML = (

            `
            <section class="panier">
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


    // sinon c'est que des articles on été selectionné :
    } else {
        
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
                    <th>Suppression :</th>
                </tr>
                </thead>
                <tbody id="bodyTab"></tbody>
                <tfoot>
                <tr>
                    <td>TOTAL :</td>
                    <td> 0 </td>
                </tr>
                </tfoot>
            </table>
            
            `
        );

        let bodyTab = document.getElementById('bodyTab');

        for(let i = 0; i < mesProduitsEnregistrer.length; i++) {

            if(produit.id == mesProduitsEnregistrer[i].id) {

                
            bodyTab.insertAdjacentElement('beforeend', 
                
                `
                <tr>
                    <td>${produit.mesProduitsEnregistrer[i].picture}</td>
                    <td>${produit.mesProduitsEnregistrer[i].name}</td>
                    <td>${produit.mesProduitsEnregistrer[i].choice}</td>
                    <td>${produit.mesProduitsEnregistrer[i].qunatity}</td>
                    <td>${produit.mesProduitsEnregistrer[i].price}</td>
                    <td><button></button></td>
                </tr>
                
                `
            );
          
            
            } else {
    
                return;
    
            }


        }


    };

}


