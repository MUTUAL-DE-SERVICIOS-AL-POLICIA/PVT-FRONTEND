<template>
<v-container fluid>
    <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        persistent
    >
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="close()">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <!-- T I T U L O -->
                <v-toolbar-title>IMPORTACIÓN {{type_import.name}}</v-toolbar-title>
            </v-toolbar>
            <v-row justify="center" class="mt-5">
                <v-col cols="8">
                    <v-toolbar-title class="pb-5">
                        <center><b>GESTIÓN {{year_selected}}</b></center>
                        <div class="text-right"><Information :title="information.title" :parameters="information.parameters"/></div>
                    </v-toolbar-title>
                    <!-- P E R I O D O   A   I M P O R T A R -->
                    <v-select
                        dense
                        :items="list_months_not_import"
                        item-text="period_month_name"
                        item-value="period_month"
                        :label="'Periódo para importar'"
                        v-model="month_selected"
                        outlined
                        @change="importProgressBar()"
                        :disabled="progress.query_step_1"
                    ></v-select>
                    <!-- P A S O S   P A R A   I M P O R T A R -->
                    <v-stepper v-model="e1" editable>
                        <v-stepper-header>
                            <v-stepper-step :complete="e1 > 1 " step="1">
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
                                <v-card class="mb-12">
                                    <v-card-text>
                                        <v-card color="white" class="pa-2">
                                            <v-form ref="forStep1">
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
                                                    <strong>Nombre del archivo:</strong> {{progress.file_exists ? progress.file_name: import_export.file.name}}<br>
                                                    <strong>Total de registros copiados:</strong> {{$filters.thousands(data_count.num_total_data_copy)}}<br>
                                                </v-col>
                                            </v-form>
                                        </v-card>
                                    </v-card-text>
                                </v-card>
                                <v-btn color="primary" @click="validateForm1()" :loading="btn_update_file">
                                    Subir archivo
                                </v-btn>
                                <v-btn color="secundary" @click="nextStep(1)" :disabled="!progress.query_step_1">
                                    Siguiente
                                </v-btn>
                            </v-stepper-content>
                            <!-- S E G U N D O   P A S O  -->
                            <v-stepper-content step="2">
                                <v-card class="mb-12" color="grey lighten-1">
                                    <v-card-text>
                                        <v-card color="white" class="pa-2" v-if="progress.query_step_1">
                                            <v-row v-if="type_import.name == 'SENASIR'">
                                                <v-col cols="12" md="6">
                                                    <strong>Nombre del archivo:</strong> {{progress.file_exists ? progress.file_name : import_export.file.name}}<br>
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
                                                    <strong>Total de registros nuevos:</strong> {{$filters.thousands(data_count.num_data_new)}}<br>
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
    <!-- D I A L O G O S   D E   R E S P U E S T A -->
    <v-dialog
      v-model="dialog_confirm"
      max-width="600"
      persistent
    >
      <v-card>
        <v-card-title>
          <center>¿Está seguro que quiere rehacer el proceso de importación?</center>
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
          ¿Está seguro de realizar la importación?
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
import Information from '@/components/contribution/Information.vue';
export default {
    name: "PayrollImportProcess",
    components: {
        Information,
    },
    data: () => ({
        list_months_not_import: [],
        import_export: {},
        e1: 1,
        month_selected: null,
        progress: {
            file_exists: false,
            file_name: null,
            percentage: 0,
            query_step_1: false,
            query_step_2: false
        },
        data_count: {
            num_data_considered: 0,
            num_data_not_considered: 0,
            num_data_not_validated: 0,
            num_data_validated: 0,
            num_total_data_copy: 0,
            num_data_new: 0,
            num_data_regular: 0
        },
        btn_update_file: false,
        btn_validate_data: false,
        btn_rollback: false,
        dialog_confirm: false,
        dialog_confirm_import: false,

        information: {
            title: "IMPORTACIÓN",
            parameters: [
                {
                    title: "FORMATO ARCHIVO",
                    body: "tipo CSV delimitado por \"dos puntos\" (:)",
                },
                {
                    title: "NOMBRE ARCHIVO",
                    body: "tipo-mes-año.csv Ejemplo: senasir-04-2021.csv"
                }
            ]
        }
    }),
    props: {
        dialog: {
            type: Boolean,
            required: true,
            default: false
        },
        type_import: {
            type: Object,
            required: true,
        },
        year_selected: null,
    },
    computed: {
        dateFormat() {
            if(this.month_selected < 10)
                return this.year_selected + "-" + "0" + this.month_selected + "-" + "01";
            else
                return this.year_selected + "-" + this.month_selected + "-" + "01";
        },
    },
    watch: {
        dialog: function() {
            // this.$nuxt.$on('add_period', this.getSimpleMonths())
            this.getSimpleMonths()
        }
    },
    methods: {
        async getSimpleMonths() {
            try {
                let res = await this.$axios.post(`${this.type_import.route_get_months}`,{
                    period_year: this.year_selected,
                    with_data_count: false
                });
                let months_not_import =[]
                for (let i = 0; i < res.payload.list_months.length; i++) {
                    if (res.payload.list_months[i].state_importation == false) {
                        months_not_import.push(res.payload.list_months[i]);
                    }
                }
                this.list_months_not_import = months_not_import;
            } catch (e) {
                console.log(e);
            }
        },
        async importProgressBar() {
            try {
                let res = await this.$axios.post(`${this.type_import.route_import_progressBar}`,{
                    date_payroll: this.dateFormat,
                });
                this.progress = res.payload.import_progress_bar
                this.data_count = res.payload.data_count
                if(this.progress.query_step_1){
                    this.e1 = 2
                    this.progress.percentage = this.progress.percentage
                } else {
                    this.e1 = 1
                    this.progress.percentage = 0
                }
            } catch (e) {
                console.log(e);
            }
        },
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
        async rollbackContribution() {
            this.btn_rollback = true
            try {
                let res = await this.$axios.post(`${this.type_import.route_rollback_contribution}`,{
                    date_payroll: this.dateFormat,
                });
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
                        // console.log(res.payload.data_count.num_data_new)
                        this.$toast.info(this.type_import.message_validate_data);
                        this.downloadFile();
                        }
                    }

                    this.progress.percentage = 100
                    this.dialog_confirm_import = false
                    // this.dialog = false // mutación
                    // this.dialog_component = false (aca nos falta) [ojo] tiene que cerrarse automaticamente
                    this.close() // con esto se solucionará? lo del ojo
                    // this.getMonths();
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
        validateForm1() {
            if(this.$refs.forStep1) {
                if(this.$refs.forStep1.validate()) {
                    this.uploadFile()
                } else {
                    this.$toast.error('Ingrese los datos necesarios')
                }
            }
        },
        nextStep(n) {
            if(n == this.steps) {
                this.e1 = 1
            } else {
                if(n == 1) {
                    this.progress.percentage = this.progress.percentage + 50
                }
                if(n == 2) {
                    this.progress.percentage = this.progress.percentage + 100
                }
                this.e1 = n + 1
            }
        },
        close() {
            this.$emit('open-close', !this.dialog)
            this.clearData()
        },
        clearData() {
            this.el = 1
            this.import_export = {}
            this.progress.file_exists = false
            this.progress.file_name = null
            this.progress.percentage = 0
            this.progress.query_step_1 = false
            this.progress.query_step_2 = false
        },
    }
}
</script>