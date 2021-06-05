<template>
  <div>
    <h1 class="mb-5">Моя корзина</h1>
    <create-order-modal :show="showSendForm" :items="items" @close="showSendForm = false" />
    <v-progress-linear
      v-if="$fetchState.pending"
      active indeterminate
    ></v-progress-linear>
    <transition-group class="items" name="scale-transition">
      <v-sheet rounded class="mb-3" v-for="(item, index) in items" :key="item.item.id"
               :style="{opacity: item.item.show ? 1 : 0.5 }">
        <div class="item__info">
          <v-img class="rounded" max-width="100%" max-height="100%" :src="item.item.imgUrl" />
          <v-spacer />
          <div>
            <h2>{{index+1}}. {{item.item.name}} <span v-if="!item.item.show">[Нет в наличии]</span></h2>
            <p>{{item.item.description}}</p>
            <p>{{item.item.weight}} грамм | {{item.item.cost}} ₽</p>
          </div>
        </div>
        <v-divider />
        <div class="item__counter">
          <v-spacer />
          <v-btn :disabled="$fetchState.pending || load" icon
                 @click="removeFromOrder(item)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <span>{{item.count * item.item.cost}} ₽</span>
          <span>{{item.count}} шт.</span>
          <v-btn :disabled="$fetchState.pending || load || !item.item.show" icon
                 @click="removeItem(item)">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          <v-btn :disabled="$fetchState.pending || load || !item.item.show" icon
                 @click="addItem(item)">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-sheet>
    </transition-group>

    <v-divider class="my-5" />
    <v-sheet rounded class="pa-3">
      <v-row no-gutters align="center">
        <h2>Итого:</h2>
        <v-spacer />
        <span class="mx-3">Всего: {{itemsCount}} шт.</span>
        <span class="mx-3">Сумма: {{allCost}} ₽</span>
      </v-row>
      <v-divider class="my-3" />
      <v-row no-gutters justify="end">
        <v-btn class="my-1" color="red" @click="items = []; setStoreItems()">
          Очистить корзину
        </v-btn>
        <v-btn class="ml-1 ml-sm-3 my-1" color="primary" @click="showSendForm = true">
          Оформить заказ
        </v-btn>
      </v-row>
    </v-sheet>

  </div>
</template>

<script>
import CreateOrderModal from "@/components/orders/CreateOrderModal";
export default {
name: "cart",
  components: {
  CreateOrderModal
  },
  data(){
    return {
      items: [],
      load: false,
      showSendForm: false
    }
  },
  computed: {
    itemsCount(){
      return this.items.reduce((allCount, item) => {
        return allCount + item.count
      }, 0)
    },
    allCost(){
      return this.items.reduce((allCount, item) => {
        return allCount + item.count * item.item.cost
      }, 0)
    }
  },
  watch: {
    '$store.state.cart.actualInfo'(){
      this.$fetch()
    }
  },
  methods: {
    addItem(item) {
      if (this.itemsCount < 250){
        item.count += 1
      }
    },
    removeItem(item) {
      if (item.count > 0){
        item.count -= 1
      }
    },
    setStoreItems(){
      this.$store.commit('cart/setItems', this.items.map(item => {
        return {
          id: item.item.id,
          count: item.count
        }
      }))
    },
    removeFromOrder(item) {
      this.items = this.items.filter(i => {
        return i !== item
      })
      this.setStoreItems()
    }
  },
  beforeDestroy() {
    if (!this.$fetchState.pending)
      this.setStoreItems()
  },
  async fetch(){
    const promises = []
    this.$store.state.cart.items.forEach(item => {
      promises.push( (async () => {
        const res = await this.$axios.get(`/api/items/get/by/id/${item.id}`)
        this.items.push({item: res.data, count: item.count})
      } )())
    })
    await Promise.all(promises)
    this.$store.commit("cart/clearEvents")
  }
}
</script>

<style scoped>
.items{

}
.item__info{
  display: grid;
  grid-template-columns: 2fr 1fr 10fr;
}
.item__counter{
  display: grid;
  grid-template-columns: 32fr 2fr 6fr 3fr 2fr 2fr;
  grid-gap: 1em;
  align-items: center;
}
@media screen and (max-width: 800px){
  .item__info{
    grid-template-columns: 4fr 1fr 8fr;
  }
  .item__counter{
    grid-template-columns: 31fr 2fr 5fr 5fr 2fr 2fr;
  }
}
@media screen and (max-width: 500px){
  .item__info{
    grid-template-columns: 8fr 1fr 16fr;
  }
  .item__counter{
    grid-template-columns: 21fr 2fr 10fr 10fr 2fr 2fr;
  }
}
</style>
