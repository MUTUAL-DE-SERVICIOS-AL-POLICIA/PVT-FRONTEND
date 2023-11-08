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
        id: 1,
        name: 'SENASIR',
        import_type_name: 'senasir',
        permissions_create: 'create-import-payroll-senasir',
        permissions_download: 'download-report-payroll-senasir',
        route_get_months: '/contribution/list_months_validate_senasir',
        route_upload_file: '/contribution/upload_copy_payroll_senasir', //Step1
        route_validate_data: '/contribution/validation_payroll_senasir', //step2
        message_validate_data: 'No se encontraron algunas matrículas, por favor revise el archivo Excel',
        route_rollback_contribution: '/contribution/rollback_payroll_copy_senasir',
        route_import_progressBar: '/contribution/import_payroll_senasir_progress_bar',
        route_download_file: '/contribution/download_fail_not_found_payroll_senasir',
        name_download_file: "ReporteMatriculasNoValidas.xls",
        route_report: '/contribution/report_payroll_senasir',
        name_report_file: "ReporteDatosSenasir.xls"
      },
  })
};
</script>
