import {Router} from 'express'
import {Op} from 'sequelize'
import { db } from '../plugins/sequelize'

const router = Router()

router.get('/get/all', async (req,res) => {
  try{
    const itemsOnPage = + req.query['onPage'] || 24
    const pageNumber = + req.query['page'] || 1
    const itemType = + req.query['type'] || 1
    const showAll = + req.query['showAll'] || 0
    let showOption = showAll === 1 ? {}: {show: true}
    const items = await db.Items.findAll({
      order: ['name'],
      limit: itemsOnPage,
      offset: itemsOnPage * (pageNumber - 1),
      where: {
        itemTypeId: itemType,
        ...showOption
      }
    })
    const count = await db.Items.count({ where: { itemTypeId: itemType, ...showOption } })
    res.send({ pages: Math.ceil(count / itemsOnPage), items })
  }
  catch (err){
    res.status(500).send(err.message)
  }
})

router.get('/get/by/id/:itemId', async (req, res) => {
  try{
    const item = await db.Items.findByPk(req.params['itemId'])
    res.send(item)
  }
  catch (err){
    res.status(500).send(err.message)
  }
})

router.post('/create', async (req, res) => {
  try{
    const newItem = await db.Items.create(req.body)
    res.send(newItem)
  }
  catch (err){
    res.status(500).send(err.message)
  }
})

router.post('/edit', async (req, res) => {
  try{
    const newAttrs = { ...req.body, id: undefined }
    const item = await db.Items.update(newAttrs, { where: {id: req.body['id']} })
    res.send(item)
  }
  catch (err){
    res.status(500).send(err.message)
  }
})

export default router
