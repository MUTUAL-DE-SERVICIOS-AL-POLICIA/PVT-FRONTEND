<template>
  <v-container fluid>
    <v-card flat>
      <v-card-title>
        <v-toolbar dense color="tertiary" class="caption">
          <GlobalBreadCrumb />
          <div class="flex-grow-1"></div>
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
                @click.stop="openDialog()"
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
    <!--fin contenido-->
    <!--steps-->
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      persistent
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>IMPORTACIÓN {{type_import.name}}</v-toolbar-title>
        </v-toolbar>
        <v-row justify="center" class="mt-5"
          ><v-col cols="8">
            <v-toolbar-title class="pb-5">
              <center><b>GESTIÓN {{year_selected}}</b></center>
              <div class="text-right">
                <Information />
              </div>
              </v-toolbar-title>

              <v-select
                dense
                :items="list_months_not_import"
                item-text="period_month_name"
                item-value="period_month"
                :label="'Periódo para importar '"
                v-model="month_selected"
                outlined
                @change ="importProgressBar()"
                :disabled="progress.query_step_1"
              ></v-select>

            <v-stepper v-model="e1" v-if="month_selected != null" editable>
              <v-stepper-header>
                <v-stepper-step :complete="e1 > 1" step="1" >
                  Subir archivo
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="e1 > 2" step="2">
                  Validar Datos
                </v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-progress-linear
                  color="info"
                  height="20"
                  :value="progress.percentage"
                  striped
                >
                  <strong>Porcentaje de Importación: {{progress.percentage}}%</strong>
                </v-progress-linear>
                <v-stepper-content step="1">
                  <v-card class="mb-12" >
                    <v-card-text>
                      <v-card color="white" class="pa-2">
                        <v-form ref="forStep1">
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-file-input
                              counter
                              show-size
                              truncate-length="30"
                              outlined
                              small-chips
                              dense
                              label="Cargar Archivo"
                              v-model="import_export.file"
                              :disabled="progress.query_step_1"
                              :rules="[$rules.obligatoria('Archivo')]"
                            ></v-file-input>
                          </v-col>
                          <v-col cols="12" md="6" v-if="progress.query_step_1">
                            <strong>Nombre del archivo:</strong> {{ progress.file_exists ? progress.file_name :  import_export.file.name}}<br>
                            <strong>Total de registros copiados:</strong> {{$filters.thousands(data_count.num_total_data_copy)}}<br>
                          </v-col>
                        </v-row>
                        </v-form>
                      </v-card>
                    </v-card-text>
                  </v-card>
                  <v-btn 
                    color="primary"
                    @click="validateForm1()"
                    :loading ="btn_update_file"
                  >
                    Subir archivo
                  </v-btn>
                  <v-btn color="secondary"
                    :disabled="!progress.query_step_1"
                    @click="nextStep(1)"> Siguiente </v-btn>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-card class="mb-12" color="grey lighten-1">
                    <v-card-text>
                      <v-card color="white" class="pa-2" v-if="progress.query_step_1">
                        <v-row v-if="type_import.name == 'SENASIR'">
                          <v-col cols="12" md="6">
                            <strong>Nombre del archivo:</strong> {{ progress.file_exists ? progress.file_name :  import_export.file.name}}<br>
                            <strong class="success--text">Total de registros considerados:</strong> {{$filters.thousands(data_count.num_data_considered)}}<br>
                            <strong class="red--text">Total de registros no considerados:</strong> {{$filters.thousands(data_count.num_data_not_considered)}}<br>
                          </v-col>
                          <v-col cols="12" md="6">
                            <strong>Total de registros copiados:</strong> {{$filters.thousands(data_count.num_total_data_copy)}}<br>
                            <strong class="success--text">Total de registros validados:</strong> {{$filters.thousands(data_count.num_data_validated)}}<br>
                            <strong class="error--text">Total de registros no validados:</strong> {{$filters.thousands(data_count.num_data_not_validated)}}<br>
                          </v-col>
                        </v-row>
                        <v-row v-if="type_import.name == 'COMANDO'">
                          <v-col cols="12" md="6">
                            <strong>Nombre del archivo:</strong> {{ progress.file_exists ? progress.file_name :  import_export.file.name}}<br>
                            <strong>Total de registros copiados:</strong> {{$filters.thousands(data_count.num_total_data_copy)}}<br>
                            <strong class="success--text">Total de registros validados:</strong> {{$filters.thousands(data_count.num_data_validated)}}<br>
                          </v-col>
                          <v-col cols="12" md="6">
                            <strong>Total de registros nuevo:</strong> {{$filters.thousands(data_count.num_data_new)}}<br>
                            <strong class="success--text">Total de registros regulares:</strong> {{$filters.thousands(data_count.num_data_regular)}}<br>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-card-text>
                  </v-card>
                  <v-btn color="error" @click="dialog_confirm=true">
                    Rehacer
                  </v-btn>
                  <v-btn color="primary" @click="dialog_confirm_import=true">
                    Validar archivo
                  </v-btn>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
    <!--fin steps-->
    <v-dialog
      v-model="dialog_confirm"
      max-width="600"
      persistent
    >
      <v-card>
        <v-card-title>
          <center>¿Esta seguro que quiere rehacer el proceso de importación?</center>
          <br>
          <br> <small class='caption'>Al rehacer se borraran todos los datos ingresados</small>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            @click="dialog_confirm=false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="success"
            text
            @click="rollbackContribution()"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog_confirm_import"
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title>
          Esta seguro de realizar la importación?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            @click="dialog_confirm_import=false"
            :disabled="btn_validate_data"
          >
            Cerrar
          </v-btn>
          <v-btn
            color="sucess"
            text
            @click="validateData()"
            :loading="btn_validate_data"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import GlobalBreadCrumb from "@/components/common/GlobalBreadCrumb.vue";
import GlobalLoading from "@/components/common/GlobalLoading.vue";
import Information from "@/components/contribution/Information.vue";
export default {
  name: "MainImportation",
  components: {
    GlobalBreadCrumb,
    GlobalLoading,
    Information
  },
  data: () => ({
    active: 'SENASIR',
    years: [],
    loading: false,
    year_selected: null,
    list_months: [],
    list_months_not_import: [],
    dialog: false,
    e1: 1,
    import_export: {},
    month_selected: null,
    progress: {
      file_exists: false,
      file_name: null,
      percentage: 0,
      query_step_1: false,
      query_step_2: false
    },
    data_count:{
      num_data_considered: 0, //senasir
      num_data_not_considered: 0, //senasir
      num_data_not_validated: 0, //senasir
      num_data_validated: 0, //senasir , command
      num_total_data_copy: 0, //senasir, command
      num_data_new: 0, //command
      num_data_regular: 0 //command
    },
    btn_update_file: false,
    btn_validate_data: false,
    btn_import_contributions: false,
    btn_rollback: false,
    dialog_confirm : false,
    dialog_confirm_import:false,
    loading_circular:false,
    loading_pos_index: -1,
    loading_rep_state: false,
    items_import: [],
    type_import:{}
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
      }
    ],
    this.getYears();
    this.type_import = this.items_import[0]//Toma por defecto la importacion del item 0 = Seanasir
    //seleccionar el mes en caso de null
    // if(this.year_selected){
    //   this.getMonths()
    // }else{
    //   this.year_selected = new Date().getFullYear()
    //   this.getMonths()
    // }
  },
  computed: {
    //permisos del selector global por rol
    permissionSimpleSelected () {
      return this.$store.getters.permissionSimpleSelected
    },
    dateFormat() {
      if(this.month_selected < 10)
      return this.year_selected + "-" + "0"+this.month_selected + "-" + "01";
      else
      return this.year_selected + "-" + this.month_selected + "-" + "01";
    },
  },

  watch: {
    active(newVal, oldVal) {
      if (newVal != oldVal) {
        for(let i=0; i < this.items_import.length; i++){
          if(this.active == this.items_import[i].name){
            this.type_import = this.items_import[i]
          }
        }
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
    nextStep (n) {
      if (n == this.steps) {
        this.e1 = 1
      }
      else {
        if(n==1){
          this.progress.percentage= this.progress.percentage + 50
        }if(n==2){
          this.progress.percentage= this.progress.percentage + 100
        }
        this.e1 = n + 1
      }
    },
    //Función Global para importacion
    async getYears() {
      try {
        this.loading = true;
        let res = await this.$axios.get("/contribution/list_years");
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
          }
        );
        this.list_months = res.payload.list_months;
        this.loading_circular = false
      } catch (e) {
        console.log(e);
        this.loading_circular = false
      }
    },

    async getSimpleMonths() {
      try {
        let res = await this.$axios.post(`${this.type_import.route_get_months}`,{
            period_year: this.year_selected,
            with_data_count: false
          }
        );
        let months_not_import =[]
        for (let i = 0; i < res.payload.list_months.length; i++) {
          if (res.payload.list_months[i].state_importation == false) {
            months_not_import.push(res.payload.list_months[i]);
          }
          console.log(months_not_import)
        }
        this.list_months_not_import = months_not_import;
      } catch (e) {
        console.log(e);
      }
    },
    openDialog() {
      this.dialog = true;
      this.month_selected= null,
      this.getSimpleMonths()
    },
    close() {
      this.dialog = false;
      this.clearData()
    },
    //PASO1
    //Metodo para subir el archivo
    async uploadFile() {
      this.btn_update_file = true;
      let formData = new FormData();
      formData.append("file", this.import_export.file);
      formData.append("date_payroll", this.dateFormat);
      try {
        let res = await this.$axios.post(`${this.type_import.route_upload_file}`,
          formData
        );
        if (res.payload.successfully) {
          if(this.type_import.name == 'SENASIR'){
            this.data_count.num_total_data_copy = res.payload.data_count.num_total_data_copy
            this.data_count.num_data_considered = res.payload.data_count.num_data_considered
            this.data_count.num_data_not_considered = res.payload.data_count.num_data_not_considered
            this.data_count.num_data_not_validated = res.payload.data_count.num_data_not_validated
            this.data_count.num_data_validated = res.payload.data_count.num_data_validated
          } else if(this.type_import.name == 'COMANDO'){
            this.data_count.num_total_data_copy = res.payload.data_count.num_total_data_copy
            this.data_count.num_data_validated = res.payload.data_count.num_data_validated
            this.data_count.num_data_new = res.payload.data_count.num_data_new
            this.data_count.num_data_regular = res.payload.data_count.num_data_regular
          }
          this.$toast.success("Se ha realizado el copiado de " + this.data_count.num_total_data_copy + ' registros');
          this.progress.query_step_1 = true
          console.log(this.import_export.file.name)
        } else {
          this.$toast.error(res.payload.error);
        }
        this.btn_update_file = false;
      } catch (e) {
        console.log(e);
        this.btn_update_file = false;
        this.$toast.error(e.message);
      }
    },
    //PASO2
    async validateData() {
      this.btn_validate_data = true;
      try {
        let res = await this.$axios.post(`${this.type_import.route_validate_data}`,{
            date_payroll: this.dateFormat,
          }
        );
        if (res.payload.successfully) {
          this.data_count.num_data_not_validated = res.payload.data_count.num_data_not_validated
          this.data_count.num_data_validated = res.payload.data_count.num_data_validated

          if(this.type_import.name == 'SENASIR'){
            if(res.message == 'Excel'){
              this.$toast.info(this.type_import.message_validate_data);
              this.downloadFile();
            }
          }
          if(this.type_import.name == 'COMANDO'){
            this.data_count.num_data_new = res.payload.data_count.num_data_new
            if(res.payload.data_count.num_data_new > 0){
              console.log(res.payload.data_count.num_data_new)
              this.$toast.info(this.type_import.message_validate_data);
              this.downloadFile();
            }
          }

          this.progress.percentage = 100
          this.dialog_confirm_import = false
          this.dialog = false
          this.clearData()
          this.getMonths();
          this.$toast.success("Se ha realizado la validación de "+ res.payload.data_count.num_data_validated+" registros");

        } else {
            this.e1 = 1
            this.progress.query_step_1 = false
            this.progress.percentage = 0
            this.$toast.error(res.message);
        }
        this.btn_validate_data = false;
      } catch (e) {
        console.log(e);
        this.btn_validate_data = false;
      }
    },
    async downloadFile() {
      try {
        // ESTA ES OTRA FORMA QUE UTILIZA FETCH EN LUGAR DE AXIOS
        /*let response = await fetch(
          'http://localhost:8989/api/contribution/download_fail_validated_senasir', {
            method: 'POST',
            body: JSON.stringify({date_payroll: this.dateFormat}),
            headers: new Headers({'Authorization': `Bearer 64|S34WMifFxR4XVdyQtC8WTdk4cVOFMocqZcQFCN9a`, 'responseType': 'blob', 'Content-Type': 'application/json'}),
          }
        );
        let res = (await response.blob())*/

        // Se debe enviar el responseType como configuracion, NO como header
        let res = await this.$axios.post(`${this.type_import.route_download_file}`,{
            date_payroll: this.dateFormat,
          },
          {'Accept': 'application/vnd.ms-excel' },
          {'responseType': 'blob'}
        );
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${this.type_import.name_download_file}`);
        document.body.appendChild(link);
        link.click();
      } catch (e) {
        console.log(e);
      }
    },
    async rollbackContribution() {
      this.btn_rollback = true
      try {
        let res = await this.$axios.post(`${this.type_import.route_rollback_contribution}`,{
            date_payroll: this.dateFormat,
          }
        );
        if (res.payload.valid_rollbackk) {
          this.$toast.info(res.message + ". Se ha realizado el borrado de datos");
          this.clearData()
          this.dialog_confirm=false
        } else {
          this.$toast.error(res.message);
        }
        this.btn_rollback = false
      } catch (e) {
        console.log(e);
      }
    },
    async importProgressBar() {
      try {
        let res = await this.$axios.post(`${this.type_import.route_import_progressBar}`,{
            date_payroll: this.dateFormat,
          }
        );
        this.progress = res.payload.import_progress_bar
        this.data_count = res.payload.data_count
        if(this.progress.query_step_1){
          this.e1 = 2
          this.progress.percentage = this.progress.percentage
        }else {
          this.e1 = 1
          this.progress.percentage = 0
      }
         console.log(this.e1)
      } catch (e) {
        console.log(e);
      }
    },
    validateForm1() {
      if (this.$refs.forStep1) {
        if (this.$refs.forStep1.validate()) {
          this.uploadFile();
        } else {
          this.$toast.error('Ingrese los datos necesarios');
        }
      }
    },
    clearData(){
      this.e1 = 1,
      this.import_export = {},
      this.progress.file_exists= false,
      this.progress.file_name= null,
      this.progress.percentage= 0,
      this.progress.query_step_1= false,
      this.progress.query_step_2= false
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
