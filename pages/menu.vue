<template>
  <div>
    <v-row no-gutters class="mb-5">
      <v-btn exact tile :to="`/menu/${type.urlName}`"
             v-for="type in $store.state.itemTypes.itemTypes" :key="type.id">
        {{type.type}}
      </v-btn>
    </v-row>
    <nuxt-child />
  </div>
</template>

<script>
export default {
name: "index"
}
</script>

<style scoped>

</style>
