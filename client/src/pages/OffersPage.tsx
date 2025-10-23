import React from "react";
import { useNavigate } from "react-router-dom";
// components
import { Button, Input, Pagination } from "@heroui/react";
import { DynamicTable, DynamicTableBody, DynamicTableFooter, DynamicTableHeader, TableGrid } from "@/features/components/dynamic-table/ui";
import { Plus } from "lucide-react";

const MOCK_SITES_DATA:any[] = [
    // { id: 1, name: "example.com", status: "Active" },
    // { id: 2, name: "testsite.com", status: "Inactive" },
    // { id: 3, name: "mysite.org", status: "Active" },
];

const mockColumnDefs = [
    { headerName: "ID", field: "id", width: 80 },
    { headerName: "Site Name", field: "name", flex: 1 },
    { headerName: "Status", field: "status", width: 120 },
];

const OffersPage: React.FC = () => {
    const navigate = useNavigate();

    return (
       <DynamicTable>
        <DynamicTableHeader className="flex justify-between items-center">

            <div className="flex flex-1 items-center justify-start gap-2">
                <Input 
                    placeholder="Search sites..." 
                    className="mr-4" 
                />
            </div>

            <div className="flex flex-1 items-center justify-end gap-2">
                <Button 
                    onPress={() => navigate("/sites/new")}
                    variant="solid"
                    color="primary"
                    startContent={<Plus size={16} />}
                >
                        Add New Site
                </Button>
            </div>
        </DynamicTableHeader>
        <DynamicTableBody className="h-[400px]">
            <TableGrid
                props={{
                    rowData: MOCK_SITES_DATA,
                    columnDefs: mockColumnDefs,
                    isLoading: false,
                    tableId: "sites-table",
                }}
            />
        </DynamicTableBody>
        <DynamicTableFooter className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground mr-4">
                {MOCK_SITES_DATA.length} sites
            </span>
            <Pagination 
                total={10}
                page={1}
                onChange={(page) => console.log("Go to page:", page)}
                classNames={{
                    base: 'text-gray-300',
                    item: 'text-gray-300',
                }}
            />
        </DynamicTableFooter>
       </DynamicTable>
    );
}


export default OffersPage;