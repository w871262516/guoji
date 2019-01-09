<template>
	<von-header theme="light" v-show="headerShow">
	  <!-- <button class="button button-icon ion-ios-arrow-back"v-if="goback"></button> -->
		<ion-icon name="arrow-back"  slot="left"  v-if="goback"></ion-icon>
	  <span slot="title">
	  </span>
	  <button class="button button-icon ion-navicon" slot="right"></button>
	</von-header>
</template>

<script>
	export default{
		name:'headTop',
		props:['goback','headerShow']
	}
</script>

<style>
  h2 {
    font-family: Candara,Calibri,Segoe,Segoe UI,Optima,Arial,sans-serif;
    color: #888;
  }

  .page.has-navbar .page-content {
    /* padding-top: 100px; */
  }
</style>