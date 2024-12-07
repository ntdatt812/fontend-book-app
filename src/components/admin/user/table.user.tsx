import { getUsersAPI } from '@/services/api';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Pagination } from 'antd';
import { useRef, useState } from 'react';



const columns: ProColumns<IUserTable>[] = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: 'ID',
        dataIndex: '_id',
        hideInSearch: true,
        render(_, entity) {
            return (
                <a href='#'>{entity._id}</a>
            )
        },
    },
    {
        title: 'Full name',
        dataIndex: 'fullName',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        copyable: true,
    },
    {
        title: 'Created at',
        dataIndex: 'createdAt',
    },
    {
        title: "Action",
        hideInSearch: true,
        render() {
            return (
                < >
                    <EditOutlined
                        style={{
                            marginRight: "15px", color: "orange", cursor: "pointer"
                        }}
                    />
                    <DeleteOutlined
                        style={{
                            color: "red", cursor: "pointer"
                        }}
                    />
                </>
            )
        },
    }
    // {
    //     title: 'ntdat',
    //     dataIndex: 'title',
    //     copyable: true,
    //     ellipsis: true,
    //     tooltip: '标题过长会自动收缩',
    //     formItemProps: {
    //         rules: [
    //             {
    //                 required: true,
    //                 message: '此项为必填项',
    //             },
    //         ],
    //     },
    // },
];

const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })
    return (
        <>
            <ProTable<IUserTable>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(sort, filter);
                    const res = await getUsersAPI();
                    if (res.data) {
                        setMeta(res.data.meta);
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }

                }}
                rowKey="_id"
                pagination={
                    {
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => {
                            return (<div>{range[0]} - {range[1]} trên {total} rows</div>)
                        }
                    }
                }
                headerTitle="Table user"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            actionRef.current?.reload();
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />
        </>
    );
};

export default TableUser;