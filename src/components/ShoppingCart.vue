<template>
<div>
  <h1> Shopping Cart </h1>
  <ul>
    <li v-for="product in products">
      {{product.title}} - {{product.price}} - {{product.quantity}}
    </li>
  </ul>
  <p>Total: {{total}}</p>
  <p v-if="checkoutStatus">{{checkoutStatus}}</p>
  <button @click="checkout">Checkout</button>
</div>
</template>
<script>
import {mapState, mapGetters, mapActions} from 'vuex'
export default {
  computed: {
    ...mapGetters('cart', {
      products: 'cartProducts',
      total: 'cartTotal'
    }),

    ...mapState('cart', {
      checkoutStatus: state => state.checkoutStatus
    })

  },
  methods: {
    ...mapActions('cart', ['checkout'])
  }
}
</script>
<style scoped>

</style>