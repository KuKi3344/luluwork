<template>
	<div class="index">
		<div>
			<img src="https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2058086203,2012000159&fm=26&gp=0.jpg"
				class="img">
		</div>
		<homehead  class="homeheader"></homehead>
		<div style="margin-left: 200px;margin-right: 30px;">
			<router-view></router-view>
		</div>
		
	</div>
</template>

<script>
	import homehead from '../components/Header.vue'
	// @ is an alias to /src

	export default {
		name: 'Index',
		components: {
			homehead
		},
		data() {
			return {
				
			}
		},
		methods:{
		
		}
	}
</script>
<style scoped="scoped">
	.homeheader {
		height: 100%;
		max-width: 300px;
		width: auto;
		min-width: 80px;
	}
	
	.img {
		z-index: -1;
		opacity: 0.25;
		position: fixed;
		width: 100%;
		height:100%;
		filter: blur(15px);
	}
	
</style>
