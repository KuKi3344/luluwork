<template>
	<div class="articleview">
		<div class="top">
			<div class="title">{{article.title}}</div>
			<div class="summary">{{article.summary}}</div>
			<div class="category">
				{{article.category.name}}&ensp;|&ensp;评论数:{{comment.length}}&ensp;|&ensp;{{article.first_pub | format}}
			</div>
			<div class="author">
				<img @click="view(article.athor.id)" v-if="article.author.face" :src="article.author.face" alt="">
				<img @click="view(article.athor.id)" v-else :src="imgsrc">
				<a @click="view(article.athor.id)" class="name">{{article.author.nickname}}</a>
			</div>
		</div>
		<div class="main">
			{{article.content}}
		</div>	
		<div class="comment">
			<commentview v-for="comment in comment" :key="comment.id" :comment="comment" :id="comment.id"
					class="comment">
				</commentview>
		</div>
				
	</div>
</template>

<script>
	import {
		getonearticle,
		getcomment
	} from '../api/api.js'
	import commentview from '../components/commentview.vue'
	export default {
		name: 'articleview',
		components: {
			commentview
		},
		data() {
			return {
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
			this.getcomment(this.$route.params.id)
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
			getcomment(id) {
				getcomment(id).then(resp => {
					if (resp.data.code == 200) {
						this.comment = resp.data.data.filter(item => item.level == 1);
						console.log(this.comment)
					} else {
						this.$message.warning(resp.data.message)
					}

				})
			},
			publishComment() {

			},
			view(id) {
				this.$router.push(`/userinfo/${id}`)
			}
		}
	}
</script>

<style scoped="scoped">
	.articleview {
		margin-left: 200px;
		margin-top: 20px;
		margin-right: 30px;
		max-width: 1300px;
		min-width: 400px;
		min-height: 700px;
		background: rgba(252, 252, 252, 0.8);
		border-radius: 5px;
	}

	.top {
		width: 100%;
		color: #ffffff;
		height: 250px;
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
		margin-top: 10px;
		font-size: 13px;
	}

	.author {
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-top: 10px;
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
</style>
