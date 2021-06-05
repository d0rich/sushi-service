<template>
  <div>
    <create-item-modal class="mb-3" @created="$fetch" />
    <edit-item-modal @edited="$fetch()" @close="editModal.show = false"
                     :item-id="editModal.itemId" :show="editModal.show" />
    <v-progress-linear
      v-if="$fetchState.pending"
      active indeterminate
    ></v-progress-linear>
    <v-pagination v-if="pages>1" class="mb-3" :disabled="$fetchState.pending" v-model="page" :length="pages" />
    <transition-group class="items-container">
      <v-card :disabled="$fetchState.pending" v-for="item in items" :key="item.id"
              :style="{opacity: item.show ? 1 : 0.5 }"
              max-width="300px" width="100%" min-width="200px" >
        <v-img max-height="150px" :src="item.imgUrl" />
        <v-card-title>{{item.name}}</v-card-title>
        <v-card-text>
          <p>{{item.description}}</p>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <span>{{item.weight}} грамм | {{item.cost}} ₽</span>
          <v-spacer />
          <v-btn v-if="isAdmin"
                 icon @click="editModal.show = true; editModal.itemId = item.id">
            <v-icon>
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn v-if="item.show" icon @click="addToCart(item.id)">
            <v-icon>
              mdi-cart-plus
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </transition-group>
    <v-pagination v-if="pages>1" class="mt-3" :disabled="$fetchState.pending" v-model="page" :length="pages" />
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex'
import CreateItemModal from "@/components/items/CreateItemModal";
import EditItemModal from "@/components/items/EditItemModal";
export default {
name: "type",
  components: {
    CreateItemModal, EditItemModal
  },
  data(){
    return{
      pages: 1,
      page: 1,
      onPage: 12,
      items: [],
      editModal: {
        show: false,
        itemId: 0
      }
    }
  },
  computed: {
    ...mapGetters({
      isAdmin: "auth/isAdmin"
    })
  },
  watch:{
    page(){
      this.$fetch()
    },
    '$route.params.type'(){
      this.page = 1
    },
    isAdmin(){
      this.$fetch()
    },
    '$route'(){
      this.$fetch()
    }
  },
  methods: {
    ...mapActions({
      typeNow: "itemTypes/typeNow",
      catchServerError: "getServerErrorMessage"
    }),
    ...mapMutations({
      addToCart:"cart/addItem"
    })
  },
  async fetch(){
    let type = this.$route.params.type
    if (!this.$route.params.type) {
      await this.$router.push({...this.$route, params: {type: 'rolls'}})
      type = 'rolls'
    }
    try {
      const res = await this.$axios.get(`/api/items/get/all`+
        `?onPage=${this.onPage}`+
        `&page=${this.page}`+
        `&type=${(await this.$store.dispatch("itemTypes/typeNow", type)).id}`+
        `&showAll=${this.$store.getters["auth/isAdmin"] ? 1 : 0 }`)
      this.pages = res.data.pages
      this.items = res.data.items
    }
    catch (e){
      this.catchServerError(e)
      await this.$router.push({...this.$route, params: {type: 'rolls'}})
    }



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
