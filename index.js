//crea ed inserisce card
const createCard = () => {
    const bodyCard = '</a><ul class="list-group list-group-flush">' + 
    '<li class="list-group-item"></li>' +
    '<li class="list-group-item"></li>' + 
    '<li class="list-group-item"></li>' +
    '<li class="list-group-item"></li>' + 
    '<li class="list-group-item"></li>' +
    '</ul>';
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.width = '18rem';
    card.innerHTML = bodyCard;
    return card;
};

//popola dati card
const setCard = (card, product) => {
    const listItems = card.getElementsByTagName('li');
    listItems[0].innerHTML = `<strong>Nome: </strong>${product.name}`;
    listItems[1].innerHTML = `<strong>Descrizione: </strong>${product.description}`;
    listItems[2].innerHTML = `<strong>Marca: </strong>${product.brand}`;
    listItems[3].innerHTML = `<strong>Prezzo: </strong>${product.price}`;
    listItems[4].innerHTML = `<a href="product.html?id=${product._id}" target="_blank">Dettagli prodotto</a>`;
    return card;
};

//crea la griglia
const createGrid = (products) => {
    const row = document.querySelector('div.container > div.row');
    products.forEach(item => {
        let card = createCard();
        card = setCard(card, item);
        const col = document.createElement('div');
        col.classList.add('col', 'my-3', 'col-6', 'col-sm-4', 'col-md-3');
        col.append(card);
        row.append(col);
    });
};


//nizializzazione della pagina
const init = async () => {
    //recupero i dati dall'API
    let products = await getProducts();
    createGrid(products);
};

//richiamo inizializzazione della pagina
init();