<template>
	<div class="userinfo">
		<el-container>
			<div class="head">
				<div class="head-bk">
					<div class="user">
						<div class="mypic">
							<img :src="user.face" v-if="user.face">
							<img :src="imgsrc" v-else>
						</div>

						<div class="name" v-if="!update">{{user.nickname}}</div>
						<div class="name" v-else>
							<el-input size="mini" v-model="user.nickname" @blur="updatenickname"></el-input>
						</div>
						<div class="email"><i class="el-icon-message"></i>&ensp;<span>{{user.email}}</span></div>
					</div>
				</div>

			</div>
			<el-main>
				<div class="infor">
					<div class="createdate">用户创建时间：{{user.created | format}}</div>
					<div v-if="myid===user.id">
						<el-button size="small" type="primary" @click="updatename">修改昵称</el-button>
						<el-button size="small" @click="showreset">重置密码</el-button>
					</div>
				</div>
				<div class="userarticle">
					<div class="row">
						<div class="author">{{user.nickname}}的文章:</div>
						<div v-if="myid===user.id">
							<el-button type="text" size="small" v-if="articlepub==='发布'" @click="change">
								<i class="el-icon-takeaway-box"></i>&ensp;查看我的草稿箱
							</el-button>
							<el-button type="text" size="small" v-else @click="change"><i class="el-icon-takeaway-box"></i>&ensp;查看我的已发布
							</el-button>
						</div>

					</div>
					<userinfoarticle :ispub = "articlepub"></userinfoarticle>
				</div>

			</el-main>
			<el-dialog title="重设密码" :visible.sync="reset" :close-on-click-modal=false custom-class="me-dialog"
				width="400px">

				<el-form :model="resetpwd" ref="resetpwd" :rules="rules">
					<el-form-item label="旧密码" prop="oldpwd">
						<el-input type="password" v-model="resetpwd.oldpwd" placeholder="请输入旧密码">
						</el-input>
					</el-form-item>
					<el-form-item label="新密码" prop="newpwd">
						<el-input type="password" v-model="resetpwd.newpwd" placeholder="请输入新密码">
						</el-input>
					</el-form-item>
					<el-form-item label="二次输入新密码" prop="confirmnewpwd">
						<el-input type="password" v-model="resetpwd.confirmnewpwd" placeholder="请再次输入新密码">
						</el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="reset=false" size="small">取 消</el-button>
					<el-button @click="resetpassword" size="small" type="primary">修改</el-button>
				</div>
			</el-dialog>
		</el-container>
	</div>
</template>

<script>
	import {
		getsomeoneinfo,
		updatename,
		updatepwd
	} from '../api/api.js'
	import userinfoarticle from '../components/userinfoarticle.vue'
	export default {
		name: 'userinfo',
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
				if (value != this.resetpwd.newpwd) {
					cb(new Error('两次密码输入不同，请重新输入'))
				}
				return cb();
			}
			return {
				user: '',
				myid: JSON.parse(window.sessionStorage.getItem('user')).id,
				update: false,
				reset: false,
				resetpwd: {
					oldpwd: '',
					newpwd: '',
					confirmnewpwd: ''
				},
				articlepub: '发布',
				rules: {
					oldpwd: [{
						required: true,
						message: '请输入旧密码',
						trigger: 'blur'
					}],
					newpwd: [{
							required: true,
							message: '请输入新密码',
							trigger: 'blur'
						},
						{
							validator: checkpwd,
							trigger: ['blur', 'change'],
						}
					],

					confirmnewpwd: [{
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
		components: {
			userinfoarticle
		},
		created() {
			this.getuserinfo();
		},
		methods: {
			updatename() {
				this.update = true;
			},
			getuserinfo() {
				getsomeoneinfo(this.$route.params.id).then(resp => {
					if (resp.data.code == 200) {
						this.user = resp.data.data;
					} else {
						this.$message.error('获取用户失败');
					}
				})
			},
			updatenickname() {
				let data = {
					nickname: this.user.nickname
				}
				updatename(data).then(resp => {
					if (resp.data.code == 200) {
						this.$message.success('更新成功')
					} else {
						this.$message.warning('更新失败，请稍后再试')
					}
					this.getuserinfo();
					this.update = false;
				})
			},
			showreset() {
				this.reset = true;
			},
			resetpassword() {
				updatepwd(this.resetpwd).then(resp => {
					if (resp.data.code == 200) {
						this.$message.success('修改成功，请重新登录');
						this.clearCookie('Authorization');
						window.sessionStorage.removeItem('user');
						//清除vuex中保存的路由，这样保证路由一直是当前用户拥有的
						this.$router.replace('/Login')
					} else {
						this.$message.warning(resp.data.message);
					}
				})
			},
			change(){
				if(this.articlepub === '草稿'){
					this.articlepub = '发布';
				}else{
					this.articlepub = '草稿';
				}
			}
		}
	}
</script>

<style scoped="scoped">
	.el-icon-message {
		color: #2abcff;
		font-weight: 600;
	}

	.userinfo {
		display: flex;
		justify-content: center;
		background: rgba(255, 255, 255, 0.5);
		border-radius: 10px;
		margin-top: 20px;
		height: 100%;
		width: 100%;
		min-width: 350px;
	}

	.head {
		width: 100%;
		height: 300px;
	}

	.el-container {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.mypic {
		width: 60px;
		height: 60px;
		overflow: hidden;
		display: flex;
		justify-content: center;
		border-radius: 50%;
		margin-bottom: 5px;
	}

	.head-bk {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
		border-radius: 10px;
		height: 300px;
		background-image: url(../assets/img/bk.jpg);
		background-position: center;
		background-repeat: no-repeat;
		z-index: -1;
		background-size: cover;
	}

	.user {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		overflow: hidden;
	}

	.user img {
		width: auto;
		height: 60px;

	}

	.name {
		color: #fff;
		margin: 5px;
		letter-spacing: 2px;
		font-size: 14px;
	}

	.email {
		font-size: 12px;
		color: #ffffff;
		letter-spacing: 2px;
		margin: 5px;
		margin-bottom: 20px;
	}

	.createdate {
		color: #307ec3;
		font-size: 14px;
	}

	.infor {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
	}

	.el-button {
		margin: 8px;
	}

	.author {
		margin-top: 10px;
		color: #3b7599;
		font-weight: 600;
		font-size: 15px;
	}

	.row {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
	}
</style>
