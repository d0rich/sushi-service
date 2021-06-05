import {Router} from 'express'
import {Op} from 'sequelize'
import { db } from '../plugins/sequelize'

const router = Router()

router.post('/create', async (req, res) => {
  try{
    const orderData = req.body
    const order = await db.Orders.create({ ...orderData, items: undefined })
    const items = await db.ItemsInOrders.bulkCreate(orderData.items.map(item => {
      return {
        orderId: order.id,
        itemId: item.itemId,
        count: item.count,
        cost: item.cost
      }
    }))
    res.send(order)
  }
  catch (err){
    res.status(500).send(err.message)
  }
})

export default router
