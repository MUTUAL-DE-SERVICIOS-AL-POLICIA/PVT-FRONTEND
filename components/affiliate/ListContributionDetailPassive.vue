<template>
  <v-data-table
    dense
    :headers="headers"
    :items="contribution_list"
    :options.sync="options"
    :loading="loading_table"
    :server-items-length="total_contributions"
  >
    <template v-slot:[`header.year`]="{ header }">
      <span :class="searching.year ? 'primary--text' : ''">{{
        header.text
      }}</span>
    </template>
    <template v-slot:[`header.month`]="{ header }">
      <span :class="searching.month ? 'primary--text' : ''">{{
        header.text
      }}</span>
    </template>
    <template slot="body.prepend">
      <tr>
        <td>
          <v-text-field
            placeholder="Año"
            spellcheck="false"
            class="filter-text"
            v-model="searching.year"
            @input="getSearchPassiveAffiliateContribution()"
          ></v-text-field>
        </td>
        <td>
          <v-text-field
            placeholder="Mes"
            spellcheck="false"
            class="filter-text"
            v-model="searching.month"
            @input="getSearchPassiveAffiliateContribution()"
          ></v-text-field>
        </td>
        <td><v-text-field disabled class="filter-text"></v-text-field></td>
        <td><v-text-field disabled class="filter-text"></v-text-field></td>
        <td><v-text-field disabled class="filter-text"></v-text-field></td>
        <td><v-text-field disabled class="filter-text"></v-text-field></td>
        <td><v-text-field disabled class="filter-text"></v-text-field></td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "ListContributionDetailPassive",
  components: {},
  affiliate: {
    type: Object,
    require: true,
  },
  data: () => ({
    searching: {
      year: "",
      month: "",
      contributionable_type: "",
      contributionable_type_name: " ",
    },
    options: {
      page: 1,
      itemsPerPage: 8,
      sortBy: ["month_year"],
      sortDesc: [false],
    },

    total_contributions: 0,
    loading_table: false,
    active: true,
    contribution_list: [],
    headers: [
      {
        text: "Año",
        value: "year",
        input: "",
        class: ["table", "white--text"],
        width: "10%",
        sortable: true,
      },
      {
        text: "Mes",
        value: "month",
        input: "",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
      },
      {
        text: "Renta",
        value: "rent_pension",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
      },
      {
        text: "Renta Dignidad",
        value: "dignity_rent",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
      },
      {
        text: "Cotizable",
        value: "quotable",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
      },
      {
        text: "Aporte Auxilio Mortuorio",
        value: "total",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
      },
      {
        text: "Tipo",
        value: "contributionable_type_name",
        class: ["table", "white--text"],
        width: "15%",
        sortable: false,
      },
    ],
  }),

  watch: {
    options: function (newVal, oldVal) {
      if (
        newVal.page != oldVal.page ||
        newVal.itemsPerPage != oldVal.itemsPerPage ||
        newVal.sortBy != oldVal.sortBy ||
        newVal.sortDesc != oldVal.sortDesc
      ) {
        this.getSearchPassiveAffiliateContribution();
      }
    },
    searching: {
      deep: true,
      handler(val) {
        this.options.page = 1;
      },
    },
  },
  mounted() {
    this.getSearchPassiveAffiliateContribution();
  },
  methods: {
    async getSearchPassiveAffiliateContribution() {
      try {
        this.loading_table = true;
        let res = await this.$axios.get(
          `/contribution/search_passive_affiliate_contribution`, undefined, {
          params: {
            affiliate_id: this.$route.params.id,
            year: this.searching.year,
            month: this.searching.month,
            contributionable_type: this.searching.contributionable_type,
            page: this.options.page,
            per_page: this.options.itemsPerPage,
            sortBy: this.options.sortBy,
            sortDesc: this.options.sortDesc,
          }
          }
        );
        this.contribution_list = res.data;
        console.log(this.contribution_list);
        this.total_contributions = res.total;
        this.options.page = res.current_page;
        this.options.itemsPerPage = parseInt(res.per_page);
        this.loading_table = false;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading_table = false;
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
