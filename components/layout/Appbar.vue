<template>
  <v-app-bar
    app
    fixed
    dense
    flat
    clipped-left
    dark
    :color="bar.color"
  >
    <template v-if="currentRole">
      <v-app-bar-nav-icon @click.stop="$emit('update:expanded', !expanded)"></v-app-bar-nav-icon>
    </template>
    <v-toolbar-title>{{ bar.text }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <div width="300px">

      <span class="text-caption font-weight-bold">{{ currentRole ? currentRole.display_name : '' }}</span>
        <v-btn
          fab
          dark
          x-small
          v-if="currentRole!=null"
          color="white"
          outlined
          class="mx-3"
          @click="$router.push('/PageChangeModuleRol')"
        >
          <v-icon>mdi-keyboard-return</v-icon>
        </v-btn>
    </div>
    <LoggedUser/>
    {{$store.getters.user.username}}
  </v-app-bar>
</template>


<script>
import LoggedUser from '@/components/layout/LoggedUser'
export default {
  name:'appbar',
  components: {
    LoggedUser
  },
  props: {
    expanded: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      rolesPermissionsItems: [],
    }
  },
  async created() {
    //this.currentRole = this.$store.getters.currentRole
    //await this.getRolePermissions()
  },
  //TODO: se comento, intentar recuperar funcionalidad
  /*watch: {
    'currentRole.display_name'(val) {
      this.$store.commit('setRolePermissionSelected', this.currentRole)
    }
  },*/
  computed:{
    currentRole(){
      return this.$store.getters.currentRole
    },
    bar() {
      if (process.env.NODE_ENV != 'production') {
        return {
          color: `error`,
          text: `SEGUIMIENTO DE TRAMITES INTEGRAL (VERSIÓN DE PRUEBA)`
        }
      } else {
        return {
          color: `primary`,
          text: `SEGUIMIENTO DE TRAMITES INTEGRAL`
        }
      }
    },
  },
}
    
</script>
