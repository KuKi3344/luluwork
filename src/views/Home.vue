<template>
	<div class="home">
		<div class="top">
			<div class="time">
				<span class="timeshow">{{hour}}<span id="time">:</span>{{minute}}</span>
				<div style="display: flex;justify-content: space-around;align-items: center; z-index: 999;">
					<span id="nav2">&emsp;今日气温</span>
					<div id="he-plugin-simple"></div> <!-- 天气预报接口实现 -->
				</div>

			</div>
			<div>
			</div>
		</div>
		<articlepage></articlepage>
	</div>
</template>

<script>
	import articlepage from '../components/article.vue'
	export default {
		name: 'Home',
		components: {
			articlepage
		},
		data() {
			return {
				minute: '',
				hour: '',
				article: ''
			}
		},
		created() {
			var time = new Date();
			this.minute = time.getMinutes();
			this.hour = time.getHours();
			if (this.minute < 10) {
				this.minute = '0' + this.minute;
			}
			if (this.hour < 10) {
				this.hour = '0' + this.hour;
			}
			//和风天气插件调用
			window.WIDGET = {
				"CONFIG": {
					"modules": "02",
					"background": "5",
					"tmpColor": "#ffffff",
					"tmpSize": "15",
					"aqiColor": "#ffffff",
					"aqiSize": "15",
					"weatherIconSize": "20",
					"alertIconSize": "15",
					"padding": "10px 10px 10px 10px",
					"shadow": "0",
					"language": "auto",
					"fixed": "false",
					"vertical": "center",
					"horizontal": "center",
					"key": "bb0bd610ef8e4dd0b28f6920d11d41a8"
				}
			};
			(function(d) {
				var c = d.createElement('link');
				c.rel = 'stylesheet';

				c.href = 'https://widget.heweather.net/simple/static/css/he-simple.css?v=1.4.0';
				var s = d.createElement('script');

				s.src = 'https://widget.heweather.net/simple/static/js/he-simple.js?v=1.4.0';
				var sn = d.getElementsByTagName('script')[0];
				sn.parentNode.insertBefore(c, sn);
				sn.parentNode.insertBefore(s, sn);
			})(document);

		},
	}
</script>
<style scoped="scoped">
	.home {
		margin-top: 20px;
		max-width: 1300px;
		min-width: 400px;
		min-height: 650px;
	}
	::v-deep  .view-vertical,.top{
		z-index: 999 !important;
	}
	.top {
		background-image: url(../assets/img/bk.png);

		background-repeat: no-repeat;
		background-attachment: fixed;
		background-size: cover;
		width: 100%;
		height: 200px;
	}

	.time {
		color: #fff;
		letter-spacing: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
		font-weight: 600;
	}

	.timeshow {
		font-size: 50px;
		display: block;
		height: 80px;
		line-height: 80px;
	}

	#time {
		animation: appear 0.8s alternate infinite ease-in;
	}

	#nav2 {
		color: #fff;
	}


	@keyframes appear {
		0% {
			opacity: 1;
		}

		50% {
			opacity: 0.7;
		}

		100% {
			opacity: 0;
		}
	}
</style>
