<template>
  <v-app>
    <template v-if="isAuthenticated && currentRole">
      <Navbar :expanded.sync="expandNavbar" />
    </template>

    <template v-if="isAuthenticated">
      <Appbar :expanded.sync="expandNavbar" />
    </template>

    <v-main>
      <Nuxt />
    </v-main>

    <Footer />
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import Appbar from "@/components/layout/Appbar.vue";
import LoggedUser from "@/components/layout/LoggedUser.vue";
import Navbar from "@/components/layout/Navbar.vue";
import Footer from "@/components/layout/Footer.vue";

export default {
  name: "layout",
  components: {
    Appbar,
    LoggedUser,
    Navbar,
    Footer,
  },
  data() {
    return {
      expandNavbar: false,
    };
  },

  computed: {
    ...mapGetters(["currentRole"]),
    isAuthenticated() {
      return this.$store.state.isAuthenticated || false;
    },
  },
};
</script>
<style scoped>
.container {
  padding: 0;
}
</style>

