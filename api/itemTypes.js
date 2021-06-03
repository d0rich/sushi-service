import {Router} from 'express'
import {Op} from 'sequelize'
import { db } from '../plugins/sequelize'

const router = Router()

router.get('/get/all', async (req,res) => {
  try{
    const types = await db.ItemTypes.findAll()
    res.send(types)
  }
  catch (err){
    res.status(500).send(err.message)
  }

})

export default router
