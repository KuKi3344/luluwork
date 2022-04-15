<template>
	<div class="articleitem">
		<el-card>
			<div class="me-article-header">

				<a @click="view(id)" class="me-article-title"><i class="el-icon-document"
						:style="randomRgb()"></i>{{title}}</a>
			</div>

			<div class="me-artile-description" @click="view(id)">
				{{summary}}
			</div>
			<div class="intro">
				<div class="me-article-author">
					<div class="me-icon-author">&nbsp;{{author.nickname}}</div>
				</div>

			</div>

			<div class="foot">
				<span class="category">
					<el-tag size="small">{{category.name}}</el-tag>
				</span>
				<div class="me-pull-right me-article-count">
					<i class="el-icon-time"></i>&nbsp;{{first_pub | format}}
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
	export default {
		name: 'articleitem',
		props: {
			id: Number,
			title: String,
			summary: String,
			author: Object,
			category: Object,
			first_pub: String
		},
		data() {
			return {

			}
		},
		methods: {
			view(id) {
				this.$router.push(`/article/${id}`)
			},
			randomRgb() {
				var str = ['#70af7e', '#50b3b3', '#30c59b', '#66acd8', '#e18283', '#f5a379', '#3dd2e2', '#82c77b',
					'#d6c06e'
				];
				let t = str[Math.floor(Math.random() * str.length)];
				return {
					color: `${t} !important`,
				};
			},
		}
	}
</script>

<style scoped="scoped">
	body {
		font-size: 20px;
	}

	.articleitem {
		display: flex;
		justify-content: center;
		margin-right: 5px;
	}

	.el-card {
		flex: 1;
		min-width: 300px;
		max-width: 450px;
		max-height: 350px;
		min-height: 150px;
		margin: 10px 10px;
		margin-bottom: 5px;
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		flex-wrap: wrap;
		border-radius: 10px;
		background-color: rgba(255, 255, 255, 0.5);
		box-shadow: 0 5px 10px rgba(212, 212, 212, 0.5) !important;
	}

	.el-icon-document {
		margin-right: 5px;
	}

	.me-article-title {
		font-weight: 600;
		font-size: 15px;
		margin-right: 10px;
	}

	.me-article-header a:hover {
		color: #5c9f74 !important;
	}

	.me-artile-description {
		min-height: 50px;
		font-size: 13px;
		margin-top: 10px;
		max-height: 80px;
		overflow: hidden;
	}

	.me-article-count {
		color: #909090;
		font-size: 12px;
	}

	.intro {
		display: flex;
		justify-content: space-between;
		padding-bottom: 5px;
		border-bottom: 1px solid #dedede;
		margin-top: 10px;
	}

	.foot {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.me-article-author {
		font-size: 12px;
	}

	.me-icon-author {
		color: #909090;
		text-decoration: none;
	}

	.footview {
		color: #a2a2a2;
		font-size: 0.6rem;
		margin-right: 10px;
	}

	@media screen and (max-width:520px) {
		.me-artile-description {
			min-height: 20px;
			font-size: 12px;
		}

		.me-article-title {
			font-size: 13px;
		}
	}
</style>
