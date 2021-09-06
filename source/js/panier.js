let mesProduitsEnregistrer = JSON.parse(localStorage.getItem("mon panier"));
console.log(mesProduitsEnregistrer);

let myPanier = document.getElementById('main-panier');
let close = document.getElementById('closePop');


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



} else {

    

};
