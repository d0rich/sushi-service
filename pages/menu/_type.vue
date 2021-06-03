<template>
  <div>
    <div class="items-container">
      <v-card max-width="300px" width="100%" min-width="200px" v-for="item in items" :key="item.id">
        <v-img :src="item.imgUrl" />
        <v-card-title>{{item.name}}</v-card-title>
        <v-card-text>
          <p>{{item.description}}</p>
        </v-card-text>
        <v-divider />
        <v-card-subtitle>
          {{item.weight}} грамм | {{item.cost}} руб.
        </v-card-subtitle>
      </v-card>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
name: "type",
  data(){
    return{
      pages: 1,
      page: 1,
      onPage: 24,
      items: []
    }
  },
  watch:{
    page(){
      this.$fetch()
    },
    '$route'(){
      this.$fetch()
    }
  },
  methods: {
    ...mapActions({
      typeNow: "itemTypes/typeNow"
    })
  },
  async fetch(){
    let type = this.$route.params.type
    if (!this.$route.params.type) {
      this.$router.push({...this.$route, params: {type: 'rolls'}})
      type = 'rolls'
    }
    const res = await this.$axios.get(`/api/items/get/all`+
      `?onPage=${this.onPage}`+
      `&page=${this.page}`+
      `&type=${(await this.$store.dispatch("itemTypes/typeNow", type)).id}`)
    this.pages = res.data.pages
    this.items = res.data.items



  }
}
</script>

<style scoped>
.items-container{
  display: grid;
  align-items: start;
  justify-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1em;
}
@media screen and (max-width: 800px){
  .items-container {
    grid-template-columns: 1fr 1fr;
  }
}
@media screen and (max-width: 500px){
  .items-container {
    grid-template-columns: 1fr;
  }
}
</style>
