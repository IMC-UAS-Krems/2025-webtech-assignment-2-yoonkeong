let cart = [];
let text = "";

//Reference: W3Schools - How To Toggle Elements
function cartButton() { 
    var x = document.getElementById("cart-section").style.display = "block";
}

// Getting DOM info inspired by W3Schools DOM Traversing examples
function myFunction(button) {

    alert("Add Cart")

    console.log("click!");
    const productBox = button.parentNode;
    const productItem = productBox.parentNode;

    const image = productItem.querySelector("img").src; 
    const name = productBox.querySelector("h5").innerText; 
    const price = productBox.querySelector("p").innerText; 

    const item = {
            image: image,
            name: name,
            price: price,
            quantity: 1
    };

    const exists = cart.some(product => product.name === name); 

    if (!exists) {
        cart.push(item);
    }

    updateCart();

}

function deleteItem(i) {
    cart.splice(i,1); 
    updateCart();
}

function updateCart(){

        let list = document.getElementById("cart-container");
        list.innerHTML = "";

        for(let i = 0; i < cart.length; i++) {
            let item = cart[i];

            let itemBox = document.createElement("li");
            
            let img = document.createElement("img");
            let p_name = document.createElement("p");
            let p_price = document.createElement("p");

            let delete_button = document.createElement("button");
            //delete
            delete_button.innerText = "Delete";
            delete_button.onclick = function() {
                deleteItem(i);
            };

            //+ - quantity button, reference: GeeksforGeeks - Increment/Decrement Counter Example
            let plus_button = document.createElement("button");
            let quantity = document.createElement("p");
            let minus_button = document.createElement("button");

            plus_button.innerText = "+";

            plus_button.onclick = function() {
                cart[i].quantity++;
                updateCart();
            }

            quantity.innerText = item.quantity;

            minus_button.innerText = "-"; 
            minus_button.onclick = function() {
                if (cart[i].quantity > 1) {
                    cart[i].quantity --;
                }
                updateCart();
            }

            img.src = item.image;
            p_name.innerText = item.name;
            p_price.innerText = item.price;
 
            itemBox.appendChild(img);
            itemBox.appendChild(p_name);
            itemBox.appendChild(p_price);
            itemBox.appendChild(delete_button);
            itemBox.appendChild(plus_button);
            itemBox.appendChild(quantity);
            itemBox.appendChild(minus_button);
            list.appendChild(itemBox);
        }

 }

function increment(data) {
    data = data + 1;
    updateCart();
}

function decrement(data) {
    data = data - 1;
    updateCart();
}


function checkout() {

    if (cart.length == 0) {
        alert("Your cart is empty!")
        return;
    }

    var x = document.getElementById("checkout-section");
    if(x.style.display == "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

function goback() {
    let checkout = document.getElementById("checkout-section");
    let cart = document.getElementById("cart-section");
    let confirm = document.getElementById("confirm-section");

    // Summary -> checkout
    if (confirm.style.display !== "none" && confirm.style.display !== "") {
        confirm.style.display = "none";
        checkout.style.display = "block";
        return;
    }

    // Checkout -> cart
    if (checkout.style.display !== "none" && checkout.style.display !== "") {
        checkout.style.display = "none";
        cart.style.display = "block";
        return;
    }

    // Cart → home
    if (cart.style.display !== "none" && cart.style.display !== "") {
        cart.style.display = "none";
    }
}



function checkoutConfirm() {

    let firstName = document.getElementById("firstName").value.trim();
    let lastName  = document.getElementById("lastName").value.trim();
    let phone     = document.getElementById("phone").value.trim();
    let email     = document.getElementById("email").value.trim();
    let zip       = document.getElementById("zip").value.trim();
    let address   = document.getElementById("address").value.trim();

    
    if (firstName === "" || lastName === "" || phone === "" ||
        email === "" || zip === "" || address === "") {
        alert("All fields are required");
        return;
    }

    
    if (isNaN(phone)) {
        alert("Phone number must contain only digits");
        return;
    }

    //Reference: W3Schools - JavaScript Form Validation Regex 
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email.");
        return;
    }

    if (zip.length < 4) {
        alert("Zip code must be at least 4 characters.");
        return;
    }

    let subtotal = 0;
    for (let i = 0; i < cart.length; i++) {
        let priceNum = parseFloat(cart[i].price.replace("€", ""));
        subtotal += priceNum * cart[i].quantity;
    }

    //Reference: MDN Web Docs -Array.reduce()
    let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    let discount = 0;
    if (totalQuantity >= 3) {
        discount = subtotal * 0.10; 
    }

    let subtotalAfterDiscount = subtotal - discount;
    let tax = subtotalAfterDiscount * 0.10;
    let total = subtotalAfterDiscount + tax;

    
    let summaryBox = document.getElementById("summary-box");

    /*Reference: W3Schools - javaScript template literals, javaScript arrays (forEach used to generate item list),
      MDN Web Docs - Template strings (variable interpolation & formatting) */
    //Combined and adapted for the checkout summary layout
    let itemsHTML = "";
    cart.forEach(item => {
        itemsHTML += `
            <p>${item.name} × ${item.quantity} — €${(parseFloat(item.price.replace("€","")) * item.quantity).toFixed(2)}</p>
        `;
    });

    summaryBox.innerHTML = `
    <div class="summary-card">

        <div class="summary-block">
            <h5 class="section-title">Customer Info</h5>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Address:</strong> ${address}, ${zip}</p>
        </div>

        <div class="summary-block">
            <h5 class="section-title">Items</h5>
            ${itemsHTML}
        </div>

        <div class="summary-block totals-box">
            <p><strong>Subtotal:</strong> €${subtotal.toFixed(2)}</p>
            <p class="discount-line"><strong>Discount (10%):</strong> -€${discount.toFixed(2)}</p>
            <p><strong>Tax (10%):</strong> €${tax.toFixed(2)}</p>
            <p class="final-total"><strong>Total: €${total.toFixed(2)}</strong></p>
        </div>

    </div>`;

    document.getElementById("checkout-section").style.display = "none";
    document.getElementById("confirm-section").style.display = "block";
}

function finalConfirm() {
    alert("Thank you! Your order has been placed");

    cart = [];
    updateCart();

    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("zip").value = "";
    document.getElementById("address").value = "";

    document.getElementById("confirm-section").style.display = "none";
}


