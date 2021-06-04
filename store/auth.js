import axios from 'axios'

export const state = () => {
  return {
    login: '',
    token: '',
    phone: '',
    userType: 0,
    firstName: '',
    secondName: '',
    address: '',
  }
}

export const getters = {
  authUserType(state){
    switch (state.userType) {
      case 1:
        return 'Клиент'
      case 2:
        return 'Оператор'
      case 3:
        return 'Администратор'
      default:
        return 'Загрузка...'
    }
  },
  isAuth(state){
    return !!state.token
  },
  isAdmin(state){
    return state.userType === 3
  },
  isOperator(state){
    return state.userType === 2
  }
}

export const mutations = {
  setUser(state, {login, token, phone, userType, firstName, secondName, address}){
    state.login = login
    state.token = token
    state.userType = userType
    state.phone = phone
    state.firstName = firstName
    state.secondName = secondName
    state.address = address
    localStorage.setItem('token', token)
  }
}

export const actions = {
  async authByPwd({commit}, {login, password}){
    const res = await axios.post('/api/auth/by/pwd', { login, password })
    commit('setUser', { ...res.data.user, token: res.data.token })
  },
  async authByToken({commit}, token){
    const res = await axios.post('/api/auth/by/token', { token })
    commit('setUser', { ...res.data.user, token: res.data.token })
  },
  async logout({commit}){
    const token = localStorage.getItem('token')
    await axios.post('/api/auth/logout', { token })
    commit('setUser', { token: '', login: '', userType: 0, firstName: '', secondName: '' })
    localStorage.removeItem('token')
  },
  async register({}, {login, password, firstName, secondName}){
    const res = await axios.post('/api/auth/register', { login, password, firstName, secondName })
  }
}
