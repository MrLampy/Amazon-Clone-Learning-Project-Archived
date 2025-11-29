export let cart = JSON.parse(localStorage.getItem('cart'));
if(!cart){
    cart = [];
}

export function addToCart(add,productId){
    let match;
    cart.forEach((item)=>{
        if(item.id === productId){
            match = item;
        }
    })
    if(match){
        match.quantity += add;
    }
    else{
        cart.push({
            id: productId,
            quantity: add,
            deliveryOptionId: '1'
        });
    }
    saveToStorage();
}

export function getCartObjectById(id){
    let ans;
    cart.forEach((product)=>{
        if(id === product.id){
            ans = product;
        }
    })
    if(ans !== null) return ans;
    else console.log("Ohhhhhh_shit");
}

export function saveToStorage(){
    localStorage.clear();
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function del_item_cart(target){
    if(target.quantity > 0){
        target.quantity--;
        cart = cart.filter((item)=>{
            if(item.quantity < 1) return 0
            else return 1
        })
    }
}

export function updateDeliveryOption(productId, deliveryOptionId){
    let match;
    console.log(productId)
    cart.forEach((item)=>{
        if(item.id === productId){
            match  = deliveryOptionId
        }
        item.deliveryOptionId = match;
    })
    saveToStorage();
} 