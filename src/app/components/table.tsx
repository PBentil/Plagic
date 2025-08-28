import React from "react";
import { Table } from "antd";
import type { TableProps, ColumnsType } from "antd/es/table";

interface CustomTableProps<T> {
    columns: ColumnsType<T>;
    data: T[];
    loading?: boolean;
    rowKey?: string;
}

function CustomTable<T extends object>({
                                           columns,
                                           data,
                                           loading = false,
                                           rowKey = "id",
                                       }: CustomTableProps<T>) {
    return (
        <Table<T>
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey={rowKey}
            pagination={{ pageSize: 10 }}
            bordered
        />
    );
}

export default CustomTable;
