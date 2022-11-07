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
    <v-data-table
    :headers="headers"
    :items="contributions"
    :loading="loading"
    single-expand
  >
    <template v-slot:item="props">
      <tr :class="props.isExpanded ? 'table white--text': ''">
        <td @click.stop="expand(props)">{{ props.item.year }}</td>
        <td @click.stop="expand(props)">{{ Object.entries(props.item.contributions[0].detail).length !==0 ? props.item.contributions[0].detail.total: '0,00' }}</td>
        <td @click.stop="expand(props)">{{ Object.entries(props.item.contributions[1].detail).length !==0 ? props.item.contributions[1].detail.total: '0,00' }}</td>
        <td @click.stop="expand(props)">{{ Object.entries(props.item.contributions[2].detail).length !==0 ? props.item.contributions[2].detail.total: '0,00' }}</td>
        <td @click.stop="expand(props)">{{ Object.entries(props.item.contributions[3].detail).length !==0 ? props.item.contributions[3].detail.total: '0,00' }}</td>
        <td @click.stop="expand(props)">{{ Object.entries(props.item.contributions[4].detail).length !==0 ? props.item.contributions[4].detail.total: '0,00' }}</td>
        <td @click.stop="expand(props)">{{ Object.entries(props.item.contributions[5].detail).length !==0 ? props.item.contributions[5].detail.total: '0,00' }}</td>
        <td @click.stop="expand(props)">{{ Object.entries(props.item.contributions[6].detail).length !==0 ? props.item.contributions[6].detail.total: '0,00' }}</td>
        <td @click.stop="expand(props)">{{ Object.entries(props.item.contributions[7].detail).length !==0 ? props.item.contributions[7].detail.total: '0,00' }}</td>
        <td @click.stop="expand(props)">{{ Object.entries(props.item.contributions[8].detail).length !==0 ? props.item.contributions[8].detail.total: '0,00' }}</td>
        <td @click.stop="expand(props)">{{ Object.entries(props.item.contributions[9].detail).length !==0 ? props.item.contributions[9].detail.total: '0,00' }}</td>
        <td @click.stop="expand(props)">{{ Object.entries(props.item.contributions[10].detail).length !==0 ? props.item.contributions[10].detail.total: '0,00'}}</td>
        <td @click.stop="expand(props)">{{ Object.entries(props.item.contributions[11].detail).length !==0 ? props.item.contributions[11].detail.total: '0,00'}}</td>
      </tr>
    </template>
    <template v-slot:expanded-item="{item}">
      <tr>
        <td :colspan="13" class="px-0">
          <v-data-table :items="item.contributions" :hide-default-footer="true" :itemsPerPage="12">
            <template v-slot:body="{ items }">
              <tbody>
                <tr v-for="header in headersDetail" :key="header.id">
                  <td>
                    {{ header.text }}
                  </td>
                  <td v-for="item in items" :key="item.id">
                    {{ Object.entries(item.detail).length !==0 ? item.detail[header.value]: '0,00'}}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </td>
      </tr>
    </template>
  </v-data-table>
  </v-card>
</template>


<script>
export default {
  name: "ListContribution",
  props: {
    affiliate: {
      type: Object,
      require: true,
    },
  },
  components: {},
  data: () => ({
    itemsPerPage: 0,
    loading: true,
    search: "",
    active: true,
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
