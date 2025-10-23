import React from "react";
// Components
import { ModuleRegistry, AllCommunityModule, iconSetMaterial, themeQuartz, colorSchemeDark } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Spinner } from "@heroui/react";
// Libs
import { pickFirstChildOfType } from "@/shared/lib/react";

ModuleRegistry.registerModules([ AllCommunityModule ]);

const DynamicTable: React.FC<DynamicTableProps> = ({ children }) => {
    const tableHeader = pickFirstChildOfType(children, DynamicTableHeader);
    const tableBody = pickFirstChildOfType(children, DynamicTableBody);
    const tableFooter = pickFirstChildOfType(children, DynamicTableFooter);

    return (
        <div className="flex flex-col gap-2">
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

// Grid
export const TableGrid: React.FC<{props: Props & { onApiReady?: (api:any)=>void }}> = ({ props }) => {
    return (
        <div className='flex-1 h-full'>
            <AgGridReact
                headerHeight={50}
                theme={baseTheme}
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
                defaultColDef={{
                  suppressKeyboardEvent: () => true,
                  autoHeight: true,
                  wrapText: true,    
                }}
                onSelectionChanged={(event) => props.onSelectionChanged && props.onSelectionChanged(event.api.getSelectedRows()) || null}

                getRowId={(p) =>
                  p?.data?.__rowId ||
                  p?.data?.subid ||
                  p?.data?.__uid ||
                  p?.data?.id ||
                  p?.data?._id
                }

                suppressAnimationFrame={true}
                suppressScrollOnNewData={true}
                domLayout="normal"
                context={props.context || {}}
                rowSelection={'multiple'}
                
            />
        </div>
    );
};

// Types
export type DynamicTableProps = {
    children: React.ReactNode;
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
    gridProps?: Record<string, any>;
}

// ==============================
// Theme
// ==============================
const baseTheme = themeQuartz
  .withPart(iconSetMaterial)
  .withPart(colorSchemeDark)
  .withParams({
    // базовые
    backgroundColor:        "#17171A", // content1
    foregroundColor:        "#ABABBA", // default-900 (текст)
    borderColor:            "#202027", // divider
    accentColor:            "#e20d1c",

    // хедер
    headerBackgroundColor:  "#1C1C20", // content2
    // headerForegroundColor:  "#ABABBA",
    headerRowBorder:        true,
    headerColumnBorder:     true,

    // строки
    oddRowBackgroundColor:  "#17171A",
    // evenRowBackgroundColor: "#1C1C20",
    rowHoverColor:          "#202027",
    selectedRowBackgroundColor: "#292932",

    // ячейки/редакторы/инпуты
    inputBackgroundColor:   "#1C1C20",
    inputTextColor:         "#ABABBA",

    // тултипы/оверлеи
    tooltipBackgroundColor: "#202027",
    // tooltipForegroundColor: "#ABABBA",

    // панели/хром
    // controlPanelBackgroundColor: "#17171A",
  });

export default DynamicTable;