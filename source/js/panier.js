let mesProduitsEnregistrer = JSON.parse(localStorage.getItem("mon panier"));
//console.log(mesProduitsEnregistrer);

let myPanier = document.getElementById('main-panier');
let close = document.getElementById('closePop');
let bodyTab;
let commander;
let supprimerSelection;
let tab = [];
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


        // Formulaire apparait au clique
        commander = document.getElementById('commander');

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
                        <input id="email" name="email" type="text" placeholder="e-mail" />
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

            

            // FORMULAIRE ET VALIDATION DE L'INPUT VIA LES REGEXP
            formulaire = document.querySelector('#formulaireCommande');

            
            formulaire.lastName.addEventListener('change', function() {

                validationLastName(this);

            });
                        
            formulaire.firstName.addEventListener('change', function() {

                validationFirstName(this);

            });
            
            formulaire.email.addEventListener('change', function() {

                validationEmail(this);

            });

            formulaire.adress.addEventListener('change', function() {

                validationAdress(this);

            });

            formulaire.city.addEventListener('change', function() {

                validationCity(this);

            });


            // AFFICHAGE DUN MESSAGE EN CAS DERREUR 
            const conditionValidation = function(elementTest, input, affichage) {

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



            // LES REGEX et APPEL A CONDITION VALIDATION    
            const validationLastName = function(inputLastName) {

                let lastNameRegex = new RegExp('^[^0-9][a-zA-Z.-]{3,25}[ ]{0,2}$', 'g');

                let testlastName = lastNameRegex.test(inputLastName.value);
                let affichage = inputLastName.nextElementSibling;

                conditionValidation(testlastName, inputLastName, affichage);

            };

            const validationFirstName = function(inputFirstName) {

                let FirstNameRegex = new RegExp('^[^0-9][a-zA-Z.-]{3,25}[ ]{0,2}$', 'g');

                let testFirstName = FirstNameRegex.test(inputFirstName.value);
                let affichage = inputFirstName.nextElementSibling;

                conditionValidation(testFirstName, inputFirstName, affichage);

            };

            const validationEmail = function(inputEmail) {

                let emailRegex = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}[ ]{0,2}$', 'g');

                let testEmail = emailRegex.test(inputEmail.value);
                let affichage = inputEmail.nextElementSibling;

                conditionValidation(testEmail, inputEmail, affichage);

            };

            const validationAdress = function(inputAdress) {

                let adressRegex = new RegExp('^[a-zA-Z0-9.,-_ ]{5,50}[ ]{0,2}$', 'g');

                let testAdress = adressRegex.test(inputAdress.value);
                let affichage = inputAdress.nextElementSibling;

                conditionValidation(testAdress, inputAdress, affichage);

            };
  
            const validationCity = function(inputCity) {

                let cityRegex = new RegExp('^[^0-9][a-zA-Z.-]{3,25}[ ]{0,2}$', 'g');

                let testCity = cityRegex.test(inputCity.value);
                let affichage = inputCity.nextElementSibling;

                conditionValidation(testCity, inputCity, affichage);

            };

        });

    };



};

majPanier();

//console.log((1000).toLocaleString("EUR", { style: "currency", currency: "EUR",}));

/*

    formulaire = document.getElementById('formulaireCommande');

    // fonction d'ecoute du formulaire en posant des conditions 
            const verificationFormulaire = (input, typeDeVerification) => {

                // verif input selectionner  
                let verifEntrer = typeDeVerification;
                let testEntrer = verifEntrer.test(input.value);
                let afficherMessage = input.nextElementSibling;

                // si valeur est correcte
                if (testEntrer) {

                    afficherMessage.style.display ="none";
                    afficherMessage.style.color ="#32CD32";

                    input.style.border ="4px solid #32CD32";

                    console.log(input.value);
                    console.log(testEntrer);


                // si aucune valeur    
                } else if (input.value.length == 0) {

                    afficherMessage.style.display ="none";
                    input.style.border ="none";
                   
                // si valeur fausse    
                } else if (!testEntrer) {

                    console.log(input.value);
                    console.log(testEntrer);

                    afficherMessage.style.display ="inline-block";
                    afficherMessage.style.color ="red";
                    input.style.border ="4px solid red";

                    afficherMessage.innerHTML = (
                        
                        `
                        
                        "${input.value}" N'EST PAS VALIDE

                        `

                    );

                };

            };
            

            // création argument, pour eviter de repeter le code 
            verificationFormulaire(formulaire.email, new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}[ ]{0,2}$', 'g'));
            verificationFormulaire(formulaire.city, new RegExp('^[^0-9][a-zA-Z.-]{3,25}[ ]{0,2}$', 'g'));
            verificationFormulaire(formulaire.firstName, new RegExp('^[^0-9][a-zA-Z.-]{3,25}[ ]{0,2}$', 'g'));
            verificationFormulaire(formulaire.lastName, new RegExp('^[^0-9][a-zA-Z.-]{3,25}[ ]{0,2}$', 'g'));
            verificationFormulaire(formulaire.adress, new RegExp('^[a-zA-Z0-9.,-_ ]{5,50}[ ]{0,2}$', 'g'));


            // BOUTON DENVOI FORMULAIRE / COMMANDE
            validerCommande = document.getElementById('validerCommande');

            validerCommande.addEventListener('click', (e) => {

                e.preventDefault();


                // la verification fonctionne
                if (!new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g').test(formulaire.email.value) ||
                    !new RegExp('^[^0-9][a-zA-Z.-]{3,25}$', 'g').test(formulaire.city.value)  || 
                    !new RegExp('^[^0-9][a-zA-Z.-]{3,25}$', 'g').test(formulaire.firstName.value)  ||
                    !new RegExp('^[^0-9][a-zA-Z.-]{3,25}$', 'g').test(formulaire.lastName.value)  || 
                    !new RegExp('^[a-zA-Z0-9.,-_ ]{5,50}$', 'g').test(formulaire.adress.value) ) {

                    console.log('une des conditions nest pas rempli');
                                      
                } else { 
                    
                    console.log('tous est béné ');

                };

                

            });
            

*/


/* 

            const tableauInputs = Array.from(document.querySelectorAll("#formulaireCommande input"));
            let formulaire = document.getElementById('formulaireCommande');

            for (let i = 0; i < tableauInputs.length; i++) {

                let input = tableauInputs[i];
                let value = input.value;

                let verification = () => {

                    new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}[ ]{0,2}$', 'g').test(formulaire.lastName.value);
                    new RegExp('^[^0-9][a-zA-Z.-]{3,25}[ ]{0,2}$', 'g').test(formulaire.firstName.value);
                    new RegExp('^[^0-9][a-zA-Z.-]{3,25}[ ]{0,2}$', 'g').test(formulaire.email.value);
                    new RegExp('^[^0-9][a-zA-Z.-]{3,25}[ ]{0,2}$', 'g').test(formulaire.adress.value);
                    new RegExp('^[a-zA-Z0-9.,-_ ]{5,50}[ ]{0,2}$', 'g').test(formulaire.city.value);

                };


                input.addEventListener('change', () => {


                    verification();


                });


            };

*/


