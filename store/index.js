export const strict = false

export const actions = {
  async nuxtServerInit({commit}, { $axios }){
    const res = await $axios.get('/api/item-types/get/all')

    commit("itemTypes/setItemTypes", res.data)
  },
  getServerErrorMessage(state, err){
      if (err.response) {
      console.log(err.response.data)
      return err.response.data
    } else if (err.request) {
      console.log('Problem with server connection')
      return 'Problem with server connection'
    } else {
      // anything else
    }
  }
}
