<template>
	<div class="main">
		<div class="form">
			<h2>Welcome to LULU Work</h2>
			<el-form :rules="rules" ref="user" :model="user" class="registbox">
				<el-form-item prop="username">
					<el-input type="text" v-model="user.username" placeholder="请输入用户名">
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input type="password" auto-complete="false" v-model="user.password"
						placeholder="请输入密码">
					</el-input>
				</el-form-item>
				<div class="verify" v-if="toverify">
					<slide-verify ref="slideblock" @again="onAgain" @success="onSuccess" @fail="onFail" :accuracy="accuracy"
						:slider-text="text"></slide-verify>
				</div>
				<div>
					<a @click="toregist" class="one">
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						Toreg
					</a>
					<a @click="dosubmit" class="two">
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						login
					</a>
				</div>
			</el-form>
		</div>

	</div>
</template>

<script>
	import {
		login
	} from '../api/api.js'
	export default {
		name: "Login",
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


			return {
				user: {
					username: '',
					password: '',
				},
				checked: true,
				text: '向右滑',
				accuracy: 4,
				toverify: false,
				succeed: false,
				rules: {
					username: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}, ],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							validator: checkpwd,
							trigger: ['blur', 'change'],
						}
					]
				}
			}

		},

		methods: {
		onSuccess: function() {
			this.$message({
				type: 'success',
				message: '验证通过',
			});
			this.succeed = true;
			this.toverify = false;
		},
		onFail: function() {
			this.$message.error('验证失败');
		},
		onAgain: function() {
			this.$message({
				message: '请求错误，请重试',
				type: 'warning'
			});
			// 刷新
			this.$refs.slideblock.reset();
		},
			dosubmit: function() {
				this.$refs.user.validate((valid) => {
					if (valid) {
						if (this.succeed) {
							login(this.user).then(resp => {
							if (resp.data.code == 200) {
								this.setCookieValue("Authorization",resp.data.token);
								this.$message({
									message: '登录成功',
									type: 'success'
								});
								this.$router.push('/Home')
							} else {
								this.$message({
									message: resp.data.message,
									type: 'error'
								});
							}

						})
						}else{
							this.$message.warning('请先通过验证');
							this.toverify = true;
						}
						
					} else {
						this.$message.error('输入格式错误，请检查！')
					}
				})
			},
			toregist() {
				this.$message({
					type: 'success',
					message: '跳转成功'

				})
				this.$router.push('/Regist');
			}
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
		background: linear-gradient(#518755, #63a584, #89ba80, #9cc394);
		justify-content: center;
		align-items: center;
	}
	.form h2{
		margin-bottom: 40px;
		padding: 0;
		color: #fff;
		text-align: center;
		font-family:"bodoni mt";
		
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
		height: 260px;
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
	.verify{
		position:absolute;
		left:55%;
		top:46%;
		transform: translate(10%,-50%);
		padding:30px 10px 10px 20px;
		background:#fff;
		border-radius:5px;
		z-index:100;
	}
</style>
