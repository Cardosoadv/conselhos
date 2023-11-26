import bootstrap
<template>
<html>

<header-view/>
<navbar-view/>
<sidebar-view/>
<content-view/>
<footer-view/>
</html>

</template>

<script>
import ContentView from '../components/template/ContentView.vue'
import HeaderView from '../components/template/HeaderView.vue'
import NavbarView from '../components/template/NavbarView.vue'
import SidebarView from '../components/template/SidebarView.vue'
import FooterView from '../components/template/FooterView.vue'
export default {
  components: { HeaderView,NavbarView,ContentView,SidebarView,FooterView },

}
</script>

<style>

</style>