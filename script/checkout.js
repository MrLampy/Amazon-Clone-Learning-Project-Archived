import { cart, getCartObjectById, saveToStorage, del_item_cart, updateDeliveryOption } from './cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {deliveryOptions} from '../data/deliveryOptions.js'

const today = dayjs();
const delivery1 = today.add(1,'day');
const delivery2 = today.add(3,  'day');
const delivery3 = today.add(7,  'day');

function render(){
    let html = "";
    cart.forEach((cartItem) => {
        const productId = cartItem.id;
        let matchingProduct;
        products.forEach((product) => {
            if (product.id === productId) {
                matchingProduct = product;
            }
        });

        const deliveryOptionId = cartItem.deliveryOptionId;

        let deliveryOption;

        deliveryOptions.forEach((option)=>{
            if(option.id === deliveryOptionId) deliveryOption = option;
        })
        
        const dateString = today.add(deliveryOption.deliveryDays,'days').format('dddd, MMMM D');

        if (matchingProduct) {
            html += `
                <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
                    <div class="delivery-date">
                        Delivery date: ${dateString}
                    </div>

                    <div class="cart-item-details-grid">
                        <img class="product-image" src="${matchingProduct.image}">
                        <div class="cart-item-details">
                            <div class="product-name">
                                ${matchingProduct.name}
                            </div>
                            <div class="product-price">
                                $${formatCurrency(matchingProduct.priceCents)}
                            </div>
                            <div class="product-quantity">
                                <span>
                                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                                </span>
                                <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}">Update</span>
                                <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">Delete</span>
                            </div>
                        </div>

                        <div class="delivery-options">
                            <div class="delivery-options-title">
                                Choose a delivery option:   
                            </div>
                        ${deliveryOptionsHTML(matchingProduct, cartItem)}
                        </div>
                    </div>
                </div>`;
            }
    });

    document.querySelector(".order-summary").innerHTML = html;
    updateCartDeliveryOptionText();
    delivery_date();
    update_header();
    update_cart();
    delete_item();
}

function update_header(){
    let count = 0;
    cart.forEach((item) => {
        count += item.quantity;
    })
    if(count>1) document.querySelector(".return-to-home-link").innerText = `${count} items`
    else if(count === 1) document.querySelector(".return-to-home-link").innerText = `1 item`
    else document.querySelector(".return-to-home-link").innerText = `0 item`
}

function delete_item(){
    let target;
    document.querySelectorAll(".js-delete-link").forEach((link)=>{
        link.addEventListener("click", ()=>{
            const productId = link.dataset.productId;
            target = getCartObjectById(productId);
            del_item_cart(target);
            saveToStorage();
            render();
        })
    })
}

function blockInvalid(e){
    const press = e.key;
    const whole = e.target;
    if(whole.value.length === 0 && (press === '-' || press === '0')) return false;
    if (!/[0-9]/.test(press)) return false;
    return true;
}

function update_cart(){
    let target;
    document.querySelectorAll(".update-quantity-link").forEach((link)=>{
        link.addEventListener('click',()=>{
        const productId = link.dataset.productId;
        const parent = link.parentElement;
        target = getCartObjectById(productId);
        parent.innerHTML = `
            <span>
                Quantity: <span class="quantity-label">${target.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary" data-product-id="${target.id}" style="display: none;">Update</span>
            <input class="input01-${target.id} input01" type="number" min="1" max="99" onpaste="return false">
            <span class="js-save-${target.id} link-primary"> save</span>
            <span class="js-cancel link-primary">cancel</span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${target.id}" style="display: none;">Delete</span>
        `;
        document.querySelectorAll(".input01").forEach((input)=>{
            input.addEventListener("keypress", (e)=>{
                if (!blockInvalid(e)) {
                    e.preventDefault();
                }
            });
            input.addEventListener("paste", (e)=>{
                e.preventDefault();
            });
        });
        document.querySelectorAll(`.js-save-${target.id}`).forEach((button)=>{
            button.addEventListener('click', ()=>{
                accept_update(target.id);
            })
        })
        document.querySelectorAll(".js-cancel").forEach((button)=>{
            button.addEventListener('click', ()=>{
                render();
            })
        })
        delete_item();
       })
    })
}

function accept_update(id){
    let match;
    const value = document.querySelector(`.input01-${id}`).value
    cart.forEach((item) =>{
        if(item.id === id){
            match = item;
        }
    })
    if(value !== ''){
        match.quantity = Number(value);
    } ;
    render();
    saveToStorage();
}

function delivery_date(){
    const text_delivery1 = delivery1.format('dddd, MMMM D');
    const text_delivery2 = delivery2.format('dddd, MMMM D');
    const text_delivery3 = delivery3.format('dddd, MMMM D');
    document.querySelectorAll(".js-delivery-1").forEach((text)=>{
        text.innerText = `${text_delivery3}`
    })
    document.querySelectorAll(".js-delivery-2").forEach((text)=>{
        text.innerText = `${text_delivery2}`
    })
    document.querySelectorAll(".js-delivery-3").forEach((text)=>{
        text.innerText = `${text_delivery1}`
    })
}

//watchout for the parameter that pass in I think it cause your bug
function deliveryOptionsHTML(matchingProduct, cartItem){
    let html = '';
    let i = 1;
    deliveryOptions.forEach((deliveryOption)=>{
        const deliveryDate = today.add(deliveryOption.deliveryDays,'days');
        const dateString = deliveryDate.format('dddd, MMMM D')
        const priceString = deliveryOption.priceCents === 0 ? 'Free' : `$${formatCurrency(deliveryOption.priceCents)} -`
        const isChecked = deliveryOption.id === cartItem.deliveryOptionId ? 'checked':''
        html += `
        <div class="delivery-option js-delivery-option">
            <input type="radio" ${isChecked} class="delivery-option-input" name="delivery-option-${matchingProduct.id}" data-delivery-option-id='${deliveryOption.id}' data-product-id="${matchingProduct.id}">
            <div>
                <div class="delivery-option-date js-delivery-${i}">${dateString}</div>
                <div class="delivery-option-price">${priceString} Shipping</div>
            </div>
        </div>`
        i++;
    })
    return html;
}

function updateCartDeliveryOptionText(){
    document.querySelectorAll('.js-delivery-option').forEach((link)=>{
        link.addEventListener('click', ()=>{
            const {deliveryOptionId, productId} = link.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
        })
    })
}

render();