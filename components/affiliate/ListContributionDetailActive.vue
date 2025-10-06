<template>
  <div>
    <!-- Eliminación en rango--->
    <v-card elevation="1" flat outlined class="ma-2 pa-2">
      <div class="d-flex align-center">
        <strong>Seleccione el rango de aportes a eliminar: </strong>
        <v-text-field
          dense
          outlined
          hide-details
          style="max-width: 200px;"
          v-model="date_start"
          label="Fecha inicio"
          type="date"
          clearable
          @input="date_start = adjustedDate(date_start)"
        ></v-text-field>
        <v-text-field
          dense
          outlined
          hide-details
          style="max-width: 200px;"
          v-model="date_end"
          label="Fecha fin"
          type="date"
          class="ml-2"
          clearable
          @input="date_end = adjustedDate(date_end)"
        ></v-text-field>
        <v-btn 
          icon 
          color="red" 
          outlined 
          class="ml-2"
          @click.stop="dialog=true; type_delete='massive'"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </v-card>

    <v-select
      dense
      v-model="selectedHeaders"
      :items="headers"
      label="Seleccionar columnas"
      multiple
      outlined
      return-object
      class="select-fields"
      color= 'secondary'
    >
      <template v-slot:selection="{ index }">
        <span v-if="index === showHeaders.length -1" class="secondary--text caption"
          >{{ headersMap.length != showHeaders.length ? '(+ ' + (headersMap.length - showHeaders.length) + ' por adiconar)':'Nada por adicionar' }}</span
        >
      </template>
    </v-select>

  <v-data-table
    dense
    :headers="showHeaders"
    :items="contribution_list"
    :options.sync="options"
    :loading="loading_table"
    :server-items-length="total_contributions"
    :key="refresh_table"
    :footer-props="{
      showFirstLastPage: true,
      firstIcon: 'mdi-arrow-collapse-left',
      lastIcon: 'mdi-arrow-collapse-right',
      prevIcon: 'mdi-minus',
      nextIcon: 'mdi-plus',
      'items-per-page-text':'Filas por página',
      itemsPerPageOptions: [12, -1],
     
    }"
  >
    <template v-slot:[`header.con_re`]="{ header }">
      <span :class="searching.con_re ? 'primary--text' : ''">{{
        header.text
      }}</span>
    </template>
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
        <td v-if="showInputText.includes('con_re')">
          <v-select
            dense
            :items="items"
            item-text = "name"
            item-value = "value"
            v-model = "searching.con_re"
            @change = "searchTimeOut()"
            spellcheck = "false"
            close-on-click
          ></v-select>
        </td>
        <td v-if="showInputText.includes('year')">
          <v-text-field
            placeholder="Año"
            spellcheck="false"
            class="filter-text"
            v-model="searching.year"
            @keyup="searchTimeOut()"
          ></v-text-field>
        </td>
        <td v-if="showInputText.includes('month')">
          <v-text-field
            placeholder="Mes"
            spellcheck="false"
            class="filter-text"
            v-model="searching.month"
            @keyup="searchTimeOut()"
          ></v-text-field>
        </td>
        <td v-if="showInputText.includes('degree_shortened')"><v-text-field disabled class="filter-text"></v-text-field></td>
        <td v-if="showInputText.includes('unit_code')"><v-text-field disabled class="filter-text"></v-text-field></td>
        <td v-if="showInputText.includes('base_wage')"><v-text-field disabled class="filter-text"></v-text-field></td>
        <td v-if="showInputText.includes('seniority_bonus')"><v-text-field disabled class="filter-text"></v-text-field></td>
        <td v-if="showInputText.includes('stydy_bonus')"><v-text-field disabled class="filter-text"></v-text-field></td>
        <td v-if="showInputText.includes('position_bonus')"><v-text-field disabled class="filter-text"></v-text-field></td>
        <td v-if="showInputText.includes('border_bonus')"><v-text-field disabled class="filter-text"></v-text-field></td>
        <td v-if="showInputText.includes('east_bonus')"><v-text-field disabled class="filter-text"></v-text-field></td>
        <td v-if="showInputText.includes('public_security_bonus')"><v-text-field disabled class="filter-text"></v-text-field></td>
        <td v-if="showInputText.includes('gain')"><v-text-field disabled class="filter-text"></v-text-field></td>
        <td v-if="showInputText.includes('quotable')"><v-text-field disabled class="filter-text"></v-text-field></td>
        <td v-if="showInputText.includes('retirement_fund')"><v-text-field disabled class="filter-text"></v-text-field></td>
        <td v-if="showInputText.includes('mortuary_quota')"><v-text-field disabled class="filter-text"></v-text-field></td>
        <td v-if="showInputText.includes('total')"><v-text-field disabled class="filter-text"></v-text-field></td>
        <td v-if="showInputText.includes('breakdown_name')">
          <v-text-field
            placeholder="Desglose"
            spellcheck="false"
            class="filter-text"
            v-model="searching.breakdown"
            @keyup="searchTimeOut()"
          ></v-text-field>
        </td>
        <td v-if="showInputText.includes('type')"><v-text-field disabled class="filter-text"></v-text-field></td>
        <td v-if="showInputText.includes('actions')"><v-text-field disabled class="filter-text"></v-text-field></td>
      </tr>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            small
            v-on="on"
            @click="dialogDelete(item.con_re_id); type_delete='individual'"
            color="error"
            :disabled="!(item.can_deleted && permissionSimpleSelected.includes('delete-contribution'))"
          >
            <v-icon v-if="permissionSimpleSelected.includes('delete-contribution')">
                mdi-delete
            </v-icon>
          </v-btn>
        </template>
        <span>Eliminar contribución</span>
      </v-tooltip>
    </template>
  </v-data-table>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title class="text-h5">
         {{ type_delete == 'individual' ? 'Esta seguro de eliminar el registro?' : 'Esta seguro de eliminar los registros del rango?'}}
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="dialog=false">Cerrar</v-btn>
        <v-btn color="success" text @click="type_delete == 'individual' ? deleteItem() : deleteMassive()">
          Confirmar
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </div>
</template>

<script>
export default {
  name: "ListContributionDetailActive",
  components: {},
  affiliate: {
    type: Object,
    require: true,
  },
  data: () => ({
    searching: {
      con_re:"",
      year: "",
      month: "",
      breakdown:""
    },
    items: [
        {
          name: "CON",
          value: 'CON',
        },{
          name: "RE",
          value: 'RE',
        },{
          name: "TODOS",
          value: '',
        },
      ],
    options: {
      page: 1,
      itemsPerPage: 0,
      sortBy: ["month_year"],
      sortDesc: [true],
    },
    total_contributions: 0,
    loading_table: false,
    active: true,
    contribution_list: [],
    headersMap: [
      {
        text: "Tipo",
        value: "con_re",
        input: "",
        class: ["table", "white--text"],
        width: "5%",
        sortable: false,
        active: true
      },{
        text: "Año",
        value: "year",
        input: "",
        class: ["table", "white--text"],
        width: "10%",
        sortable: true,
        active: true
      },{
        text: "Mes",
        value: "month",
        input: "",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
        active: true
      },
      {
        text: "Grado",
        value: "degree_shortened",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
        active: false
      },
      {
        text: "Unidad",
        value: "unit_code",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
        active: false
      },{
        text: "Sueldo",
        value: "base_wage",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
        active: true
      },{
        text: "Antigüedad",
        value: "seniority_bonus",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
        active: true
      },
      {
        text: "Estudio",
        value: "study_bonus",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
        active: false
      },
      {
        text: "Cargo",
        value: "position_bonus",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
        active: false
      },
      {
        text: "Frontera",
        value: "border_bonus",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
        active: false
      },
      {
        text: "Oriente",
        value: "east_bonus",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
        active: false
      },
      {
        text: "Seguridad",
        value: "public_security_bonus",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
        active: false
      },{
        text: "Ganado",
        value: "gain",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
        active: true
      },{
        text: "Cotizable",
        value: "quotable",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
        active: true
      },{
        text: "F.R.",
        value: "retirement_fund",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
        active: true
      },{
        text: "C.M.",
        value: "mortuary_quota",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
        active: true
      },{
        text: "Aporte",
        value: "total",
        class: ["table", "white--text"],
        width: "10%",
        sortable: false,
        active: true
      },{
        text: "Desg.",
        value: "breakdown_name",
        class: ["table", "white--text"],
        width: "20%",
        sortable: false,
        active: true
      },{
        text: "Tipo.",
        value: "type",
        class: ["table", "white--text"],
        width: "20%",
        sortable: false,
        active: false
      },{
        text: "Acciones",
        value: "actions",
        class: ["table", "white--text"],
        width: "20%",
        sortable: false,
        active: true
      },
    ],
    dialog: false,
    delete_id: null,
    refresh_table:0,
    selectedHeaders: [],
    headers: [],
    inputText:[],
    date_start: null,
    date_end: null,
    type_delete: 'individual'
  }),

  watch: {
    options: function (newVal, oldVal) {
      if (
        newVal.page != oldVal.page ||
        newVal.itemsPerPage != oldVal.itemsPerPage ||
        newVal.sortBy != oldVal.sortBy ||
        newVal.sortDesc != oldVal.sortDesc
      ) {
        this.getSearchActiveAffiliateContribution();
      }
    },
    searching: {
      deep: true,
      handler(val) {
        this.options.page = 1;
      },
    },
    refresh_table: function (newVal, oldVal) {
      if(newVal != oldVal)
        this.getSearchActiveAffiliateContribution()
    }
  },

  computed: {
    //permisos del selector global por rol
    permissionSimpleSelected () {
      return this.$store.getters.permissionSimpleSelected
    },
    //Obtener encaebzados ordenados
    showHeaders() {
      return this.headers.filter((s) => this.selectedHeaders.includes(s));
    },
    showInputText() {
      this.inputText =Object.values(this.selectedHeaders)
      return this.inputText.map(item => item.value);
    },
  },
  created(){
    this.headers = Object.values(this.headersMap);
    for (let i = 0; i < this.headers.length; i++) {
      if (this.headers[i].active) {
        this.selectedHeaders.push(this.headers[i]);
      }
    }
  },

  mounted() {
    this.getSearchActiveAffiliateContribution();
  },
  methods: {
    async getSearchActiveAffiliateContribution() {
      try {
        this.loading_table = true;
        let res = await this.$axios.get(
          `/contribution/search_active_affiliate_contribution`, undefined, {
            params: {
              affiliate_id: this.$route.params.id,
              con_re: this.searching.con_re,
              year: this.searching.year,
              month: this.searching.month,
              breakdown:this.searching.breakdown,
              contributionable_type: this.searching.contributionable_type,
              page: this.options.page,
              per_page: this.options.itemsPerPage,
              sortBy: this.options.sortBy,
              sortDesc: this.options.sortDesc,
            }
          }
        );
        this.contribution_list = res.data;
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
    searchTimeOut() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.getSearchActiveAffiliateContribution()
      }, 800);
    },
    dialogDelete(item){
      this.dialog= true
      this.delete_id=item
    },
    async deleteItem(){
      try {
        let res = await this.$axios.delete(`/contribution/contribution/${this.delete_id}`)
        this.dialog = false
        this.refresh_table ++
        if(!res.error){
          this.$toast.success(res.message)
        }else{
          this.$toast.error(res.message)
        }
      } catch (e) {
        this.dialog = false
        console.log(e)
      }
    },    
    async deleteMassive(){
      try {
        let res = await this.$axios.delete('/contribution/contribution/massive', {  
            affiliate_id: Number(this.$route.params.id),
            date_start: this.date_start,
            date_end: this.date_end,          
            }, {
            headers: { 'X-HTTP-Method-Override': 'DELETE' }
          })
          this.dialog = false
          this.refresh_table ++
         if(!res.error)
            this.$toast.success(res.message) 
         else
            this.$toast.error(res.message)
          this.clear_inputs()
      } catch (e) {
        console.log(e)
        this.dialog= false
      }
    },
    adjustedDate(date) {
      if (!date) return null;
      const [year, month] = date.split('-');
      return `${year}-${month}-01`;
    },
    clear_inputs(){
      this.date_start = null
      this.date_end = null
    }
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
.select-fields {
  max-width: 200px;
  margin-bottom: -30px;
  position: absolute;
  right: 10px;
  margin-top: -45px;
  padding-right: 20px;

}
</style>
