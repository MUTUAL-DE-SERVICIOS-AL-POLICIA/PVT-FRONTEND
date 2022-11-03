 <template>
  <v-container fluid>
    <v-form>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-container class="py-0">
            <v-row>
              <v-col cols="12">
                <v-toolbar-title>DATOS PERSONALES</v-toolbar-title>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  dense
                  v-model="affiliate.first_name"
                  :disabled="!editable"
                  :outlined="editable"
                  label="Primer Nombre"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  dense
                  v-model="affiliate.second_name"
                  :disabled="!editable"
                  :outlined="editable"
                  label="Segundo Nombre"
                  >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  dense
                  v-model="affiliate.last_name"
                  :disabled="!editable"
                  :outlined="editable"
                  label="Apellido Paterno"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  dense
                  v-model="affiliate.mothers_last_name"
                  :disabled="!editable"
                  :outlined="editable"
                  label="Apellido Materno"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  dense
                  v-model="affiliate.surname_husband"
                  :disabled="!editable"
                  :outlined="editable"
                  label="Apellido de Casada"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  dense
                  :items="genders"
                  item-text="name"
                  item-value="value"
                  :disabled="!editable"
                  :outlined="editable"
                  label="Género"
                  v-model="affiliate.gender"
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  dense
                  v-model="affiliate.identity_card"
                  :disabled="!editable"
                  :outlined="editable"
                  label="Cédula de Identidad"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  dense
                  :items="cities"
                  item-text="name"
                  item-value="id"
                  label="Ciudad de Expedición"
                  :disabled="!editable"
                  :outlined="editable"
                  v-model="affiliate.city_identity_card_id"
                  >
                </v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  dense
                  v-model="affiliate.registration"
                  :disabled="!editable"
                  :outlined="editable"
                  label="Matrícula"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="5" >
                <v-text-field
                  dense
                  v-model="affiliate.due_date"
                  label="Fecha Vencimiento C.I"
                  hint="Día/Mes/Año"
                  type="date"
                  :clearable="editable"
                  :readonly="!editable"
                  :outlined="editable"
                  :disabled="!editable"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-checkbox
                  dense
                  v-model="affiliate.is_duedate_undefined"
                  :readonly="!editable"
                  :outlined="editable"
                  :disabled="!editable"
                  :label="`Indefinido`"
                >
                </v-checkbox>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  dense
                  :loading="loading"
                  :items="civil_statuses"
                  item-text="name"
                  item-value="value"
                  label="Estado Civil"
                  v-model="affiliate.civil_status"
                  :readonly="!editable"
                  :outlined="editable"
                  :disabled="!editable"
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  dense
                  v-model="affiliate.birth_date"
                  label="Fecha Nacimiento"
                  hint="Día/Mes/Año"
                  type="date"
                  :readonly="!editable"
                  :outlined="editable"
                  :disabled="!editable"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  dense
                  :loading="loading"
                  :items="cities"
                  item-text="name"
                  item-value="id"
                  label="Ciudad de Nacimiento"
                  v-model="affiliate.city_birth_id"
                  :readonly="!editable"
                  :outlined="editable"
                  :disabled="!editable"
                >
                </v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col cols="12" md="6">
          <v-row justify="center">
            <v-col cols="12">
              <v-toolbar-title>INFORMACIÓN POLICIAL</v-toolbar-title>
            </v-col>
              <v-col cols="12" md="6">
                <v-select
                  dense
                  :loading="loading"
                  :items="affiliateState"
                  item-text="name"
                  item-value="id"
                  label="Estado"
                  v-model="affiliate.affiliate_state_id"
                  :Onchange="Onchange()"
                  :readonly="!editable"
                  :outlined="editable"
                  :disabled="!editable"
                ></v-select>
              </v-col>
            <v-col cols="12" md="6" v-if="!visible">
              <span class="red--text" v-show="(affiliate.death_certificate_number != null && affiliate.death_certificate_number.trim() != '') ||
                  (affiliate.date_death != null && affiliate.date_death.trim() != '') ||
                  (affiliate.reason_death != null && affiliate.reason_death.trim() != '')">
                ** Se tiene registrado datos de fallecimiento del afiliado,
                cambie el estado del afiliado a Fallecido.</span>
            </v-col>
            <v-col cols="12" md="6" v-if="visible">
              <v-text-field
                dense
                v-model="affiliate.date_death"
                label="Fecha Fallecimiento"
                hint="Día/Mes/Año"
                type="date"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6" v-if="visible">
              <v-text-field
                dense
                v-model="affiliate.death_certificate_number"
                label="N° de Certificado de Defunción"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6" v-if="visible">
              <v-text-field
                dense
                v-model="affiliate.reason_death"
                label="Causa Fallecimiento"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                v-model="affiliate.date_entry"
                label="Fecha Ingreso a la Institución Policial"
                hint="Día/Mes/Año"
                type="date"
                :clearable="editable"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                dense
                :loading="loading"
                :items="degree"
                item-text="name"
                item-value="id"
                label="Grado"
                name="Grado"
                v-model="affiliate.degree_id"
                :readonly="!editable "
                :outlined="editable "
                :disabled="!editable"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                dense
                :loading="loading"
                :items="category"
                item-text="name"
                item-value="id"
                label="Categoria"
                name="categoria"
                v-model="affiliate.category_id"
                :readonly="!editable "
                :outlined="editable "
                :disabled="!editable "
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                dense
                :loading="loading"
                :items="unit"
                item-text="name"
                item-value="id"
                label="Unidad"
                v-model="affiliate.unit_id"
                persistent-hint
                :readonly="!editable "
                :outlined="editable "
                :disabled="!editable "
              ></v-select>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field
                dense
                v-model="affiliate.unit_police_description"
                label="Descripcion de Unidad"
                :readonly="!editable "
                :outlined="editable "
                :disabled="!editable "
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                dense
                :loading="loading"
                :items="pension_entity"
                item-text="name"
                item-value="id"
                label="Ente Gestor"
                name="Grado"
                v-model="affiliate.pension_entity_id"
                :readonly="!editable "
                :outlined="editable "
                :disabled="!editable "
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                v-model="affiliate.date_derelict"
                :disabled="!editable "
                label="Fecha Desvinculacion"
                hint="Día/Mes/Año"
                type="date"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<script>
export default {
  name: "affiliate-profile",
  props: {
    affiliate: {
      type: Object,
      required: true,
    },
    editable: {
      type: Boolean,
      required: true,
    },
  },
  data:()=>({
      loading: true,
      cities: [],
      civil_statuses: [
        {
          name: "Soltero",
          value: "S"
        },
        {
          name: "Casado",
          value: "C"
        },
        {
          name: "Viudo",
          value: "V"
        },
        {
          name: "Divorciado",
          value: "D"
        },
      ],
      genders: [
        {
          name: "Femenino",
          value: "F",
        },
        {
          name: "Masculino",
          value: "M",
        },
      ],
      dates: {
        dueDate: {
          formatted: null,
          picker: false
        },
        birthDate: {
          formatted: null,
          picker: false
        },
        dateDeath: {
          formatted: null,
          picker: false
        }
      },
      affiliateState: [],
      category: [],
      degree: [],
      pension_entity: [],
      unit: [],
      visible: false,
    }),
    beforeMount() {
    this.getCities();
    this.getCategory();
    this.getDegree();
    this.getPensionEntity();
    this.getUnit();
    this.getAffiliateState();
  },
  mounted() {},
  watch: {
    "affiliate.due_date": function (date) {
      this.formatDate("dueDate", date);
    },
    "affiliate.date_entry": function (date) {
      this.formatDate("dateEntry", date);
    },
    "affiliate.date_derelict": function (date) {
      this.formatDate("dateDerelict", date);
    },
    "affiliate.date_death": function (date) {
      this.formatDate("dateDeath", date);
    },
   'affiliate.birth_date': function(date) {
      this.formatDate('birthDate', date)
    }
  },

  methods: {
    formatDate(key, date) {
      if (date) {
        this.dates[key].formatted = this.$moment(date).format("L");
      } else {
        this.dates[key].formatted = null;
      }
    },

    async getCities() {
      try {
        this.loading = true
        let res = await this.$axios.get(`/global/city`)
        this.cities = res
        console.log(this.cities)
      } catch (e) {
        console.log(e)
      }
    },

    async getCategory() {
      try {
        this.loading = true;
        let res = await this.$axios.get(`/affiliate/category`);
        this.category = res
      } catch (e) {
        this.dialog = false;
        console.log(e);
      } finally {
        this.loading = false;
      }
    },

    async getDegree() {
      try {
        this.loading = true;
        let res = await this.$axios.get(`/affiliate/degree`);
        this.degree = res
      } catch (e) {
        this.dialog = false;
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    async getPensionEntity() {
      try {
        this.loading = true;
        let res = await this.$axios.get(`/affiliate/pension_entity`);
        this.pension_entity = res;
        this.pension_entity.unshift({
          id: null,
          name: "-------"
        })
      } catch (e) {
        this.dialog = false;
        console.log(e);
      } finally {
        this.loading = false;
      }
    },

    async getUnit() {
      try {
        this.loading = true;
        let res = await this.$axios.get(`/affiliate/unit`);
        this.unit = res
      } catch (e) {
        this.dialog = false;
        console.log(e);
      } finally {
        this.loading = false;
      }
    },

    async getAffiliateState() {
      try {
        this.loading = true;
        let res = await this.$axios.get(`/affiliate/affiliate_state`);
        this.affiliateState = res;
      } catch (e) {
        this.dialog = false;
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    //En el caso que este fallecido
    Onchange() {
      if (this.affiliate.affiliate_state_id == 4) {
        this.visible = true;
      } else {
        this.visible = false;
      }
    },

  },
}
</script>
