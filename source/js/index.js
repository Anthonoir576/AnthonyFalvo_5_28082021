
// Mes variables est constantes 

/* declarations de ma variable en globale */
let cameras;
const showCameras;
const showShop = document.getElementById('myBoutique');

/* constantes stockant ma fonction pour récupérer l'api */
const fetchCameras = async() => {

    cameras = await fetch('http://localhost:3000/api/cameras/').then(res => res.json());

};

/* Fonction qui fait appel a l'api */
showCameras = async() => {

    await fetchCameras();

};