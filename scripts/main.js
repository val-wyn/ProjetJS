
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

function LignePanier (name, qte, prix)
{
    this.name = name;
    this.qteArticle = qte;
    this.prixArticle = prix;
    this.ajouterQte = function(qte)
    {
        this.qteArticle += qte;
    }
    this.getPrixLigne = function()
    {
        var resultat = this.prixArticle * this.qteArticle;
        return resultat;
    }
    this.getName = function()
    {
        return this.name;
    }
}

function Panier()
{
    this.liste = [];
    this.ajouterArticle = function(name, qte, prix)
    {
        var index = this.getArticle(name);
        if (index === -1) this.liste.push(new LignePanier(name, qte, prix));
        else this.liste[index].ajouterQte(qte);
    }
    this.getPrixPanier = function()
    {
        var total = 0;
        for(var i = 0 ; i < this.liste.length ; i++)
            total += this.liste[i].getPrixLigne();
        return total;
    }
    this.getArticle = function(code)
    {
        for(var i = 0 ; i <this.liste.length ; i++)
            if (name == this.liste[i].getName()) return i;
        return -1;
    }
    this.deleteArticle = function(code)
    {
        var index = this.getArticle(code);
        if (index > -1) this.liste.splice(index, 1);
    }
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
