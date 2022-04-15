<template>
	<div>
		<div class="articleview">
			<div class="top">
				<div class="title">{{article.title}}</div>
				<div class="summary">{{article.summary}}</div>
				<div class="category">
					{{article.category.name}}&ensp;&ensp;|&ensp;&ensp;评论数:{{comment.length}}&ensp;&ensp;|&ensp;{{article.first_pub | format}}
				</div>
				<div class="author">
					<img @click="view(article.author.id)" v-if="article.author.face" :src="article.author.face" alt="">
					<img @click="view(article.author.id)" v-else :src="imgsrc">
					<a @click="view(article.author.id)" class="name">{{article.author.nickname}}</a>
				</div>
				<div style="display: flex;align-items: flex-end;margin-top: 20px;"
					v-if="user.id == article.author.id">
					<el-button @click="editArticle()" size="small" icon="el-icon-edit" type="primary"
						circle></el-button>
					<el-button type="danger" icon="el-icon-delete" size="small" circle @click="deletearticle()">
					</el-button>
				</div>
			</div>
			<div class="main">
				{{article.content}}
			</div>
			<div class="comment">
				<div class="me-view-comment-write">
					<el-row>

						<div width="40" height="40" style="display: flex;margin-bottom: 10px;">
							<a style="margin-right: 5px;">
								<div class="picture">
									<img class="me-view-picture" :src="user.face">
								</div>
							</a>
							<el-input type="textarea" :autosize="{ minRows: 2}" placeholder="你的评论..." maxlength="300"
								class="me-view-comment-text" v-model="subcomment.content" resize="none">
							</el-input>
						</div>
						<el-button type="button" size="small" round @click="publishComment()" style="float: right;">评论
						</el-button>
					</el-row>

				</div>

				<div style="opacity: 1;padding:5px,20px;background:rgba(255,255,255,0.8);border-radius: 8px;"
					v-if="comment.length>0">
					<div class="me-view-comment-title">
						<span>{{comment.length}} 条评论</span>
					</div>
					<commentview v-for="comment in comment" :key="comment.id" :comment="comment" :id="comment.id" @getcomment = "getcomment"
						class="comment">
					</commentview>

				</div>
				<el-empty description="暂无评论" v-else></el-empty>
			</div>
			<el-skeleton :rows="15" animated :loading="loading" />
		</div>
	</div>
</template>

<script>
	import {
		getonearticle,
		getcomment,
		recall,
		deletearticle
	} from '../api/api.js'
	import commentview from '../components/commentview.vue'
	export default {
		name: 'articleview',
		components: {
			commentview
		},
		data() {
			return {
				loading: true,
				user: JSON.parse(window.sessionStorage.getItem('user')),
				article: {
					id: '',
					title: '',
					content: '',
					ispub: '',
					summary: '',
					category: {
						id: '',
						name: ''
					},
					author: {
						id: '',
						nickname: ''
					},
					cover_img: '',
					first_pub: '',
					last_pub: ''
				},
				comment: '',
				subcomment: {
					articleId: '',
					content: '',
					level: 1
				}

			}
		},
		created() {
			this.getthisarticle(this.$route.params.id);
			this.getcomment()
		},
		mounted() {
			this.loading = false;
		},
		methods: {
			getthisarticle(id) {
				getonearticle(id).then(resp => {
					if (resp.data.code == 200) {
						this.article = resp.data.data[0];
					} else {
						this.$message.warning('文章加载失败');
					}
				})
			},
			getcomment() {
				getcomment(this.$route.params.id).then(resp => {
					if (resp.data.code == 200) {
						this.comment = resp.data.data.filter(item => item.level == 1);
						document.title = `${this.article.title} —— LULU Work`
					} else {
						this.$message.warning(resp.data.message)
					}

				})
			},
			publishComment() {
				this.subcomment.articleId = this.$route.params.id;
				recall(this.subcomment).then(resp => {
					if (resp.data.code == 200) {
						this.$message.success("评论成功")
						this.getcomment();
						this.subcomment.content = '';
					} else {
						this.$message.error(resp.data.message)
					}
				})
			},
			editArticle(){
				this.$router.push({
					path: `/write/${this.article.id}`
				})
			},
			deletearticle(){
					this.$confirm('文章将会删除, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.delete();
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						})
					});
			},
			delete(){
				deletearticle(this.article.id).then(resp => {
					if (resp.data.code == 200) {
						this.$message.success("删除成功")
						this.$router.replace('/Home')
					} else {
						this.$message.error(resp.data.message)
					}
				})
			},
			view(id) {
				this.$router.push(`/userinfo/${id}`)
			}
		}
	}
</script>

<style scoped="scoped">
	.articleview {
		margin-top: 20px;
		max-width: 1300px;
		min-width: 400px;
		min-height: 700px;
		background: rgba(252, 252, 252, 0.8);
		border-radius: 5px;
	}

	.top {
		width: 100%;
		color: #ffffff;
		height: 350px;
		padding-top: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		background-image: url(https://image.baidu.com/search/down?tn=download&word=download&ie=utf8&fr=detail&url=http://p7.qhimg.com/bdm/1000_618_85/t0126965e612a7835ac.jpg);
		background-repeat: no-repeat;
		background-attachment: fixed;
		background-size: cover;
	}

	.title {
		font-size: 35px;
		font-weight: 600;
	}

	.summary,
	.category {
		margin-top: 20px;
		font-size: 13px;
	}

	.author {
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-top: 20px;
	}

	.author img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin-right: 10px;
	}

	.main {
		padding: 30px;
		margin-left: 15px;
		margin-right: 15px;
		font-size: 15px;
		line-height: 25px;
		min-height: 300px;
		border-bottom: 1px solid #dfdfdf;
	}

	.me-view-comment {
		margin-top: 60px;
	}

	.me-view-comment-title {
		font-weight: 600;
		border-bottom: 1px solid #f0f0f0;
		padding: 15px;
	}

	.el-button {
		margin-bottom: 10px;
	}

	.me-view-comment-write {
		margin-top: 20px;
	}

	.me-view-comment-text {
		font-size: 13px;
	}

	.comment {
		border-bottom: 1px solid #dcdcdc;
		margin-top: 20px;
		padding: 10px;
	}

	.picture {
		width: 40px;
		height: 40px;
		overflow: hidden;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		margin: 0;
	}

	.me-view-picture {
		width: auto;
		height: 40px;
		border: 1px solid #ddd;
		vertical-align: middle;
		background-color: #5fb878;
		padding: 0;
	}
</style>
