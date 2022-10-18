<template>
  <v-container  >
    <v-row class="justify-center my-4">
			<strong class="grey--text text-h5">Seleccionar Rol</strong><br>
		</v-row>
    <v-row justify="center">
      <v-col cols="12" sm="12" md="12"
        v-for="(modulo, index) in rolesPermissionsItems"
        :key="index"
      >
        <div class="font-weight-medium text-uppercase">{{ modulo.display_name }}</div>
          <v-progress-linear></v-progress-linear>
          <br />
        <v-row>
          <v-col cols="12" sm="4" md="3" v-for="(rol, index) in modulo.roles" :key="index">
            <v-hover v-slot:default="{ hover }">
              <v-chip
                :class="hover ? 'elevation-4' : 'elevation-2'"
                color="secondary"
                dark
                style="width: 250px;"
                outlined
                @click="clickRole(rol)"
              >
                <v-avatar left>
                  <v-icon>mdi-account-circle</v-icon>
                </v-avatar>
                <strong>{{ rol.display_name }}</strong>
              </v-chip>
            </v-hover>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: "ChangeModuleRol",
  data() {
    return {
      rolesPermissionsItems: [],
    };
  },
  async created() {
		// al entrar a esta pagina se elimina el rolePermissionSelected del store
    this.$auth.setCurrentRole(null)
    await this.getRolePermissions()
  },
  computed: {
    modules() {
      return this.$store.state.modules;
    },
  },

  methods: {
    async getRolePermissions() {
			this.rolesPermissionsItems = this.$store.getters.modules
    },
    clickRole(item) {
			//this.$store.commit('setRolePermissionSelected', item)
      //console.log(item)
      this.$auth.setCurrentRole(item.id)
			this.$router.push("PageDashboard")
		}
  },
};
</script>