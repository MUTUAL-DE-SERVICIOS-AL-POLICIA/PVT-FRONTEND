<template>
<v-navigation-drawer
    app
    fixed
    permanent
    clipped
    :expand-on-hover="!expanded"
    class="tertiary"
  >
    <v-list
      nav
      dense
    >
      <div
        v-for="item in menuItems"
        :key="item.title"
      >
        <v-list-item
          :to="item.href"
          v-if="!item.group && checkPermission(item)"
        >
          <v-list-item-icon class="ml-0 mr-2">
            <v-icon >{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
        <v-list-group
          v-if="item.group && checkPermission(item)"
          :prepend-icon="item.icon"
          mandatory
        >
          <v-list-item slot="activator">
            <v-list-item-title style="margin-left: -31px;">{{ item.title }}</v-list-item-title>
          </v-list-item>
          <template v-for="subItem in item.group">
            <v-list-item
              class="pl-5"
              :to="subItem.href"
              :key="subItem.title"
              v-if="checkPermission(subItem)"
            >
              <v-list-item-icon class="mr-2">
                <v-icon>{{ subItem.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ subItem.title }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-list-group>
        <v-divider></v-divider>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import menuItems from '@/menu.json'
export default {
    name: 'navbar',
  props: {
    expanded: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    menuItems: menuItems
  }),
      computed: {
    //permisos del selector global por rol
      permissionSimpleSelected () {
        return this.$store.getters.permissionSimpleSelected
      }
    },
      methods: {
    checkPermission(item) {
      let hasPermission = true
        if (item.hasOwnProperty('permission'))
          hasPermission &= (item.permission == null || this.permissionSimpleSelected.includes(item.permission))
      return hasPermission
    }
  }
}
</script>
