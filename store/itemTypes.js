import axios from 'axios'

export const state = () => {
  return {
    itemTypes: []
  }
}

export const mutations = {
  setItemTypes(state, itemTypes){
    state.itemTypes = itemTypes.map(type => {
      return {
        id: type.id,
        type: type.type,
        urlName: type.urlName
      }
    })
  }
}

export const actions = {
  typeNow({state}, typeUrl){
    return state.itemTypes.find(item => item.urlName === typeUrl)
  }
}
