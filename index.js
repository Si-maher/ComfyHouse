// variables

const cartBtn = document.querySelector(".cart-btn ");
const closeCartBtn = document.querySelector(".close-cart ");
const clearCartBtn = document.querySelector(".clear-cart ");
const cartDOM = document.querySelector(".cart ");
const cartOverLay = document.querySelector(".cart-overlay ");
const cartItems = document.querySelector(".cart-items ");
const cartTotal = document.querySelector(".cart-total ");
const cartContent = document.querySelector(".cart-content ");
const productsDOM = document.querySelector(".products-center ");

// cart

let cart = [];
let buttonsDOM = []

// Getting the products

class Products {
  async getProducts() {
    try {
      let result = await fetch("./products.json");
      let data = await result.json();
      let products = data.items;
      products = products.map(item => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// displaying the products

class UI {
    displayProducts(products) {
        let result = ''
        products.forEach(product => {
            result += `
            <article class="product">
            <div class="img-container">
            <img src=${product.image} alt="product" class="product-img">
            <button class="bag-btn" data-id=${product.id}>
            <i class="fas fa-shopping-cart"></i>add to bag
            </button>
            </div>
            <h3>${product.title}</h3>
            <h4>€${product.price}16</h4>
            </article>
            ` })
        
        productsDOM.innerHTML = result
    }
    
    
    getBagButtons() {
      const buttons = [...document.querySelectorAll(".bag-btn")]
      buttonsDOM = buttons
      
      buttons.forEach(button => {
        let id = button.dataset.id 
        let inCart = cart.find(item => item.id === id)
        if(inCart){
          button.innerText ="In Cart"
          button.disabled = true
        }
          button.addEventListener("click", event => {
            event.target.innerText ="In Cart"
            event.target.disabled = true

            // get single product from product

            let cartItem = {...Storage.getProduct(id), amount:1}

            // add single product to the cart

            cart = [...cart,cartItem]

            // save the cart to the local storage 

            Storage.saveCart(cart)
            
            // set the cart values 

            this.setCartValues(cart)

            // display the cart item(S)
            this.addCartItem(cartItem)
            // show the cart  

          })
        })
    }
            
            
            
        setCartValues(cart) {
          let startValue = 0
          let itemsTotal = 0
          cart.map(item => {
            startValue += item.price * item.amount
            itemsTotal += item.amount
          })
          cartTotal.innerText = parseFloat(startValue.toFixed(2))
          cartItems.innerText = itemsTotal
        }
          addCartItem(item){
            const div = document.createElement('div')
            div.classList.add('cart-item')
            div.innerHTML = `
            <img src="./images/product-1.jpeg" alt="product" />
            <div>
              <h4>queen bed</h4>
              <h5>€999</h5>
              <span class="remove-item">remove</span>
            </div>
            <div>
              <i class="fas fa-chevron-up"></i>
              <p class="item-amount"></p>
              <i class="fas fa-chevron-down"></i>
            </div>
            
            `
          }
          

    }
  // local storage

class Storage {
    static saveProducts(products) {
     localStorage.setItem("products", JSON.stringify(products))
    }
    static getProduct(id){
      let products = JSON.parse(localStorage.getItem('products'))
      return products.find(product => product.id === id)
    }

    static saveCart(cart){
      localStorage.setItem('cart',JSON.stringify(cart) )
    }
     
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  // get all products

  products.getProducts().then(products =>{
      ui.displayProducts(products)
      Storage.saveProducts(products)
    }).then(() => {
      ui.getBagButtons()
    })

    });
