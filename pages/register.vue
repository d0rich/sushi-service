<template>
  <v-form ref="form" v-model="valid" :disabled="load" @submit.prevent="register">
    <h1>Регистрация</h1>
    <v-divider />
    <p class="error--text">{{errorMsg}}</p>
    <v-text-field label="Логин" v-model="formData.login" :rules="rules" />
    <v-text-field label="Имя" v-model="formData.firstName" :rules="rules" />
    <v-text-field label="Фамилия" v-model="formData.secondName" :rules="rules" />
    <v-text-field type="ph" label="Телефон" v-model="formData.phone" />
    <v-text-field label="Пароль" v-model="formData.password" :rules="rules" type="password" />
    <v-text-field label="Повторите пароль" v-model="repeatPwd" :rules="[...rules, passwordRule]" type="password" />
    <v-row no-gutters>
      <v-spacer />
      <v-btn :loading="load" color="primary" type="submit">
        Регистрация
      </v-btn>
    </v-row>
    <v-dialog v-model="showDialog">
      <v-card>
        <v-card-title>
          Статус регистрации
        </v-card-title>
        <v-card-text>
          <p>Регистрация прошла успешно.</p>
          <p>Вы можете войти в свой аккаунт, выбрав соответствующую функцию в меню слева.</p>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDialog = !showDialog" color="red">Закрыть</v-btn>
          <v-btn to="/" color="primary">На главную</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script>
import {mapActions} from 'vuex'
export default {
name: "register",
  data(){
    return{
      load: false,
      valid: true,
      showDialog: false,
      rules: [
        v => !!v || 'Обязательное поле'
      ],
      errorMsg: '',
      repeatPwd: '',
      formData:{
        login: '',
        phone: '',
        password: '',
        firstName: '',
        secondName: ''
      },
      passwordRule: () => this.repeatPwd === this.formData.password || 'Пароли должны совладать.'
    }
  },
  methods: {
    ...mapActions({
      regReq: "auth/register",
      catchError: 'getServerErrorMessage'
    }),
    async register() {
      this.formData.login = this.formData.login.trim()
      this.formData.firstName = this.formData.firstName.trim()
      this.formData.secondName = this.formData.secondName.trim()
      this.$refs.form.validate()
      if (this.valid) {
        this.load = true
        try {
          await this.regReq(this.formData)
          this.errorMsg = ''
          this.formData.login = ''
          this.formData.phone = ''
          this.formData.password = ''
          this.formData.firstName = ''
          this.formData.secondName = ''
          this.showDialog = true
        } catch (e) {
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
