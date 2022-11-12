<template>
  <v-container fluid>
    <v-card-title mb-4>
      <v-toolbar dense color="tertiary" class="caption">
        <GlobalBreadCrumb />
      </v-toolbar>
    </v-card-title>
    <v-card-text>
      <!--  background-color="notificationCard" -->
      
      <v-tabs left background-color="notificationCard">
        <v-tab  :href="`#tab-1`" > Notificación App </v-tab>
        <v-tab  :href="`#tab-2`" > SMS's </v-tab>

        <v-tab-item  :value="'tab-1'">
          <v-card flat tile>
            <v-card-text>
              <NotificationApp />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item :value="'tab-2'">
          <v-card flat tile>
            <v-card-text>
              <MainNotificationSimple />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
      
    </v-card-text>

  </v-container>
</template>

<script>
import GlobalBreadCrumb from "@/components/common/GlobalBreadCrumb.vue";
import NotificationApp from "@/components/notification/NotificationApp.vue";
import MainNotificationSimple from "@/components/notification/MainNotificationSimple.vue";

export default {
  name: "MainNotification2",
  components: {
    GlobalBreadCrumb,
    NotificationApp,
    MainNotificationSimple,
  },
  props: {},
};
</script>
<style scoped>

</style>
