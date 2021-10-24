
/************* RECUPERATION DES DONNEES SUR LA NOUVELLE PAGE - AFFICHAGE et SUPPRESSION DONNEES ***************/


/* ########################################################### */
/* ---------------- VARIABLE / CONSTANTE --------------------- */
/* ########################################################### */

/* LES INFORMATIONS CLIENT */
let informationTemporaire = JSON.parse(localStorage.getItem("commande"));

/* ########################################################### */
/* ----------------------------------------------------------- */





/* ----------------------- FONCTIONS  ------------------------ */

/* ########################################################### */
/* -------------------    VALIDATION    ---------------------- */
/* ########################################################### */
/* Cette CONDITION me permet de ne pas pouvoir être présent sur cette page, si aucune commande a été valider. Et renvoi a l'index */   
let affichageMerci = () => {

    if (informationTemporaire == null) {

        window.location.href ="index.html";
    
    // SINON Créer a partir des informations de commande des élements, avec certaine information essentiel au client
    } else {
    
    
        let mainValidation = document.querySelector('.main-validation');
    
        mainValidation.innerHTML = (
    
            `
            
            <section>
                <h2>Merci pour votre commande :</h2>
                <p>Madame, monsieur, <span>${informationTemporaire.Nom} ${informationTemporaire.Prénom}</span> nous vous remercions pour votre confiance .</p>
                <p>Nous confirmons votre commande n° <span>${informationTemporaire['Numéros de commande']}</span> pour un montant total de : <span>${parseFloat(informationTemporaire.prix).toLocaleString("EUR", { style: "currency", currency: "EUR"})}</span> TTC.</p>
                <p>Elle serra expédié dans les plus bref délais. En espérant vous revoir très bientôt.</p>
                <p>Amicalement <strong> Ori <em>&</em> pix's .fr</strong></p>
                <a href="index.html"> Retour à votre boutique préférer ? </a>
            </section>
            
            `
    
        );
        
        /* effacer le local storage Panier vide pour qu'il puisse commander a nouveau et information client vide (pour la sécurité) Même si je répète, cette pratique n'est pas du tous sécurisé */
        localStorage.clear();
    
    };

};

affichageMerci();
/* ########################################################### */
/* ----------------------------------------------------------- */ 