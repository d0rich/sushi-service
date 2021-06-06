<template>
  <div>
    <div @click="show = !show">
      <slot />
    </div>

    <v-dialog width="300px" persistent
          v-model="show" >
      <v-form ref="form" :disabled="false" v-model="valid" @submit.prevent="login">
        <v-card>
          <v-card-title>
            Вход
          </v-card-title>
          <v-card-text>
            <p class="error--text">{{errorMsg}}</p>
            <v-text-field label="Логин" v-model="formData.login" :rules="rules" />
            <v-text-field label="Пароль" v-model="formData.password" :rules="rules" type="password" />
          </v-card-text>
          <v-card-text>
            Первый раз здесь? <nuxt-link to="/register"><span @click="show = !show">Регистрация</span></nuxt-link>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn dark :loading="load" color="red" @click="show = !show">Отмена</v-btn>
            <v-btn :loading="load" color="primary" type="submit">Вход</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
name: "loginModal",
  data(){
    return{
      load: false,
      valid: true,
      show: false,
      rules: [
        v => !!v || 'Обязательное поле'
      ],
      errorMsg: '',
      formData:{
        login: '',
        password: ''
      },

    }
  },
  methods:{
    ...mapActions({
      loginReq: "auth/authByPwd",
      catchError: 'getServerErrorMessage'
    }),
    async login(){
      this.formData.login = this.formData.login.trim()
      this.$refs.form.validate()
      if (this.valid){
        this.load = true
        try{
          await this.loginReq(this.formData)
          this.errorMsg = ''
        }
        catch (e){
          this.errorMsg = await this.catchError(e)
        }
        this.load = false
      }
    }

  }
}
</script>

<style scoped>

</style>
