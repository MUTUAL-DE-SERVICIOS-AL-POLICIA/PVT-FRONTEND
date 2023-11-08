<template>
    <MainImportation :item_import="item_import"/>
</template>

<script>
import MainImportation from "@/components/contribution/MainImportation.vue";
export default {
  name: "PageImportation",
  components: {
    MainImportation,
  },
  data: () => ({
    item_import: {
        id: 2,
        name: 'COMANDO',
        import_type_name:'command',
        permissions_create: 'create-import-payroll-command',
        permissions_download: 'download-report-payroll-command',
        route_get_months: '/contribution/list_months_validate_command',
        route_upload_file: '/contribution/upload_copy_payroll_command', //Step1
        route_validate_data: '/contribution/validation_payroll_command', //step2
        message_validate_data: 'El archivo excel contiene informacion de los afiliados creados',
        route_rollback_contribution: '/contribution/rollback_payroll_copy_command',
        route_import_progressBar: '/contribution/import_payroll_command_progress_bar',
        route_download_file: '/contribution/download_new_affiliates_payroll_command',
        name_download_file: "ReporteNuevosAfiliados.xls",
        route_report: '/contribution/report_payroll_command',
        name_report_file: "ReporteDatosComando.xls"
      },
  })
};
</script>
