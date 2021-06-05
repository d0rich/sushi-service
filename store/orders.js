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
    ]
  }
}

export const getters = {

}

export const mutations = {

}

export const actions = {

}
