import axios from 'axios'

var base = 'http://127.0.0.1:8848';

export function upload(formdata) {
  return axios({
    headers: {'Content-Type': 'multipart/form-data'},
    url: `https://api.googookuki.cn/upload/private/image`,
    method: 'post',
    data: formdata
  })
}

export function Regist(data){
	return axios({
		method:'post',
		url:`${base}/api/regist`,
		data:data,
	})
}
export function login(data){
	return axios({
		method:'post',
		url:`${base}/api/login`,
		data:data,
	})
}
export function getuserinfo(){
	return axios({
		method:'get',
		url:`${base}/my/userinfo`
	})
}
export function getarticle(){
	return axios({
		method:'get',
		url:`${base}/article/get`
	})
}
export function getonearticle(id){
	return axios({
		method:'get',
		url:`${base}/article/get/${id}`
	})
}
export function getcomment(id){
	return axios({
		method:'get',
		url:`${base}/comment/search/${id}`
	})
}
export function recall(data){
	return axios({
		method:'post',
		url:`${base}/comment/add`,
		data:data,
	})
}
export function deletecomment(id){
	return axios({
		method:'post',
		url:`${base}/comment/delete`,
		data:{
			id:id
		},
	})
}

