let productSelected = null;

//inizializzazione della pagina
const init = async () => {
    const addButton = document.getElementById('add');
    //listener associato al pulsante di aggiunta del prodotto
    addButton.addEventListener('click', async () => {
        //gestione input del form
        const inputs = document.querySelectorAll('.form > input');
        //validazione dei dati
        const check = validate(inputs);
        if (check === true) {
            //info prodoitto inserite dall'utente
            const name = inputs[0].value;
            const description = inputs[1].value;
            const brand = inputs[2].value;
            const imgUrl = inputs[3].value;
            const price = inputs[4].value;
            //aggiungo il nuovo prodotto
            const data = await addNewProduct(name, description, brand, imgUrl, parseFloat(price));
            //reset dei campi
            resetFields();
            window.location.reload();
        } else {
            //alert che appare in caso di problemi con i dati
            alert(check);
        }
    });

//aggiunge nuovo prodotto
const addNewProduct = async (name, desc, brand, imgUrl, price) => {

    let data;
    const myProduct = {

        name: name,
        description: desc,
        brand: brand,
        imageUrl: imgUrl,
        price: price
    };

    try {
        showLoader();
        await fetch(endpoint, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify(myProduct),
        }).then(response => response.json()).then(result => data = result);

        hideLoader();
        return data;
    } catch (e) {
        console.log(e);
    }
};

//pulisce i campi
const resetFields = () => {
    document.getElementById('name').value = '';
    document.getElementById('description').value = '';
    document.getElementById('brand').value = '';
    document.getElementById('imgUrl').value = '';
    document.getElementById('price').value = '';
};

//crea la tabella
const createTable = (products, tbody) => {
    products.forEach(item => {
        const tr = document.createElement('tr');
        const nameCol = document.createElement('td');
        nameCol.innerText = item.name;
        const descrCol = document.createElement('td');
        descrCol.innerText = item.description;
        const brandCol = document.createElement('td');
        brandCol.innerText = item.brand;
        const imgCol = document.createElement('td');
        imgCol.innerText = item.imageUrl;
        const priceCol = document.createElement('td');
        priceCol.innerText = item.price;
        const editCol = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.type = 'button';
        editButton.setAttribute('data-bs-toggle', 'modal');
        editButton.setAttribute('data-bs-target', '#editModal');
        editButton.classList.add('btn', 'btn-outline-success');
        editButton.addEventListener('click', () => {
            sendToDialog(item);
        });
        editCol.append(editButton);
        const deleteCol = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.type = 'button';
        deleteButton.classList.add('btn', 'btn-outline-danger');
        deleteButton.addEventListener('click', async () => {
            if (confirm("Vuoi eliminare l'elemento selezionato?")) {
                await deleteProduct(item._id);
                window.location.reload();
            }
        })
        deleteCol.append(deleteButton);
        tr.append(nameCol, descrCol, brandCol, imgCol, priceCol, editCol, deleteCol);
        tbody.append(tr);
    });
};

//eliminare
const deleteProduct = async (id) => {

    try {
        showLoader();
        await fetch(endpoint + id, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            },
            method: 'DELETE',
        }).then(response => response.json()).then(result => console.log(result));
        hideLoader();
    } catch (e) {
        console.log(e);
    }
};

//gestione modale
const sendToDialog = (product) => {
    const inputs = document.querySelectorAll('.modal-body > input');
    inputs[0].value = product.name;
    inputs[1].value = product.description;
    inputs[2].value = product.brand;
    inputs[3].value = product.imageUrl;
    inputs[4].value = product.price;
    productSelected = product;
};

//modifica prodotto
const saveChange = async (inputs) => {
    const id = productSelected._id;
    const myProduct = {
        name: inputs[0].value,
        description: inputs[1].value,
        brand: inputs[2].value,
        imageUrl: inputs[3].value,
        price: parseFloat(inputs[4].value)
    };

    try {
        showLoader();
        await fetch(endpoint + id, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json"
            },
            method: 'PUT',
            body: JSON.stringify(myProduct),
        }).then(response => response.json()).then(result => console.log(result));
        productSelected = null;
        hideLoader();
    } catch (e) {
        console.log(e);
    }
};

//controllo sui campi popolati
const checkInputs = (inputs) => {
    for(let input of inputs) {
        if (input.value === '') {
            return false;
        }
    }
    return true;
};

const checkPrice = (input) => {
    if (!isNaN(input.value)) {
        //il valore inserito è un numero
        return true;
    }
    return false;
};

//controllo dati
const validate = (inputs) => {
    if (checkInputs(inputs) && checkPrice(inputs[inputs.length - 1])) {
        return true;
    } else {
        if (!checkInputs(inputs)) {
            return 'Campi non compilati';
        } else {
            return "Il prezzo dev'essere un numero";
        }
    }
};

    const saveButton = document.querySelectorAll('.modal-footer > button')[1];
    saveButton.addEventListener('click', async () => {
        const inputs = document.querySelectorAll('.modal-body > input');
        const check = validate(inputs);
        if (check === true) {
            const modal = new bootstrap.Modal('#editModal');
            await saveChange(inputs);
            modal.hide();
            window.location.reload();
        } else {
            //alert che appare in caso di problemi con i dati
            alert(check);
        }

    });
    const products = await getProducts();
    const tbody = document.getElementsByTagName('tbody')[0];
    createTable(products, tbody);
};

//richiamo inizializzazione della pagina
init();
