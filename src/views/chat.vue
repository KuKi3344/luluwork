<template>
	<div class="chat">
		<div class="group">googoo聊天室</div>
		<div class="chatmain"></div>
		<div class="option">
			<textarea class="article-content" placeholder="请输入内容"></textarea>
			<button class="send">发送消息</button>
		</div>
	</div>
</template>
<script>
	import {
		getuserinfo
	} from '../api/api.js'
	export default {
		name: 'chat',
		data() {
			return {
				username: ''
			}
		},
		created() {
			getuserinfo().then(resp => {
				if (resp.data.code == 200) {
					setTimeout(() => {
						this.username = resp.data.data.username;
						this.getconnect(resp.data.data.username, resp.data.data.nickname, resp.data.data
							.face);
					}, 500)
				} else {
					this.clearCookie('Authorization');
					window.sessionStorage.removeItem('user');
				}
			})
		},
		methods: {
			getconnect(username, nickname, face) {
				var socket = new WebSocket('ws://localhost:3000')
				var div = document.getElementsByClassName('chatmain')[0];
				var send = document.getElementsByClassName('send')[0];
				var input = document.getElementsByClassName('article-content')[0];
				face = face != '' ? face : this.imgsrc;
				socket.addEventListener('open', function() {
					var inchat = document.createElement('div');
					inchat.innerHTML = '连接到聊天室...'
					inchat.className = 'in'
					div.appendChild(inchat);
					socket.send(JSON.stringify({
						type: 'login',
						username: username,
						nickname: nickname,
						face: face
					}))
				})

				send.addEventListener('click', function() {
					if (input.value != '') {
						socket.send(JSON.stringify({
							type: 'msg',
							value: input.value
						}))
						input.value = ''
					}
				})
				socket.addEventListener('message', function(e) {
					let data = JSON.parse(e.data);
					if (data.type == 'msg') {
						if (data.username !== username) {
							var every = document.createElement('div');
							every.innerHTML = `<div class="pic"><img src="${data.face}"></div>
						<div class="mesmain">
						<div class="chatuserleft">${data.nickname}</div>
						<div class="content">${data.msg}</div>
						</div>`
							every.className = "talk"
							div.appendChild(every)
						} else {
							var everyone = document.createElement('div');
							everyone.innerHTML = `
								<div class="mesmain">
								<div class="chatuserright">${data.nickname}</div>
								<div class="mycontent">${data.msg}</div>
								</div>
								<div class="pic"><img src="${data.face}"></div>
								`
							everyone.className = "mytalk"
							div.appendChild(everyone)
						}

					} else {
						var one = document.createElement('div')
						one.innerText = data.msg;
						one.className = data.type;
						div.appendChild(one);
					}
				})
				socket.addEventListener('close', function() {
					var outchat = document.createElement('div');
					outchat.innerHTML = '离开聊天室...'
					outchat.className = 'out'
					div.appendChild(outchat);
				})
			},
		}
	}
</script>

<style>
	.chatmain {
		min-width: 250px;
		width: 100%;
		min-height: 300px;
		flex: 1;
		margin-top: 7px;
		margin-bottom: 7px;
		box-sizing: border-box;
		overflow-y: scroll;
	}

	.in,
	.out {
		color: #9d9d9d;
		font-size: 13px;
		text-align: center;
	}


	.msg {
		color: #000;
	}

	.talk {
		margin: 8px;
		display: flex;
		align-items: flex-start;
		overflow: hidden;
	}

	.mytalk {
		margin: 8px;
		display: flex;
		align-items: flex-start;
		justify-content: flex-end;
		overflow: hidden;
	}

	.pic {
		width: 35px;
		height: 35px;
		overflow: hidden;
		display: flex;
		justify-content: center;
		border-radius: 5px;
		margin-left: 5px;
		margin-right: 5px;
	}

	.mesmain {
		display: flex;
		flex-direction: column;
	}

	.chat {
		margin: 20px;
		margin-top: 50px;
		height: 500px;
		background-color: #F5F6F7;
		display: flex;
		justify-content: center;
		flex-direction: column;
		box-shadow: 0 15px 25px rgba(206, 206, 206, 0.8);
		border-radius: 10px;
		padding: 20px;
	}

	.pic img {
		width: auto;
		height: 35px;
	}

	.chatuserleft,
	.chatuserright {
		font-size: 12px;
		color: #6d6d6d;
	}

	.chatuserleft {
		text-align: left;
	}

	.chatuserright {
		text-align: right;
	}

	.option {
		min-height: 150px;
		width: 100%;
		border-top: 1px solid #dedede;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: flex-end;
	}

	.group {
		width: 100%;
		padding-bottom: 10px;
		font-size: 14px;
		text-align: center;
		letter-spacing: 2px;
		font-family: "book antiqua";
		border-bottom: 1px solid #bdbdbd;
		box-sizing: border-box;
	}

	.content {
		width: auto;
		max-width: 280px;
		min-height: 15px;
		margin-top: 5px;
		background-color: #fff;
		padding: 10px;
		border-radius: 5px;
		font-size: 13px;
		word-break: break-all;
		overflow: hidden;
		word-wrap: break-word;
	}

	.mycontent {
		width: auto;
		max-width: 280px;
		min-height: 15px;
		margin-top: 5px;
		background-color: #1d64ff;
		color: #fff;
		padding: 10px;
		border-radius: 5px;
		font-size: 13px;
		word-break: break-all;
		overflow: hidden;
		word-wrap: break-word;
	}

	.option input::-webkit-input-placeholder {
		color: #bababa;
	}

	.option textarea::-webkit-input-placeholder {
		color: #bababa;
		font-size: 13px;
	}

	.article-content {
		width: 100%;
		text-overflow: clip;
		border: none;
		box-sizing: border-box;
	}

	.option button {
		width: 80px;
		font-size: 13px;
		height: 30px;
		border: none;
		background-color: #3d98f3;
		color: #fff;
		border-radius: 5px;
	}

	.option textarea {
		resize: none;
		/* 去除边框 */
		border: none;
		/* 去除选中后的边框 */
		outline: none;
		font-size: 13px;
		flex: 1;
		padding: 7px;
		background-color: #F5F6F7;
		font-family: "microsoft sans serif";

	}

	.option textarea :active,
	.option textarea :focus {
		border: none !important;
		outline: none !important;
	}

	@media screen and (max-width:520px) {
		.content {
			max-width: 180px !important;
		}

		.option {
			min-height: 100px !important;
		}

		.chat {
			width: 450px;
		}
	}
</style>
