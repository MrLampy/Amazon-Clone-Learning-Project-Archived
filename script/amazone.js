import {cart, addToCart} from './cart.js';
import {products} from '../data/products.js';
import { formatCurrency } from '../utils/money.js';

let html = ''
products.forEach((product)=>{
    html += `<div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars*10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${formatCurrency(product.priceCents)}
          </div>
          
          
          <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id = "${product.id}">
            Add to Cart
          </button>
        </div>`
})
//console.log(html)
let TO_map = {}
document.querySelector(".js-product-grid").innerHTML = html 
document.querySelectorAll(".js-add-to-cart").forEach((button) =>{
    button.addEventListener("click", () => {
        const productId = button.dataset.productId;
        let add = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
        addToCart(add, productId)
        if(TO_map[productId]){
          clearTimeout(TO_map[productId]);
        }
        updateCartQuantity();
        console.log(cart)
        document.querySelector(`.added-to-cart-${productId}`).style.opacity = 1
        TO_map[productId] = setTimeout(()=>document.querySelector(`.added-to-cart-${productId}`).style.opacity = 0, 2000)
    })
})

export function total_quantity(listA) {
    let count = 0
    
    listA.forEach((item) => {
        count += item.quantity;
    })
    return count;
}

export function updateCartQuantity(){
        const total = total_quantity(cart);
        document.querySelector(".cart-quantity").innerText = `${total}`
}

updateCartQuantity();