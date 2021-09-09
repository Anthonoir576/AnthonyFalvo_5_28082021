let mesProduitsEnregistrer = JSON.parse(localStorage.getItem("mon panier"));
//console.log(mesProduitsEnregistrer);

let myPanier = document.getElementById('main-panier');
let close = document.getElementById('closePop');
let bodyTab;
let commander;
let supprimerSelection;

/* Mon parse de prix le même que sur lindex */
function pricesSpace(prix) {

    return parseFloat(prix / 100).toFixed(2);

};

function majPanier() {

    // si la page panier ne contient rien, afficher ce message :
    if (mesProduitsEnregistrer == null || mesProduitsEnregistrer == 0) {

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


    // sinon c'est que des articles on été ajouté au panier / localStorage :
    } else {


        let totaux = 0;    
        
        for (let i = 0; i < mesProduitsEnregistrer.length; i++) {

            let price = Number(mesProduitsEnregistrer[i].price);

            totaux += price; 

        }
        
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
                    <td>${totaux.toFixed(2)} €</td>
                </tr>
                </tfoot>
            </table>
            <button id="commander" type="button">Commander</button>
            
            `
        );

        commander = document.getElementById('commander');

        
        bodyTab = document.getElementById('bodyTab');
        /* Chaque produit du localStorage, et ajouté dynamiquement dans mon tableau */    
        for(let i = 0; i < mesProduitsEnregistrer.length; i++) {

            bodyTab.insertAdjacentHTML('beforeend', 
                
                `
                <tr data-content="${mesProduitsEnregistrer[i].id}">
                    <td data-label="Produit :"><img class="produit-img" src="${mesProduitsEnregistrer[i].picture}" alt="produit selectionné" /></td>
                    <td data-label="Nom :">${mesProduitsEnregistrer[i].name}</td>
                    <td data-label="Option :">${mesProduitsEnregistrer[i].choice}</td>
                    <td data-label="Quantité :">${mesProduitsEnregistrer[i].quantity}</td>
                    <td data-label="Prix :">${mesProduitsEnregistrer[i].price} €</td>
                    <td data-label="Supprimer :" class="supprimerProduit"><i class="far fa-trash-alt"></i></td>
                </tr>
                
                `
            );

        };


        supprimerSelection = Array.from(document.querySelectorAll('.supprimerProduit'));
        let tab = [];


        // supprimer element
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

};

majPanier();

