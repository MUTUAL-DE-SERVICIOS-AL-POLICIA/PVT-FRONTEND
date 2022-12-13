<template>
  <v-container fluid>
    <v-form ref="forSpouse">
      <v-row class="text-right">
        <v-col cols="12" class="ma-0 pa-0 pt-0">
          <!--TODO corregir primaryPermissionn una vez defina la edicion de  afiliado-->
          <template v-if="!this.spouse.id && primaryPermissionn"
            ><v-btn
              x-small
              dark
              @click="validateForm()"
              :color="editable_spouse ? 'success' : 'info'"
            >
              <span v-if="!editable_spouse"> CREAR</span>
              <span v-else> Confirmar</span>
            </v-btn>
            <v-btn
              x-small
              color="error"
              dark
              v-show="editable_spouse"
              @click.stop="resetFormSpouse()"
            >
              <span> Cancelar</span>
            </v-btn>
          </template>
          <template v-if="(this.spouse.id && primaryPermission) || (this.spouse.id && secondaryPermission)">
            <v-btn
              x-small
              right
              color="success"
              dark
              @click.stop="updateSpouse()"
            >
              <span v-if="!editable_spouse"> EDITAR</span>
              <span v-else> Confirmar</span>
            </v-btn>
            <v-btn
              x-small
              color="error"
              dark
              v-show="editable_spouse"
              @click.stop="resetFormSpouse()"
            >
              <span> Cancelar</span>
            </v-btn>
          </template>
        </v-col>
      </v-row>
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
                label="Primer Nombre"
                :readonly="!editable_spouse || !primaryPermission"
                :outlined="editable_spouse && primaryPermission"
                :disabled="editable_spouse && !primaryPermission"
                @keyup.enter="validateForm()"
                :rules="[
                  $rules.obligatoria('Primer Nombre'),
                  $rules.soloLetras(),
                  $rules.longitudMinima(3),
                  $rules.longitudMaxima(20),
                ]"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                v-model="spouse.second_name"
                label="Segundo Nombre"
                :readonly="!editable_spouse || !primaryPermission"
                :outlined="editable_spouse && primaryPermission"
                :disabled="editable_spouse && !primaryPermission"
                @keyup.enter="validateForm()"
                :rules="[
                  $rules.soloLetras(),
                  $rules.longitudMinima(3),
                  $rules.longitudMaxima(20),
                ]"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                dense
                v-model="spouse.last_name"
                label="Apellido Paterno"
                :readonly="!editable_spouse || !primaryPermission"
                :outlined="editable_spouse && primaryPermission"
                :disabled="editable_spouse && !primaryPermission"
                @keyup.enter="validateForm()"
                :rules="
                  spouse.mothers_last_name == null ||
                  spouse.mothers_last_name == ''
                    ? [
                        $rules.obligatoria('Apellido Paterno'),
                        $rules.soloLetras(),
                        $rules.longitudMinima(3),
                        $rules.longitudMaxima(20),
                      ]
                    : [
                        $rules.soloLetras(),
                        $rules.longitudMinima(3),
                        $rules.longitudMaxima(20),
                      ]"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                dense
                v-model="spouse.mothers_last_name"
                label="Apellido Materno"
                :readonly="!editable_spouse || !primaryPermission"
                :outlined="editable_spouse && primaryPermission"
                :disabled="editable_spouse && !primaryPermission"
                @keyup.enter="validateForm()"
                :rules="
                  spouse.last_name == null || spouse.last_name == ''
                    ? [
                        $rules.obligatoria('Apellido Materno'),
                        $rules.soloLetras(),
                        $rules.longitudMinima(3),
                        $rules.longitudMaxima(20),
                      ]
                    : [
                        $rules.soloLetras(),
                        $rules.longitudMinima(3),
                        $rules.longitudMaxima(20),
                      ]"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                dense
                v-model="spouse.surname_husband"
                label="Apellido de Casada"
                :readonly="!editable_spouse || !primaryPermission"
                :outlined="editable_spouse && primaryPermission"
                :disabled="editable_spouse && !primaryPermission"
                @keyup.enter="validateForm()"
                :rules="[
                  $rules.soloLetras(),
                  $rules.longitudMinima(3),
                  $rules.longitudMaxima(20),
                ]"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                dense
                v-model="spouse.identity_card"
                label="Cedula de Identidad"
                :readonly="!editable_spouse || !primaryPermission"
                :outlined="editable_spouse && primaryPermission"
                :disabled="editable_spouse && !primaryPermission"
                @keyup.enter="validateForm()"
                :rules="[
                  $rules.obligatoria('Cédula de Identidad'),
                  $rules.longitudMinima(5),
                  $rules.longitudMaxima(15),
                ]"
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
                :readonly="!editable_spouse || !secondaryPermission"
                :outlined="editable_spouse && secondaryPermission"
                :disabled="editable_spouse && !secondaryPermission"
                @keyup.enter="validateForm()"
                :rules="[$rules.obligatoria('Ciudad de Expedición')]"
              >
              </v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                dense
                v-model="spouse.registration"
                label="Matrícula"
                :readonly="!editable_spouse || !secondaryPermission"
                :outlined="editable_spouse && secondaryPermission"
                :disabled="editable_spouse && !secondaryPermission"
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
                :clearable="editable_spouse"
                :readonly="!editable_spouse || !secondaryPermission"
                :outlined="editable_spouse && secondaryPermission"
                :disabled="editable_spouse && !secondaryPermission"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-checkbox
                v-model="spouse.is_duedate_undefined"
                :readonly="!editable_spouse || !secondaryPermission"
                :outlined="editable_spouse && secondaryPermission"
                :disabled="editable_spouse && !secondaryPermission"
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
                :readonly="!editable_spouse || !secondaryPermission"
                :outlined="editable_spouse && secondaryPermission"
                :disabled="editable_spouse && !secondaryPermission"
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
                :readonly="!editable_spouse || !secondaryPermission"
                :outlined="editable_spouse && secondaryPermission"
                :disabled="editable_spouse && !secondaryPermission"
                :rules="[$rules.obligatoria('Fecha de Nacimiento')]"
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
                label="Ciudad de Nacimiento"
                v-model="spouse.city_birth_id"
                :readonly="!editable_spouse || !secondaryPermission"
                :outlined="editable_spouse && secondaryPermission"
                :disabled="editable_spouse && !secondaryPermission"
                @keyup.enter="validateForm()"
                :rules="[$rules.obligatoria('Ciudad de Nacimiento')]"
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
                :readonly="!editable_spouse || !secondaryPermission"
                :outlined="editable_spouse && secondaryPermission"
                :disabled="editable_spouse && !secondaryPermission"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" v-if="!visible">
              <v-text-field
                dense
                v-model="spouse.death_certificate_number"
                label="Cert. de Defunción"
                :readonly="!editable_spouse || !secondaryPermission"
                :outlined="editable_spouse && secondaryPermission"
                :disabled="editable_spouse && !secondaryPermission"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12" v-if="!visible">
              <v-text-field
                dense
                v-model="spouse.reason_death"
                label="Causa del Fallecimiento"
                :readonly="!editable_spouse || !secondaryPermission"
                :outlined="editable_spouse && secondaryPermission"
                :disabled="editable_spouse && !secondaryPermission"
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
    editable_spouse: false,
    cancel: false,
  }),
  mounted() {},
  beforeMount() {
    this.getCities();
  },
  computed: {
    //permisos del selector global por rol
    permissionSimpleSelected () {
      return this.$store.getters.permissionSimpleSelected
    },
    secondaryPermission() {
      if (this.spouse.id) {
        return this.permissionSimpleSelected.includes('update-spouse-secondary')
      }else {
        return this.permissionSimpleSelected.includes('create-spouse')
      }
    },
    primaryPermission() {
      if (this.spouse.id) {
        return this.permissionSimpleSelected.includes('update-spouse-primary')
      }else {
        return this.permissionSimpleSelected.includes('create-spouse')
      }
    }
  },
  methods: {
    eventGetSpouse(val) {
      this.$nuxt.$emit("eventGetSpouse", val);
    },
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
    async saveSpouse() {
      try {
        if (!this.editable_spouse) {
          this.editable_spouse = true;
        } else {
          //Preguntar si afiliado esta fallecido o tiene esposa con fecha de fallecimiento para crear
          if (this.affiliate.affiliate_state_id == 4 || this.spouse.date_death.length !== 0) {
            if (!this.spouse.id) {
              if (Object.entries(this.spouse).length !== 0) {
                this.spouse.affiliate_id = this.affiliate.id;
                await this.$axios.post(`affiliate/spouse`, this.spouse);
                this.eventGetSpouse(this.$route.params.id);
                this.$toast.success("Se creo a la cónyuge correctamente.");
                this.editable_spouse = false;
              }
            }
          } else {
            this.editable_spouse = true;
            this.$toast.error(
              "Ocurrió un error durante la creación inconsistencia de datos."
            );
          }
        }
      } catch (e) {
        console.log(e)
        this.$toast.error("Ocurrió un error durante la creación inconsistencia de datos.");
      }
    },
    async updateSpouse() {
      try {
        if (!this.editable_spouse) {
          this.editable_spouse = true;
        } else {
          //Preguntar si afiliado esta fallecido o tiene esposa con fecha de fallecimiento para actualizar
          if (this.affiliate.affiliate_state_id == 4 || this.spouse.date_death.length !== 0) {
            if (this.spouse.id) {
              await this.$axios.patch(
                `affiliate/spouse/${this.spouse.id}`,
                this.spouse
              );
              this.$toast.success(
                "Se actualizo correctamente los datos de la cónyuge."
              );
            }
            this.editable_spouse = false;
          } else {
            this.editable_spouse = true;
            this.$toast.error(
              "Ocurrio un error durante la actualización."
            );
          }
        }
      } catch (e) {
        console.log(e)
        this.$toast.error("Ocurrio un error durante la actualización.");
      }
    },
    resetFormSpouse() {
      this.cancel = true;
      this.editable_spouse = false;
      this.eventGetSpouse(this.$route.params.id);
      this.$nextTick(() => {
        this.cancel = false;
      });
    },
    validateForm() {
       this.editable_spouse = true;
      if (this.$refs.forSpouse) {
        if (this.$refs.forSpouse.validate()) {
          this.saveSpouse();
        } else {
          console.log("no valido");
        }
      }
    },
  },
};
</script>
