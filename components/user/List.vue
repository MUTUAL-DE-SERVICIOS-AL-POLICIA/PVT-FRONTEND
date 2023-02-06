<template>
  <v-data-table
    :headers="headers"
    :items="users"
    :loading="loading"
    :options.sync="options"
    :server-items-length="totalUsers"
    multi-sort
    single-expand
    :footer-props="{
      showFirstLastPage: true,
      firstIcon: 'mdi-arrow-collapse-left',
      lastIcon: 'mdi-arrow-collapse-right',
      prevIcon: 'mdi-minus',
      nextIcon: 'mdi-plus',
      'items-per-page-text':'Filas por página',
      itemsPerPageOptions: [12, 30, 50, 100]
    }"
  >
    <template slot="body.prepend" >
      <tr>
        <td><v-text-field placeholder="Apellido." spellcheck="false" class="filter-text" v-model="searching.last_name" @keydown.enter="getUsers()"></v-text-field></td>
        <td><v-text-field placeholder="Nombre." spellcheck="false" class="filter-text" v-model="searching.first_name" @keydown.enter="getUsers()"></v-text-field></td>
        <td><v-text-field placeholder="Cargo." spellcheck="false" class="filter-text" v-model="searching.position" @keydown.enter="getUsers()"></v-text-field></td>
        <td><v-text-field placeholder="Usuario." spellcheck="false" class="filter-text" v-model="searching.username" @keydown.enter="getUsers()"></v-text-field></td>
      </tr>
      </template>
      <template v-slot:item="props" >
      <tr :class="props.isExpanded ? 'secondary white--text' : ''">
        <td @click.stop="expand(props)">{{ props.item.last_name }}</td>
        <td @click.stop="expand(props)">{{ props.item.first_name }}</td>
        <td @click.stop="expand(props)">{{ props.item.position  }}</td>
        <td @click.stop="expand(props)">{{ props.item.username  }}</td>
        <td v-if="active">
          <v-tooltip top >
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                dark
                x-small
                color="warning"
                v-on="on"
                @click.stop="switchActiveUser(props.item.id)"
              >
                <v-icon>mdi-cancel</v-icon>
              </v-btn>
            </template>
            <span class="caption">Deshabilitar</span>
          </v-tooltip>
        </td>
        <td v-else>
          <v-tooltip top >
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                dark
                x-small
                color="success"
                class="mr-2"
                v-on="on"
                @click.stop="switchActiveUser(props.item.id)"
              >
                <v-icon>mdi-sync</v-icon>
              </v-btn>
            </template>
            <span class="caption">Habilitar</span>
          </v-tooltip>
          <!--<v-tooltip top >
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                dark
                x-small
                color="error"
                v-on="on"
                @click.stop="$nuxt.$emit('openRemoveDialog', `user/${props.item.id}`)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span class="caption">Eliminar</span>
          </v-tooltip>-->
        </td>
      </tr>

    </template>
    <template v-slot:expanded-item="{ headers }">
      <tr>
        <td :colspan="headers.length" class="px-0">
          <Role :user.sync="selectedUser"/>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>

import Role from '@/components/user/Role'
export default {
  name: 'user-List',
  components: {
    Role
  },
  props: {

  },
  data: () => ({
    loading: true,
    search: '',
    active: true,
    options: {
      page: 1,
      itemsPerPage: 12,
      sortBy: ['last_name'],
      sortDesc: [false]
    },
    users: [],
    selectedUser: 0,
    totalUsers: 0,
    headers: [
      {
        text: 'Apellido',
        value: 'last_name',
        class: ['normal', 'white--text'],
        width: '15%',
        sortable: true
      }, {
        text: 'Nombre',
        value: 'first_name',
        class: ['normal', 'white--text'],
        width: '15%',
        sortable: true
      }, {
        text: 'Cargo',
        value: 'position',
        class: ['normal', 'white--text'],
        width: '50%',
        sortable: true
      }, {
        text: 'Usuario',
        value: 'username',
        class: ['normal', 'white--text'],
        width: '10%',
        sortable: true
      }, {
        text: 'Acciones',
        class: ['normal', 'white--text'],
        width: '10%',
        sortable: false
      }
    ],
    searching: {
      last_name:"",
      first_name:"",
      position:"",
      username:""
    },
    new_users_ldap: []
  }),
  watch: {
    options: function(newVal, oldVal) {
      if (newVal.page != oldVal.page || newVal.itemsPerPage != oldVal.itemsPerPage || newVal.sortBy != oldVal.sortBy || newVal.sortDesc != oldVal.sortDesc) {
        this.getUsers()
      }
    },
    search: function(newVal, oldVal) {
      if (newVal != oldVal) {
        this.options.page = 1
        this.getUsers()
      }
    },
    active: function(newVal, oldVal) {
      if (newVal != oldVal) {
        this.getUsers()
      }
    }
  },
  mounted() {
    this.$nuxt.$on('added', val => {
      this.getUsers()
    })
    this.$nuxt.$on('removed', val => {
      this.getUsers()
    })
    this.$nuxt.$on('search', val => {
      this.search = val
    })
    this.$nuxt.$on('active', val => {
      this.active = val
    })
    this.getUsers()
  },
  methods: {
    expand(props) {
      props.expand(!props.isExpanded && this.active )
      if (this.selectedUser != props.item.id) this.selectedUser = props.item.id
    },
    async switchActiveUser(id) {
      try {
        this.loading = true
        let res = await this.$axios.patch(`/admin/user/${id}`, {
          active: !this.active
        })
        this.$nuxt.$emit('removed', id)
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async getUsers() {
      try {
        this.loading = true
        let res = await this.$axios.get(`/admin/user`, undefined, {
          params: {
            page: this.options.page,
            per_page: this.options.itemsPerPage,
            sortBy: this.options.sortBy,
            sortDesc: this.options.sortDesc,
            active: this.active,
            last_name: this.searching.last_name,
            first_name: this.searching.first_name,
            position: this.searching.position,
            username: this.searching.username
          }
        })
        this.users = res.payload.users.data
        this.totalUsers = res.payload.users.total
        //delete res.data['data']
        this.options.page = res.payload.users.current_page
        this.options.itemsPerPage = parseInt(res.payload.users.per_page)
        this.options.totalItems = res.payload.users.total

      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async synchronizeUsers(){
      try {
        this.loading = true
        let res = await this.$axios.get(`/admin/sync_employees`)
        this.new_users_ldap = res.payload.new_users_ldap
        this.$toast.info('Se encontraron ' +  this.new_users_ldap.length +' nuevo usuarios')
      } catch (e) {
        console.log(e)
        this.$toast.error('Ocurrio un error durante la sincronización.')
      } finally {
        this.loading = false
      }
    },
      clearAll() {
      this.searching.last_name = "",
      this.searching.first_name = "",
      this.searching.position = "",
      this.searching.username = "",
      this.getUsers()
    },
  }
}
</script>
<style scoped>
.filter-text{
  font-size: 12px;
  height: 2px;
  margin: 0 0 40px 0;
  padding: 0;
  width: 100%

}
</style>
