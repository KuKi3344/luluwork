<template>
	<div id="write">
		<el-header>
			<div style="display: flex;justify-content: space-between;align-items: center;height:100%;">
				<div style="display: flex;justify-content: space-around;align-items: center;">
					<div class="leaf"></div>
					<div>
						<div class="me-write-info" v-if="articleForm.title!=''">{{articleForm.title}}</div>
						<div class="me-write-info" v-else>无标题</div>
						<div class="username">{{user.nickname}}&emsp;/&emsp;<span
								v-if="articleForm.category!=''">{{articleForm.category.name}}区</span>
							<span v-else>暂无</span>
						</div>
					</div>
				</div>
				<div class="me-write-btn">
					<el-button  @click="publishShow('草稿')" size="small" type="primary">保存为草稿</el-button>
					<el-button @click="publishShow('发布')" size="small" type="success">发布</el-button>
					<el-button  @click="cancel" size="small">取消 </el-button>
				</div>
			</div>
		</el-header>
		<el-container>
			<el-container class="me-area me-write-box">
				<el-main class="me-write-main">
					<div class="me-write-title">
						<input v-model="articleForm.title" placeholder="请输入标题" class="me-write-input">

					</div>
					<div id="placeholder" style="visibility: hidden;height: 89px;display: none;"></div>
					<textarea v-model="articleForm.content" class="article-content" placeholder="请输入内容"></textarea>
				</el-main>
			</el-container>

			<el-dialog title="摘要 分类" :visible.sync="publishVisible" :close-on-click-modal=false
				custom-class="me-dialog">

				<el-form :model="articleForm" ref="articleForm" :rules="rules">
					<el-form-item prop="summary">
						<el-input type="textarea" v-model="articleForm.summary" :rows="6" placeholder="请输入摘要">
						</el-input>
					</el-form-item>
					<el-form-item label="文章分类" prop="category">
						<el-select v-model="articleForm.category" value-key="id" placeholder="请选择文章分类">
							<el-option v-for="c in categorys" :key="c.id" :label="c.name" :value="c">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="publishVisible = false" size="small">取 消</el-button>
					<el-button @click="publish('articleForm')"  size="small">发布</el-button>
				</div>
			</el-dialog>
		</el-container>
	</div>
</template>
<script>
	import {
		publisharticle,
		getonearticle,
		editarticle
	} from '../api/api.js'
	import {
		getallcategory
	} from '../api/api.js'

	export default {
		name: 'write',
		mounted() {
			this.getCategorys()
			if (this.$route.params.id) {
				this.getArticleById(this.$route.params.id);
				this.type = 'update'
			}
		},
		data() {
			return {
				user: JSON.parse(window.sessionStorage.getItem('user')),
				type: 'add',
				publishVisible: false,
				categorys:[],
				pubtype:'pub',
				articleForm: {
					id: '',
					title: '',
					summary: '',
					category: '',
					content: ''
				},
				rules: {
					summary: [{
							required: true,
							message: '请输入摘要',
							trigger: 'blur'
						},
						{
							max: 80,
							message: '不能大于180个字符',
							trigger: ['blur', 'change']
						}
					],
					category: [{
						required: true,
						message: '请选择文章分类',
						trigger: ['blur', 'change']
					}],
				}
			}
		},
		computed: {
			title() {
				return '写文章 - LULU Work'
			}
		},
		methods: {
			getArticleById(id) {
				getonearticle(id).then(resp => {

					this.articleForm = resp.data.data[0];
					this.articleForm.content = resp.data.data[0].content.replace(/\\r\\n/g, "\n").replace(
						/&lt;/g, "<").replace(/&gt;/g, ">")
					if (this.user.id != this.articleForm.author.id) {
						this.$message.error('您没有权限');
						this.$router.replace('/Home');
					}
				}).catch(error => {
					this.$message({
						type: 'error',
						message: '文章加载失败',
						showClose: true
					})
					console.log(error)
				})
			},
			publishShow(type) {
				if (!this.articleForm.title) {
					this.$message({
						message: '标题不能为空哦',
						type: 'warning',
						showClose: true
					})
					return
				}

				if (this.articleForm.title.length > 50) {
					this.$message({
						message: '标题不能大于50个字符',
						type: 'warning',
						showClose: true
					})
					return
				}

				if (this.articleForm.content.length < 1) {
					this.$message({
						message: '内容不能为空哦',
						type: 'warning',
						showClose: true
					})
					return
				}
				this.pubtype = type;
				this.publishVisible = true;
			},
			publish(articleForm) {

				let that = this
				this.$refs[articleForm].validate((valid) => {
					if (valid) {
						if (this.articleForm.category == '') {
							this.$message({
								message: '种类不能为空哦',
								type: 'warning',
								showClose: true
							})
							return
						}
						this.articleForm.content = this.articleForm.content.replace(/</g, "&lt;").replace(/>/g,
							"&gt;");
						let article = {
							title: this.articleForm.title,
							summary: this.articleForm.summary,
							categoryid: this.articleForm.category.id,
							content: this.articleForm.content,
							ispub:this.pubtype

						}
						this.publishVisible = false;

						let loading = this.$loading({
							lock: true,
							text: '发布中，请稍后...'
						})
						if (this.type == 'add') {
							publisharticle(article).then((resp) => {
								if (resp.data.code == 200) {
									loading.close();
									that.$message({
										message: '发布成功啦',
										type: 'success',
										showClose: true
									})
									setTimeout(() => {
										that.$router.push({
											path: `/article/${resp.data.id}`
										})
									}, 500)

								} else {
									that.$message({
										type: 'error',
										message: '发布文章失败:' + resp.data.message,
										showClose: true
									});
								}

							}).catch((error) => {
								loading.close();
								that.$message({
									message: error,
									type: 'error',
									showClose: true
								});
							})
						} else {
							//更新接口
							article.id = this.articleForm.id;
							editarticle(article).then((resp) => {
								if (resp.data.code == 200) {
									loading.close();
									that.$message({
										message: '发布成功啦',
										type: 'success',
										showClose: true
									})
									that.$router.push({
										path: `/article/${this.articleForm.id}`
									})
								} else {
									that.$message({
										type: 'error',
										message: '发布文章失败:' + resp.data.message,
										showClose: true
									});
								}

							}).catch((error) => {
								loading.close();
								that.$message({
									message: error,
									type: 'error',
									showClose: true
								});
							})

						}

					} else {
						return false;
					}
				});
			},
			cancel() {
				this.$confirm('文章将不会保存, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$router.go(-1);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					})
				});
			},
			getCategorys() {
				getallcategory().then(resp => {
					if (resp.data.code == 200) {
						this.categorys = resp.data.data;
					} else {
						this.$message({
							type: 'error',
							message: '文章分类加载失败',
							showClose: true
						})
					}

				}).catch(error => {
					if (error !== 'error') {
						this.$message({
							type: 'error',
							message: '文章分类加载失败',
							showClose: true
						})
					}
				})
			}
		}
	}
</script>

<style scoped="scoped">
	body {
		font-size: 15px;
	}

	#write {
		height: 100%;
	}

	.el-header {
		position: fixed;
		z-index: 1024;
		min-width: 100%;
		box-shadow: 0 2px 3px hsla(0, 0%, 7%, .1), 0 0 0 1px hsla(0, 0%, 7%, .1);
		background-color: #fff;
		height: 30px;
	}

	.me-write-info {
		font-size: 14px;
		font-weight: 600;
		margin-bottom: 5px;
	}

	.username {
		font-size: 12px;
		color: #767676;
		text-align: center;

	}

	.me-write-btn {
		margin-top: 10px;
		display: flex;
	}

	.me-write-box {
		background-color: #fff;
		min-width: 100%;
		margin: 80px auto 0;
		margin-top: 60px;
		opacity: 0.95;
		height: 600px;
		justify-content: center;
	}

	.me-write-main {
		padding: 10px;
		border-radius: 30px;
		max-width: 1300px;
		margin-left: 40px;
		margin-right: 40px;
	}

	.me-write-input {
		border: none;
		height: 60px;
		width: 100%;
		font-size: 30px;
		margin-bottom: 20px;
		color: #161616;
		font-weight: 600;
		outline: none;
	}

	input::-webkit-input-placeholder {
		color: #bababa;
	}
	textarea::-webkit-input-placeholder {
		color: #bababa;
		font-size: 16px;
	}
	.article-content {
		width: 100%;
		text-overflow: clip;
		height: 80%;
		border: none
	}

	textarea {
		resize: none;
		/* 去除边框 */
		border: none;
		/* 去除选中后的边框 */
		outline:none;
		font-size: 15px;

	}

	textarea :active,
	textarea :focus {
		border: none !important;
		outline: none !important;
	}

	.me-header-left {
		margin-top: 10px;
	}

	.me-title img {
		max-height: 2.4rem;
		max-width: 100%;
	}

	.me-write-toolbar-fixed {
		position: fixed;
		width: 700px !important;
		top: 60px;

	}

	.leaf {
		width: 30px;
		height: 30px;
		background-color: #60c763;
		border-top-left-radius: 30px;
		border-bottom-right-radius: 30px;
		margin-right: 10px;
	}
</style>
