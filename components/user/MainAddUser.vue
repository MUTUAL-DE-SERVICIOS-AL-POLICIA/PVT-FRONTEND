<template>
  <v-container fluid>
    <v-card flat>
      <v-card-title>
        <v-toolbar dense color="tertiary" class="caption">
          <v-row>
            <v-col cols="12" class="pa-0">
              Accesos / Usuarios
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-icon>mdi-arrow-right-bold-box</v-icon>
              Nuevo usuario
            </v-col>
          </v-row>
          <v-tooltip top >
            <template v-slot:activator="{ on }">
              <v-btn
                dark
                color="info"
                v-on="on"
                absolute
                right
                @click="synchronizeUsers(true)"
              >
                <v-icon>mdi-sync</v-icon> Sincronizar
              </v-btn>
            </template>
            <span class="caption">Sincronizar usuarios</span>
          </v-tooltip>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-card flat>
          <v-card-text>
            <v-row>
              <v-col>
                <v-autocomplete
                  :loading="loading"
                  dense
                  filled
                  outlined
                  shaped
                  label="Seleccione usuario"
                  v-model="data_user"
                  :items="new_users_ldap"
                  :item-text="fullname"
                  :item-value="obj_user"
              ></v-autocomplete>
                <v-select
                  dense
                  :items="cities"
                  item-text="name"
                  item-value="id"
                  label="Seleccione departamento"
                  v-model="city_id"
                  close-on-click
                >
                </v-select>
                <v-btn
                  color="success"
                  :disabled="!(Object.entries(data_user).length !== 0 && city_id != 0)"
                  @click="saveUser()"
                >
                  Adicionar usuario
                </v-btn>
              </v-col>
            </v-row>
            <template v-if="selectedUser != 0">
              <v-card
                elevation="2"
                outlined
                class="my-2 pa-2 text-uppercase"
                color="secondary"
                dark>
                <strong>Nombre:</strong> {{user.first_name +' '+user.last_name}} <br>
                <strong>Cargo:</strong> {{user.position}} <br>
                <strong>Usuario:</strong> {{user.username}}
              </v-card>
              <v-card
                elevation="2"
                outlined
                class="ma-2 pa-2">
                <Role :user.sync="selectedUser"/>
              </v-card>
            </template>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import GlobalBreadCrumb from "@/components/common/GlobalBreadCrumb.vue";
import Role from '@/components/user/Role'
export default {
  name: "user-MainUsers",
  components: {
    GlobalBreadCrumb,
    Role
  },
  props: {},
  data: () => ({
    loading: false,
    selectedUser: 0,
    new_users_ldap: [],
    data_user: {},
    cities: [],
    city_id: 0
  }),
  mounted(){
    this.getCities()
    this.hide_synchronize_users= false
    this.synchronizeUsers(false)
  },

  computed: {
    fullname() {
      return (user) => {
        return user.first_name + ' ' + user.last_name;
      }
    },
    obj_user() {
      return (user) => {
        return user
      }
    },
  },
  methods: {
    async synchronizeUsers(value){
      try {
        this.loading = true
        let res = await this.$axios.get(`/admin/sync_employees`)
        this.new_users_ldap = res.payload.new_users_ldap
        if(value){
          this.$toast.info('Se encontraron ' +  this.new_users_ldap.length +' nuevos usuarios')
        }
      } catch (e) {
        console.log(e)
        this.$toast.error('Ocurrio un error durante la sincronización.')
      } finally {
        this.loading = false
      }
    },
    async getCities() {
      try {
        let res = await this.$axios.get(`/global/city`)
        this.cities = res
        console.log(this.cities)
      } catch (e) {
        console.log(e)
      }
    },
    // FIXME ruta para actualizar ci de usuarios, BORRAR DESPUES DE PONER EM PRODUCCION
    async ruta() {
      try {
        let res = await this.$axios.get(`/admin/update_users_ci`)
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    async saveUser() {
      try {
        this.loading = true
        let res = await this.$axios.post(`/admin/user`,{
          username: this.data_user.username,
          first_name: this.data_user.first_name,
          last_name: this.data_user.last_name,
          identity_card: this.data_user.identity_card,
          position: this.data_user.position,
          phone: this.data_user.phone,
          city_id: this.city_id
        })
        this.user = res.payload.user
        this.selectedUser = this.user.id
        this.$toast.success('Se guardo el usuario correctamente.')
        this.synchronizeUsers(false)
        this.clearInputs()
      } catch (e) {
        console.log(e)
        this.$toast.error(e.errors.city_id || e.errors.first_name || e.errors.last_name || e.errors.username  )
      } finally {
        this.loading = false
      }
    },
    clearInputs() {
      this.data_user = {}
      this.city_id = 0
    }
  }

};
</script>
