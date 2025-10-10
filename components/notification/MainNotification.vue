<template>
  <v-container fluid>
    <v-card-title mb-4>
      <v-toolbar dense color="tertiary" class="caption">
        <GlobalBreadCrumb />
      </v-toolbar>
    </v-card-title>
    <v-card-text>
      <v-tabs left background-color="backgroundTab">
        <v-tab v-for="tab in visibleTabs" :key="tab.id" :href="`#${tab.id}`">
          {{ tab.label }}
        </v-tab>
        <v-tab-item v-for="tab in visibleTabs" :key="tab.id" :value="tab.id">
          <v-card flat tile>
            <v-card-text>
              <component :is="tab.component" v-if="tab.component" />
              <p v-else>Error al cargar el componente.</p>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card-text>
  </v-container>
</template>

<script>
import GlobalBreadCrumb from "@/components/common/GlobalBreadCrumb";
import NotificationApp from "@/components/notification/NotificationApp";
import NotificationMassive from "@/components/notification/NotificationMassive";
import NotificationSMS from "@/components/notification/NotificationSMS";

export default {
  name: "MainNotification",
  components: {
    GlobalBreadCrumb,
    NotificationApp,
    NotificationMassive,
    NotificationSMS,
  },
  data() {
    return {
      tabs: [
        {
          id: "tab-1",
          label: "Notificación CE",
          component: "NotificationApp",
          permission: "send-notification-ce",
        },
        {
          id: "tab-2",
          label: "Notificación App",
          component: "NotificationMassive",
          permission: "send-notification-app",
        },
        {
          id: "tab-3",
          label: "SMS's",
          component: "NotificationSMS",
          permission: "send-notification-sms",
        },
      ],
    };
  },
  computed: {
    visibleTabs() {
      return this.tabs.filter(
        (tab) =>
          !tab.permission || this.permissionSimpleSelected.includes(tab.permission)
      );
    },
    permissionSimpleSelected() {
      return this.$store.getters.permissionSimpleSelected;
    },
  },
};
</script>

<style scoped>
.v-tabs {
  border-bottom: 1px solid #ddd;
}

.v-tab {
  font-weight: bold;
  text-transform: uppercase;
}

.v-card {
  background-color: #f5f5f5;
}
</style>
