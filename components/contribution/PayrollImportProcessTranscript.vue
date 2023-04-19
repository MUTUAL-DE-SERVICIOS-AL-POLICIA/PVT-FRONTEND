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
                    <v-toolbar-title>IMPORTACIÓN {{type_import.name}}</v-toolbar-title>
                </v-toolbar>
                <v-row justify="center" class="mt-5">
                    <v-col cols="8">
                        <v-toolbar-title class="pb-5">
                            <center><b>GESTIÓN {{year_selected}}</b></center>
                            <div class="text-right"><Information :title="information.title" :parameters="information.parameters"/></div>
                        </v-toolbar-title>
                        <v-select
                            dense
                            :items="list_months_not_import"
                            item-text="period_month_name"
                            item-value="period_month"
                            :label="'Periódo para importar'"
                            v-model="month_selected"
                            outlined
                            :rules="[ $rules.obligatoria('Periódo') ]"
                            :disabled="progress.query_step_1"
                            @change="importProgressBar()"
                        ></v-select>
                        <v-stepper v-model="e1" editable>
                            <v-stepper-header>
                                <v-stepper-step :complete="e1 > 1" step="1">
                                    Subir archivo
                                </v-stepper-step>
                                <v-divider></v-divider>
                                <v-stepper-step :complete="e1 > 2" step="2">
                                    Validar Datos Afiliado
                                </v-stepper-step>
                                <v-divider></v-divider>
                                <v-stepper-step :complete="e1 > 3" step="3">
                                    Importa planilla
                                </v-stepper-step>
                                <v-divider></v-divider>
                                <v-stepper-step :complete="e1 > 4" step="4">
                                    Importar aportes
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
                                <!-- P R I M E R   P A S O -->
                                <v-stepper-content step="1">
                                    <v-card class="mb-12">
                                        <v-card-text>
                                            <v-card color="white" class="pa-2">
                                                <v-form ref="forStep1">
                                                    <v-col cols="12" md="6">
                                                        <v-text-field
                                                            v-model="amount"
                                                            label="Introduzca el monto"
                                                            :rules="[
                                                                $rules.obligatoria('Monto'),
                                                                $rules.soloNumerosFloat(amount)
                                                            ]"
                                                        ></v-text-field>
                                                        <v-text-field
                                                            v-model="number_of_records"
                                                            label="Introduzca la cantidad de registros"
                                                            :rules="[
                                                                $rules.obligatoria('Cantidad de registros'),
                                                                $rules.soloNumeros(number_of_records)
                                                            ]"
                                                        ></v-text-field>
                                                        <v-file-input
                                                            v-model="take_picture"
                                                            counter
                                                            show-size
                                                            truncate-length="30"
                                                            outlined
                                                            small-chips
                                                            label="Cargar imágen"
                                                            :rules="[
                                                                $rules.obligatoria('Archivo'),
                                                            ]"
                                                        ></v-file-input>
                                                        <v-file-input
                                                            v-model="import_export.file"
                                                            counter
                                                            show-size
                                                            truncate-length="30"
                                                            outlined
                                                            small-chips
                                                            label="Cargar Archivo"
                                                            :disabled="progress.query_step_1"
                                                            :rules="[$rules.obligatoria('Archivo')]"
                                                        ></v-file-input>
                                                    </v-col>
                                                    <v-col cols="12" md="6" v-if="progress.query_step_1">
                                                        <strong>Nombre del archivo: </strong>{{progress.file_exists ? progress.file_name : import_export.file.name}}<br>
                                                        <strong>Total de registros copiados:</strong>{{$filters.thousands(data_count.num_total_data_copy)}}<br>
                                                    </v-col>
                                                </v-form>
                                            </v-card>
                                        </v-card-text>
                                    </v-card>
                                    <v-btn color="primary" @click="validateForm1()" :loading="btn_update_file" :disabled="progress.query_step_1">
                                        Subir archivo
                                    </v-btn>
                                    <v-btn color="secundary" @click="nextStep(1)" :disabled="!progress.query_step_1">
                                        Siguiente
                                    </v-btn>
                                </v-stepper-content>
                                <!-- S E G U N D O   P A S O -->
                                <v-stepper-content step="2">
                                    <v-card class="mb-12" color="grey lighten-1">
                                        <v-card-text>
                                            <v-card color="white" class="pa-2">
                                                <v-row>
                                                    <v-col cols="12" md="6">
                                                        <strong>Total de registros copiados: </strong>{{$filters.thousands(data_count.num_total_data_copy)}}<br>
                                                        <strong class="sucess--text">Total de registros relacionados: </strong>{{$filters.thousands(data_count.count_data_automatic_link)}}<br>
                                                    </v-col>
                                                    <v-col cols="12" md="6">
                                                        <strong>Total de registros para creación: </strong>{{$filters.thousands(data_count.count_data_creation)}}<br>
                                                        <strong class="success--text">Total de registros para revisión: </strong>{{$filters.thousands(data_count.count_data_revision)}}
                                                    </v-col>
                                                </v-row>
                                            </v-card>
                                        </v-card-text>
                                    </v-card>
                                    <v-btn color="error" @click="dialog_confirm=true">
                                        Rehacer
                                    </v-btn>
                                    <v-btn color="primary" @click="dialog_confirm_import=true" :disabled="btn_validate">
                                        Validar archivo
                                    </v-btn>
                                    <v-btn color="secundary" @click="nextStep(2)" :disabled="!progress.query_step_2">
                                        Siguiente
                                    </v-btn>
                                </v-stepper-content>
                                <!-- T E R C E R   P A S O -->
                                <v-stepper-content step="3">
                                    <v-card class="mb-12" color="grey lighten-1">
                                        <v-card-text>
                                            <v-card color="white" class="pa-2">
                                                <v-row>
                                                    <v-col cols="12" md="6">
                                                        Este es el tercer paso
                                                    </v-col>
                                                </v-row>
                                            </v-card>
                                        </v-card-text>
                                    </v-card>
                                    <v-btn color="error">
                                        Rehacer
                                    </v-btn>
                                    <v-btn color="secundary" @click="nextStep(3)">
                                        Siguiente
                                    </v-btn>
                                </v-stepper-content>
                                <!-- C U A R T O   P A S O -->
                                <v-stepper-content step="4">
                                    <v-card class="mb-12" color="grey lighten-1">
                                        <v-card-text>
                                            <v-card color="white" class="pa-2">
                                                <v-row>
                                                    <v-col cols="12" md="6">
                                                        Este es el cuarto paso
                                                    </v-col>
                                                </v-row>
                                            </v-card>
                                        </v-card-text>
                                    </v-card>
                                    <v-btn color="error" @click="nextStep(3)">
                                        Rehacer
                                    </v-btn>
                                    <v-btn color="secundary" @click="nextStep(4)">
                                        Siguiente
                                    </v-btn>
                                </v-stepper-content>
                            </v-stepper-items>
                        </v-stepper>
                    </v-col>
                </v-row>
            </v-card>
        <div class="overlay" v-if="loading_circular">
            <GlobalLoading />
        </div>
        </v-dialog>
        <v-dialog
            v-model="dialog_confirm"
            max-width="600"
            persistent
        >
            <v-card>
                <v-card-title>
                    <center>¿Está seguro que quiere rehacer el proceso?</center>
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
                    ¿Está seguro de realizar la validación?
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
                        color="success"
                        text
                        @click="validateData()"
                    >
                    Aceptar
                    </v-btn>
                    <!--
                        :loading="btn_validate_data"
                    -->
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>


<script>
import Information from '@/components/contribution/Information.vue'
import GlobalLoading from '@/components/common/GlobalLoading.vue'
export default {
    name: "PayrollImportProcessTranscript",
    components: {
        Information,
        GlobalLoading
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
            query_step_2: false,
            query_step_3: false,
            query_step_4: false
        },
        data_count: {
            num_total_data_copy: 0,
            count_data_automatic_link: 0,
            count_data_creation: 0,
            count_data_revision: 0,
            // total_data_count: 0
            num_total_data_payroll: 0,
            num_total_data_contribution: 0
        },
        btn_update_file: false,
        btn_validate_data: false,
        btn_rollback: false,
        btn_validate: false,

        // Datos para paso 1
        amount: 0,
        number_of_records: 0,
        take_picture: null,

        // variables para los dialogos
        dialog_confirm: false,
        dialog_confirm_import: false,

        loading_circular: false,
        information: {
            title: "IMPORTACIÓN",
            parameters: [
                {
                    title: "FORMATO ARCHIVO",
                    body: "tipo CSV delimitado por \"dos puntos\" (:)"
                },
                {
                    title: "NOMBRE ARCHIVO",
                    body: "tipo-mes-año.csv Ejm. transcripcion-01-1999.csv"
                },
                {
                    title: "MONTO TOTAL",
                    body: "El monto total debe ser el mismo a del archivo a importar"
                },
                {
                    title: "CANTIDAD REGISTROS",
                    body: "La cantidad de registros debe ser la misma a del archivo a importar"
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
            default: {}
        },
        year_selected: null,
    },
    computed: {
        dateFormat() {
            if(this.month_selected < 10) {
                return this.year_selected + "-" + "0" + this.month_selected + "-" + "01"
            }
            else
                return this.year_selected + "-" + this.month_selected + "-" + "01"
        }
    },
    watch: {
        dialog: function() {
            this.getSimpleMonths()
        }
    },
    methods: {
        async uploadFile() {
            this.btn_update_file = true
            let formData = new FormData()
            // Datos para la ruta
            formData.append("total_amount", parseFloat(this.amount))
            formData.append("number_records", parseInt(this.number_of_records))
            formData.append("image", this.take_picture)
            formData.append("file", this.import_export.file)
            formData.append("date_payroll", this.dateFormat)
            // fin datos de la ruta
            try {
                if(this.month_selected != null) {
                    let res = await this.$axios.post(`${this.type_import.route_upload_file}`,
                        formData
                    )
                    if(res.payload.successfully) {
                        this.data_count.num_total_data_copy = res.payload.data_count.num_total_data_copy
                        this.$toast.success(res.message)
                        this.progress.query_step_1 = true
                        // Descarga
                        res = await this.$axios.post(`${this.type_import.route_download_file_error_data_archive}`, {
                            date_payroll: formData.get("date_payroll")
                        },
                        { 'Accept': 'application/vnd.ms-excel' },
                        { 'responseType': 'blob'}
                        );
                        const url = window.URL.createObjectURL(new Blob([res]));
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", `${this.type_import.name_download_file}`);
                        document.body.appendChild(link);
                        link.click();
                    } else {
                        this.$toast.error(res.payload.error)
                    }
                    this.btn_update_file = false
                } else {
                    this.$toast.error("Periódo no seleccionado")
                    this.btn_update_file = false
                }
            } catch(e) {
                console.log(e)
                this.btn_update_file = false
                console.log(e)
                this.$toast.error(e.message)
            }
        },
        async getSimpleMonths() { // Obtener meses no importados
            try {
                let res = await this.$axios.post(`${this.type_import.route_get_months}`,{
                    period_year: this.year_selected,
                    with_data_count: false
                });
                let months_not_import = []
                for (let i = 0; i < res.payload.list_months.length; i++) {
                    if (res.payload.list_months[i].state_importation == false) {
                        months_not_import.push(res.payload.list_months[i])
                    }
                }
                this.list_months_not_import = months_not_import
            } catch(e) {
                console.log(e)
            }
        },
        async importProgressBar() {
            try {
                let res = await this.$axios.post(`${this.type_import.route_import_progressBar}`,{
                    date_payroll: this.dateFormat
                });
                this.progress = res.payload.import_progress_bar
                this.data_count = res.payload.data_count
                if(this.progress.query_step_1) {
                    this.e1 = 2
                    this.progress.percentage = this.progress.percentage
                } else if(this.progress.query_step_2) {
                    this.e1 = 3
                    this.progress.percentage = this.progress.percentage
                } else {
                    this.e1 = 1
                    this.progress.percentage = 0
                }
            } catch(e) {
                console.log(e)
            }
        },
        async rollbackContribution() {
            this.btn_rollback = true
            try {
                console.log("Esto es dateFormat " +this.dateFormat)
                let res = await this.$axios.post(`${this.type_import.route_rollback_contribution}`,{
                    date_payroll: this.dateFormat,
                });
                if (res.payload.valid_rollback) {
                    console.log("entra aca")
                    this.$toast.info(res.message + ". Se ha realizado el borrado de datos")
                    this.clearData()
                    this.dialog_confirm = false
                } else {
                    console.log("no, entra aca")
                    this.$toast.error(res.message)
                }
                this.btn_rollback = false
            } catch (e) {
                this.btn_rollback = false
                console.log(e)
            }
        },
        close() {
            this.$emit('open-close-transcript', !this.dialog)
        },
        nextStep(n) {
            if(n == this.steps) {
                this.e1 = 1
            } else {
                if (n == 1) {
                    this.progress.percentage = this.progress.percentage + 25
                }
                if (n == 2) {
                    this.progress.percentage = this.progress.percentage + 25
                }
                if (n == 3) {
                    this.progress.percentage = this.progress.percentage + 25
                }
                console.log(this.e1)
                this.e1 = n + 1
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
        async validateData() {
            this.dialog_confirm_import = false
            this.btn_validate_data = true
            this.loading_circular = true
            try {
                let res  = await this.$axios.post(`${this.type_import.route_validate_data}`, {
                    date_payroll: this.dateFormat
                })


                if(res.payload.successfully) {
                    this.data_count = res.payload.data_count
                    this.btn_validate = true
                    this.progress.query_step_2 = true
                    this.$toast.success("Se ha realizado la validación de los afiliados")
                }
                this.downloadFile(res.payload.route, res.payload.route_file_name)
                // this.dialog_confirm_import = false
                this.btn_validate_data = false
                this.loading_circular = false
            } catch(e) {
                console.log(e)
                this.loading_circular = false
                this.btn_validate_data = false
            }
        },
        async downloadFile(route, name) {
            try {
                let res = await this.$axios.post(`${route}`, {
                    date_payroll: this.dateFormat,
                },
                { 'Accept': 'application/vnd.ms-excel' },
                { 'responseType':  'blob' }
                )
                const url = window.URL.createObjectURL(new Blob([res]))
                const link = document.createElement("a")
                link.href = url
                link.setAttribute("download", `${name}`)
                document.body.appendChild(link)
                link.click()
            } catch(e) {
                console.log(e)
            }
        },
        clearData() {
            this.e1 = 1
            this.import_export = {}
            this.progress.file_exists = false
            this.progress.file_name = null
            this.progress.percentage = 0
            this.progress.query_step_1 = false
            this.progress.query_step_2 = false
            this.progress.query_step_3 = false
            this.progress.query_step_4 = false
            this.btn_validate = false
        },
    },
}
</script>
<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
}
</style>