import shop from '@/api/shop'
export default {
  namespaced: true,
  state: {
    items: [],
    checkoutStatus: null
  },
  getters: {
    cartProducts (state, getters, rootState, rootGetters) {
      // transform the id and quantity in the cart to the object from the products array, and return that object literal
      return state.items.map(cartItem => {
        const product = rootState.products.items.find(product => product.id === cartItem.id)
        return {
          title: product.title,
          price: product.price,
          quantity: cartItem.quantity
        }
      })
    },
    cartTotal (state, getters) {
      return getters.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0)
    },
  },
  mutations: {
    pushProductToCart (state, productId) {
      state.items.push({
        id: productId,
        quantity: 1
      })
    },
    incrementItemQuantity (state, cartItem) {
      cartItem.quantity++
    },
    setCheckoutStatus (state, status) {
      state.checkoutStatus = status
    },
    emptyCart (state) {
      state.items = []
    }
  },
  actions: {
    addProductToCart ({state, getters, commit, rootState, rootGetters}, product) {
      if (rootGetters['products/productIsInStock'](product)) { // check that product exists
        const cartItem = state.items.find(item => item.id === product.id) // find it in the cart
        if (!cartItem) { // if its not there:
          commit('pushProductToCart', product.id) //add it to the cart
        } else { // it is in the cart already
          commit('incrementItemQuantity', cartItem) // so add another to the cart's item count
        }
        commit('products/decrementItemQuantity', product, {root: true}) // pull the item added to cart from the inventory
      }
    },
    checkout ({state, commit}) {
      shop.buyProducts(
        state.items,
        () => {
          commit('emptyCart')
          commit('setCheckoutStatus', 'success')
        },
        () => {
          commit('setCheckoutStatus', 'fail')
        }
      )
    }
  }
}