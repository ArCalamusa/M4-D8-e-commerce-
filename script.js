const endpoint = "https://striveschool-api.herokuapp.com/api/product/";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDM0NzhmNzc5MTk4NjAwMTQ4N2M0NWIiLCJpYXQiOjE2ODExNjI0NDEsImV4cCI6MTY4MjM3MjA0MX0.CglQpq8KhmbDLW9bkUaJNaQszoQU3EmYutd8gE0xnmM";

//la API non dovrebbe caricarmi i prodotti? anche sulla generazione del token ho avuto diversi problemi
const getProducts = async () => {
    let products;
    try {
        showLoader();
        await fetch(endpoint, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            }
        }).then(response => response.json()).then(data => products = data);
        hideLoader();
        return products;
    } catch (error) {
        console.log(error);
    }
};

//funzione che mostra il loader
const showLoader = () => {
    const loader = document.querySelector('div.loader');
    loader.classList.remove('d-none');
};

//funzione che nasconde il loader
const hideLoader = () => {
    const loader = document.querySelector('div.loader');
    loader.classList.add('d-none');
};