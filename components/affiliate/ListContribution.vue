<template>
  <v-card v-if="!state">
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
    <v-card class="text-right">
      <v-btn
        small
        dark
        color="success"
        class="mr-4"
        @click="showDetailActive()"
      >
        <span> Detalle</span> </v-btn
      ><br />
    </v-card>
    <ListContributionActive />
    <v-toolbar-title>APORTES PASIVO</v-toolbar-title>
    <v-card class="text-right">
      <v-btn
        small
        dark
        color="success"
        class="mr-4"
        @click="showDetailPassive()"
      >
        <span> Detalle</span> </v-btn
      ><br />
    </v-card>
    <ListContributionPassive />
  </v-card>
  <v-card v-else-if="state">
    <template v-if="show_detail.active">
      <v-toolbar-title> DETALLE DE APORTES ACTIVO</v-toolbar-title>
      <v-row>
        <v-col cols="12" sm="6" md="10">
          <v-tooltip top class="my-0">
            <template v-slot:activator="{ on }">
              <v-btn
                small
                dark
                icon
                v-model="show_detail.active"
                color="success"
                v-on="on"
                class="mr-4"
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
        <v-col cols="12" sm="6" md="2">
          <v-spacer></v-spacer>
          <v-tooltip top class="my-0">
            <template v-slot:activator="{ on }">
              <v-btn
                small
                dark
                :color="'success'"
                :loading="loading_print"
                v-on="on"
                class="mr-4"
                @click="printContributionsActive()"
              >
                <v-icon> mdi-download</v-icon>Descargar
              </v-btn>
            </template>
            <div>
              <span>Certificación de Aportes</span>
            </div>
          </v-tooltip>
          <br />
        </v-col>
      </v-row>
      <ListContributionDetailActive />
    </template>
    <template v-if="show_detail.passive">
      <v-toolbar-title> DETALLE DE APORTES PASIVO</v-toolbar-title>
      <v-row>
        <v-col cols="12" sm="6" md="10">
          <v-tooltip top class="my-0">
            <template v-slot:activator="{ on }">
              <v-btn
                small
                dark
                icon
                v-model="show_detail.passive"
                color="success"
                v-on="on"
                class="mr-4"
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
        <v-col cols="12" sm="6" md="2">
          <v-spacer></v-spacer>
          <v-tooltip top class="my-0">
            <template v-slot:activator="{ on }">
              <v-btn
                small
                dark
                :color="'success'"
                :loading="loading_print"
                v-on="on"
                class="mr-4"
                @click="printContributionsPassive()"
              >
                <v-icon> mdi-download</v-icon>Descargar
              </v-btn>
            </template>
            <div>
              <span>Certificación de Aportes</span>
            </div>
          </v-tooltip>
          <br />
        </v-col>
      </v-row>
      <ListContributionDetailPassive />
    </template>
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
    loading_print: false,
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
      this.loading_print = true;
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
        this.loading_print = false;
      } finally {
        this.loading_print = false;
      }
    },
    async printContributionsPassive() {
      this.loading_print = true;
      try {
        let res = await this.$axios.get(
          `/contribution/print_contributions_passive/${this.$route.params.id}`,
          undefined,
          { responseType: "blob" }
        );
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Aporte_Pasivo.pdf");
        document.body.appendChild(link);
        link.click();
      } catch (e) {
        console.log(e);
        this.loading_print = false;
      } finally {
        this.loading_print = false;
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
