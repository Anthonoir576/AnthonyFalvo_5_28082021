
// Mes variables est constantes 

/* declarations de ma variable en globale */
let cameras;
const showShop = document.getElementById('myBoutique');
const buttonShop = document.getElementById('buttonShop'); 

/* constantes stockant ma fonction pour récupérer l'api */
const fetchCameras = async() => {

    cameras = await fetch('http://localhost:3000/api/cameras/').then(res => res.json());

};

/* Fonction qui fait appel a l'api */
const showCameras = async() => {

    await fetchCameras();

    showShop.innerHTML = (

        cameras
            .filter(camera => camera.name.toLowerCase())
            .map(camera => (

                `
                
                <div class="camera-item">
                    <img class="camera-img" src="${camera.imageUrl}" alt="article en vente" />
                    <div class="camera-info">
                        <h2 class="camera-name">${camera.name}</h2>
                        <p class="camera-price">${camera.price}</p>
                    </div>
                </div>

                `

            )).join('')
    );

};

buttonShop.addEventListener('click', showCameras());

