import { catalog } from '../Data/Catalogue1.js';

const articles = [];
const catalogue = getProduitsFromCatalog();
main();

function main() {
    generateItemList(catalogue);

    var recherche = document.getElementById("recherche-input");
    recherche.addEventListener('input', _ => {
        if (recherche.value == "") {
            generateItemList(catalogue);
        } else {
            rechercherArticle(recherche.value);
        }
    });
}

function addInputsListeners() {
    var quantiteInputs = document.querySelectorAll('.quantite-input');
    quantiteInputs.forEach(input => {
        input.addEventListener('input', _ => {
            updateInput(input)
        });
    });
}

function updateInput(input) {
    if (input.value > 9) {
        input.value = 9;
    } else if (input.value <= 0) {
        input.value = null;
        var id = input.id.substring(9);
        var button = document.getElementById("produit-" + id);
        disableInput(button);
    } else {
        var id = input.id.substring(9);
        var button = document.getElementById("produit-" + id);
        if (input.value > 0) {
            enableInput(input.value, id, button);
        } else {
            disableInput(button);
        }
    }
}

function enableInput(quantite, id, button) {
    button.removeAttribute('disabled');
    button.onclick = function() {
        ajouterAuPanier(id, parseInt(quantite));
        const input = document.getElementById("quantite-" + id);
        input.value = null;
    };
    button.setAttribute('style','opacity:1');
}

function disableInput(button) {
    button.removeAttribute("onclick");
    button.setAttribute("disabled", "");
    button.setAttribute('style','opacity:0.25');
}

function getProduitsFromCatalog() {
    var index = 1;
    var catalogue = [];
    catalog.forEach(produit => {
        catalogue.push({
            id : index,
            name : produit["name"],
            description : produit["description"],
            image : produit["image"],
            price : produit["price"]
        });
        index++;
    });
    return catalogue;
}

function generateItemList(items)
{
    resetListeArticle();
    var catalog = document.getElementById("catalog");
    items.forEach(item =>
    {
        var listedItem = document.createElement('div');
        listedItem.setAttribute('class', 'col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-4')
        listedItem.innerHTML =
            `<div class="card">
                <img class="card-img-top" src="${item["image"]}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${item["name"]}</h5>
                    <p class="card-text aligned">${item["description"]}
                    <br>Prix : ${item["price"]}€</p>    
                    <div class="container">
                        <form>
                            <div class="form-group row">
                                <input class="col-9 quantite-input" id="quantite-${item["id"]}" type="number" min="0" max="9"/>
                                <div class="col-2">
                                    <button class="btn btn-primary" id="produit-${item["id"]}" disabled style="opacity:0.25"><i class="fas fa-cart-arrow-down"></i></button>                    
                                </div>                                
                            </div>
                        </form>
                    </div>                    
                </div>
            </div>`;
        catalog.appendChild(listedItem);
    });
    addInputsListeners();
}


function rechercherArticle(libelle) {
    var articlesCorrespondants = [];
    catalogue.forEach(produit => {
        if (produit["name"].toUpperCase().includes(libelle.toUpperCase())) {
            articlesCorrespondants.push(produit);
        }
    });
    generateItemList(articlesCorrespondants);
}

function resetListeArticle() {
    var catalog = document.getElementById("catalog");
    catalog.innerHTML = "";
}

function ajouterAuPanier(id, quantite) {
    if(quantite < 0 && quantite >= 9) {
        window.alert("Saisie incorrect: vous devez saisir une quantité entre 1 et 9");
    } else {
        let article = null;
        //Test si l'article existe dans le panier
        const produit = catalogue.find(p => p.id == id);
        if (articles !== undefined) {

            article = articles.find(element => element.produit.name === produit.name);
            //S'il n'existe pas, on créer un nouvel article
            if (article == null) {
                ajouterArticle(produit, quantite);
                //Sinon on modifie la quantité
            } else {
                if((article.quantite + quantite) > 9) {
                    window.alert("Erreur: vous ne pouvez pas commander plus de 9 fois le même article");
                } else {
                    modifierQuantiteArticle(article, quantite);
                }
            }
            var button = document.getElementById("produit-" + id);
            disableInput(button);
            getTotalPrice();
        }
    }
}

function modifierQuantiteArticle(article, quantite) {
    //Récupère l'index
    var index = article.produit.id;
    if(index > 0) {
        //Modifie la quantité
        article.quantite += quantite;
        //Récupère l'élément html de l'article présent dans le panier
        const element = document.getElementById("article-"+index);
        //const liste = element.getElementsByClassName("infosArticle");
        const champsQuantite = element.getElementsByClassName("infosArticle")[0].children.item(2);
        champsQuantite.innerHTML = "Quantité : " + article.quantite;
    } else {
        windows.alert("Cet élément ne fait plus partie de votre panier");
    }
}

function retirerDuPanier(id) {
    const index = articles.indexOf(element => element.produit.id === id)
    articles.splice(index, 1);
    document.getElementById("article-"+id).remove();
    getTotalPrice();
}

function ajouterArticle(produit, quantite) {
    articles.push({
        produit: produit,
        quantite: quantite
    });
    var newArticle = document.createElement('div');
    newArticle.setAttribute('class', 'container');
    newArticle.innerHTML =
        `<div class="row mb-2" id="article-${produit.id}">
            <div class="col-4 p-0">
                <img src="${produit.image}" alt="" style="width:100%">
            </div>
            <div class="col-8 p-0">
                <ul class="infosArticle m-0">
                    <li>Nom : ${produit.name}</li>
                    <li>Prix : ${produit.price}€</li>
                    <li>Quantité : ${quantite}</li>
                </ul>
                <button class="btn btn-danger float-right" id="delete-${produit.id}"><i class="fas fa-trash-alt"></i></button>
            </div>            
        </div>`;
    const panier = document.getElementById('panier');
    panier.appendChild(newArticle);
    const deleteArticle = document.getElementById('delete-' + produit.id);
    deleteArticle.onclick = function() { retirerDuPanier(produit.id); }
}

function getTotalPrice() {
    var sum = 0;
    articles.forEach(article => {
        sum += article.quantite * parseInt(article.produit["price"]);
    });
    document.getElementById('total-price').innerHTML = sum;
}
