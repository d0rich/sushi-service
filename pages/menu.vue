<template>
  <div>
    <v-row no-gutters class="mb-5" justify="center">
      <v-btn exact tile :to="`/menu/${type.urlName}`" class="mx-3 my-1"
             v-for="type in $store.state.itemTypes.itemTypes" :key="type.id">
        {{type.type}}
      </v-btn>
    </v-row>
    <nuxt-child />
  </div>
</template>

<script>
export default {
name: "menu-index"
}
</script>

<style scoped>

</style>
