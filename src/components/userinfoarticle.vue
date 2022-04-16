<template>
	<div class="article">
		<div class="main">
			<el-empty description="暂无文章" v-if="!articles.length>0"></el-empty>
			<articleitem v-for="article in articles" v-bind="article" :key="article.id"
				style="flex:1;margin-bottom: 10px;z-index: 99;">
			</articleitem>
		</div>
		<div style="width: 100%;display: flex;justify-content: center;margin-top: 20px;margin-bottom: 20px;">
			<el-pagination background layout="prev, pager, next" :page-count="pagesum" :current-page.sync="pager"
				@current-change="handleCurrentChange">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import{  getsomeonearticle,getnopub} from '../api/api.js'
	import articleitem from './articleitem.vue'
	export default {
		name: 'articlepage',
		components:{
			articleitem
		},
		props:{
			ispub:String
		},
		data() {
			return {
				pagesum: 1,
				pager: 1,
				cureentarticle: '',
				articles:''
			}
		},
		watch:{
			ispub(){
				this.articles = [];
				this.pager = 1;
				if(this.ispub === '发布'){
					this.getarticle();
				}else{
					this.getnopub();
				}
			}
		},
		created() {
			if(this.ispub === '发布'){
				this.getarticle();
			}else{
				this.getnopub();
			}
			
		},
		methods: {
			getcurrentarticle() {
				let pager = this.pager;
				this.cureentarticle = this.articles.filter(function(value, index) {
					return (index >= (pager - 1) * 12 && index < pager * 12)
				})
			},
			handleCurrentChange(val) {
				this.pager = val;
				this.getcurrentarticle();
			},
			getarticle() {
					getsomeonearticle(this.$route.params.id).then(resp=>{
					if(resp.data.code == 200){
						this.articles = resp.data.data;
						this.pagesum = Math.ceil(this.articles.length / 12);
						this.getcurrentarticle();
					}else{
						this.$message.warning('获取文章失败，请稍后再试');
					}
				})		
			},
			getnopub() {
					getnopub().then(resp=>{
					if(resp.data.code == 200){
						this.articles = resp.data.data;
						this.pagesum = Math.ceil(this.articles.length / 12);
						this.getcurrentarticle();
					}else{
						this.$message.warning('获取草稿失败，请稍后再试');
					}
				})		
			}
		}
	}
</script>

<style scoped="scoped">
	.article {
		width: 100%;
		min-height: 300px;
		width: 100%;
		margin-top: 20px;
		border-radius: 10px;
		z-index: 0;

	}
	.main{
		display: flex;
		justify-content: space-around;
		align-items: flex-start;
		flex-wrap: wrap;
	}
	
</style>
