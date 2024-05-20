<template>
   <v-container fluid>
      <v-row>
         <v-col>
            <v-toolbar-title>DEVOLUCIONES</v-toolbar-title>
         </v-col>
         <!-- BOTÓN DE REGISTRO DE LA DEUDA -->
         <v-col cols="6" class="text-right">
            <v-spacer></v-spacer>
            <v-tooltip top>
               <template v-slot:activator="{ on }">
                  <v-btn
                     x-small
                     color="success"
                     class="mr-3 ml-0 pa-4"
                     v-on="on"
                     elevation="2"
                     @click="openRegisterDue()"
                  >
                     <v-icon>mdi-plus</v-icon> Registrar deuda
                  </v-btn>
               </template>
               <div>
                  <span>Registrar una deuda</span>
               </div>
            </v-tooltip>
            <v-tooltip top>
               <template v-slot:activator="{ on }">
                  <v-btn
                     x-small
                     color="info"
                     class="mr-3 ml-0 pa-4"
                     v-on="on"
                     elevation="2"
                     @click="openRegisterAmount()"
                  >
                     <v-icon>mdi-plus</v-icon> Registrar monto
                  </v-btn>
               </template>
               <div>
                  <span>Registrar un monto</span>
               </div>
            </v-tooltip>
         </v-col>
         <v-col cols="12">
            <v-data-table
               :headers="headers"
               :items="indexedMovements"
               :options.sync="options"
               :footer-props="{
                  showFirstLastPage: true,
                  firstIcon: 'mdi-arrow-collapse-left',
                  lastIcon: 'mdi-arrow-collapse-right',
                  prevIcon: 'mdi-minus',
                  nextIcon: 'mdi-plus',
                  'items-per-page-text': 'Filas por página',
                  itemsPerPageOptions: [12, 30, 50, 100]
               }"
               :loading="loading_table"
               no-data-text="No hay datos disponibles"
            >
               <template v-slot:[`item.actions`]="{ item }">
                  <v-tooltip bottom v-if="item.index === movements.length - 1" >
                     <template v-slot:activator="{ on }">
                        <v-btn
                           icon
                           small
                           v-on="on"
                           @click="deletedMovement(item.id)"
                           color="error"
                        >
                           <v-icon>mdi-delete</v-icon>
                        </v-btn>
                     </template>
                     <span>Eliminar registro</span>
                  </v-tooltip>
               </template>
            </v-data-table>
         </v-col>
      </v-row>
      <v-dialog v-model="dialog_register_due" width="600">
         <v-card>
            <v-card-text>
               <v-container>
                  <v-form ref="forRegisterDue">
                     <v-row>
                        <v-col cols="12">
                           <v-toolbar-title>REGISTRO DE UNA DEUDA</v-toolbar-title>
                        </v-col>
                        <v-col cols="12" md="4">
                           <v-text-field
                              v-model="amountDue"
                              dense
                              label="Monto de la deuda"
                              :rules="[
                                 $rules.obligatoria('Monto'),
                                 $rules.soloNumeros('Monto')
                              ]"
                           >
                           </v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                           <v-select
                              v-model="semesterDue"
                              dense
                              :items="semesters"
                              item-text="name"
                              item-value="id"
                              label="Semestre"
                              :rules="[
                                 $rules.obligatoria('Semestre')
                              ]"
                           >
                           </v-select>
                        </v-col>
                        <v-col cols="12" md="4">
                           <v-btn
                              icon
                              small
                              color="info"
                              outlined
                              @click="validateFormDue()"
                           >
                              <v-icon class="text-center">mdi-plus</v-icon>
                           </v-btn>
                        </v-col>
                     </v-row>
                     <v-row>
                        <v-col cols="12">
                           <v-data-table
                              dense
                              :headers="headersDues"
                              :items="duesWithNro"
                              no-data-text="No hay datos disponibles"
                              hide-default-footer
                           ></v-data-table>
                        </v-col>
                     </v-row>
                  </v-form>
               </v-container>
            </v-card-text>
            <v-card-actions>
               <v-spacer></v-spacer>
               <v-btn color="error" text @click="reset()">Cerrar</v-btn>
               <v-btn
                  color="success"
                  @click="postRegisterDues()"
               >
                REGISTRAR
               </v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
      <v-dialog v-model="dialog_register_amount" width="600">
         <v-card>
            <v-card-text>
               <v-container>
                  <v-form ref="forRegisterPayment">
                     <v-row>
                        <v-col cols="12">
                           <v-toolbar-title>REGISTRO DE PAGO</v-toolbar-title>
                        </v-col>
                        <v-col cols="12" md="4">
                           <v-text-field
                              dense
                              label="Monto del pago"
                              :rules="[
                                 $rules.obligatoria('Monto')
                              ]"
                           >
                           </v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                           <v-text-field
                              dense
                              label="Nro de comprobante"
                              :rules="[
                                 $rules.obligatoria('Nro de comprobante')
                              ]"
                           >
                           </v-text-field>
                        </v-col>
                     </v-row>
                  </v-form>
               </v-container>
               <v-spacer></v-spacer>
            </v-card-text>
            <v-card-actions>
               <v-spacer></v-spacer>
               <v-btn color="error" text @click="reset()">Cerrar</v-btn>
               <v-btn
                  color="success"
                  @click="validateFormPayment()"
               >
                REGISTRAR
               </v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
      <!-- ELIMINACIÖN -->
      <v-dialog v-model="dialog_delete_movement" width="400">
         <v-card>
            <v-card-title>
               ¿Está seguro de realizar esta acción?
            </v-card-title>
            <v-card-actions>
               <v-spacer></v-spacer>
               <v-btn color="error">Eliminar</v-btn>
               <v-btn color="success" @click="dialog_delete_movement = false">Cancelar</v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
   </v-container>
</template>

<script>
import GlobalBreadCrumb from "@/components/common/GlobalBreadCrumb.vue";
export default {
   name: "Devolution",
   components: {
      GlobalBreadCrumb
   },
   props: {
      affiliate: {
         type: String,
         required: true,
         default: null
      }
   },
   data: () => ({
      loading_table: false,
      headers: [
         {
            text: "NRO.",
            value: "correlative",
            class: ["table", "white--text"],
         },
         {
            text: "TIPO",
            value: "description",
            class: ["table", "white--text"]
         },
         {
            text: "MONTO",
            value: "amount",
            class: ["table", "white--text"]
         },
         {
            text: "BALANCE",
            value: "balance",
            class: ["table", "white--text"]
         },
         {
            text: "FECHA",
            value: "created_at",
            class: ["table", "white--text"]
         },
         {
            text: "ACCIÓN",
            value: "actions",
            input: '',
            menu: false,
            type: "text",
            class: ["table", "white--text", "text-md-center"],
            align: "center",
            sortable: false
         }
      ],
      headersDues: [
         {
            text: 'NRO',
            value: 'nro',
            class: ["table", "white--text"]
         },
         {
            text: "MONTO",
            value: 'amount',
            class: ["table", "white--text"]
         },
         {
            text: "SEMESTRE",
            value: 'eco_com_procedure_id',
            class: ["table", "white--text"]
         }
      ],
      dues: [],
      movements: [],
      semesters: [],
      amountDue: null,
      semesterDue: null,
      options: {
         page: 1,
         itemsPerPage: 12,
      },
      dialog_register_amount: false,
      dialog_register_due: false,
      dialog_delete_movement: false,
   }),
   computed: {
      duesWithNro() {
         return this.dues.map((due, index) => {
            return {
               nro: index + 1,
               ...due
            }
         })
      },
      indexedMovements() {
         return this.movements.map((item, index) => ({
            ...item,
            index
         }))
      }
   },
   mounted() {
      this.getSemesters()
      this.getMovements()
   },
   watch: {
      options: function (newVal, oldVal) {
         if(
            newVal.page != oldVal.page ||
            newVal.itemsPerPage != oldVal.itemsPerPage
         ) {

         }
      }
   },
   methods: {
      async postRegisterDues() {
         this.dialog_register_due = true
         try {
            let response = await this.$axios.post(
               "/economic_complement/register_devolution",
               {
                  affiliate_id: this.affiliate,
                  dues: this.dues
               }
            )
            this.reset()
            this.getMovements()
            this.$toast.success(
               "Se registró correctamente la deuda."
            )
         } catch(e) {
            this.$toast.error(
               "Ocurrió un error durante el registro."
            )
            console.log(e)
         } finally {
            this.dialog_register_due = false
         }
      },
      async getMovements() {
         try {
            let response = await this.$axios.get(
               `/economic_complement/movement_list/${this.affiliate}`
            )
            this.movements = response.payload.movements
         } catch(e) {
            console.log(e)
         }
      },
      async getSemesters() {
         try {
            let response = await this.$axios.get(
               `/economic_complement/eco_com_procedure_list`
            )
            this.semesters = response.payload.eco_com_procedures
            console.log(this.semesters)
         } catch(e) {
            console.log(e)
         }
      },
      async deletedMovement(movement_id) {
         console.log(movement_id)
         this.dialog_delete_movement = true
         // aqui mostrar un mensaje o un dialog para preguntar si quiere eliminar
         // try {
         //    let response = await this.$axios.delete(
         //       "/"
         //    )
         //    // aqui mostrar eliminado
         // } catch(e) {
         //    console.log(e)
         // }
      },
      async saveRegisterMovement() {
         alert("voy a registrar un movimiento")
      },
      openRegisterDue() {
         this.dialog_register_due = true
      },
      openRegisterAmount() {
         this.dialog_register_amount = true
      },
      reset() {
         this.dialog_register_amount = false
         this.dialog_register_due = false
         this.dues = []
      },
      validateFormDue() {
         if(this.$refs.forRegisterDue) {
            if(this.$refs.forRegisterDue.validate()) {
               this.addDebtToRecord()
            } else {
               console.log("no valido")
            }
         }
      },
      validateFormPayment() {
         if(this.$refs.forRegisterPayment) {
            if(this.$refs.forRegisterPayment.validate()) {
               this.saveRegisterMovement()
            } else {
               console.log("no valido")
            }
         }
      },
      addDebtToRecord() {
         console.log(this.amountDue)
         console.log(this.semesterDue)
         const newDue = {
            amount: this.amountDue,
            eco_com_procedure_id: this.semesterDue
         }
         this.dues.push(newDue)
         this.resetDue()
      },
      resetDue() {
         this.amountDue = null
         this.semesterDue = null
      }
   }
}

</script>