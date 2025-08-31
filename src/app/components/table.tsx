import React from "react";
import { Table } from "antd";
import type { TableProps } from "antd/es/table";

interface CustomTableProps<T> extends TableProps<T> {
    data: T[];
}

function CustomTable<T extends object>({
                                           data,
                                           rowKey = "id",
                                           pagination = { pageSize: 10 },
                                           bordered = false,
                                           ...rest
                                       }: CustomTableProps<T>) {
    return (
        <Table
            dataSource={data}
            rowKey={rowKey}
            pagination={pagination}
            bordered={bordered}
            {...rest}
        />
    );
}

export default CustomTable;
