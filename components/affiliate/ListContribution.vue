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
    <v-card>
      <ListContributionActive :affiliate.sync="affiliate" />
    </v-card>
    <v-toolbar-title>APORTES PASIVO</v-toolbar-title>
    <v-card>
      <ListContributionPassive />
    </v-card>
  </v-card>
</template>


<script>
import ListContributionActive from "@/components/affiliate/ListContributionActive.vue";
import ListContributionPassive from "@/components/affiliate/ListContributionPassive.vue";

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
  },
  data: () => ({
    itemsPerPage: 0,
    loading: true,
    search: "",
    active: true,
    show_detail: false,
    contributions: [],
    headers: [
      {
        text: "Año",
        value: "year",
        class: ["table", "white--text"],
        width: "16%",
        sortable: true,
      },
      {
        text: "Enero",
        value: "year",
        class: ["table", "white--text"],
        width: "7%",
        sortable: false,
      },
      {
        text: "Febrero",
        value: "",
        class: ["table", "white--text"],
        width: "7%",
        sortable: false,
      },
      {
        text: "Marzo",
        value: "",
        class: ["table", "white--text"],
        width: "7%",
        sortable: false,
      },
      {
        text: "Abril",
        value: "",
        class: ["table", "white--text"],
        width: "7%",
        sortable: false,
      },
      {
        text: "Mayo",
        value: "",
        class: ["table", "white--text"],
        width: "7%",
        sortable: false,
      },
      {
        text: "Junio",
        value: "",
        class: ["table", "white--text"],
        width: "7%",
        sortable: false,
      },
      {
        text: "Julio",
        value: "",
        class: ["table", "white--text"],
        width: "7%",
        sortable: false,
      },
      {
        text: "Agosto",
        value: "",
        class: ["table", "white--text"],
        width: "7%",
        sortable: false,
      },
      {
        text: "Septiembre",
        value: "",
        class: ["table", "white--text"],
        width: "7%",
        sortable: false,
      },
      {
        text: "Octubre",
        value: "",
        class: ["table", "white--text"],
        width: "7%",
        sortable: false,
      },
      {
        text: "Noviembre",
        value: "",
        class: ["table", "white--text"],
        width: "7%",
        sortable: false,
      },
      {
        text: "Diciembre",
        value: "",
        class: ["table", "white--text"],
        width: "7%",
        sortable: false,
      },
    ],

    headersDetail: [
      {
        text: "Cotizable",
        value: "quotable",
        class: ["table", "white--text"],
        width: "16%",
        sortable: true,
      },
      {
        text: "Fondo de Retiro",
        value: "retirement_fund",
        class: ["table", "white--text"],
        width: "16%",
        sortable: true,
      },
      {
        text: "Cuota Mortuoria ",
        value: "mortuary_quota",
        class: ["table", "white--text"],
        width: "16%",
        sortable: true,
      },
      {
        text: "Aporte",
        value: "total",
        class: ["table", "white--text"],
        width: "16%",
        sortable: true,
      },
      {
        text: "Reintegro",
        value: "reimbursement_total",
        class: ["table", "white--text"],
        width: "16%",
        sortable: true,
      },
    ],
  }),
  mounted() {
    this.getActiveAffiliateContribution(this.$route.params.id);
  },
  methods: {
    expand(props) {
      props.expand(!props.isExpanded && this.active);
    },
    async getActiveAffiliateContribution(id) {
      try {
        this.loading = true;
        let res = await this.$axios.post(
          `/contribution/active_affiliate_contribution`,
          {
            affiliate_id: id,
          }
        );
        this.contributions = res.payload.all_contributions;
        console.log(this.contributions);
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    showDetail() {
      this.show_detail = true;
      // this.show_detail_passive= true;
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
