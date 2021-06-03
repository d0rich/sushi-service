import {Router} from 'express'
import {Op} from 'sequelize'
import { db } from '../plugins/sequelize'

const router = Router()

router.get('/get/all', async (req,res) => {
  try{
    const itemsOnPage = + req.query['onPage'] || 24
    const pageNumber = + req.query['page'] || 1
    const itemType = + req.query['type'] || 1
    const items = await db.Items.findAll({
      order: ['name'],
      limit: itemsOnPage,
      offset: itemsOnPage * (pageNumber - 1),
      where: { itemTypeId: itemType, show: true }
    })
    const count = await db.Items.count({ where: { itemTypeId: itemType } })
    res.send({ pages: Math.ceil(count / itemsOnPage), items })
  }
  catch (err){
    res.status(500).send(err.message)
  }

})

export default router
