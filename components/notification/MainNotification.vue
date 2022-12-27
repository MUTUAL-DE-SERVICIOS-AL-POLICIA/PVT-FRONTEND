<template>
  <v-container fluid>
    <v-card-title mb-4>
      <v-toolbar dense color="tertiary" class="caption">
        <GlobalBreadCrumb />
      </v-toolbar>
    </v-card-title>
    <v-card-text>      
      
      <v-tabs left background-color="backgroundTab">
        <v-tab  :href="`#tab-1`" > Notificación CE </v-tab>
        <v-tab  :href="`#tab-2`" > Notificación App</v-tab>
        <v-tab  :href="`#tab-3`" > SMS's </v-tab>

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
              <NotificationMassive />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item :value="'tab-3'">
          <v-card flat tile>
            <v-card-text>
              <NotificationSMS />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
      
    </v-card-text>

  </v-container>
</template>

<script>
import GlobalBreadCrumb from "@/components/common/GlobalBreadCrumb"
import NotificationApp from "@/components/notification/NotificationApp"
import NotificationMassive from "@/components/notification/NotificationMassive"
import NotificationSMS from "@/components/notification/NotificationSMS"

export default {
  name: "MainNotification",
  components: {
    GlobalBreadCrumb,
    NotificationApp,
    NotificationMassive,
    NotificationSMS,
  },
  props: {},
};
</script>
<style scoped>

</style>
