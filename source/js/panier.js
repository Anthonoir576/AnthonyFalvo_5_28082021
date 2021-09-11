let mesProduitsEnregistrer = JSON.parse(localStorage.getItem("mon panier"));
//console.log(mesProduitsEnregistrer);

let myPanier = document.getElementById('main-panier');
let close = document.getElementById('closePop');
let bodyTab;
let commander;
let supprimerSelection;
let tab = [];
let formulaire;
let validerCommande;


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
            
        // Enlever le tableau vide si les elements ont été supprimé 
        if (mesProduitsEnregistrer == 0) {

            localStorage.clear();

        }


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
                    <td>${totaux.toLocaleString("EUR", { style: "currency", currency: "EUR"})}</td>
                </tr>
                </tfoot>
            </table>
            <button id="commander" type="button">Commander</button>
            
            `
        );
     
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
                    <td data-label="Prix :">${parseFloat(mesProduitsEnregistrer[i].price).toLocaleString("EUR", { style: "currency", currency: "EUR"})}</td>
                    <td data-label="Supprimer :" class="supprimerProduit"><i class="far fa-trash-alt"></i></td>
                </tr>
                
                `
            );

        };


        supprimerSelection = Array.from(document.querySelectorAll('.supprimerProduit'));
        
        // supprimer element panier au clique
        for (let i = 0; i < supprimerSelection.length; i++) {

            supprimerSelection[i].addEventListener('click', () => {

                supprimerSelection[i].parentElement.style.display ="none";
                 
                tab = mesProduitsEnregistrer;
                tab.splice([i], 1);
                
                mesProduitsEnregistrer = localStorage.setItem('mon panier', JSON.stringify(tab));

                window.location.href ="panier.html";

            });

        };


        commander = document.getElementById('commander');
        // Formulaire apparait au clique
        commander.addEventListener('click', (e) => {

            e.preventDefault();
            commander.style.display ='none';

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
                        <input id="email" name="email" type="email" placeholder="e-mail" />
                        <small></small>
                    </div>
                    <div>
                        <label for="adress">Adresse :</label>
                        <input id="adress" name="adress" type="text" placeholder="adresse" />
                        <small></small>
                    </div>
                    <div>
                        <label for="city">Ville :</label>
                        <input id="city" name="city" type="text" placeholder="ville" />
                        <small></small>
                    </div>

                    <button id="validerCommande" type="submit"> Valider la commande </button>
                </form>
                
                ` 
            
            );

            
            // formulaire
            
            /* Utilisation du form.name pour recup les inputs au lieu de créer plusieurs variable */

            // nom = document.getElementById('lastName');
            // prenom = document.getElementById('firstName');
            // ville = document.getElementById('city');
            // adresse = document.getElementById('adress');
            // mail = document.getElementById('email');

            formulaire = document.getElementById('formulaireCommande');
            validerCommande = document.getElementById('validerCommande');

            validerCommande.addEventListener('click', (e) => {

                e.preventDefault();
                

            });

            const verificationFormulaire = () => {

                // j'écoute le changement de l'input une fois le focus disparu, donc une fois que j'ai cliqué ailleurs
                formulaire.email.addEventListener('change', () => {

                    // test 
                    console.log('changement ok');

                });

            };

            verificationFormulaire();

        });

    };



};

majPanier();

//console.log((1000).toLocaleString("EUR", { style: "currency", currency: "EUR",}));
