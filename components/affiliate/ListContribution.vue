<template>
  <v-container fluid>
    <v-form>
  <template v-if="!state">
   <v-row>
       <v-col cols="6"  class="text-left mb-0">
    <v-toolbar-title>APORTES ACTIVO</v-toolbar-title>
       </v-col>
       <v-col cols="6" class="text-right mb-0" >
          <v-tooltip top class="my-0">
            <template v-slot:activator="{ on }">
              <v-btn
                x-small
                dark
                :color="'success'"
                :loading="loading_print_active"
                v-on="on"
                class="my-2 mr-2"
                @click="printContributionsActive()"
              >
                <v-icon> mdi-download</v-icon>Descargar
              </v-btn>
            </template>
            <div>
              <span>Certificación de Aportes</span>
            </div>
          </v-tooltip>

      <v-btn top 
        x-small
        dark
        color="success"
        class="my-2 mr-2"
        @click="showDetailActive()"
      >
        <span> Detalle</span> </v-btn
      >
       </v-col>
 
      <v-col cols="12" sm="6" md="4">
        <span
          ><strong>Fecha de Ingreso a la Institucional Policial: </strong
          >{{
            affiliate.date_entry != null && affiliate.date_entry.trim() != ""
              ? affiliate.date_entry
              : "Sin Registro"
          }}</span
        ><br />
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <span
          ><strong>Fecha de Desvinculación: </strong
          >{{
            affiliate.date_derelict != null &&
            affiliate.date_derelict.trim() != ""
              ? affiliate.date_derelict
              : "Sin Registro"
          }}</span
        ><br />
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <span
          ><strong>Último Periodo Según Listas de Revista: </strong
          >{{
            affiliate.date_last_contribution != null &&
            affiliate.date_last_contribution.trim() != ""
              ? affiliate.date_last_contribution
              : "Sin Registro"
          }}</span
        ><br />
      </v-col>
    </v-row>
    <ListContributionActive />
    <v-row  >
     <v-col cols="6" class="text-left" >
    <v-toolbar-title >APORTES PASIVO</v-toolbar-title> 
     </v-col>
     <v-col cols="6"  class="text-right ">
          <v-tooltip top class="my-0">
            <template v-slot:activator="{ on }">
              <v-btn
                x-small
                dark
                :color="'success'"
                :loading="loading_passive_old_age"
                v-on="on"
                class="my-2 mr-2"
                @click="printContributionsPassive('VEJEZ')"
              >
                <v-icon> mdi-download</v-icon>Titular
              </v-btn>
            </template>
            <div>
              <span>Certificación de Aportes Vejez</span>
            </div>
          </v-tooltip>
            <v-tooltip top class="my-0">
            <template v-slot:activator="{ on }">
              <v-btn
                x-small
                dark
                :color="'success'"
                :loading="loading_passive_widow"
                v-show="affiliate.dead && affiliate.spouse!=null"
                v-on="on"
                class="my-2 mr-2"
                @click="printContributionsPassive('VIUDEDAD')"
              >
                <v-icon> mdi-download</v-icon>Viudedad
              </v-btn>
            </template>
            <div>
              <span>Certificación de Aportes Viudedad</span>
            </div>
          </v-tooltip>
           <v-btn
        x-small
        dark
        color="success"
        class="my-2 mr-2"
        @click="showDetailPassive()"
      >
        <span> Detalle</span> </v-btn
      >
   
        </v-col>
    </v-row>
    <ListContributionPassive />
  </template>
  <template v-else-if="state">
    <template v-if="show_detail.active">
      <v-row >
        <v-col cols="1">
          <v-tooltip >
            <template v-slot:activator="{ on }">
              <v-btn
                small
                dark
                icon
                v-model="show_detail.active"
                color="success"
                v-on="on"
                class="my-2 mr-4"
                @click="showContribution()"
              >
                <v-icon>mdi-arrow-left-bold </v-icon>
              </v-btn>
            </template>
            <div>
              <span>Aportes</span>
            </div>
          </v-tooltip>
        </v-col>
            <v-col cols="11" class ="mt-2">
          <v-toolbar-title> DETALLE DE APORTES ACTIVO</v-toolbar-title>
        </v-col>
      </v-row>
      <ListContributionDetailActive />
    </template>
    <template v-if="show_detail.passive">
      <v-row>
        <v-col cols="1" class ="mr-0">
          <v-tooltip  class="my-0">
            <template v-slot:activator="{ on }">
              <v-btn
                small
                dark
                icon
                v-model="show_detail.passive"
                color="success"
                v-on="on"
                class="my-2 mr-4"
                @click="showContribution()"
              >
                <v-icon>mdi-arrow-left-bold </v-icon>
              </v-btn>
            </template>
            <div>
              <span>Aportes</span>
            </div>
          </v-tooltip>
        </v-col>
           <v-col cols="11" class ="mt-2">
              <v-toolbar-title> DETALLE DE APORTES PASIVO</v-toolbar-title>
           </v-col>
      </v-row>
      <ListContributionDetailPassive />
    </template>
  </template>
    </v-form>
  </v-container>
</template>

<script>
import ListContributionActive from "@/components/affiliate/ListContributionActive.vue";
import ListContributionPassive from "@/components/affiliate/ListContributionPassive.vue";
import ListContributionDetailPassive from "@/components/affiliate/ListContributionDetailPassive.vue";
import ListContributionDetailActive from "@/components/affiliate/ListContributionDetailActive.vue";

export default {
  name: "ListContribution",
  props: {
    affiliate: {
      type: Object,
      require: true,
    },
    show_contribution: {
      type: Boolean,
      require: true,
    },
  },
  components: {
    ListContributionActive,
    ListContributionPassive,
    ListContributionDetailPassive,
    ListContributionDetailActive,
  },
  data: () => ({
    itemsPerPage: 0,
    loading: true,
    search: "",
    active: true,
    show_detail: {
      passive: false,
      active: false,
    },
    state: false,
    contributions: [],
    list: [],
    loading_print_active: false,
    loading_passive_old_age: false,
    loading_passive_widow: false,
  }),
  mounted() {
    this.state = this.show_contribution;
  },
  methods: {
    expand(props) {
      props.expand(!props.isExpanded);
    },
    showDetailPassive() {
      this.state = true;
      this.show_detail.passive = true;
      this.show_detail.active = false;
    },
    showDetailActive() {
      this.show_detail.passive = false;
      this.state = true;
      this.show_detail.active = true;
    },
    showContribution() {
      if (this.show_detail.active == true || this.show_detail.passive == true)
        this.state = false;
    },
    async printContributionsActive() {
      this.loading_print_active = true;
      try {
        let res = await this.$axios.get(
          `/contribution/print_contributions_active/${this.$route.params.id}`,
          undefined,
          { responseType: "blob" }
        );
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Aporte_Activo.pdf");
        document.body.appendChild(link);
        link.click();
      } catch (e) {
        console.log(e);
        this.loading_print_active = false;
      } finally {
        this.loading_print_active = false;
      }
    },
    async printContributionsPassive(type_contribution) {
      if(type_contribution=="VEJEZ"){
         this.loading_passive_old_age = true;
      }
      else{
       this.loading_passive_widow = true;
      }
    
     
      try {
        let res = await this.$axios.get(
          `/contribution/print_contributions_passive/${this.$route.params.id}`,undefined,{ responseType: "blob"  ,params: {
            affiliate_rent_class: type_contribution,}
             },
        );
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Aporte_Pasivo.pdf");
        document.body.appendChild(link);
        link.click();
      } catch (e) {
        console.log(e);
        this.loading_passive_widow = false;
        this.loading_passive_old_age = false;
      } finally {
        this.loading_passive_widow = false;
        this.loading_passive_old_age = false;
      }
    },
    
  },
};
</script>
<style scoped>
.filter-text {
  font-size: 12px;
  height: 2px;
  margin: 0 0 40px 0;
  padding: 0;
  width: 100%;
}
</style>
