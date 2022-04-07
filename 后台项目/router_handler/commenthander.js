const db = require('../db/index')

//查找评论
exports.searchcomment= (req,res)=>{
	const sql = 'select comment.*,user.nickname,user.face from comment,user where comment.articleid = ? and comment.authorid = user.id and comment.status = 1';
	db.query(sql,req.params.id,(err,result)=>{
		if (err) return res.send({
			code: 500,
			message: '数据库异常' + err.message
		})
	for (let i = 0; i < result.length; i++) {
			result[i] = {
				id: result[i].id,
				content: result[i].content,
				level:result[i].level,
				toUserid:result[i].toUserid,
				toUsername:result[i].toUsername,
				author: {
					id: result[i].authorid,
					face:result[i].face,
					nickname: result[i].nickname
				},
				parentid:result[i].parentid,
				created:result[i].created,
				
			}
			}
			res.send({
				code:200,
				message:'查找评论成功',
				data:result,
			})
	})
}
//添加
exports.addcomment = (req, res) => {
	// //需要前端的数据格式
	// {
	// 	content:'',
	//  articleid:'',
	//  parentid:'',
//		toUserid:'',
//		toUsername:'',
	//  level:'',
	// }
	req.body.authorid = req.user.id;
	const sql = 'insert into comment set ?'
	db.query(sql, req.body, (err, result) => {
		if (err) return res.send({
			code: 500,
			message: '数据库异常' + err.message
		})
		if (result.affectedRows !== 1) return res.send({
			code: 1001,
			message: '发布评论失败'
		})
		res.send({
			code: 200,
			message: '发布评论成功'
		})
	})
}
//删除
exports.deletecomment = (req,res)=>{
	const sql = 'select * from comment where id = ?'
	db.query(sql,req.body.id,(err,result)=>{
		if (err) return res.send({
			code: 500,
			message: '数据库异常' + err.message
		})	
		if (result[0].authorid != req.user.id) return res.send({
			code: 401,
			message: '无权限删除他人评论'
		})
		const sqlstr = 'update comment set status = 0 where id = ?'
		db.query(sqlstr,req.body.id, (err, result) => {
			if (err) return res.send({
				code: 500,
				message: '数据库异常' + err.message
			})
			if (result.affectedRows !== 1) return res.send({
				code: 1002,
				message: '删除评论失败'
			})
			res.send({
				code: 200,
				message: '删除评论成功'
			})
		})
	})
}