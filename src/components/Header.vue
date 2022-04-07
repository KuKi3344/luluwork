<template>
	<div class="head">
		<div style="display: flex;flex-direction: column;justify-content: space-between;width:100%;height:100%;">
			<div class="left">
				<span id="name">LULU Work</span>
				<div style="width: 100%;">
					<span class="el-dropdown-link">
						<div class="mypic">
							<img :src="user.face" v-if="user.face">
							<img :src="imgsrc" v-else>
						</div>

					</span>
					<span class="username">{{user.nickname}}</span>
				</div>
				<el-menu :router=true menu-trigger="click">
					<el-menu-item index="/Home"><i class="el-icon-s-home"></i>首页</el-menu-item>
					<el-menu-item index="/category/all"><i class="el-icon-menu"></i>文章分类</el-menu-item>
					<el-menu-item index="/write" class="write"><i class="el-icon-edit"></i>写文章</el-menu-item>
					<el-menu-item :index="'/userinfo/'+user.id" class="person" v-if="user"><i
							class="el-icon-user-solid"></i>
						<span>个人中心</span>
					</el-menu-item>
				</el-menu>
			</div>
			<div class="right">
				<el-button round @click="logout" type="text" size="small">退出登录</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'homehead',
		data() {
			return {
				user: JSON.parse(window.sessionStorage.getItem('user')),
			}
		},
		methods: {
			logout() {
				this.$confirm('此操作将注销登录, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//清空用户信息
					this.clearCookie('Authorization');
					window.sessionStorage.removeItem('user');
					//清除vuex中保存的路由，这样保证路由一直是当前用户拥有的
					this.$router.replace('/Login')

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});

			},
		}
	}
</script>

<style scoped="scoped">
	html {
		padding: 0;
		font-size: 15px;
	}

	.el-icon-s-home {
		color: #01cec4 !important;
	}

	.el-icon-menu {
		color: #30b3da !important;
	}

	.el-icon-s-flag {
		color: #da6b6d !important;
	}

	.el-icon-collection {
		color: #48c774 !important;
	}

	.el-icon-edit {
		color: #d6b06e !important;
	}

	.el-icon-s-promotion {
		color: #669886;
	}

	.el-icon-user-solid {
		color: #8dbce8 !important;
	}

	.head {
		position: fixed;
		top:0;
		left: 0;
		display: flex;
		height: 100%;
		width: 180px;
		min-width: 10vw;
		z-index: 999;
		flex-direction: column;
		justify-content: space-between;
		background-color: #6a7a82;
		box-shadow: 0 2px 5px hsla(0, 0%, 7%, .1), 0 0 0 2px hsla(0, 0%, 7%, .1);
	}

	.left {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: flex-start;
	}

	.left {
		width: 180px !important;
	}

	.right {
		min-height: 100px;
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.right button {
		font-size: 15px;
	}

	#name {
		color: #ffffff;
		width: 100%;
		text-align: center;
		font-size: 18px;
		display: inline-block;
		font-weight: 600;
		font-family: "DM Sans", sans-serif;
		margin-bottom: 30px;
		line-height: 50px;
		flex: 1
	}

	.el-menu {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-top: 20px;
		background: none !important;
	}

	.el-menu-item {
		font-size: 13px;
		color: #dcdcdc !important;
		width: 100%;
		height: 52px !important;
		line-height: 52px !important;
		margin-bottom: 2vh;
		padding-left: 30px !important;
	}

	.person {
		line-height: 30px !important;
		padding: 9px;
	}

	.el-button {
		margin-right: 2vw;
		font-size: 0.9vw;
		float: left;
		height: 100%;
	}

	.el-dropdown-link {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		height: 50px;
		width: 50px;
		padding: auto;
	}

	.mypic {
		width: 55px;
		height: 55px;
		border-radius: 50%;
		border: 1px solid #b9e598;
		display: flex;
		justify-content: center;
		overflow: hidden;
	}

	.el-dropdown-link img {
		height: 55px;
		width: auto;
	}

	.el-dropdown-menu {
		text-align: center;
	}

	.username {
		color: #dbeff3 !important;
		font-size: 13px;
		display: block;
		width: 100%;
		text-align: center;
		margin-top: 70px;
		margin-bottom: 10px;
	}

	.el-button {
		height: 30px;
		font-size: 13px !important;
		margin: 10px;
	}

	::v-deep .el-submenu__title:hover,
	.el-menu-item:focus,
	.el-menu-item:hover {
		background-color: #859ea7 !important;
	}
</style>
