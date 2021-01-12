
// Constantes
const MAX_QTY = 9;
const productIdKey = "product";
const orderIdKey = "order";
const inputIdKey = "quantite";
const achats = [];

var total = 0;

function init() {
    createShop();
}

window.addEventListener("load", init);

function createShop() {
    var shop = document.getElementById("boutique");
    for (var i = 0; i < catalog.length; i++) {
        shop.appendChild(createProduct(catalog[i], i));
    }
}

function createProduct(product, index) {
    var block = document.createElement("div");
    block.className = "produit";
    block.id = index + "-" + productIdKey;

    block.appendChild(createBlock("h4", product.name));
    block.appendChild(createBlock("img", product.image, "imgproduct"));
    block.appendChild(createBlock("div", product.description, "description"));
    block.appendChild(createBlock("div", product.prix, "prix"));
    block.appendChild(createOrderControlBlock(index));
    return block;
}

function createBlock(tag, content, cssClass) {
    var element = document.createElement(tag);
    if (cssClass != undefined) {
        element.className = cssClass;
    }
    if (tag === 'img')
        element.src = content
    else
        element.innerHTML = content;
    return element;
}

function createOrderControlBlock(index, product) {
    var control = document.createElement("div");
    control.className = "controle";
    var input = document.createElement("input");
    input.id = index + '-' + inputIdKey;
    input.type = "number";
    input.step = "1";
    input.value = "0";
    input.min = "0";
    input.max = MAX_QTY.toString();
    control.appendChild(input);

    var button = document.createElement("button");
    button.className = 'commander';
    button.innerHTML = "Ajouter"
    button.id = index + "-" + orderIdKey;
    control.appendChild(button);
    button.addEventListener ("click", function() {
        alert("Article ajouté au panier");
    });
    return control;
}

function updateButton(input) {
    if (input.value === 0) {
        input.value = null;
        let id = input.id.substring(9);
        let button = document.getElementById("produit-" + id);
        disableInput(button);
    } else {
        let id = input.id.substring(9);
        let button = document.getElementById("produit-" + id);
        enableInput(input.value, id, button);
    }
}

function enableButton(quantite, id, button) {
    button.removeAttribute('disabled');
    button.onclick = function () {
        addToCart(id, parseInt(quantite));
        const input = document.getElementById("quantite-" + id);
        input.value = null;
    };
    button.setAttribute('style', 'opacity:1');
}

function disableButton(button) {
    button.removeAttribute("onclick");
    button.setAttribute("disabled", "");
    button.setAttribute('style', 'opacity:0.15');
}

function addToCart(id, quantite){

}

function deleteProductFromCart(id) {
    const index = achats.indexOf(element => element.product.id === id)
    achats.splice(index, 1);
    document.getElementById("achat-" + id).remove();
    getTotalPrice();
}

function montant() {
    let sum = 0;
    achats.forEach(achat => {
        sum += achat.quantite * parseInt(achat.product["prix"]);
    });
    document.getElementById('total-price').innerHTML = sum;
}

// BARRE DE RECHERCHE

function searchProduct(search) {
    var listProducts = [];
    catalog.forEach(product => {
        if (product["name"].toUpperCase().includes(search.toUpperCase())) {
            listProducts.push(product);
        }
    });
    createShop(listProducts);
}
