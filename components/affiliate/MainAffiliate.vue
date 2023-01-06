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
          <template v-if="permissionSimpleSelected.includes('create-credentials')">
            <v-btn
              v-if="affiliate.credential_status.access_status == 'No asignadas'"
              small
              dark
              @click="getState_cellphone()"
              color="info"
            >
              <span> ASIGNAR CREDENCIALES</span>
            </v-btn>
            <v-btn
              v-if="affiliate.credential_status.access_status != 'No asignadas'"
              small
              dark
              @click="printFormCredential()"
              color="secondary"
              :loading="loading_btn_print"
            >
              <span> <v-icon>mdi-printer</v-icon>CREDENCIALES</span>
            </v-btn>
          </template>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-tabs vertical v-model="tab">
          <v-card color="accent" class="pa-2" style="width:250px" align="center">
            <v-chip
              class="ma-0"
              color="secondary"
              label
              text-color="white"
            >
              <v-icon left class="body-2">
                NUP:
              </v-icon>
              {{ affiliate.id }}
            </v-chip>
            <v-card-text class="textPrimary--text">
              <h2>{{ affiliate.full_name }}</h2>
              <strong>C.I.: </strong> {{ affiliate.identity_card }}
            </v-card-text>
          </v-card>
          <v-tabs-slider></v-tabs-slider>
          <v-tab class="backgroundTab" :href="`#tab-1`" :disabled="sync_up.editable && tab != 'tab-1'" >
            DASHBOARD </v-tab>
          <v-tab class="backgroundTab" :href="`#tab-2`" :disabled="sync_up.editable && tab != 'tab-2'">
            DATOS PERSONALES
          </v-tab>
          <v-tab class="backgroundTab" :href="`#tab-3`" :disabled="sync_up.editable && tab != 'tab-3'">
            INFORMACION ADICIONAL
          </v-tab>
          <v-tab class="backgroundTab" :href="`#tab-4`" :disabled="sync_up.editable && tab != 'tab-4'">
            INFORMACION CONYUGE
          </v-tab>
          <v-tab class="backgroundTab" :href="`#tab-5`" :disabled="sync_up.editable && tab != 'tab-5'">
            APORTES
          </v-tab>
          <v-tab-item :value="'tab-1'">
            <v-card flat tile>
              <v-card-text class="pt-0">
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
              <v-card-text class="pt-0">
                <Profile
                  :affiliate.sync="affiliate"
                  :sync_up.sync="sync_up"
                  :permission="permission"
                />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :value="'tab-3'">
            <v-card flat tile>
              <v-card-text class="pt-0">
                <AdditionalInformation
                  :affiliate.sync="affiliate"
                  :sync_up.sync="sync_up"
                  :obj_address.sync="obj_address"
                  :cancel.sync="cancel"
                  :permission="permission"
                />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :value="'tab-4'">
            <v-card flat tile>
              <v-card-text class="pt-0">
                <Spouse
                  :affiliate.sync="affiliate"
                  :spouse.sync="spouse"/>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :value="'tab-5'">
            <v-card flat tile>
              <v-card-text class="pt-0">
                <ListContribution
                  :affiliate.sync="affiliate"
                  :state.sync="state"/>
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
                Por favor actualice el número de celular
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
      credential_status:{
        access_status: null
      }
    },
    sync_up:{
      editable: false,
    },
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
    loading: false,
    spouse: {
      affiliate_id: null,
      first_name: null,
      second_name:null,
      last_name: null,
      mothers_last_name:null,
      identity_card:null,
      birth_date:null,
      date_death:null,
      reason_death:null,
      phone_number:null,
      cell_phone_number:null,
      city_identity_card_id:null,
      death_certificate_number:null,
      city_birth_id:null,
      civil_status:null,
      official:null,
      book:null,
      departure:null,
      marriage_date:null
    },
    tab: 0,
    state:{
      active:false
    },
    loading_btn_print: false
  }),
  beforeMount(){
    this.$nuxt.$on('eventGetSpouse', (val) => {
      this.getSpouse(val)
    })
    this.$nuxt.$on('eventSaveAffiliate', (val) => {
      this.saveAffiliate()
    })
    this.$nuxt.$on('eventSaveAffiliate2', (val) => {
      this.saveAffiliate()
    })
    this.$nuxt.$on('eventResetForm', (val) => {
      this.resetForm()
    })
  },
  mounted() {
    this.getAffiliate(this.affiliate_id);
    this.sync_up.editable = false;
  },
  watch: {
    tab: function(newVal, oldVal){
      if(newVal!= oldVal)
        this.state.active = false
    }
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
      this.sync_up.editable = false;
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
        this.getSpouse(id)
      } catch (e) {
        console.log(e);
      } finally {
        this.loading_affiliate = false;
      }
    },
    async saveAffiliate() {
      try {
        if (!this.sync_up.editable) {
          this.sync_up.editable = true;
        } else {
          await this.$axios.patch(`affiliate/affiliate/${this.affiliate.id}`,
            {
              cell_phone_number: this.affiliate.cell_phone_number
            }
          );
          this.getAffiliateAddress();
          this.$toast.success(
            "Se actualizao correctamente los datos del afiliado."
          );
          this.sync_up.editable = false;
        }
      } catch (e) {
        this.sync_up.editable = false;
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

      if (this.affiliate.credential_status.access_status == "Inactivo" || this.affiliate.credential_status.access_status == "No asignadas") {
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
        if (this.affiliate.credential_status.access_status == "No asignadas" || this.affiliate.credential_status.access_status == "Inactivo") {
          let res = await this.$axios.post(`/affiliate/store`,{
            affiliate_id: this.affiliate.id,
            role_id:this.$store.getters.currentRole.id
          }
          );
          if (res.error==false) {
            this.options.response_message =
            res.message +
            " su usuario es: " +
            res.payload.username +
            " su password es " +
            res.payload.pin;
          this.watch_button_send = false;
          }
          else{
            this.options.response_message =res.message
            this.watch_button_send = false;
          }
        } else {
          this.$toast.info("ya cuenta con credenciales");
        }
        this,loading= false
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
    async getSpouse(id) {
      this.loading= true
        try {
        this.loading_spouse=true
        let res = await this.$axios.get(
          `/affiliate/affiliate/${id}/spouse`);
        this.spouse = res
      } catch (e) {
        this.loading = false
      } finally {
        this.loading = false
      }
    },
    async printFormCredential(){
      this.loading_btn_print=true
      try {
        let res = await this.$axios.get(
          `/affiliate/credential_document/${this.$route.params.id}`,
          undefined,
          { responseType: "blob"}
        )
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Alta de credenciales.pdf");
        document.body.appendChild(link);
        link.click();
        this.loading_btn_print = false
      } catch (e) {
        console.log(e)
        this.loading_btn_print= false
      }
    }

  },
};
</script>
