<template>
    <MainImportation :item_import="item_import" />
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
        id: 4,
        name: 'DISPONIBILIDAD',
        import_type_name:"availability",
        permissions_create: 'create-import-payroll-senasir',//falta
        permissions_download: 'download-report-payroll-senasir',//falta
        route_get_months: '/affiliate/list_months_import_affiliates_availability',
        route_upload_file: '/affiliate/upload_copy_affiliates_availability', //Step1
        download_error_data_archive: 'affiliate/download_error_data_archive',//Step1
        route_validate_data: '/affiliate/validate_availability', //step2
        download_data_revision: '/affiliate/download_data_revision', //paso2 caso1: En caso de error
        //download_data_revision_suggestion: '/affiliate/download_data_revision_suggestion', //paso2 caso2: casos no identificados como disponibilidad
        //name_download_file: "observados_para_revision.xls",//step2
        rollback_import_affiliates_availability: '/affiliate/rollback_import_affiliates_availability',
        route_import_progressBar: '/affiliate/import_affiliates_availability_progress_bar',
        route_report:'/affiliate/report_import_affiliates_availability',
        name_report_file: "ReporteDatosDisponibilidad.xls"
      }
  })
};
</script>
