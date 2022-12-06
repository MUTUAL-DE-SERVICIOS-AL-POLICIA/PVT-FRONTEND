<template>
  <v-container fluid>
    <v-card-title mb-4>
      <v-toolbar dense color="tertiary" class="caption">
        <GlobalBreadCrumb />
      </v-toolbar>
    </v-card-title>
    <v-card-text>
      <div class="mt-2 pb-8 mx-0 px-0 backgroundCard">
        <v-row>
          <v-col cols="12" md="3">
            <v-card class="mx-5 px-5 py-6 elevation-0">
              <v-select 
                v-model="type"
                :items="type_notifications"
                item-text="name" 
                item-value="id" 
                label="Tipo Notificación" 
                outlined dense>
              </v-select>
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="start_date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="start_date"
                    label="Fecha fin"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="start_date"
                  min="2013-01-01"
                  :max="current_date"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(start_date)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
              <v-menu
                ref="menu2"
                v-model="menu2"
                :close-on-content-click="false"
                :return-value.sync="end_date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="end_date"
                    label="Fecha fin"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="end_date"
                  min="2013-01-01"
                  :max="current_date"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu2 = false">
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu2.save(end_date)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
              <v-btn color="primary" @click="downloadReport()"  :loading="loading">Descargar reporte </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-container>
</template>

<script>
import GlobalBreadCrumb from "@/components/common/GlobalBreadCrumb.vue";

export default {
  name: "ReportNotification",
  components: {
    GlobalBreadCrumb,
  },

  data: () => ({
    start_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    end_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    menu2: false,
    current_date: null,
    type_notifications: null,
    type: null,
    loading: false,
  }),
  mounted() {
    this.getTypeNotification()
    this.current_date = this.formater()
  },
  methods: {
    async getTypeNotification() {
        try {
            let response = await this.$axios.get(
                "/notification/get_type_notification",
                undefined
            )
            this.type_notifications = response.type_notifications
            this.type_notifications.unshift({ id: 0, name: "Todos" })            
        } catch(e) {
            console.log(e)
        }
    },
    async downloadReport() {
        try {            
            this.loading = true
            let response = await this.$axios.post(
                "/notification/report",
                {
                    type: this.type,
                    start_date: this.start_date,
                    end_date: this.end_date,
                },
                {'Accept': 'application/vnd.ms-excel'},
                {'responseType': 'blob'}
            )            
            const url = window.URL.createObjectURL(new Blob([response]))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", "notifications" + ".xlsx")
            document.body.appendChild(link)
            link.click()
            this.loading = false
        } catch(e) {
            console.log(e)
            this.loading = false
        }
    },
    formater() {
      let current_date = new Date();
      let month = current_date.getMonth() + 1;
      let day = current_date.getDate();
      let year = current_date.getFullYear();
      
      if(day < 10) {
        day = '0' + day + '';
      }
      let date = year + "-" + month + "-" + day;
      return date;
    },
  },
};
</script>
