<template>
    <div>
      <v-subheader>PANEL DE ADMINISTRACIÓN</v-subheader>
        <v-container>
            <v-skeleton-loader type="list-item-avatar-three-line, image, article">
                <v-container grid-list-xl>
                    <v-card>
                        <v-row class="ma-0 pa-0">
                            <v-col cols="12" md="6">
                                Redaccion de notificacion 
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-card>
                        <v-row class="ma-0 pa-0">
                            <v-col>
                                <v-row class="ma-0 pa-0">
                                    <v-combobox
                                    label="Accion">
                                    </v-combobox>
                                </v-row>
                                <v-row class="ma-0 pa-0">
                                    <v-combobox
                                    label="Metodo de Pago">
                                    </v-combobox>
                                </v-row>
                                <v-row class="ma-0 pa-0">
                                    <v-combobox
                                    label="Semestre"
                                    dense
                                    :items=res
                                    item-text="name"
                                    item-value="id">
                                    </v-combobox>
                                </v-row>
                                <v-row class="ma-0 pa-0">
                                    <v-combobox
                                    label="Modalidad">
                                    </v-combobox>
                                </v-row>
                                <v-row class="ma-0 pa-0">
                                    <v-combobox
                                    label="Nivel Jerarquico">
                                    </v-combobox>
                                </v-row>
                            </v-col>
                            <v-col>
                                <v-row class="ma-0 pa-0">
                                    <v-card-text 
                                    class="black--text my-0 py-0">Previsualizacion
                                    </v-card-text>
                                    <v-textarea
                                        background-color="grey lighten-2"
                                        color="cyan">
                                    </v-textarea>
                                </v-row>
                                <v-row class="ma-0 pa-0">
                                        <v-btn
                                        color="success"
                                        class="mr-4">Enviar</v-btn>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-card>
                        <v-row class="ma-0 pa-0">
                            <v-col>
                                <v-chip draggable>
                                    Nombre
                                </v-chip>
                            </v-col>
                            <v-col>
                                <v-chip draggable>
                                     Grado
                                </v-chip>
                            </v-col>
                            <v-col>
                                <v-chip draggable>
                                    Carnet
                                </v-chip>
                            </v-col>
                            <v-col>
                                <v-chip draggable>
                                    Semestre
                                </v-chip>
                            </v-col>
                            <v-col>
                                <v-chip draggable>
                                    Grado
                                </v-chip>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-tab-item v-for="item in items" v-bind:key="item.text">
                                <v-chip 
                                    draggable
                                    >asd
                                </v-chip>
                            </v-tab-item>
                        </v-row>
                        <v-row class="ma-0 pa-0">
                            <v-textarea 
                            background-color="grey lighten-2"
                            color="cyan">
                            </v-textarea>
                        </v-row>
                        <v-row class="ma-0 pa-0"    >
                            <v-file-input
                            accept="image/*"
                            label="Cargar imagen"></v-file-input>
                        </v-row>
                    </v-card>
                    <v-card>
                        <v-data-table
                        :items-per-page="5"
                        class="elevation-1"></v-data-table>
                    </v-card>
                </v-container>
            </v-skeleton-loader>
        </v-container>
      <v-subheader>Dark status bar</v-subheader>
    </div>
</template>
<script>
    export default{
        data: () => ({
            semesters:[],
            items: [
                {
                text: 'Nombre',
                icon: 'mdi-account'
                },
                {
                text: 'Grado',
                icon: 'mdi-seal'
                },
                {
                text: 'Carnet',
                icon: 'mdi-credit-card'
                },
                {
                text: 'Semestre',
                icon: 'mdi-calendar-check'
                },
                {
                text: 'Tipo',
                icon: 'mdi-human-greeting'
                },
            ],
            res: []
        }),
        computed: {

        },
        beforeMount(){
            this.getSemesters()
        },
        mounted(){
           
        },
        methods: {
            async getSemesters() {
                try{
                    let res = await this.$axios.get('notification/get_semesters')
                    this.semesters = res.semesters
                    this.formatSemesters()


                }catch(e){
                    console.log(e)
                }

            },
            formatSemesters(){
                let new_semester= {}
                for(let i=0; i< this.semesters.length;i++){
                new_semester[i] = this.semesters[i].year +'-'+this.semesters[i].semester
                this.res.push({
                                id: this.semesters[i].id,
                                name: new_semester[i]
                            })
                }
            }
        },

    }
</script>