<template>
  <div v-if="$store.getters['auth/isAdmin']">
    <v-btn @click="show = !show" color="primary">Новый товар</v-btn>
    <v-dialog v-model="show" width="90%" max-width="500px">
      <v-form :disabled="load" ref="form" v-model="valid" @submit.prevent="createItem">
        <v-card>
          <v-toolbar dark color="primary">
            Создание товара
            <v-spacer />
            <v-btn icon @click="show = false" >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <p class="error--text">{{errorMsg}}</p>
            <v-select :items="$store.state.itemTypes.itemTypes"
                      label="Тип позиции"
                      item-text="type" item-value="id"
                      v-model="formData.itemTypeId" />
            <v-text-field label="Ссылка на изображение" v-model="formData.imgUrl" :rules="rules" />
            <v-text-field label="Название" v-model="formData.name" :rules="rules" />
            <v-textarea label="Описание" outlined v-model="formData.description" :rules="rules" />
            <v-text-field type="number" label="Вес" v-model="formData.weight" :rules="rules" suffix="грамм" />
            <v-text-field type="number" label="Цена" v-model="formData.cost" :rules="rules" suffix="₽" />

          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn :loading="load" @click="show = false" color="red" dark>Закрыть</v-btn>
            <v-btn :loading="load" type="submit" color="primary">Создать</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
name: "CreateItemModal",
  data(){
    return {
      show: false,
      valid: true,
      formData: {
        itemTypeId: 1,
        name: '',
        description: '',
        cost: 0,
        imgUrl: '',
        weight: 0
      },
      rules: [
        v => !!v || 'Обязательное поле'
      ],
      errorMsg: '',
      load: false
    }
  },
  methods:{
    ...mapActions({
      catchError: 'getServerErrorMessage'
    }),
    async createItem() {
      this.formData.name = this.formData.name.trim()
      this.$refs.form.validate()
      if (this.valid) {
        this.load = true
        try {
          await this.$axios.post('/api/items/create', this.formData)
          this.errorMsg = ''
          this.show = false
          this.$emit('created')
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
