<template>
  <v-container fluid>
    <v-card flat>
      <v-card-title>
        <v-toolbar dense color="tertiary" class="caption">
          <v-row>
            <v-col cols="12" class="pa-0"> Datos del afiliado </v-col>
            <v-col cols="12" class="pa-0">
              <v-icon>mdi-arrow-right-bold-box</v-icon>
              Datos del afiliado
            </v-col>
          </v-row>
          <v-tooltip>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                dark
                v-bind="attrs"
                v-on="on"
                @click="getState_cellphone()"
                color="success"
                class="mr-4"
              >
                <span v-if="!editable"> ASIGNAR CREDENCIALES</span>
              </v-btn>
            </template>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                dark
                v-bind="attrs"
                v-on="on"
                @click.stop="saveAffiliate()"
                :color="editable ? 'success' : 'secondary'"
              >
                <span v-if="!editable"> EDITAR</span>
                <span v-else> Confirmar</span>
              </v-btn>
            </template>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                color="error"
                dark
                v-bind="attrs"
                v-on="on"
                v-show="editable"
                @click.stop="resetForm()"
              >
                <span> cancelar</span>
              </v-btn>
            </template>
            <span>EDITAR</span>
          </v-tooltip>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-tabs :vertical="true">
          <v-card color="backgroundCard">
            <v-card-text>
              <v-row>
                <v-col cols="12" md="12" align="center">
                  <h2>{{ affiliate.full_name }}</h2>
                  <br />
                  <strong>C.I.: </strong> {{ affiliate.identity_card }}
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-tabs-slider></v-tabs-slider>
          <v-tab class="backgroundTab" :href="`#tab-1`"> DASHBOARD </v-tab>
          <v-tab class="backgroundTab" :href="`#tab-2`">
            DATOS PERSONALES DEL AFILIADO
          </v-tab>
          <v-tab class="backgroundTab" :href="`#tab-3`">
            INFORMACION ADICIONAL
          </v-tab>
          <v-tab class="backgroundTab" :href="`#tab-4`">
            INFORMACION CONYUGE
          </v-tab>
          <v-tab class="backgroundTab" :href="`#tab-5`">
            APORTES
          </v-tab>
          <v-tab-item class="backgroundTab" :value="'tab-1'">
            <v-card flat tile>
              <v-card-text>
                <Dashboard
                  :affiliate.sync="affiliate"
                  :loading_affiliate="loading_affiliate"
                  :permission="permission"
                />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :value="'tab-2'">
            <v-card flat tile>
              <v-card-text>
                <Profile
                  :affiliate.sync="affiliate"
                  :editable.sync="editable"
                  :permission="permission"
                />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :value="'tab-3'">
            <v-card flat tile>
              <v-card-text>
                <AdditionalInformation
                  :affiliate.sync="affiliate"
                  :editable.sync="editable"
                  :obj_address.sync="obj_address"
                  :cancel.sync="cancel"
                  :permission="permission"
                />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :value="'tab-4'">
            <v-card flat tile>
              <v-card-text>
                <Spouse 
                  :affiliate.sync="affiliate" 
                  :editable.sync="editable" 
                  :permission="permission" />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :value="'tab-5'">
            <v-card flat tile>
              <v-card-text>
                <ListContribution
                  :affiliate.sync="affiliate"
                  :show_contribution.sync="show_contribution"/>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
        <v-dialog v-model="dialog_send_credential" width="500">
          <v-card>
            <v-card-title>
              <span>Confirmar</span>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-card-text>
              <v-container v-if="state_cellphone">
                {{ options.response_message }}
              </v-container>
              <v-container v-else>
                Por favor actualice el numero de celular
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="resetForm()"> cerrar </v-btn>
              <v-btn
                v-if="watch_button_send && state_cellphone"
                color="success"
                @click="getCredential()"
                :loading="loading"
              >
                ENVIAR
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import AdditionalInformation from "@/components/affiliate/AdditionalInformation";
import Dashboard from "@/components/affiliate/Dashboard";
import Profile from "@/components/affiliate/Profile";
import Spouse from "@/components/affiliate/Spouse.vue";
import ListContribution from "@/components/affiliate/ListContribution.vue";
export default {
  components: {
    AdditionalInformation,
    Dashboard,
    Profile,
    Spouse,
    ListContribution,
  },
  props: {
    affiliate_id: {
      type: String,
      require: true,
      default: 0,
    },
  },
  data: () => ({
    affiliate: {
      first_name: null,
      second_name: null,
      last_name: null,
      mothers_last_name: null,
      identity_card: null,
      birth_date: null,
      date_death: null,
      reason_death: null,
      phone_number: null,
      cell_phone_number: null,
      city_identity_card_id: null,
      date_entry: null,
      date_derelict: null,
      unit_name: null,
      affiliate_state_id: null,
    },
    editable: false,
    show_contribution:false,
    vertical: false,
    icons: true,
    loading_affiliate: false,
    watch_button_send: false,
    options: {
      response_message: "Esta seguro de enviar los credenciales",
    },

    dialog_send_credential: false,
    state_cellphone: false,
    obj_address: {
      addresses: null,
      id_street: null,
      addresses_aux: null,
    },
    cancel: false,
    loading: false
  }),
  mounted() {
    this.getAffiliate(this.affiliate_id);
    this.editable = false;
  },
  watch: {

  },
    computed: {
    //permisos del selector global por rol
    permissionSimpleSelected () {
      return this.$store.getters.permissionSimpleSelected
    },

    permission() {
      return {
        primary: this.primaryPermission,
        secondary: this.secondaryPermission
      }
    },
    secondaryPermission() {
      if (this.affiliate.id) {
        return this.permissionSimpleSelected.includes('update-affiliate-secondary')
      } else {
        return this.permissionSimpleSelected.includes('create-affiliate')
      }
    },
    primaryPermission() {
      if (this.affiliate.id) {
        return this.permissionSimpleSelected.includes('update-affiliate-primary')
      } else {
        return this.permissionSimpleSelected.includes('create-affiliate')
      }
    }
  },
  
  methods: {
    resetForm() {
      this.cancel = true;
      this.getAffiliate(this.$route.params.id);
      this.editable = false;
      this.dialog_send_credential = false;
      this.$nextTick(() => {
        this.cancel = false
      });
    },
    async getAffiliate(id) {
      try {
        this.loading_affiliate = true;
        let res = await this.$axios.get(`/affiliate/affiliate/${id}`);
        this.affiliate = res;
        this.getStateCredential();
      } catch (e) {
        console.log(e);
      } finally {
        this.loading_affiliate = false;
      }
    },
    async saveAffiliate() {
      try {
        if (!this.editable) {
          this.editable = true;
        } else {
          await this.$axios.patch(
            `affiliate/affiliate/${this.affiliate.id}`,
            this.affiliate
          );
          this.getAffiliateAddress();
          this.$toast.success(
            "Se actualizao correctamente los datos del afiliado"
          );
          this.editable = false;
        }
      } catch (e) {
        this.editable = false;
        this.$toast.error("Ocurrio un error durante la actualización");
      }
    },
    getState_cellphone() {
      this.dialog_send_credential = true;
      console.log(this.affiliate.cell_phone_number[0]);
      if (this.affiliate.cell_phone_number[0].length > 0) {
        this.state_cellphone = true;
        this.state_button_send = true;
      } else {
        this.state_cellphone = false;
        this.state_button_send = false;
      }
      console.log(this.state_cellphone);
    },

    getStateCredential() {

      if (this.affiliate.credential_status.access_status == "No asignadas") {
        this.watch_button_send = true;
      } else {
        this.watch_button_send = false;
        this.options.response_message ="El afiliado y cuenta con credencialea asignados como: " +
          this.affiliate.credential_status.access_status;
      }
    },
    async getCredential() {
      console.log(this.affiliate.credential_status.access_status)
      this.loading= true
      try {
        if (this.affiliate.credential_status.access_status == "No asignadas") {
          let res = await this.$axios.post(`/affiliate/store`,{
            affiliate_id: this.affiliate.id
          }
          );
          this.options.response_message =
            res.message +
            " su usuario es: " +
            res.payload.username +
            " su password es " +
            res.payload.pin;
          this.watch_button_send = false;
          this,loading= false
        } else {
          this.$toast.info("ya cuenta con credenciales");
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getAffiliateAddress() {
      try {
        let res = await this.$axios.patch(`affiliate/affiliate/${this.$route.params.id}/address`,
          {
            addresses: this.obj_address.addresses.map((o) => o.id),
            addresses_valid: this.obj_address.id_street,
          }
        );
      } catch (e) {
        console.log();
      }
    },

  },
};
</script>
