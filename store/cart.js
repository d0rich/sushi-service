import axios from 'axios'

export const state = () => {
  return {
    items: [],
    events: 0,
    actualInfo: false
  }
}

export const getters = {
  positionsCount(state){
    return state.items.length
  },
  itemsCount(state){
    return state.items.reduce((allCount, item) => {
        return allCount + item.count
      }, 0)
  }
}

export const mutations = {
  addItem(state, itemId){
    const item = state.items.find(i => i.id === itemId)
    if (item) item.count += 1
    else state.items.push({ id: itemId, count: 1 })
    state.events += 1
    localStorage.setItem('cart', JSON.stringify(state.items))
  },
  clearEvents(state){
    state.events = 0
  },
  setItems(state, newItems){
    state.items = newItems
    localStorage.setItem('cart', JSON.stringify(state.items))
  },
  cartFromLocalStorage(state){
    const items = JSON.parse(localStorage.getItem('cart')) || []
    state.items = items
    state.events = items.reduce((allCount, item) => {
      return allCount + item.count
    }, 0)
    state.actualInfo = true
  }
}
