import Vuex from 'vuex'
import Vue from 'vue'
import shop from '@/api/shop'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products: [],
    cart: [],
    checkoutStatus: null
  },
  // getters are like computed properties for the entire application
  getters: {
    availableProducts (state, getters) {
      return state.products.filter(product => product.inventory > 0)
    },
    cartProducts (state) {
      // transform the id and quantity in the cart to the object from the products array, and return that object literal
      return state.cart.map(cartItem => {
        const product = state.products.find(product => product.id === cartItem.id)
        return {
          title: product.title,
          price: product.price,
          quantity: cartItem.quantity
        }
      })
    },
    cartTotal (state, getters) {
      return getters.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0)
    }
  },
  actions: {
    fetchProducts ({commit}) {
      return new Promise((resolve, reject) => {
        shop.getProducts(products => {
          commit('setProducts', products)
          resolve()
        })
      })
    },
    addProductToCart (context, product) {
      if (product.inventory > 0) { // check that product exists
        const cartItem = context.state.cart.find(item => item.id === product.id) // find it in the cart
        if (!cartItem) { // if its not there:
          context.commit('pushProductToCart', product.id) //add it to the cart
        } else { // it is in the cart already
          context.commit('incrementItemQuantity', cartItem) // so add another to the cart's item count
        }
        context.commit('decrementItemQuantity', product) // pull the item added to cart from the inventory
      }
    },
    checkout ({state, commit}) {
      shop.buyProducts(
        state.cart,
        () => {
          commit('emptyCart')
          commit('setCheckoutStatus', 'success')
        },
        () => {
          commit('setCheckoutStatus', 'fail')
        }
      )
    }
  },
  mutations: {
    setProducts (state, payload) {
      state.products = payload
    },
    pushProductToCart (state, productId) {
      state.cart.push({
        id: productId,
        quantity: 1
      })
    },
    incrementItemQuantity (state, cartItem) {
      cartItem.quantity++
    },
    decrementItemQuantity (state, product) {
      product.inventory--
    },
    setCheckoutStatus (state, status) {
      state.checkoutStatus = status
    },
    emptyCart (state) {
      state.cart = []
    }
  }
})