<template>
  <v-row>
    <template >
      <v-col cols="6" class="text-left" >
        <v-toolbar-title >APORTES PASIVO</v-toolbar-title>
      </v-col>
      <v-col cols="6"  class="text-right " v-if="show">
        <v-tooltip top class="my-0">
          <template v-slot:activator="{ on }">
            <v-btn
              x-small
              color="info"
              :loading="loading_passive_old_age"
              v-on="on"
              class="ma-2 pa-3"
              @click="printContributionsPassive('VEJEZ')"
              outlined
              elevation="2"
            >
              <v-icon> mdi-download</v-icon>Cert. Titular
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
              color="success"
              :loading="loading_passive_widow"
              v-show="affiliate.dead && affiliate.spouse!=null"
              v-on="on"
              class="ma-2 pa-3"
              @click="printContributionsPassive('VIUDEDAD')"
              outlined
              elevation="2"
            >
              <v-icon> mdi-download</v-icon>Cert. Viudedad
            </v-btn>
          </template>
          <div>
            <span>Certificación de Aportes Viudedad</span>
          </div>
        </v-tooltip>
        <v-btn
          x-small
          color="secondary"
          class="ma-2 pa-3"
          @click="showDetailPassive()"
          outlined
          elevation="2"
        >
          <v-icon> mdi-cash</v-icon>Detalle
        </v-btn>
      </v-col>
      <v-col cols="12" v-if="show">
        <v-data-table
          :headers="headers"
          :items="contributions"
          :loading="loading"
          single-expand
          item-key="year"
          :itemsPerPage="contributions.length"
          hide-default-footer
        >
          <template v-slot:item="props">
            <tr :class="props.isExpanded ? 'secondary white--text': ''">
              <td class="text-left" @click.stop="expand(props)">{{ props.item.year }}</td>
              <td class="text-right" @click.stop="expand(props)" v-for="(key,index) in props.item.contributions" :key="index" >{{Object.entries(key.detail).length !==0 ? key.detail.total:'0,00' }}</td>
              <!--<td @click.stop="expand(props)">{{ Object.entries(props.item.contributions[0].detail).length !==0 ? props.item.contributions[0].detail.total: '0,00'}}</td> a 11 borrar -->
            </tr>
          </template>
          <template v-slot:expanded-item="{item}">
            <tr>
              <td :colspan="13" class="px-0">
                <v-data-table :items="item.contributions" :hide-default-footer="true" :itemsPerPage="12" class="tertiary">
                  <template v-slot:body="{ items }">
                    <tbody>
                      <tr v-for="header in headersDetail" :key="header.id">
                        <td class="font-weight-bold">
                          {{ header.text }}
                        </td>
                        <td class="text-right"  v-for="item in items" :key="item.id">
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
      </v-col>
      <v-col cols="12"  v-else>
        NO SE ENCONTRARON REGISTROS.
      </v-col>
    </template>
  </v-row>
</template>


<script>
export default {
  name: "ListContributionPassive",
   props: {
    affiliate: {
      type: Object,
      require: true,
    },
    show_detail: {
      type: Object,
      require: true,
    },
    state: {
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
    show:false,
    contributions: [],
    loading_passive_old_age: false,
    loading_passive_widow: false,
    headers: [
      { text: "Año",value: "year", class: ["table", "white--text", "text-left","text-uppercase"], width: "10%", sortable: true,},
      { text: "Enero",value: "", class: ["table", "white--text", "text-right","text-uppercase"], width: "7%", sortable: false,},
      { text: "Febrero",value: "", class: ["table", "white--text", "text-right","text-uppercase"], width: "7%", sortable: false,},
      { text: "Marzo",value: "", class: ["table", "white--text", "text-right","text-uppercase"], width: "7%", sortable: false,},
      { text: "Abril",value: "", class: ["table", "white--text", "text-right","text-uppercase"], width: "7%", sortable: false,},
      { text: "Mayo",value: "", class: ["table", "white--text", "text-right","text-uppercase"], width: "7%", sortable: false,},
      { text: "Junio",value: "", class: ["table", "white--text", "text-right","text-uppercase"], width: "7%", sortable: false,},
      { text: "Julio",value: "", class: ["table", "white--text", "text-right","text-uppercase"], width: "7%", sortable: false,},
      { text: "Agosto",value: "", class: ["table", "white--text", "text-right","text-uppercase"], width: "7%",sortable: false,},
      { text: "Septiembre",value: "", class: ["table", "white--text", "text-right","text-uppercase"], width: "7%",sortable: false,},
      { text: "Octubre",value: "", class: ["table", "white--text", "text-right","text-uppercase"], width: "7%",sortable: false,},
      { text: "Noviembre",value: "", class: ["table", "white--text", "text-right","text-uppercase"], width: "7%", sortable: false,},
      { text: "Diciembre",value: "",class: ["table", "white--text", "text-right","text-uppercase"], width: "7%", sortable: false,},
    ],
    headersDetail: [
      { text: "Cotizable", value: "quotable", class: ["table", "white--text", "text-left"], width: "10%", sortable: true,},
      { text: "F.S. Vejez", value: "aps_total_fs", class: ["table", "white--text", "text-left"], width: "10%", sortable: true,},
      { text: "F.C. Cotización", value: "aps_total_cc", class: ["table", "white--text", "text-left"], width: "10%", sortable: true,},
      { text: "F.S. Acumulado", value: "aps_total_fsa", class: ["table", "white--text", "text-left"], width: "10%", sortable: true,},
      { text: "R. Invalidez", value: "aps_disability", class: ["table", "white--text", "text-left"], width: "10%", sortable: true,},
      { text: "R. por Muerte", value: "aps_total_death", class: ["table", "white--text", "text-left"], width: "10%", sortable: true,},
      { text: "Aporte", value: "total", class: ["table", "white--text", "text-left"], width: "10%", sortable: true,},
      { text: "Reintegro", value: "aps_reimbursement", class: ["table", "white--text", "text-left"], width: "10%", sortable: true,},
    ],
  }),
  mounted() {
    this.getPassiveAffiliateContribution(this.$route.params.id);
  },
  methods: {
    expand(props) {
      props.expand(!props.isExpanded && this.active);
    },
    async getPassiveAffiliateContribution(id) {
      try {
        this.loading = true;
        let res = await this.$axios.post(
          `/contribution/passive_affiliate_contribution`,
          {
            affiliate_id: id,
          }
        );
        this.show = res.hasContributionPassives;
        this.contributions = res.payload.all_contributions;
        console.log(this.contributions);
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    async printContributionsPassive(type_contribution) {
      if(type_contribution=="VEJEZ"){
         this.loading_passive_old_age = true;
      }else{
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
    showContribution() {
      if (this.show_detail.active == true || this.show_detail.passive == true)
        this.state.active = false;
      },
    showDetailPassive() {
      this.state.active = true;
      this.show_detail.passive = true;
      this.show_detail.active = false;
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
