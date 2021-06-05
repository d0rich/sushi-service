<template>
  <div>
    <h1>Карточка покупателя</h1>
    <v-divider class="my-3" />
    <p class="error--text">{{errorMsg}}</p>
    <p class="success--text">{{successMsg}}</p>
    <v-form v-if="$store.getters['auth/isAuth']"
            :disabled="load" ref="form"
            v-model="valid" @submit.prevent="editProfile">
      <v-text-field label="Имя" v-model="formData.firstName" :rules="rules" />
      <v-text-field label="Фамилия" v-model="formData.secondName" :rules="rules" />
      <v-text-field type="ph" label="Телефон" v-model="formData.phone" />
      <v-text-field label="Адрес по умолчанию" v-model="formData.address" />
      <v-row no-gutters>
        <v-spacer />
        <v-btn :loading="load" type="submit" color="primary">
          Сохранить
        </v-btn>
      </v-row>
    </v-form>
    <h1 v-else>Необходимо авторизоваться</h1>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
name: "personal",
  head(){
    return{
      title: 'Карточка покупателя'
    }
  },
  data(){
    return{
      valid: true,
      errorMsg: '',
      successMsg: '',
      formData:{
        firstName: '',
        secondName: '',
        phone: '',
        address: ''
      },
      load: false,
      rules: [
        v => !!v || 'Обязательное поле'
      ],
    }
  },
  computed:{
    ...mapGetters({
      isAuth: "auth/isAuth"
    })
  },
  watch: {
    async 'isAuth'(){
      await this.$fetch()
    }
  },
  methods:{
    ...mapActions({
      catchError: 'getServerErrorMessage'
    }),
    async editProfile(){
      this.$refs.form.validate()
      if (this.valid) {
        this.load = true
        try {
          const res = await this.$axios.post('/api/auth/profile/edit',
            { ...this.formData, id: this.$store.state.auth.id })
          this.errorMsg = ''
          this.successMsg = 'Изменения успешно сохранены'
          this.$store.commit("auth/setUser", {...res.data, token: this.$store.state.auth.token})
          this.$fetch()
        } catch (e) {
          this.errorMsg = await this.catchError(e)
          this.successMsg = ''
        }
        this.load = false
      }
    }
  },
  fetch(){
    this.formData.firstName = this.$store.state.auth.firstName
    this.formData.secondName = this.$store.state.auth.secondName
    this.formData.address = this.$store.state.auth.address
    this.formData.phone = this.$store.state.auth.phone
  }
}
</script>

<style scoped>

</style>
