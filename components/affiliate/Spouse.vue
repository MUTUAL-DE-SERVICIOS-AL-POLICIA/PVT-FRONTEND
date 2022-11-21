<template>
  <v-container fluid>
    <v-form>
      <v-row justify="center">
        <v-col cols="12" md="6" class="v-card-profile">
          <v-row>
            <v-col cols="12">
              <v-toolbar-title>INFORMACIÓN CONYUGE</v-toolbar-title>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                v-model="spouse.first_name"
                class="purple-input"
                label="Primer Nombre"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable || affiliate.affiliate_state_id != 4"
                @keyup.enter="validateForm()"
                :rules="[$rules.obligatoria('Primer Nombre'),$rules.soloLetras(),$rules.longitudMinima(3),$rules.longitudMaxima(20)]"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                v-model="spouse.second_name"
                class="purple-input"
                label="Segundo Nombre"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable || affiliate.affiliate_state_id != 4"
                @keyup.enter="validateForm()"
                :rules="[$rules.soloLetras(),$rules.longitudMinima(3),$rules.longitudMaxima(20)]"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                dense
                v-model="spouse.last_name"
                class="purple-input"
                label="Apellido Paterno"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable || affiliate.affiliate_state_id != 4"
                @keyup.enter="validateForm()"
                  :rules="(spouse.mothers_last_name == null || spouse.mothers_last_name == '')?[$rules.obligatoria('Apellido Paterno'),$rules.soloLetras(),$rules.longitudMinima(3),$rules.longitudMaxima(20)]:[$rules.soloLetras(),$rules.longitudMinima(3),$rules.longitudMaxima(20)]"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                dense
                v-model="spouse.mothers_last_name"
                class="purple-input"
                label="Apellido Materno"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable || affiliate.affiliate_state_id != 4"
                @keyup.enter="validateForm()"
                :rules="(spouse.last_name == null || spouse.last_name == '')?[$rules.obligatoria('Apellido Materno'),$rules.soloLetras(),$rules.longitudMinima(3),$rules.longitudMaxima(20)]:[$rules.soloLetras(),$rules.longitudMinima(3),$rules.longitudMaxima(20)]"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                dense
                v-model="spouse.surname_husband"
                class="purple-input"
                label="Apellido de Casada"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable || affiliate.affiliate_state_id != 4"
                @keyup.enter="validateForm()"
                :rules="[$rules.soloLetras(),$rules.longitudMinima(3),$rules.longitudMaxima(20)]"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                dense
                v-model="spouse.identity_card"
                class="purple-input"
                label="Cedula de Identidad"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable || affiliate.affiliate_state_id != 4"
                @keyup.enter="validateForm()"
                :rules="[$rules.obligatoria('Cédula de Identidad'),$rules.longitudMinima(5),$rules.longitudMaxima(15)]"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                dense
                :loading="loading"
                :items="cities"
                item-text="name"
                item-value="id"
                label="Ciudad de Expedición"
                v-model="spouse.city_identity_card_id"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable || affiliate.affiliate_state_id != 4"
                @keyup.enter="validateForm()"
                :rules="[$rules.obligatoria('Ciudad de Expedición')]"
              >
              </v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                dense
                v-model="spouse.registration"
                class="purple-input"
                label="Matrícula"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable || affiliate.affiliate_state_id != 4"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="5">
              <v-text-field
                dense
                v-model="spouse.due_date"
                label="Fecha Vencimiento CI"
                hint="Día/Mes/Año"
                type="date"
                :clearable="editable"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable || affiliate.affiliate_state_id != 4"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-checkbox
                v-model="spouse.is_duedate_undefined"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable || affiliate.affiliate_state_id != 4"
                :label="`Indefinido`"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                dense
                :items="civil"
                item-text="name"
                item-value="value"
                label="Estado Civil"
                name="estado_civil"
                v-model="spouse.civil_status"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable || affiliate.affiliate_state_id != 4"
                @keyup.enter="validateForm()"
                :rules="[$rules.obligatoria('Estado Civil')]"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                v-model="spouse.birth_date"
                name="spouse_birth_date"
                label="Fecha Nacimiento"
                hint="Día/Mes/Año"
                type="date"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable || affiliate.affiliate_state_id != 4"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                dense
                :loading="loading"
                :items="cities"
                item-text="name"
                item-value="id"
                name="nacimiento"
                label="Lugar de Nacimiento"
                v-model="spouse.city_birth_id"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable || affiliate.affiliate_state_id != 4"
                @keyup.enter="validateForm()"
                :rules="[$rules.obligatoria('Lugar de Nacimiento')]"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="6" class="v-card-profile">
          <v-row>
            <v-col cols="12">
              <v-toolbar-title>INFORMACION DECESO</v-toolbar-title>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                v-model="spouse.date_death"
                label="Fecha Fallecimiento"
                hint="Día/Mes/Año"
                type="date"
                :onclick="Death()"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable || affiliate.affiliate_state_id != 4"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" v-if="!visible">
              <v-text-field
                dense
                v-model="spouse.death_certificate_number"
                label="Cert. de Defunción"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable || affiliate.affiliate_state_id != 4"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12" v-if="!visible">
              <v-text-field
                dense
                v-model="spouse.reason_death"
                label="Causa del Fallecimiento"
                :readonly="!editable"
                :outlined="editable"
                :disabled="!editable || affiliate.affiliate_state_id != 4"
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
  props: {
    affiliate: {
      type: Object,
      require: true,
    },
    spouse: {
      type: Object,
      required: true,
    },
    editable: {
      type: Boolean,
      require: true,
    },
  },
  data: () => ({
    loading: false,
    cities: [],
    civil: [
      { name: "Soltero", value: "S" },
      { name: "Casado", value: "C" },
      { name: "Viudo", value: "V" },
      { name: "Divorciado", value: "D" },
    ],
    visible: false,
  }),
  mounted() {},
  beforeMount() {
    this.getCities();
  },
  methods: {
    async getCities() {
      try {
        this.loading = true;
        let res = await this.$axios.get(`/global/city`);
        this.cities = res;
        console.log(this.cities);
      } catch (e) {
        this.loading = false;
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    Death() {
      if (this.spouse.date_death == null) {
        this.visible = true;
      } else {
        this.visible = false;
      }
    },
  },
};
</script>
