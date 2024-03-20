<template>
  <v-container fluid>

    <v-card-title mb-4>
      <v-toolbar dense color="tertiary" class="caption">
        <GlobalBreadCrumb />
      </v-toolbar>
    </v-card-title>

    <v-card-text>
      <!-- Opciones del tab -->
      <v-tabs left background-color="backgroundTab" v-model="tab">
        <v-tab v-for="item in actions" :key="item.nameTab">{{item.nameTab}}</v-tab>
      </v-tabs>
      <!-- Fin de las opciones del tab -->

      <!-- Contenido de los tabs -->
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in actions" :key="item.nameTab">
          <div class="mt-3 pt-3 pb-8 mx-0 px-0 backgroundCard">
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
        id: 0,
        name: "Reporte de Notificaciones Complemento Económico",
        tab: 0,
        criterios: ["start_date", "end_date"],
        method:"post",
        service: "/notification/report_notifications",
        type: "xls",
        permissions: "download-report-notification",
        name_download:"ReporteCE"
      },
      {
        id: 1,
        name: "Reporte de Notificaciones",
        tab: 0,
        criterios: ["start_date", "end_date", "type_report"],
        method:"post",
        service: "/notification/report",
        type: "xls",
        permissions: "download-report-notification",
        name_download:"ReporteNotificaciones"
      },
      {
        id: 2,
        name: "Reporte de certificación",
        tab: 1,
        criterios: ["start_date", "end_date"],
        method:"post",
        service: "/contribution/get_report_certificate",
        type: "xls",
        permissions: "download-certifications",
        name_download:"ReporteCertificaciones",
      },
      {
        id: 3,
        name: "Reporte de información sobre Afiliados y Cónyuges",
        tab: 2,
        criterios: [],
        method:"post",
        service: "/report/report_affiliates_spouses",
        type: "xls",
        permissions: "a",
        name_download:"Reporte_Afiliados_Conyuges"
      },
      {
        id: 4,
        name: "Reporte de Clasificadores de Fondo de Retiro",
        tab: 2,
        criterios: ["start_date", "end_date"],
        method:"post",
        service: "/report/report_retirement_funds",
        type: "xls",
        permissions: "a",
        name_download:"ReporteClasificadoresFR"
      },
      {
        id: 5,
        name: "Reporte de Pagos y Derechohabientes de Fondo de Retiro",
        tab: 2,
        criterios: ["start_date", "end_date"],
        method:"post",
        service: "/report/report_payments_beneficiaries",
        type: "xls",
        permissions: "a",
        name_download:"ReportePagosDerechohabientesFR"
      },
      {
        id: 6,
        name: "Reporte de calificacion de servicios",
        tab: 2,
        criterios: ["start_date", "end_date"],
        method:"post",
        service: "/admin/get_qualification_report",
        type: "xls",
        permissions: "service-calification",
        name_download:"Reporte_calificacion_de_servicios"
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
            this.type_notifications.unshift({ id: 3, name: "Todos" })
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
              await this.$axios[this.report_selected.method](
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
                  link.setAttribute("download", this.report_selected.name_download + ".xls")
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
      let reports_items_others = []
      if(this.permissionSimpleSelected.includes("download-certifications")) {
        reports_items_certification = this.reports_items.filter((item) => item.permissions == 'download-certifications')
      }
      console.log(this.permissionSimpleSelected)
      if(this.permissionSimpleSelected.includes("download-report-notification")) {
        reports_items_notification = this.reports_items.filter((item) => item.permissions == 'download-report-notification')
      }
      if(this.reports_items.filter((item) => item.permissions == 'sin-permiso')) {
        reports_items_others = this.reports_items.filter((item) => item.permissions == 'sin-permiso')
        console.log(reports_items_others)
      }
      reports_items = reports_items_others.concat(reports_items_certification.concat(reports_items_notification))
      reports_items = reports_items.filter((item) => item.tab == this.tab)
      return reports_items
    }
  }
};
</script>
