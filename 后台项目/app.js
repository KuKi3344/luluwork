//入口文件
const express = require('express')
const app = express()
let bodyParser = require('body-parser')
//跨域
const cors = require('cors')
app.use(cors())
//解析表单数据，只能解析application/x-www-form-urlencoded格式的表单数据
app.use(express.urlencoded({extended:false}))
//解析body里面的数据
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const expressJWT = require('express-jwt')
const secretKey = 'kukiqwq55'
//中间件解析请求头部Authorization中携带的token
//解析header携带的token，并挂载到req.user上面
app.use(expressJWT({
	secret: secretKey,
	algorithms: ['HS256']
}).unless({
	path: [/^\/api\//] 
}))


//路由
const userRouter = require('./router/user')
app.use('/api',userRouter)

const userinfoRouter = require('./router/userinfo')
app.use('/my',userinfoRouter)

const articlecate = require('./router/articlecate')
app.use('/category',articlecate)

const articles = require('./router/articles')
app.use('/article',articles)

const comment = require('./router/comment.js')
app.use('/comment',comment)

app.use((err,req,res,next)=>{
	if(err){
		return res.send({code:500,message:err.message})
	}
	if(err.name === 'UnauthorizedError') return res.send({code:401,message:'身份认证失败'})
	next();
})

app.listen(8848,()=>{
	console.log('runnning at 8848')
})