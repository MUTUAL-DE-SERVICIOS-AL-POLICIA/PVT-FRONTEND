<template>
   <div>
      <template
         v-if="report_selected.criterios.includes('start_date') ||
               report_selected.criterios.includes('end_date') ||
               report_selected.criterios.includes('type_report') ">
         <v-toolbar-title>
            <b>Criterios de búsqueda</b>
         </v-toolbar-title>
         <v-progress-linear class="mb-5"></v-progress-linear>
      </template>

      <template v-if="report_selected.criterios.includes('type_report')">
         <v-select
            v-model="report_inputs.type_report"
            :items="types"
            item-text="name"
            item-value="id"
            label="Seleccione el tipo de reporte"
            outlined dense
         >
         </v-select>
      </template>

      <div v-if="report_inputs">
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
      </div>
      <v-btn color="primary" @click="downloadReport()" :loading="loading">Descargar reporte</v-btn>
   </div>
</template>
<script>
export default {
   name: "Criterion",
   props: {
      report_selected: {
         type: Object,
         required: true,
         default: null
      },
      report_inputs: {
         type: Object,
         requiered: true,
         default: null
      },
      types: {
         type: Array,
         default: null
      }
   },
   data: () => ({
      loading: false
   }),
   methods: {
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
                     let request = null
                     if(this.report_selected.method == "post")
                     {
                        request = this.$axios[this.report_selected.method](
                           this.report_selected.service,
                           {
                                 type: this.report_inputs.type_report,
                                 start_date: this.report_inputs.start_date,
                                 end_date: this.report_inputs.end_date,
                           },
                           {'Accept': 'application/vnd.ms-excel'},
                           {'responseType': 'blob'}
                        )
                     } else {
                        request = this.$axios[this.report_selected.method](
                           this.report_selected.service,
                           { 'Accpet': 'application/vnd.ms-excel'},
                           { 'responseType': 'blob'}
                        )
                     }
                     if(request) {
                        request.then((response) => {
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
                        console.log("Error en el método de la petición")
                     }
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
   }
}
</script>