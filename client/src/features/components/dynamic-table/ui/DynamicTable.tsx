import React from "react";
// Components
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Spinner } from "@heroui/react";
// Hooks
import { useAgGridTheme } from "@/features/components/dynamic-table/hooks";
// Libs
import { pickFirstChildOfType } from "@/shared/lib/react";

ModuleRegistry.registerModules([ AllCommunityModule ]);

const DynamicTable: React.FC<DynamicTableProps> = ({ children, className }) => {
    const tableHeader = pickFirstChildOfType(children, DynamicTableHeader);
    const tableBody = pickFirstChildOfType(children, DynamicTableBody);
    const tableFooter = pickFirstChildOfType(children, DynamicTableFooter);

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {tableHeader}
            {tableBody}
            {tableFooter}
        </div>
    );
}

// Markers
export const DynamicTableHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`${className}`}>{children}</div>;
export const DynamicTableBody: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`${className}`}>{children}</div>;
export const DynamicTableFooter: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`${className}`}>{children}</div>;

// Table Grid
export const TableGrid: React.FC<{props: Props & { onApiReady?: (api:any)=>void }}> = ({ props }) => {

    const theme = useAgGridTheme();

    return (
        <div className="h-full">
            <AgGridReact
                headerHeight={50}
                theme={theme}
                rowData={props.rowData}
                columnDefs={props.columnDefs}

                {...(props.gridProps || {})}

                loading={props.isLoading}
                loadingOverlayComponent={() => <Spinner />}
                noRowsOverlayComponent={() => <div className="ag-overlay-no-rows-center">No data available</div>}
                pagination={false}
                suppressCellFocus={true}
                singleClickEdit={false} 
                suppressClickEdit={true}
                suppressRowClickSelection={true}
                autoSizeStrategy={{
                    type: 'fitGridWidth',
                    defaultMinWidth: 100,
                }}
                domLayout={props.domLayout || "normal"}
                defaultColDef={{
                    suppressKeyboardEvent: () => true,
                    autoHeight: true,
                    flex: 1,
                    wrapText: true,    
                }}
                enableBrowserTooltips={false}
                onSelectionChanged={(event) => props.onSelectionChanged && props.onSelectionChanged(event.api.getSelectedRows()) || null}
                getRowId={(p) =>
                    p?.data?.id ||
                    p?.data?._id || 
                    p?.data?.date
                }

                suppressAnimationFrame={true}
                suppressScrollOnNewData={true}
                context={props.context || {}}
                rowSelection={'multiple'}
                className="h-full w-full"
            />
        </div>
    );
};
// Types
export type DynamicTableProps = {
    children: React.ReactNode;
    className?: string;
};

// ==============================
// Types
// ==============================
export type Props = {
    rowData: any[];
    columnDefs: any[];
    tableId?: string;
    isLoading?: boolean;
    heightOffset?: string;
    onSelectionChanged?: (selectedRows: any[]) => void;
    context?: any;
    domLayout?: 'normal' | 'autoHeight' | 'print';
    gridProps?: Record<string, any>;
}

export default DynamicTable;