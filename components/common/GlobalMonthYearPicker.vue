<template>
    <v-text-field
      v-model="displayValue"
      :label="label"
      dense
      outlined
      hide-details
      style="max-width: 200px;"
      clearable
      v-mask="'##/####'"
      @blur="updateInternalValue"
      @click:clear="clear"
    ></v-text-field>
  </template>
  
  <script>
  export default {
    name: 'MonthYearPicker',
    props: {
      value: {
        type: String, // formato interno YYYY-MM-01
        default: null,
      },
      label: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        displayValue: '', // formato para ver en la interfaz MM/YYYY
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal) {
          if (!newVal) {
            this.displayValue = '';
          } else {
            const [year, month] = newVal.split('-');
            this.displayValue = `${month}/${year}`;
          }
        },
      },
    },
    methods: {
      updateInternalValue() {
        if (!this.displayValue) {
          this.$emit('input', null);
          return;
        }
  
        const [month, year] = this.displayValue.split('/');
        if (!month || !year) {
          this.$emit('input', null);
          return;
        }
  
        const paddedMonth = month.padStart(2, '0');
        const internalValue = `${year}-${paddedMonth}-01`;
        this.$emit('input', internalValue);
  
        // Normalizar la visual
        this.displayValue = `${paddedMonth}/${year}`;
      },
      clear() {
        this.displayValue = '';
        this.$emit('input', null);
      },
    },
  };
  </script>
  