<template>
  <v-container fluid>
    <v-card flat>
      <v-card-title>
        <v-toolbar dense color="tertiary" class="caption">
          <GlobalBreadCrumb />
          <div class="flex-grow-1"></div>
          <!-- B O T Ó N   S W I T C H  -->
          <v-btn-toggle
            v-model="active"
            active-class="secondary white--text"
            mandatory
          >
          <span  v-for="item in items_import" :key="item.name">
            <v-btn
              v-if="permissionSimpleSelected.includes(item.permissions_create)"
              :value="item.name"
            > {{item.name}}</v-btn>
          </span>
          </v-btn-toggle>
          <v-divider class="mx-2" inset vertical></v-divider>

          <!-- B O T Ó N   G E S T I Ó N -->
          <v-select
            :items="years"
            :loading="loading"
            label="Gestión"
            v-model="year_selected"
            dense
            outlined
            class="select-year"
            close-on-click
          ></v-select>

          <!-- B O T Ó N   + -->
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                dark
                x-small
                :color="'success'"
                bottom
                right
                v-on="on"
                class="mx-2"
                @click="openDialog()"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <div>
              <span>Añadir Periodo</span>
            </div>
          </v-tooltip>
        </v-toolbar>
      </v-card-title>
      <v-card-text> </v-card-text>
    </v-card>
    <!--contenido-->
    <div v-if="loading_circular">
      <GlobalLoading />
    </div>

    <!-- C O N T E N I D O   D E L   B O T Ó N   S W I T C H -->
    <v-row justify="center" class="py-0 mt-2" v-if="!loading_circular">
       <v-card
        class="headline font-weight-bold ma-2"
        max-width="250px"
        v-for="(item, i) in list_months"
        :key="i"
      >
        <template v-if="item.state_importation">
          <v-card-title class="accent">
            <v-row justify="center">
              <h3 class="white--text">{{ item.period_month_name }}</h3></v-row
            >
          </v-card-title>
          <v-divider inset></v-divider>
          <v-card-text class="backgroundCard">
            <v-row>
              <v-col cols="12" md="12" class="py-0">
                <b>{{ type_import.name }} <v-icon small>mdi-home-analytics</v-icon></b>
              </v-col>
              <v-divider inset></v-divider>
              <v-col cols="12" md="12" class="py-0">
                <span class="info--text">N° reg. copiados: </span><strong>{{$filters.thousands(item.data_count.num_total_data_copy)}}</strong><br>
                <template v-if="type_import.name == 'SENASIR'">
                  <span class="info--text">N° reg. considerados: </span><strong>{{$filters.thousands(item.data_count.num_data_considered)}}</strong><br>
                  <span class="error--text">N° reg. no considerados: </span><strong>{{$filters.thousands(item.data_count.num_data_not_considered)}}</strong><br>
                  <span class="info--text">N° reg. validados: </span><strong>{{$filters.thousands(item.data_count.num_data_validated)}}</strong><br>
                </template>
                <template v-if="type_import.name == 'COMANDO'">
                  <span class="info--text">N° reg. nuevos: </span><strong>{{$filters.thousands(item.data_count.num_data_new)}}</strong><br>
                  <span class="info--text">N° reg. regulares: </span><strong>{{$filters.thousands(item.data_count.num_data_regular)}}</strong><br>
                </template>
                  <div class="text-right pb-1" v-if="permissionSimpleSelected.includes(type_import.permissions_download)">
                    <v-tooltip top class="my-0">
                      <template v-slot:activator="{ on }">
                        <v-btn
                          small
                          :color="'primary'"
                          fab
                          v-on="on"
                          :loading="loading_rep_state && i == loading_pos_index"
                          @click.stop="loading_pos_index = i; reportPayroll(item.period_month)"
                        >
                          <v-icon>mdi-file-document</v-icon>
                        </v-btn>
                      </template>
                      <div>
                        <span>Detalle de Importación de registros válidos</span>
                      </div>
                    </v-tooltip>
                  </div>
              </v-col>
            </v-row>
          </v-card-text>
        </template>
      </v-card>
    </v-row>

    <PayrollImportProcess :dialog="dialog" :type_import="type_import" :year_selected="year_selected" @open-close="openClose()"/>
    <PayrollImportProcessTranscript :dialog="dialog_transcript" :type_import="type_import" :year_selected="year_selected" @open-close-transcript="openCloseTranscript()"/>

  </v-container>
</template>

<script>
import GlobalBreadCrumb from "@/components/common/GlobalBreadCrumb.vue";
import GlobalLoading from "@/components/common/GlobalLoading.vue";
import PayrollImportProcess from "@/components/contribution/PayrollImportProcess.vue";
import PayrollImportProcessTranscript from "@/components/contribution/PayrollImportProcessTranscript.vue";
export default {
  name: "MainImportation",
  components: {
    GlobalBreadCrumb,
    GlobalLoading,
    PayrollImportProcess,
    PayrollImportProcessTranscript
  },
  data: () => ({
    active: 'COMANDO',
    years: [],
    loading: false,
    year_selected: null,
    list_months: [],
    dialog: false,
    dialog_transcript: false,
    btn_import_contributions: false,
    loading_circular:false,
    loading_pos_index: -1,
    loading_rep_state: false,
    items_import: [],
    type_import:{},
    import_type_name: {
      SENASIR: 'senasir',
      COMANDO: 'command',
      TRANSCRIPCIÓN: 'transcript'
    },
    cancelToken: null,
  }),
  created() {
    this.items_import= [
      {
        id: 1,
        name: 'SENASIR',
        permissions_create: 'create-import-payroll-senasir',
        permissions_download: 'download-report-payroll-senasir',
        route_get_months: '/contribution/list_months_validate_senasir',
        route_upload_file: '/contribution/upload_copy_payroll_senasir', //Step1
        route_validate_data: '/contribution/validation_payroll_senasir', //step2
        message_validate_data: 'No se encontraron algunas matrículas, por favor revise el archivo Excel',
        route_rollback_contribution: '/contribution/rollback_payroll_copy_senasir',
        route_import_progressBar: '/contribution/import_payroll_senasir_progress_bar',
        route_download_file: '/contribution/download_fail_not_found_payroll_senasir',
        name_download_file: "ReporteMatriculasNoValidas.xls",
        route_report: '/contribution/report_payroll_senasir',
        name_report_file: "ReporteDatosSenasir.xls"
      },
      {
        id: 2,
        name: 'COMANDO',
        permissions_create: 'create-import-payroll-command',
        permissions_download: 'download-report-payroll-command',
        route_get_months: '/contribution/list_months_validate_command',
        route_upload_file: '/contribution/upload_copy_payroll_command', //Step1
        route_validate_data: '/contribution/validation_payroll_command', //step2
        message_validate_data: 'El archivo excel contiene informacion de los afiliados creados',
        route_rollback_contribution: '/contribution/rollback_payroll_copy_command',
        route_import_progressBar: '/contribution/import_payroll_command_progress_bar',
        route_download_file: '/contribution/download_new_affiliates_payroll_command',
        name_download_file: "ReporteNuevosAfiliados.xls",
        route_report: '/contribution/report_payroll_command',
        name_report_file: "ReporteDatosComando.xls"
      },
      {
        id: 3,
        name: 'TRANSCRIPCIÓN',
        permissions_create: 'create-import-payroll-command',
        permissions_download: 'download-report-payroll-command',
        route_get_months: '/contribution/list_months_import_contribution_transcript',
        route_upload_file: '/contribution/upload_copy_payroll_transcript', // Paso 1
        route_validate_data: '/contribution/validation_affiliate_transcript', // Paso 2
        route_import_payroll: '/contribution/import_payroll_transcript', // Paso 3
        route_import_contribution: '/contribution/import_contribution_transcript', // Paso 4
        route_rollback_contribution: '/contribution/rollback_payroll_copy_transcripts',
        route_import_progressBar: '/contribution/import_payroll_transcript_progress_bar',
        route_report: '/contribution/report_import_contribution_transcript',
        name_report_file: 'ReporteImportaciónTranscripciónContribución.xls',
      }
    ],
    this.type_import = this.items_import[1]//Toma por defecto la importacion del item 0 = Seanasir
    this.getYears();
  },
  computed: {
    //permisos del selector global por rol
    permissionSimpleSelected () {
      return this.$store.getters.permissionSimpleSelected
    },
    dateFormat() {
        if(this.month_selected < 10)
            return this.year_selected + "-" + "0" + this.month_selected + "-" + "01"
        else
            return this.year_selected + "-" + this.month_selected + "-" + "01"
    },
  },

  watch: {
    active(newVal, oldVal) {
      // como hago para que ya no llame a la ruta anterior
      if (newVal != oldVal) {
        for(let i=0; i < this.items_import.length; i++){
          if(this.active == this.items_import[i].name){
            this.type_import = this.items_import[i]
          }
        }
        this.getYears()
        this.getMonths()
      }
    },
    year_selected(newVal, oldVal) {
      if (newVal != oldVal) {
        this.getMonths();
      }
    },
  },
  methods: {
    async getYears() {
      try {
        this.loading = true;
        let import_type_name = this.import_type_name[this.type_import.name]
        let res = await this.$axios.get(`/contribution/list_years/${import_type_name}`, undefined);
        this.years = res.payload.list_years;
        this.year_selected = this.years[0];
        this.loading = false;
      } catch (e) {
        this.loading = false;
        console.log(e);
      }
    },
    async getMonths() {
      this.loading_circular = true
      try {
          let res = await this.$axios.post(`${this.type_import.route_get_months}`,{
            period_year: this.year_selected,
          },
        );
        this.list_months = res.payload.list_months;
        this.loading_circular = false
      } catch (e) {
        console.log(e);
        this.loading_circular = false
      }
    },
    openDialog() {
      if(this.type_import.name != 'TRANSCRIPCIÓN') {
        this.dialog = true;
        this.dialog_transcript = false;
      } else {
        this.dialog_transcript = true;
        this.dialog = false;
      }
      this.month_selected= null
    },
    async reportPayroll(month_selected){
      this.month_selected = month_selected
      this.loading_rep_state=true;
      try {
        let res = await this.$axios.post(`${this.type_import.route_report}`,{
            date_payroll: this.dateFormat
          },
          {'Accept': 'application/vnd.ms-excel' },
          {'responseType': 'blob'}
        );
        const url = window.URL.createObjectURL(new Blob([res]))
        const link = document.createElement("a")
        link.href = url;
        link.setAttribute("download", `${this.type_import.name_report_file}`)
        document.body.appendChild(link)
        link.click()
      } catch (e) {
        console.log(e);
      } finally {
        this.loading_rep_state=false;
        this.loading_pos_index=-1;
      }
    },
    openClose(newValue) {
      console.log("evento")
      this.dialog = newValue
      this.getMonths()
    },
    openCloseTranscript(newValue) {
      this.dialog_transcript = newValue
      this.getMonths()
    }
  },
};
</script>
<style scoped>
.select-year {
  max-width: 100px;
  margin-bottom: -30px;
}
.btn-period.v-btn:not(.v-btn--round).v-size--default {
  min-width: 160px;
  height: 25px;
}
</style>
