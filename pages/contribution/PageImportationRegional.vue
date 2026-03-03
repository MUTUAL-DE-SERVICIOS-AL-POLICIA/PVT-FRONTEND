<template>
    <MainImportation :item_import="item_import" />
</template>

<script>
import MainImportation from "@/components/contribution/MainImportation.vue";
export default {
  name: "PageImportationRegional",
  components: {
    MainImportation,
  },
  data: () => ({
    item_import: {
        id: 3,
        name: 'REGIONAL',
        import_type_name: 'regional',
        permissions_create: 'create-import-payroll-transcript',
        permissions_download: 'download-report-payroll-transcript',
        route_get_months: '/contribution/list_dates_regional',
        route_upload_file: '/contribution/upload_copy_payroll_regional', // Step 1
        route_validate_data: '/contribution/validation_affiliate_regional', // Step 2
        route_import_payroll: '/contribution/import_payroll_regional', // Step 3
        route_import_contribution: '/contribution/import_contribution_regional', // Step 4
        route_rollback_contribution: '/contribution/rollback_payroll_copy_regionals',
        route_import_progressBar: '/contribution/import_payroll_regional_progress_bar',
        route_report: '/contribution/download_data_regional',
        name_report_file: 'ReporteImportaciónRegionalContribución.xls',
      },
  })
};
</script>
