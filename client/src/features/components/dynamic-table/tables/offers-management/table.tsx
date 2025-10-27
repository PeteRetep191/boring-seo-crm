import React from "react";
// Table
import { TableGrid } from "@/features/components/dynamic-table/ui";
// Columns
import { offerColumnDefs } from "./columnDefs";

// ================================
// Main Component
// ================================
const Table:React.FC<TableProps> = ({rowData, tableId='default', onSelectionChanged, isLoading, context={}}) => {
    return (
        <TableGrid
            props={{
                rowData: rowData as any || [],
                columnDefs: offerColumnDefs,
                tableId: tableId,
                onSelectionChanged: onSelectionChanged,
                isLoading: isLoading,
                context: context,
            }}
        />
    );
}

export default Table;

// ================================
// Types
// ================================
type TableProps = {
    rowData: any[];
    tableId?: string;
    onSelectionChanged?: (selectedRows: any[]) => void;
    isLoading?: boolean;
    context?: any;
}