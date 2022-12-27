<template>
  <v-container fluid>
    <v-form>
      <v-row >
        <v-col cols="12"  class="text-left mt-0">
          <v-toolbar-title>APORTES</v-toolbar-title>
        </v-col>
        <v-col cols="4" class="my-0 py-0">
          <span
            ><strong class="text-uppercase">Fecha ingreso a la Institución Policial: </strong
            >{{
              affiliate.date_entry != null && affiliate.date_entry.trim() != ""
                ? $filters.date(affiliate.date_entry)
                : "Sin Registro"
            }}</span
          ><br />
        </v-col>
        <v-col cols="4" class="my-0 py-0">
          <span
            ><strong class="text-uppercase">Fecha desvinculación: </strong
            >{{
              affiliate.date_derelict != null &&
              affiliate.date_derelict.trim() != ""
                ? $filters.date(affiliate.date_derelict)
                : "Sin Registro"
            }}</span
          ><br />
        </v-col>
        <v-col cols="4" class="my-0 py-0">
          <span
            ><strong class="text-uppercase">Último período según Listas de Revista: </strong
            >{{
              affiliate.date_last_contribution != null &&
              affiliate.date_last_contribution.trim() != ""
                ? $filters.date(affiliate.date_last_contribution)
                : "Sin Registro"
            }}</span
          ><br />
        </v-col>
      </v-row>
      <template v-if="!state.active" class="my-0 py-0">
        <ListContributionActive :affiliate.sync="affiliate" :show_detail="show_detail" :state.sync="state"/>
        <ListContributionPassive :affiliate.sync="affiliate" :show_detail="show_detail" :state.sync="state"/>
      </template>
      <template v-else-if="state.active">
        <template v-if="show_detail.active">
          <v-row >
            <v-col cols="12" class="text-left">
              <v-toolbar-title>
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
                    <span>Aportes</span>
                  </div>
                </v-tooltip>
                DETALLE DE APORTES ACTIVO
             </v-toolbar-title>
            </v-col>
          </v-row>
          <ListContributionDetailActive />
        </template>
        <template v-if="show_detail.passive">
          <v-row>
            <v-col cols="12" class="text-left">
              <v-toolbar-title>
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
                    <span>Aportes</span>
                  </div>
                </v-tooltip>
                DETALLE DE APORTES PASIVO
              </v-toolbar-title>
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
  }),
  mounted() {

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
