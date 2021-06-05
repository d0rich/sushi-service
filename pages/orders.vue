<template>
  <div>
    <v-row no-gutters>
      <h1 v-if="$store.getters['auth/isOperator']">Заказы</h1>
      <h1 v-else >Мои заказы</h1>
      <v-spacer />
      <!-- <v-btn color="primary" @click="$fetch(); orderIndNow = null">
        <v-icon>mdi-reload</v-icon> Обновить
      </v-btn> -->
    </v-row>

    <v-divider class="my-3" />
    <v-progress-linear
      v-if="$fetchState.pending"
      active indeterminate
    ></v-progress-linear>
    <v-pagination v-if="pages > 1" class="mt-3"
                  :disabled="$fetchState.pending"
                  v-model="page" :length="pages" />
    <v-expansion-panels popout v-model="orderIndNow">
      <v-expansion-panel v-for="order in orders" :key="order.id" @change="updateOrder(order)">
        <v-expansion-panel-header class="pa-1 pa-sm-3">
          <span class="pa-1">
            {{new Date(order.createdAt).toLocaleString()}}
          </span>
          <span class="pa-1">{{order.clientName}}</span>
          <span>
            <v-sheet class="pa-2" dark :color="status(order.status).color" rounded>
              {{status(order.status).status}}
            </v-sheet>
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-progress-linear
            v-if="order.load"
            active indeterminate
          ></v-progress-linear>
          <div class="order__info">
            <span>Имя клиента:</span><span> {{order.clientName}}</span>
            <span>Номер клиента:</span><span> {{order.clientPhone}}</span>
            <span>Адрес доставки:</span><span> {{order.address}}</span>
            <span>Создано:</span><span> {{new Date(order.createdAt).toLocaleString()}}</span>
            <span>Обновлено:</span><span> {{new Date(order.updatedAt).toLocaleString()}}</span>
          </div>
          <v-divider class="my-3" />
          <v-list>
            <v-list-item v-for="(item, index) in order.items" :key="item.id">
              <v-list-item-content>
                <v-list-item-title>
                  <span>{{index + 1}}. {{item.name}}</span>
                  <span v-if="!item.show">[Нет в наличии]</span>
                </v-list-item-title>
                <v-list-item-subtitle
                  v-text="`Кол-во: ${item.count} шт. | Цена: ${item.cost} ₽`" />
                <v-list-item-subtitle
                  v-text="`Стоимость: ${item.cost*item.count} ₽`" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider class="my-3" />
          <h3>Общая стоимость: {{orderCost(order)}} ₽</h3>
          <div class="order__edit mt-3" v-if="$store.getters['auth/isOperator']">
            <v-select :items="$store.state.orders.statuses"
                      filled rounded dense dark
                      v-model="order.tStatus"
                      :background-color="$store.state.orders.statuses.find(s => s.code === order.tStatus).color"
                      item-value="code" item-text="status" />
            <v-btn color="primary" @click="setStatus(order)">
              Сохранить
            </v-btn>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-pagination v-if="pages > 1" class="mt-3"
                  :disabled="$fetchState.pending"
                  v-model="page" :length="pages" />
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  name: "orders",
  head(){
    return{
      title: 'Заказы'
    }
  },
  data(){
    return{
      pages: 1,
      page: 1,
      onPage: 12,
      orders: [],
      orderIndNow: null
    }
  },
  computed:{
    ...mapGetters({
      isAuth: "auth/isAuth"
    })
  },
  methods:{
    ...mapActions({
      catchServerError: "getServerErrorMessage"
    }),
    status(statusCode){
      return this.$store.state.orders.statuses.find(status => status.code === statusCode)
    },
    orderCost(order){
      return order?.items?.reduce(((summ, item) => {
        return summ + item.count * item.cost
      }), 0)
    },
    async updateOrder(order){
      if (!order.items){
        order.load = true
        try{
          const res = await this.$axios.get(`/api/orders/get/by/id/${order.id}`)
          order.items = res.data.itemId_Items.map(item => {
            return {
              id: item.id,
              name: item.name,
              show: item.show,
              cost: item.ItemsInOrders.cost,
              count: item.ItemsInOrders.count
            }
          })
        }
        catch (e){
          this.catchServerError(e)
        }
        order.load = false
      }
    },
    async setStatus(order){
      order.load = true
      try{
        const res = await this.$axios.post(`/api/orders/edit/status`, {id: order.id, status: order.tStatus})
        if (res.data[0] === 1)
          order.status = order.tStatus
      }
      catch (e){
        this.catchServerError(e)
      }
      order.load = false
    }
  },
  watch: {
    page(){
      this.$fetch()
    },
    '$store.state.orders.events'(){
      this.$fetch()
    },
    'isAuth'(){
      this.$fetch()
    }
  },
  async fetch(){
    this.$store.commit("orders/removeEvents")
    if (this.isAuth){
      try {
        const res = await this.$axios.get(`/api/orders/get/all/${this.$store.state.auth.id}`+
          `?onPage=${this.onPage}`+
          `&page=${this.page}`)
        this.pages = res.data.pages
        this.orders = res.data.orders.map(order => {
          return { ...order, load: false, tStatus: order.status }
        })
        if (!isNaN(this.orderIndNow)) {
          await this.updateOrder(this.orders[this.orderIndNow])
        }
      }
      catch (e){
        this.catchServerError(e)
      }
    }
    else {
      this.pages = 1
      this.orders = []
    }
  }
}
</script>

<style scoped>
.order__info{
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 2fr 1fr 1fr;
  max-width: 300px;
}

.order__edit{
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  align-items: start;
}
</style>
