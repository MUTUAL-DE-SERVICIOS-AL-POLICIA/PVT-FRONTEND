<template>
  <v-data-table
    :headers="headers"
    :items="contribution_list"
    :loading="loading"
    single-expand
  >
    <template v-slot:item="props">
      <tr :class="props.isExpanded ? 'table white--text': ''">
        <td @click.stop="expand(props)">{{ props.item.year }}</td>
      </tr>
    </template>
    <template v-slot:expanded-item="{ item }">
      <tr>
        <td :colspan="13" class="px-0">
          <v-data-table :items="item.contributions" :hide-default-footer="true">
            <template v-slot:body="{ items }">
              <tbody>
                <tr v-for="header in headersDetail" :key="header.id">
                  <td>
                    {{ header.text }}
                  </td>
                  <td v-for="item in items" :key="item.id">
                    {{ item[header.value] }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "Contribution",
  components: {
  
  },
  affiliate: {
    type: Object,
    require: true,
  },
  data: () => ({
    loading: true,
    search: "",
    active: true,
    contribution_list: [],
    headers: [
      {
        text: "Año",
        value: "year",
        class: ["table", "white--text"],
        width: "10%",
        sortable: true,
      },
      {
        text: "Enero",
        value: "year",
        class: ["table", "white--text"],
        width: "10%",
        sortable: true,
      },
      {
        text: "Febrero",
        value: "",
        class: ["table", "white--text"],
        width: "10%",
        sortable: true,
      },
      {
        text: "Marzo",
        value: "",
        class: ["table", "white--text"],
        width: "10%",
        sortable: true,
      },
      {
        text: "Abril",
        value: "",
        class: ["table", "white--text"],
        width: "10%",
        sortable: true,
      },
      {
        text: "Mayo",
        value: "",
        class: ["table", "white--text"],
        width: "10%",
        sortable: true,
      },
      {
        text: "Junio",
        value: "",
        class: ["table", "white--text"],
        width: "10%",
        sortable: true,
      },
      {
        text: "Julio",
        value: "",
        class: ["table", "white--text"],
        width: "10%",
        sortable: true,
      },
      {
        text: "Agosto",
        value: "",
        class: ["table", "white--text"],
        width: "10%",
        sortable: true,
      },
      {
        text: "Septiembre",
        value: "",
        class: ["table", "white--text"],
        width: "10%",
        sortable: true,
      },
      {
        text: "Octubre",
        value: "",
        class: ["table", "white--text"],
        width: "10%",
        sortable: true,
      },
      {
        text: "Noviembre",
        value: "",
        class: ["table", "white--text"],
        width: "10%",
        sortable: true,
      },
      {
        text: "Diciembre",
        value: "",
        class: ["table", "white--text"],
        width: "10%",
        sortable: true,
      },
    ],

    headersDetail: [
      {
        text: "Cotizable",
        value: "quotable",
        class: ["table", "white--text"],
        width: "8%",
        sortable: true,
      },
      {
        text: "Fondo de Retiro",
        value: "retirement_fund",
        class: ["table", "white--text"],
        width: "8%",
        sortable: true,
      },
      {
        text: "Cuota Mortuoria ",
        value: "mortuary_quota",
        class: ["table", "white--text"],
        width: "8%",
        sortable: true,
      },
      {
        text: "Aporte",
        value: "total",
        class: ["table", "white--text"],
        width: "8%",
        sortable: true,
      },
      {
        text: "Reintegro",
        value: "reimbursement_total",
        class: ["table", "white--text"],
        width: "8%",
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
        this.contribution_list = res.payload.contributions_total;
        console.log(this.contribution_list);
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
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
