import axios from 'axios'

export const state = () => {
  return {
    statuses: [
      {code: 0, status: 'Отменен', color: 'red'},
      {code: 1, status: 'В обработке', color: 'blue-grey'},
      {code: 2, status: 'Принят', color: 'indigo'},
      {code: 3, status: 'Готовится', color: 'cyan'},
      {code: 4, status: 'В пути', color: 'teal'},
      {code: 5, status: 'Доставлен', color: 'green'},
    ],
    compareData: [],
    events: 0
  }
}

export const getters = {

}

export const mutations = {
  checkEvents(state, newData){
    let counter = 0
    state.compareData.forEach(order => {
      const newDataOrder = newData.find(o => o.id === order.id)
      if (!newDataOrder) counter += 1
      else if (order.status !== newDataOrder.status) counter += 1
    })
    newData.forEach(order => {
      if (!state.compareData.find(o => o.id === order.id)) counter += 1
    })
    state.events += counter
    state.compareData = newData
  },
  removeEvents(state){
    state.events = 0
  }
}

export const actions = {
  async getComparedData({commit, rootState, rootGetters, dispatch}){
    if (rootGetters["auth/isAuth"]){
      try{
        const res = await axios.get(`/api/orders/get/diff/${rootState.auth.id}`)
        commit("checkEvents", res.data)
      }
      catch (e) {
        dispatch('getServerErrorMessage', e)
      }
    }
  },
  startListen({dispatch}){
    setInterval(() => {dispatch("getComparedData")}, 5000)
  }
}
