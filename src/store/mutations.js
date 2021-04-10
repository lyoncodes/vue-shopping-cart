export default {
  setProducts (state, payload) {
    state.products = payload
  },
  decrementItemQuantity (state, product) {
    product.inventory--
  }
}