<script setup>
import navbarView from '../components/navbarView.vue'
import sidebarView from '../components/sidebarView.vue'
import loginView from '../components/forms/loginView.vue'
import footerView from '../components/footerView.vue'

</script>

<template>
     <div class="app-wrapper"><!--begin::Header-->
      <navbarView />

      <sidebarView />

      <loginView/>

      <footerView />
    </div>

</template>