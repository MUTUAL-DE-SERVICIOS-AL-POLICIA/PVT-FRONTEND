<template>
    <v-container fluid>
        <v-card>
        <v-card-title>
        <v-toolbar dense color="tertiary" class="caption">
          <GlobalBreadCrumb />
        </v-toolbar>
        </v-card-title>
            <v-row justify="center" class="mt-5">
                <v-col cols="8">
                    <v-toolbar-title class="pb-5">
                        <div class="text-right"><Information :title="information.title" :parameters="information.parameters"/></div>
                    </v-toolbar-title>
                    <v-stepper v-model="e1" editable>
                        <!-- C A B E C E R A S   P A S O S -->
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
                            <!-- B A R R A   D E   P O R C E N T A J E -->
                            <v-progress-linear
                                color="info"
                                height="20"
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
                                                    <v-file-input
                                                    v-model="file_import"
                                                    outlined
                                                    small-chips
                                                    dense                                          
                                                    placeholder="Realice el cargado del documento"
                                                    label="Cargar Archivo"
                                                    prepend-icon="mdi-paperclip"
                                                    :disabled="progress.query_step_1"
                                                    :rules="[$rules.obligatoria('Archivo')]"
                                                >
                                                    <template v-slot:selection="{ text }">
                                                    <v-chip
                                                        small
                                                        label
                                                        color="primary"
                                                    >
                                                        {{ text }}
                                                    </v-chip>
                                                    </template>
                                                </v-file-input>
                                                </v-col>
                                                <v-col cols="12" md="6" v-if="file_import != null">
                                                    <strong>Nombre del archivo: </strong>  {{file_import.name}}<br>
                                                    <strong>Total de registros copiados: </strong>  {{$filters.thousands(data_count)}}<br>
                                                </v-col>
                                            </v-form>
                                        </v-card>
                                    </v-card-text>
                                </v-card>
                                <v-btn color="primary" @click="validateForm1()" :loading="btn_update_file">
                                    Subir archivo
                                </v-btn>
                                <v-btn color="secundary" @click="nextStep(1)" :disabled="!progress.query_step_1" >
                                    Siguiente
                                </v-btn>
                            </v-stepper-content>
                            <!-- S E G U N D O   P A S O -->
                            <v-stepper-content step="2">
                                <v-card class="mb-12" color="grey lighten-1">
                                    <v-card-text>
                                        <v-card color="white" class="pa-2" >
                                            <v-row>
                                                <v-col cols="12" md="6" v-if="file_import != null">
                                                    <strong>Nombre del archivo: </strong>{{file_import.name}} <br>
                                                    <strong>Total de registros copiados: </strong>{{data_count}} <br>
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

     <!-- D I Á L O G O   P A R A   R E H A C E R -->
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
            @click="rollback()"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- D I Á L O G O   P A R A   E L   S I G U I E N T E   P A S O -->
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
import GlobalBreadCrumb from "@/components/common/GlobalBreadCrumb.vue"
import Information from '@/components/contribution/Information.vue';
export default {
    name: "ImportLoans",
    components: {
        GlobalBreadCrumb,
        Information,
    },
    data: () => ({
        file_import: null,
        e1: 1,
        progress: {
            percentage: 0,
            query_step_1: false,
            query_step_2: false
        },
        data_count: 0,
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
                    body: "tipo-mes-año.csv Ejemplo: afiliadosMora-05-2024.csv"
                }
            ]
        }
    }),
    methods: {
        async uploadFile() {
            this.btn_update_file = true;
            let formData = new FormData();
            formData.append("file", this.file_import);
            try {
                let res = await this.$axios.post("/affiliate/validate_import_affiliate_mora", formData);
                if(res.payload.successfully){
                    this.data_count = res.payload.data_count
                    this.$toast.success("Se ha realizado el copiado de " + this.data_count + ' registros');
                    this.progress.query_step_1 = true
                } else {
                    this.$toast.error(res.payload.error);
                    if(res.payload.route_file_name != ''){
                        this.downloadFile(res.payload.route, res.payload.route_file_name)
                    }
                }
                this.btn_update_file = false;
            } catch (e) {
                console.log(e);
                this.btn_update_file = false;
                this.$toast.error(e.message);
            }
        },
        async downloadFile(route, name_file) {
            try {
                let res = await this.$axios.post(route,{},
                {'Accept': 'application/vnd.ms-excel' },
                {'responseType': 'blob'}
                );
                const url = window.URL.createObjectURL(new Blob([res]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", name_file);
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

        async validateData() {
            this.btn_validate_data = true
            try {
                let res = await this.$axios.post("/affiliate/import_affiliate_mora");
                if (res.payload.successfully) {
                    this.data_count = res.payload.data_count
                    this.progress.percentage = 100
                    this.dialog_confirm_import = false
                    this.$toast.success("Se ha realizado la validación de "+ this.data_count +" registros")

                } else {
                    this.e1 = 1
                    this.progress.query_step_1 = false
                    this.progress.percentage = 0
                    this.dialog_confirm_import = false
                    this.$toast.error(res.message)
                }
                this.clearData()
                this.btn_validate_data = false;
            } catch (e) {
                console.log(e);
                this.btn_validate_data = false;
            }
        },
        async rollback() {
            this.btn_rollback = true   
            this.$toast.info("Se ha realizado el borrado de datos");
            this.clearData()
            this.dialog_confirm=false
            this.btn_rollback = false

        },
        clearData() {
            this.e1 = 1
            this.file_import = null
            this.progress.percentage = 0
            this.progress.query_step_1 = false
            this.progress.query_step_2 = false
        },
    }
}
</script>