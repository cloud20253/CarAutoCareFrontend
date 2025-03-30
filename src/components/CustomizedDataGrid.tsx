import { DataGrid } from '@mui/x-data-grid';
import { GridColDef, GridRowsProp, DataGridProps } from '@mui/x-data-grid';

interface CustomizedDataGridProps {
  columns: GridColDef[]; 
  rows: GridRowsProp; 
  checkboxSelection?: boolean;
  autoHeight?: boolean;
}

export default function CustomizedDataGrid({
  columns,
  rows,
  checkboxSelection = true,
  autoHeight = false,
}: CustomizedDataGridProps) {
  return (
    <DataGrid
      autoHeight={autoHeight}
      checkboxSelection={checkboxSelection}
      rows={rows}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="compact"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: 'outlined',
              size: 'small',
            },
            columnInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            operatorInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: 'outlined',
                size: 'small',
              },
            },
          },
        },
      }}
    />
  );
}
