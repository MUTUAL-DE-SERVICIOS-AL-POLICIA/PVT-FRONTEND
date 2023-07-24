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
        id: 3,
        name: 'TRANSCRIPCIÓN',
        import_type_name: 'transcript',
        permissions_create: 'create-import-payroll-transcript',
        permissions_download: 'download-report-payroll-transcript',
        route_get_months: '/contribution/list_months_import_contribution_transcript',
        route_upload_file: '/contribution/upload_copy_payroll_transcript', // Step 1
        route_validate_data: '/contribution/validation_affiliate_transcript', // Step 2
        route_import_payroll: '/contribution/import_payroll_transcript', // Step 3
        route_import_contribution: '/contribution/import_contribution_transcript', // Step 4
        route_rollback_contribution: '/contribution/rollback_payroll_copy_transcripts',
        route_import_progressBar: '/contribution/import_payroll_transcript_progress_bar',
        route_report: '/contribution/report_import_contribution_transcript',
        name_report_file: 'ReporteImportaciónTranscripciónContribución.xls',
      },
  })
};
</script>
