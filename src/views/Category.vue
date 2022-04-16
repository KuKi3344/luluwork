<template>
	<div style="display: flex;justify-content: center;background:rgba(255, 255, 255, 0.4);margin-top:20px">
		<el-container>

			<div class="me-area">
				<ul class="me-category-list">
					<li class="choose">选择类别:</li>
					<li v-for="t in category" @click="changecategory(t.id,t.name)" :key="t.id" class="me-category-item">
						<a :style="randomRgb()">{{t.name}}</a>
					</li>

					<div style="width: 100%;">
						<el-pagination small layout="prev, pager, next" :page-count="pagesum" :current-page.sync="pager"
							@current-change="handleCurrentChange">
						</el-pagination>
					</div>
				</ul>
				<div class="addcate">
					<el-button size="medium" type="primary" @click="addview=true">新增分类</el-button>
				</div>
			</div>
			<el-main class="me-articles">

				<div class="me-category-title" v-if="currentcategory!=='全部'">
					<div class="cate-name">
						{{currentcategory}}
						<span id="alias"><b>别名:</b>{{cateintro.alias}}</span>
					</div>
					<div class="cateintro">
						<p id="cate-intro"><b>简介:</b>{{cateintro.intro}}</p>
						<a @click="view(cateintro.originator)" class="name"><b>创始人:</b>{{cateintro.nickname}}</a>
					</div>
				</div>
				<div class="me-category-title" v-else>
					<div class="cate-small-name">
						{{currentcategory}}
					</div>
				</div>
				<articlepage :category="$route.params.id"></articlepage>
			</el-main>
			<el-dialog title="分类信息" :visible.sync="addview" append-to-body top="50px" width="500px" >
				<el-form :model="addcateform" ref="addcateform" :rules="rules">
					<el-form-item label="分类名称" >
						<el-input v-model="addcateform.name"></el-input>
					</el-form-item>
					<el-form-item label="分类别名" >
						<el-input v-model="addcateform.alias"></el-input>
					</el-form-item>
					<el-form-item label="介绍">
						<el-input type="textarea" :autosize="{ minRows: 1, maxRows: 3}" placeholder="请输入内容"
							v-model="addcateform.intro">
						</el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="addview=false">取 消</el-button>
					<el-button type="primary" @click="addcategory">确 定</el-button>
				</div>
			</el-dialog>
		</el-container>
	</div>

</template>

<script>
	import {
		getallcategory,
		getcatebyid,
		addcategory
	} from '../api/api.js'
	import articlepage from '../components/article.vue'
	export default {
		name: "category",
		components: {
			articlepage
		},
		created() {
			if (this.$route.query.name) {
				this.getcatebyid();
				setTimeout(() => {
					document.title = `${this.$route.query.name} 类别 -GOOBLOG`
				}, 500)
			}
			this.listcategory();
		},
		data() {
			return {
				category: [],
				pagesum: 1,
				pager: 1,
				allcategory: [],
				cateintro: {},
				addview: false,
				addcateform: {
					name: '',
					alias: '',
					intro: ''
				},
				rules: {
					intro: [{
							required: true,
							message: '请输入简介',
							trigger: 'blur'
						},
						{
							max: 80,
							message: '不能大于80个字符',
							trigger: ['blur', 'change']
						}
					],
					name: [{
						required: true,
						message: '请输入分类名称',
						trigger: ['blur', 'change']
					}],
					alias: [{
						required: true,
						message: '请输入别名',
						trigger: ['blur', 'change']
					}]
				}
			}
		},
		watch: {
			currentcategory() {
				this.getcatebyid();
			}
		},
		computed: {
			currentcategory() {
				if (this.$route.query.name) {
					document.title = `${this.$route.query.name} 类别 -GOOBLOG`
					return this.$route.query.name;
				}
				return '全部'
			},
		},
		methods: {
			view(id) {
				this.$router.push(`/userinfo/${id}`)
			},
			randomRgb() {
				var str = ['#7eb497', '#2fbe96', '#60a1cc', '#e18384', '#e39770', '#39bc95', '#7fa0d5', '#f0a146'];
				let t = str[Math.floor(Math.random() * str.length)];

				return {
					color: `${t} !important`,
				};
			},
			addcategory() {
				this.$refs['addcateform'].validate((valid) => {
					if (valid) {
						addcategory(this.addcateform).then(resp=>{
							if (resp.data.code == 200){
									this.$message.success('添加成功');						
									this.listcategory();
									this.addview = false;
								} 
							else {
								this.$message.error(resp.data.message)
							}
						})
					}
				})
			},
			changecategory(id) {
				this.$router.push({
					path: `/category/all/${id}`,
				})
			},
			listcategory() {
				getallcategory().then(resp => {
					if (resp.data.code == 200) {
						if (resp.data.data.length <= 0) {
							this.$message({
								showClose: true,
								message: '找不到文章种类',
								type: 'error'
							})
						} else {
							this.allcategory = resp.data.data;
							this.pagesum = Math.ceil(this.allcategory.length / 10)
							this.getcurrentcate();
						}
					} else {
						this.$message.error(resp.data.message)
					}
				})
			},
			getcatebyid() {
				getcatebyid(this.$route.params.id).then(resp => {
					if (resp.data.code == 200) {
						if (resp.data.data.length <= 0) {
							this.$message({
								showClose: true,
								message: '找不到文章种类',
								type: 'error'
							})
						} else {
							this.cateintro = resp.data.data[0];
							console.log(this.cateintro)
						}
					} else {
						this.$message.error(resp.data.message)
					}
				})
			},
			getcurrentcate() {
				let pager = this.pager;
				this.category = this.allcategory.filter(function(value, index) {
					return (index >= (pager - 1) * 10 && index < pager * 10)
				})
			},
			handleCurrentChange(val) {
				this.pager = val;
				this.getcurrentcate();
			},
		}
	}
</script>

<style scoped>
	.me-area {
		border-bottom: 1px solid #efefef;
		z-index: 0 !important;
		padding: 20px 0 10px 0;
		display: flex;
		justify-content: space-around;
	}

	.choose {
		font-size: 14px;
		color: #52816f;
		width: 80px;
		margin: 8px;
		padding: 5px;
		font-weight: 640;
	}

	.el-container {
		margin-top: 20px;
		margin-left: 10px;
		margin-right: 10px;
		justify-content: center;
		flex-direction: column;
	}

	.me-category-list {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		padding: 0;
		text-align: center;
		list-style-type: none;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 15px;
	}


	.me-category-item {
		display: inline-block;
		min-width: 30px;
		padding: 5px;
		font-size: 14px;
		font-weight: 600;
		color: #649172;
		margin: 8px 5px;
	}

	.me-order-list {
		float: right;
	}

	.me-category-title {
		margin: 20px 0;
		background: rgba(193, 209, 205, 0.8);
		font-weight: 600;
		letter-spacing: 2px;
		font-size: 14px;
		color: #3f3f3f;
		width: 100%;
		opacity: 0.9;
		text-align: center;
		height: auto;
		box-shadow: 0 3px 6px rgba(212, 212, 212, 0.8);
		border-radius: 8px;
	}

	.cate-name {
		color: #4889ba;
		font-weight: 600;
		font-size: 25px;
		padding: 10px;
		margin-left: 10px;
		margin-right: 15px;
	}

	.cate-small-name {
		color: #518ab0;
		font-weight: 600;
		font-size: 20px;
		padding: 10px;
		margin-left: 10px;
		margin-right: 15px;
	}

	#alias {
		font-weight: 400;
		font-size: 13px;
		color: #667f95;
	}

	#cate-intro {
		font-size: 13px;
		color: #393939;
		width: 100%;
		font-weight: 400;
		margin-bottom: 10px;
	}

	.cateintro .name {
		color: #2a80cb;
		font-weight: 400;
		font-size: 13px;
		margin-bottom: 10px;
		display: inline-block;
	}

	.cateintro a:hover {
		color: #349ecb;
	}

	.me-category-item a:hover {
		text-decoration: underline;
	}

	.el-button {
		border-radius: 15px;
	}

	.addcate {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 10px;
	}

	.me-articles {
		min-width: 280px;
		margin-right: 10px;
		width: 100%;
		padding: 0;
	}
</style>
