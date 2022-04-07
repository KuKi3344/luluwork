const express = require('express')
const router = express.Router()

//导入用户路由处理函数对应的模块
const commenthander = require('../router_handler/commenthander.js')
//查找
router.get('/search/:id',commenthander.searchcomment)
//添加
router.post('/add',commenthander.addcomment)
//删除
router.post('/delete',commenthander.deletecomment)
module.exports = router