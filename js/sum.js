var cart = {
  // (A) PROPERTIES
  // (A1) HTML ELEMENTS
  hPdt : null, // HTML products list
  hItems : null, // HTML current cart

  // (A2) CART
  items : {}, // Current items in cart

  // (A3) AVAILABLE PRODUCTS
  // PRODUCT ID => DATA
  products : {
    
    123: {
      name : "Carteira grande marrom",
      desc : "Sandália prateada",
      img : "../img/prod01big.png",
      price : 257.87
    },
   
    124: {
      name : "Rasteira Tira Dedo",
      desc : "Sandália rasteira de tiras",
      img : "../img/prod02big.png",
      price : 124.70
    },
    125: {
      name : "Bolsa Tressê Rolotê",
      desc : "Bolsa em couro natural com detalhe de pespontos de couro na tampa e alça de tressê rolotê",
      img : "../img/prod03big.png",
      price : 675.90
    },
    126: {
      name : "Sandália prateada",
      desc : "Sandália prateada",
      img : "../img/prod04big.png",
      price : 257.87
    }
  },

  // (B) LOCALSTORAGE CART
  // (B1) SAVE CURRENT CART INTO LOCALSTORAGE
  save : function () {
    localStorage.setItem("cart", JSON.stringify(cart.items));
  },

  // (B2) LOAD CART FROM LOCALSTORAGE
  load : function () {
    cart.items = localStorage.getItem("cart");
    if (cart.items == null) { cart.items = {}; }
    else { cart.items = JSON.parse(cart.items); }
  },
  
  // (B3) NUKE CART!
  nuke : function () {
    if (confirm("Quer esvaziar o carrinho?  ?")) {
      cart.items = {};
      localStorage.removeItem("cart");
      cart.list();
    }
  },

  // (C) INITIALIZE
  init : function () {
    // (C1) GET HTML ELEMENTS
    cart.hPdt = document.getElementById("cart-products");
    cart.hItems = document.getElementById("cart-items");
    
    // (C2) DRAW PRODUCTS LIST
    cart.hPdt.innerHTML = "";
    let p, item, part;
    for (let id in cart.products) {
      // WRAPPER
      p = cart.products[id];
      item = document.createElement("div");
      item.classList.add("row-prod");
      cart.hPdt.appendChild(item);

      // PRODUCT IMAGE
      part = document.createElement("img");
      part.src = p.img;
      part.classList.add("img-cart");
      item.appendChild(part);

      // PRODUCT NAME
      part = document.createElement("div");
      part.innerHTML = p.name;
      part.classList.add("prod-name");
      item.appendChild(part);
      
      // PRODUCT PRICE
      part = document.createElement("div");
      part.innerHTML = "R$" + p.price;
      part.classList.add("prod-price");
      item.appendChild(part);
      
      //
      part = document.createElement("div");
      part.innerHTML =

      // ADD TO CART
      part = document.createElement("input");
      part.type = "button";
      part.value = "+";
      part.classList.add("p-add");
      part.onclick = cart.add;
      part.dataset.id = id;
      item.appendChild(part);

      // subtract TO CART
      part = document.createElement("input");
      part.type = "button";
      part.value = "-";
      part.classList.add("p-subtract");
      part.onclick = cart.subtract;
      part.dataset.id = id;
      item.appendChild(part);
    }
    
    // (C3) LOAD CART FROM PREVIOUS SESSION
    cart.load();
    
    // (C4) LIST CURRENT CART ITEMS
    cart.list();
  },
  
  // (D) LIST CURRENT CART ITEMS (IN HTML)
  list : function () {
    // (D1) RESET
    cart.hItems.innerHTML = "";
    let item, part, pdt;
    let empty = true;
    for (let key in cart.items) {
      if(cart.items.hasOwnProperty(key)) { empty = false; break; }
    }

    // (D2) CART IS EMPTY
    if (empty) {
      item = document.createElement("div");
      item.innerHTML = "Carrinho vazio";
      cart.hItems.appendChild(item);
    }
    
    // (D3) CART IS NOT EMPTY - LIST ITEMS
    else {
      let p, total = 0, subtotal = 0;
      for (let id in cart.items) {
        // ITEM
        p = cart.products[id];
        item = document.createElement("div");
        item.classList.add("c-item");
        cart.hItems.appendChild(item);

        // NAME
        part = document.createElement("div");
        part.innerHTML = p.name;
        part.classList.add("c-name");
        item.appendChild(part);

        // REMOVE
        part = document.createElement("input");
        part.type = "button";
        part.value = "X";
        part.dataset.id = id;
        part.classList.add("c-del");
        part.addEventListener("click", cart.remove);
        item.appendChild(part);

        // QUANTITY
        part = document.createElement("input");
        part.type = "number";
        part.value = cart.items[id];
        part.dataset.id = id;
        part.classList.add("c-qty");
        part.addEventListener("change", cart.change);
        item.appendChild(part);
        
        // SUBTOTAL
        subtotal = cart.items[id] * p.price;
        total += subtotal;
      }

      // EMPTY BUTTONS
      item = document.createElement("input");
      item.type = "button";
      item.value = "Esvaziar";
      item.addEventListener("click", cart.nuke);
      item.classList.add("c-empty");
      cart.hItems.appendChild(item);

      // CHECKOUT BUTTONS
      item = document.createElement("input");
      item.type = "button";
      item.value = "Total - " + "R$ " + total.toFixed(2);
      item.addEventListener("click", cart.checkout);
      item.classList.add("c-checkout");
      cart.hItems.appendChild(item);
    }
  },

  // (E) ADD ITEM INTO CART
  add : function () {
    if (cart.items[this.dataset.id] == undefined) {
      cart.items[this.dataset.id] = 1;
    } else {
      cart.items[this.dataset.id]++;
    }
    cart.save();
    cart.list();
  },

  subtract : function () {
    if (cart.items[this.dataset.id] == undefined || cart.items[this.dataset.id] <= 1) {
      cart.items[this.dataset.id] = 1;
    } else {
      cart.items[this.dataset.id]--;
    }
    cart.save();
    cart.list();
  },

  // (F) CHANGE QUANTITY
  change : function () {
    if (this.value == 0) {
      delete cart.items[this.dataset.id];
    } else {
      cart.items[this.dataset.id] = this.value;
    }
    cart.save();
    cart.list();
  },
  
  // (G) REMOVE ITEM FROM CART
  remove : function () {
    delete cart.items[this.dataset.id];
    cart.save();
    cart.list();
  },
  
  // (H) CHECKOUT
  checkout : function () {
    // SEND DATA TO SERVER
    // CHECKS
    // SEND AN EMAIL
    // RECORD TO DATABASE
    // PAYMENT
    // WHATEVER IS REQUIRED
    alert("TO DO");

    /*
    var data = new FormData();
    data.append('cart', JSON.stringify(cart.items));
    data.append('products', JSON.stringify(cart.products));
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "SERVER-SCRIPT");
    xhr.onload = function(){ ... };
    xhr.send(data);
    */
  }
};
window.addEventListener("DOMContentLoaded", cart.init);