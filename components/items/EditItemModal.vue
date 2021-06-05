<template>
  <v-dialog v-model="show" width="90%" max-width="500px" persistent v-if="$store.state.auth.userType === 3">
    <v-form :disabled="load" ref="form" v-model="valid" @submit.prevent="editItem">
      <v-card>
        <v-toolbar dark color="primary">
          Редактирование товара
          <v-spacer />
          <v-btn icon @click="$emit('close')" >
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
          <v-checkbox v-model="formData.show" label="Отображать всем" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :loading="load" @click="$emit('close')" color="red" dark>Закрыть</v-btn>
          <v-btn :loading="load" type="submit" color="primary">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "EditItemModal",
  props: {
    itemId: Number,
    show: Boolean
  },
  watch: {
    async itemId(id){
      this.load = true
      const res = await this.$axios.get(`/api/items/get/by/id/${id}`)
      this.formData = res.data
      this.load = false
    }
  },
  data(){
    return {
      valid: true,
      formData: {
        id: 0,
        itemTypeId: 1,
        name: '',
        description: '',
        cost: 0,
        imgUrl: '',
        weight: 0,
        show: true
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
    async editItem() {
      this.formData.name = this.formData.name.trim()
      this.$refs.form.validate()
      if (this.valid) {
        this.load = true
        try {
          await this.$axios.post('/api/items/edit', this.formData)
          this.errorMsg = ''
          this.$emit('close')
          this.$emit('edited')
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
