<template>
	<div class="main">
		<div class="form">
			<div class="bodyinput" style="display: flex;margin: 10px;">
				<div><b>头像：</b></div>
				<input type="file" name="photo" id="photo" @change="onfilechange" style="width:150px;">
				<img :src="face" v-show="face" style="width: 40px;height:40px;border-radius: 50%;margin-left: 10px;">
			</div>

			<el-form :rules="rules" ref="userRegistParam" :model="userRegistParam" class="registbox">
				<el-form-item prop="username">
					<el-input type="text" v-model="userRegistParam.username" placeholder="请输入用户名">
					</el-input>
				</el-form-item>
				<el-form-item prop="nickname">
					<el-input type="text" v-model="userRegistParam.nickname" placeholder="请输入昵称">
					</el-input>
				</el-form-item>
				<el-form-item prop="email">
					<el-input type="email" v-model="userRegistParam.email" placeholder="请输入邮箱">
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input type="password" auto-complete="false" v-model="userRegistParam.password"
						placeholder="请输入密码">
					</el-input>
				</el-form-item>
				<el-form-item prop="conpwd">
					<el-input type="password" auto-complete="false" v-model="userRegistParam.conpwd"
						placeholder="请再次确认密码">
					</el-input>
				</el-form-item>
				<div>
					<a @click="dosubmit" class="one">
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						Submit
					</a>
					<a @click="tologin" class="two">
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						tologin
					</a>
				</div>
			</el-form>
		</div>

	</div>
</template>

<script>
	import {
		Regist,
		upload
	} from '../api/api.js'
	export default {
		name: "Regist",
		data() {
			const checkpwd = (rule, value, cb) => {
				if (value.length > 5) {
					var modes = 0;
					//正则表达式验证符合要求的
					if (/\d/.test(value)) modes++; //数字
					if (/[A-z]/.test(value)) modes++; //小写
					if (/\W/.test(value)) modes++; //特殊字符					
					if (modes == 1) {
						cb(new Error('密码强度过低,请包含大小写字母、数字、特殊字符中两种及以上'))
					}
					return cb();
				} else {
					cb(new Error('请确保密码长度在6位以上'))
				}
			}
			const confirmpwd = (rule, value, cb) => {
				if (value != this.userRegistParam.password) {
					cb(new Error('两次密码输入不同，请重新输入'))
				}
				return cb();
			}



			return {
				face: '',
				userRegistParam: {
					username: '',
					face: '',
					nickname: '',
					email: '',
					password: '',
					conpwd: '',
				},


				rules: {
					username: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}, ],
					nickname: [{
						required: true,
						message: '请输入昵称',
						trigger: 'blur'
					}, ],
					email: [{
							required: true,
							message: '请输入邮箱',
							trigger: 'blur'
						},
						{
							pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
							message: "邮箱格式错误",
							trigger: ['blur', 'change'],
						}
					],

					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							validator: checkpwd,
							trigger: ['blur', 'change'],
						}
					],

					conpwd: [{
							required: true,
							message: '请二次输入密码',
							trigger: 'blur'
						},
						{
							validator: confirmpwd,
							trigger: ['blur', 'change'],
						}

					],

				}
			}

		},

		methods: {

			dosubmit: function() {
				this.$refs.userRegistParam.validate((valid) => {
					if (valid) {
						this.userRegistParam.face = this.face;
						let regdata = {
							username: this.userRegistParam.username,
							face: this.userRegistParam.face,
							nickname: this.userRegistParam.nickname,
							email: this.userRegistParam.email,
							password: this.userRegistParam.password,
						}
						Regist(regdata).then(resp => {
							if (resp.data.code == 200) {
								this.$message({
									message: '注册成功',
									type: 'success'
								});
							} else {
								this.$message({
									message: resp.data.message,
									type: 'error'
								});
							}

						})
					} else {
						this.$message.error('输入格式错误，请检查！')
					}
				})
			},
			tologin() {
				this.$message({
					type: 'success',
					message: '跳转成功'

				})
				this.$router.push('/Login');
			},
			onfilechange(e) {
				var file = e.target.files[0];
				let formdata = new FormData();
				formdata.append('image', file);
				const imgType = ['image/jpeg', 'image/png'];
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!imgType.includes(file.type)) {
					this.$message.error('上传头像图片仅支持JPG、PNG格式，请重新上传!');
				} else if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB，请重新上传!');
				} else {
					upload(formdata).then(resp => {
						if (resp.data.code == 200) {
							this.face = resp.data.data;
							console.log(this.face)
						} else {
							this.$message({
								message: resp.data.message,
								type: 'error',
								showClose: true
							})
						}

					}).catch(err => {
						this.$message({
							message: err,
							type: 'error',
							showClose: true
						});
					})
				}

			},
		}
	}
</script>

<style scoped="scoped">
	.main {
		color: #fff;
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		min-height: 100%;
		min-width: 100%;
		max-height: 1550px auto;
		max-width: 750px auto;
		z-index: -100;
		display: flex;
		background: linear-gradient(#191944, #1e274b, #33426a, #3e5483);
		justify-content: center;
		align-items: center;
	}

	::v-deep .el-input__inner {
		background: transparent !important;
		border: none;
		border-bottom: 1px solid #fff;
		outline: none;
		color: #fff;
	}

	.form {
		min-width: 300px;
		max-width: 700px;
		height: 420px;
		background: rgba(36, 36, 36, 0.5);
		box-shadow: 0 15px 25px rgba(31, 31, 31, 0.6);
		border-radius: 10px;
		padding: 30px;
	}

	.form form a.one {
		position: relative;
		display: inline-block;
		padding: 10px 20px;
		color: #31ffbb;
		font-size: 15px;
		text-decoration: none;
		text-transform: uppercase;
		overflow: hidden;
		transition: .5s;
		margin-top: 20px;
		letter-spacing: 4px
	}

	.form form a.two {
		position: absolute;
		left: 51%;
		display: inline-block;
		padding: 10px 20px;
		color: #31ffbb;
		font-size: 15px;
		text-decoration: none;
		text-transform: uppercase;
		overflow: hidden;
		transition: .5s;
		margin-top: 20px;
		letter-spacing: 4px
	}

	.form a:hover {
		background: #09deb4;
		color: #fff;
		border-radius: 5px;
		box-shadow: 0 0 5px #09deb4,
			0 0 25px #09deb4,
			0 0 50px #09deb4,
			0 0 100px #09deb4;
	}

	.form a span {
		position: absolute;
		display: block;
	}

	.form a span:nth-child(1) {
		top: 0;
		left: -100%;
		width: 100%;
		height: 2px;
		background: linear-gradient(90deg, transparent, #03e9f4);
		animation: btn-anim1 1s linear infinite;
	}

	@keyframes btn-anim1 {
		0% {
			left: -100%;
		}

		50%,
		100% {
			left: 100%;
		}
	}

	.form a span:nth-child(2) {
		top: -100%;
		right: 0;
		width: 2px;
		height: 100%;
		background: linear-gradient(180deg, transparent, #03e9f4);
		animation: btn-anim2 1s linear infinite;
		animation-delay: .25s
	}

	@keyframes btn-anim2 {
		0% {
			top: -100%;
		}

		50%,
		100% {
			top: 100%;
		}
	}

	.form a span:nth-child(3) {
		bottom: 0;
		right: -100%;
		width: 100%;
		height: 2px;
		background: linear-gradient(270deg, transparent, #03e9f4);
		animation: btn-anim3 1s linear infinite;
		animation-delay: .5s
	}

	@keyframes btn-anim3 {
		0% {
			right: -100%;
		}

		50%,
		100% {
			right: 100%;
		}
	}

	.form a span:nth-child(4) {
		bottom: -100%;
		left: 0;
		width: 2px;
		height: 100%;
		background: linear-gradient(360deg, transparent, #03e9f4);
		animation: btn-anim4 1s linear infinite;
		animation-delay: .75s
	}

	@keyframes btn-anim4 {
		0% {
			bottom: -100%;
		}

		50%,
		100% {
			bottom: 100%;
		}
	}
</style>
