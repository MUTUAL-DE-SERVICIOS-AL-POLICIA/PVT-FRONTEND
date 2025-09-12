<template>
  <v-container fluid>
    <v-form>
      <v-row>
        <v-col cols="12" class="text-left mt-0">
          <v-toolbar-title>APORTES</v-toolbar-title>
        </v-col>

        <v-col cols="12" class="ma-0 pa-0">
          <v-card-text>
            <div v-for="(date, label) in formattedDates" :key="label">
              <strong class="text-uppercase">{{ label }}: </strong>
              {{ date }}
            </div>
          </v-card-text>
        </v-col>
      </v-row>
      <template v-if="!state.active">
        <v-tabs left background-color="backgroundTab" class= "pt-2" v-model="tab" grow>
        <v-tab :href="`#tab-1`"><v-icon left>mdi-account-check</v-icon> Aportes Activo</v-tab>
        <v-tab :href="`#tab-2`"><v-icon left>mdi-account-off</v-icon> Aportes Pasivo</v-tab>
          <v-tab-item :value="'tab-1'">
            <ListContributionActive :affiliate.sync="affiliate" :show_detail="show_detail" :state.sync="state"/>
          </v-tab-item>
          <v-tab-item :value="`tab-2`">
            <ListContributionPassive :affiliate.sync="affiliate" :show_detail="show_detail" :state.sync="state"/>
          </v-tab-item>
        </v-tabs>
      </template>

      <template v-if="show_detail.active && state.active">
        <v-row >
          <v-col cols="12">
            <v-toolbar-title class="subtitle-2">
              <v-tooltip top>
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
                  <span>Regresar a Aportes Activo</span>
                </div>
              </v-tooltip>
              DETALLE DE APORTES ACTIVO
           </v-toolbar-title>
          </v-col>
        </v-row>
        <ListContributionDetailActive />
      </template>
      <template v-if="show_detail.passive && state.active">
        <v-row>
          <v-col cols="12">
            <v-toolbar-title class="subtitle-2">
              <v-tooltip top>
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
                  <span>Regresar a Aportes Pasivo</span>
                </div>
              </v-tooltip>
              DETALLE DE APORTES PASIVO
            </v-toolbar-title>
          </v-col>
        </v-row>
        <ListContributionDetailPassive />
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
    state: {
      type: Object,
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
    contributions: [],
    list: [],
    tab: 0,
    state_affiliate:[
      {name_tab:"ACTIVO", value:"0"},
      {name_tab:"PASIVO", value:"1"}
    ],
  }),
  computed: {
    formattedDates() {
      const fields = {
        "Fecha de ingreso a la Institución Policial": this.affiliate.date_entry,
        "Fecha de desvinculación": this.affiliate.date_derelict,
        "Último período según Listas de Revista": this.affiliate.date_last_contribution,
      };

      const result = {};
      for (const label in fields) {
        const value = fields[label];
        result[label] = value && value.trim() !== "" ? this.$filters.date(value) : "Sin Registro";
      }
      return result;
    }
  },
  methods: {

    showContribution() {
      if (this.show_detail.active == true || this.show_detail.passive == true)
        this.state.active = false;
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
