<template>
	<div id="app">
		<router-view />
	</div>
</template>

<style>
	* {
		padding: 0;
		margin: 0;
	}

	::-webkit-scrollbar {
		width: 10px;
		height: 10px;
		background-color: #ffffff;
	}

	::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 6px rgba(61, 61, 61, 0.2);
		border-radius: 10px;
		background-color: #ffffff;
	}

	::-webkit-scrollbar-thumb {
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 6px rgba(59, 59, 59, 0.2);
		background-color: #dddddd;
	}
</style>
