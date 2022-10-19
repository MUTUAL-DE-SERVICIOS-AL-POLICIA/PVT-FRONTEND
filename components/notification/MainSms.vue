<template>
    <div>
      <v-subheader>PANEL DE ADMINISTRACIÓN</v-subheader>
        <v-container>
            <v-skeleton-loader type="list-item-avatar-three-line, image, article">
                <v-container grid-list-xl>
                    <v-card>
                        <v-row class="ma-0 pa-0">
                            <v-col cols="12" md="6">
                                Redaccion de Mensaje
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-card>
                        <v-row class="ma-0 pa-0">
                            <v-col>
                                <v-row class="ma-0 pa-0">
                                    <v-combobox
                                    label="Tipo de Mensaje">
                                    </v-combobox>
                                </v-row>
                                <v-row class="ma-0 pa-0">
                                    <v-text-field
                                    label="Titulo"
                                    required></v-text-field>
                                </v-row>
                                <v-row  class="ma-0 pa-0">
                                    <v-textarea
                                        background-color="grey lighten-2"
                                        color="cyan"
                                        label="Mensaje Adjunto">
                                    </v-textarea>
                                </v-row>
                            </v-col>
                            <v-col>
                                <v-row>
                                    <v-card-text 
                                    class="black--text my-0 py-0">Previsualizacion
                                    </v-card-text>
                                    <v-textarea
                                        background-color="grey lighten-2"
                                        color="cyan">
                                    </v-textarea>
                                </v-row>
                                <v-row>
                                        <v-btn
                                        color="success"
                                        class="mr-4">Enviar</v-btn>
                                </v-row>
                            </v-col>
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