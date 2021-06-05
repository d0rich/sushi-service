<template>
  <v-dialog v-model="show" width="90%" max-width="500px" persistent>
    <v-form :disabled="load" ref="form" v-model="valid" @submit.prevent="createOrder">
      <v-card>
        <v-toolbar dark color="primary">
          Подтверждение заказа
          <v-spacer />
          <v-btn icon @click="$emit('close')" >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <p class="error--text">{{errorMsg}}</p>
          <v-text-field label="Имя для связи" v-model="formData.clientName" :rules="rules" />
          <v-text-field type="ph" label="Телефон для связи" v-model="formData.clientPhone" :rules="rules" />
          <v-text-field label="Адрес доставки" v-model="formData.address" :rules="rules" />
          <h3>Заказ на сумму: {{allCost}} ₽</h3>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :loading="load" @click="$emit('close')" color="red" dark>Закрыть</v-btn>
          <v-btn :loading="load" type="submit" color="primary">Отправить</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "CreateOrderModal",
  props: {
    items: Array,
    show: Boolean
  },
  watch:{
    '$store.state.auth.login'(){
      this.onCreate()
    },
    items(){
      this.formData.items = this.items
        .filter(item => item.item.show)
        .map(item => {
          return {
            itemId: item.item.id,
            count: item.count,
            cost: item.item.cost
          }
        })
    }
  },
  data(){
    return {
      valid: true,
      formData: {
        clientId: 0,
        clientPhone: '',
        clientName: '',
        address: '',
        items: []
      },
      rules: [
        v => !!v || 'Обязательное поле'
      ],
      errorMsg: '',
      load: false
    }
  },
  computed: {
    itemsCount(){
      return this.items
        .filter(item => item.item.show)
        .reduce((allCount, item) => {
          return allCount + item.count
        }, 0)
    },
    allCost(){
      return this.items
        .filter(item => item.item.show)
        .reduce((allCount, item) => {
          return allCount + item.count * item.item.cost
        }, 0)
    }
  },
  methods:{
    ...mapActions({
      catchError: 'getServerErrorMessage'
    }),
    async createOrder() {
      if (this.allCost === 0) {
        this.errorMsg='Сумма заказа должна быть больше 0 руб.'
        return
      }
      this.$refs.form.validate()
      if (this.valid) {
        this.load = true
        try {
          await this.$axios.post('/api/orders/create', this.formData)
          this.errorMsg = ''
          this.$emit('close')
          this.$emit('edited')
        } catch (e) {
          this.errorMsg = await this.catchError(e)
        }
        this.load = false
      }
    },
    onCreate(){
      if (this.$store.getters["auth/isAuth"])
      {
        this.formData.clientId = this.$store.state.auth.id
        this.formData.clientName = `${this.$store.state.auth.firstName} ${this.$store.state.auth.secondName}`
        this.formData.clientPhone = this.$store.state.auth.phone
        this.formData.address = this.$store.state.auth.address
      }
      else{
        this.formData.clientId = undefined
        this.formData.clientName = ''
        this.formData.clientPhone = ''
        this.formData.address = ''
      }
    }
  },
  created() {
    this.onCreate()
  }
}
</script>

<style scoped>

</style>
