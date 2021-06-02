import {Sequelize} from "sequelize";
import {initModels} from "./models/init-models";
const sequelize = new Sequelize(
  'de7u68q3i1vj0h',
  'tdwuqtdnmqkrgs',
  'b33157c68a66fe82d511f19f89383df3a3f05a8736f14dea5829013bd9b7820d',
  require('./seq-options.json'))
export const db = initModels(sequelize)


export default ({ app }, inject) => {
  inject('db', db)
}
