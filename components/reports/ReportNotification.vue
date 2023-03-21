<template>
  <v-container fluid>

    <v-card-title mb-4>
      <v-toolbar dense color="tertiary" class="caption">
        <GlobalBreadCrumb />
      </v-toolbar>
    </v-card-title>

    <v-card-text>
      <!-- Opciones del tab -->
      <v-tabs dark active-class="secondary" v-model="tab">
        <v-tab v-for="item in actions" :key="item.nameTab">{{item.nameTab}}</v-tab>
      </v-tabs>
      <!-- Fin de las opciones del tab -->

      <!-- Contenido de los tabs -->
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in actions" :key="item.nameTab">
          <div class="mt-2 pb-8 mx-0 px-0 backgroundCard">
            <v-row>
              <v-col cols="6" md="6" lg="4">
                <v-card class="mx-5 px-5 py-6 elevation-0">

                  <!-- Sub título  -->
                  <v-toolbar-title>
                    <b>Seleccione un reporte</b>
                  </v-toolbar-title>
                  <v-progress-linear class="mb-5"></v-progress-linear>
                  <!-- Fin subtitulo -->

                  <!-- Sección del select -->
                  <v-select
                    v-model="report_selected"
                    :items="computedReportsItems"
                    item-text="name"
                    return-object
                    label="Seleccione un reporte"
                    outlined dense>
                  </v-select>

                  <template v-if="report_selected && visible == true">
                    <template v-if="report_selected.criterios.includes('start_date') ||
                                    report_selected.criterios.includes('end_date') ||
                                    report_selected.criterios.includes('type_report')">
                      <v-toolbar-title>
                        <b>Criterios de búsqueda</b>
                      </v-toolbar-title>
                      <v-progress-linear class="mb-5"></v-progress-linear>
                    </template>

                    <template v-if="report_selected.criterios.includes('type_report')">
                      <v-select
                        v-model="report_inputs.type_report"
                        :items="type_notifications"
                        item-text="name"
                        item-value="id"
                        label="Seleccione el tipo de reporte"
                        outlined dense>
                      </v-select>
                    </template>

                    <template v-if="report_selected.criterios.includes('start_date')">
                      <v-text-field
                        dense
                        v-model="report_inputs.start_date"
                        label="Desde fecha"
                        hint="Día/Mes/Año"
                        type="date"
                        outlined
                      >
                      </v-text-field>
                    </template>

                    <template v-if="report_selected.criterios.includes('end_date')">
                      <v-text-field
                        dense
                        v-model="report_inputs.end_date"
                        label="Hasta fecha"
                        hint="Día/Mes/Año"
                        type="date"
                        :min="report_inputs.start_date"
                        outlined
                      >
                      </v-text-field>
                    </template>

                    <!-- Botón de descarga -->
                    <v-btn color="primary" @click="downloadReport()"  :loading="loading">Descargar reporte </v-btn>
                    <!-- Fin de botón de descarga -->
                  </template>

                </v-card>
              </v-col>
            </v-row>
          </div>

        </v-tab-item>
      </v-tabs-items>
    </v-card-text>

  </v-container>
</template>

<script>
import GlobalBreadCrumb from "@/components/common/GlobalBreadCrumb.vue";
import CellBalance from "@/components/notification/CellBalance"

export default {
  name: "ReportNotification",
  components: {
    GlobalBreadCrumb,
    CellBalance
  },
  data: () => ({
    menu: false,
    menu2: false,
    current_date: null,
    type_notifications: null,
    loading: false,
    actions: [
      {nameTab: "Reportes de Notificaciones", value: "notificaciones"},
      {nameTab: "Reportes de certificaciones", value: "certificaciones"},
      {nameTab: "Otros Reportes", value: "otros"},
    ],
    tab: null,
    reports_items: [],
    report_selected: null,
    visible: false,
    report_inputs: {
      type_report: null,
      start_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
      end_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    }
  }),
  created() {
    this.reports_items = [
      {
        id: 1,
        name: "Reporte de Notificaciones",
        tab: 0,
        criterios: ["start_date", "end_date", "type_report"],
        service: "/notification/report",
        type: "xls",
        permissions: "download-report-notification",
      },
      {
        id: 2,
        name: "Reporte de certificación",
        tab: 1,
        criterios: ["start_date", "end_date"],
        service: "/contribution/get_report_certificate",
        type: "xls",
        permissions: "download-certifications",
      }
    ]
  },
  mounted() {
    this.getTypeNotification()
    this.current_date = this.formater()
  },
  watch: {
    tab: function(newVal, oldVal) {
      if(newVal != oldVal) {
        this.visible = false
        this.clearInputs()
      } else {
        this.visible = true
      }
    },
    report_selected: {
      deep: true,
      handler(val) {
        this.visible = true
      }
    }
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
        if(this.report_selected) { // se seleccionó un reporte?
          let checker = true;
          if(this.report_selected.type == 'xls') { // es de tipo xls
            for(const val of this.report_selected.criterios) {
              let response = this.report_inputs[val]
              if(response == null) {
                checker = false
                break ;
              }
            }
            if(checker) {
              this.loading = true
              await this.$axios.post(
                  this.report_selected.service,
                  {
                      type: this.report_inputs.type_report,
                      start_date: this.report_inputs.start_date,
                      end_date: this.report_inputs.end_date,
                  },
                  {'Accept': 'application/vnd.ms-excel'},
                  {'responseType': 'blob'}
              )
              .then((response) => {
                if(response.status = 200) {
                  const url = window.URL.createObjectURL(new Blob([response])) 
                  const link = document.createElement("a")
                  link.href = url
                  link.setAttribute("download", "notifications" + ".xlsx")
                  document.body.appendChild(link)
                  link.click()
                  this.loading = false
                }
              })
              .catch((e) => {
                this.loading = false;
                this.$toast.error("Hubo un error")
              })
            } else {
              this.loading = false
              this.$toast.error("Falta seleccionar criterios")
            }
          }
        } else {
          this.loading = false
          this.$toast.error("Seleccione un reporte")
        }
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
    clearInputs() {
      this.report_selected = null
      this.report_inputs.start_date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10)
      this.report_inputs.end_date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10)
      this.report_inputs.type_report = null
    }
  },
  computed: {
    permissionSimpleSelected() {
      return this.$store.getters.permissionSimpleSelected
    },
    computedReportsItems() {
      let reports_items = []
      let reports_items_notification = []
      let reports_items_certification = []
      if(this.permissionSimpleSelected.includes("download-certifications")) {
        reports_items_certification = this.reports_items.filter((item) => item.permissions == 'download-certifications')
      }
      console.log(this.permissionSimpleSelected)
      if(this.permissionSimpleSelected.includes("download-report-notification")) {
        reports_items_notification = this.reports_items.filter((item) => item.permissions == 'download-report-notification')
      }
      reports_items = reports_items_certification.concat(reports_items_notification)
      reports_items = reports_items.filter((item) => item.tab == this.tab)
      return reports_items
    }
  }
};
</script>
