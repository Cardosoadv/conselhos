<template>
<html>

<header-view/>
<body class="layout-fixed sidebar-expand-lg bg-body-tertiary"><!--begin::App Wrapper-->
    <div class="app-wrapper"><!--begin::Header-->
      <navbar-view/>
      <sidebar-view/>
      <content-view/>
    </div>  
  <footer-view/>
</body>  

</html>

</template>

<script>
import ContentView from '../components/template/ContentView.vue'
import HeaderView from '../components/template/HeaderView.vue'
import NavbarView from '../components/template/NavbarView.vue'
import SidebarView from '../components/template/SidebarView.vue'
import FooterView from '../components/template/FooterView.vue'

const SELECTOR_SIDEBAR_WRAPPER = ".sidebar-wrapper";
        const Default = {
            scrollbarTheme: "os-theme-light",
            scrollbarAutoHide: "leave",
            scrollbarClickScroll: true,
        };
        document.addEventListener("DOMContentLoaded", function () {
            const sidebarWrapper = document.querySelector(SELECTOR_SIDEBAR_WRAPPER);
            if (
                sidebarWrapper &&
                typeof OverlayScrollbarsGlobal?.OverlayScrollbars !== "undefined"
            ) {
                OverlayScrollbarsGlobal.OverlayScrollbars(sidebarWrapper, {
                    scrollbars: {
                        theme: Default.scrollbarTheme,
                        autoHide: Default.scrollbarAutoHide,
                        clickScroll: Default.scrollbarClickScroll,
                    },
                });
            }
        });

        const connectedSortables =
            document.querySelectorAll(".connectedSortable");
        connectedSortables.forEach((connectedSortable) => {
            let sortable = new Sortable(connectedSortable, {
                group: "shared",
                handle: ".card-header",
            });
        });

        const cardHeaders = document.querySelectorAll(
            ".connectedSortable .card-header",
        );
        cardHeaders.forEach((cardHeader) => {
            cardHeader.style.cursor = "move";
        });



export default {
  components: { HeaderView,NavbarView,ContentView,SidebarView,FooterView },

}
</script>

<style>

</style>