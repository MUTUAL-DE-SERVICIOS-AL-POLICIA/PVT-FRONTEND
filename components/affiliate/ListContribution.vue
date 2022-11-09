<template>
  <v-card>
    <v-toolbar-title>APORTES ACTIVO</v-toolbar-title>
    <v-row>
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
      <template v-if="!show_detail_active">
        <v-card class="text-right">
          <v-btn
            small
            dark
            color="success"
            class="mr-4" @click="showDetailActive()">
            <span> Detalle</span>
          </v-btn><br />
        </v-card>
        <ListContributionActive/>
      </template>
       <v-card>
         <template v-if="show_detail_active">
            <v-card class="text-right">
              <v-btn
                small
                dark
                color="success"
                class="mr-4"
                @click="showActive()">
              <v-icon>mdi-arrow-left-bold </v-icon>
              </v-btn><br/>
            </v-card>
            <ListContributionDetailActive/>
         </template>
       </v-card>
    <v-toolbar-title>APORTES PASIVO</v-toolbar-title>
    <v-card>
       <template v-if="!show_detail">
       <v-card class="text-right">
          <v-btn
            small
            dark
            color="success"
            class="mr-4"
            @click="showDetailPassive()">
        <span> Detalle</span> </v-btn
        ><br />
        </v-card>
      <ListContributionPassive />
       </template>
      <template v-if="show_detail">
          <v-card class="text-right">
            <v-btn
              small
              dark
              color="success"
              class="mr-4"
              @click="showPassive()">
            <v-icon>mdi-arrow-left-bold </v-icon> </v-btn><br />
          </v-card>
            <ListContributionDetailPassive/>
      </template>
    </v-card>

  </v-card>
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
  },
  components: {
    ListContributionActive,
    ListContributionPassive,
    ListContributionDetailPassive,
    ListContributionDetailActive
  },
  data: () => ({
    itemsPerPage: 0,
    loading: true,
    search: "",
    active: true,
    show_detail: false,
    show_detail_active:false,
    contributions: [],
  }),
  mounted() {
     this.show_detail_active = false;
  },
  methods: {
    expand(props) {
      props.expand(!props.isExpanded && this.active);
    },
    showDetailPassive() {
      this.show_detail = true;
    },
    showPassive() {
      this.show_detail = false;
    },
    showDetailActive(){
    this.show_detail_active = true;
    },
     showActive() {
      this.show_detail_active = false;
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
