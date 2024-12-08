import { getUsersAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import DetailUser from './detail.user';

type TSearch = {
    fullName: string;
    email: string;
    createdAt: string;
    createdAtRange: string;
}

const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })
    const [userDetail, setUserDetail] = useState<IUserTable | null>(null);
    const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);

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
                    <a href='#' onClick={() => {
                        setIsOpenDetail(true)
                        setUserDetail(entity)
                    }}>{entity._id}</a>
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
            valueType: "date",
            sorter: true,
            hideInSearch: true

        },
        {
            title: 'Created at',
            dataIndex: 'createdAtRange',
            valueType: "dateRange",
            hideInTable: true

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
    ];

    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);

                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.email) {
                            query += `&email=/${params.email}/i`
                        }
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`
                        }

                        const createDateRange = dateRangeValidate(params.createdAtRange);
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                        }
                    }

                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`;
                    }

                    const res = await getUsersAPI(query);
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
            <DetailUser
                isOpenDetail={isOpenDetail}
                userDetail={userDetail}
                setIsOpenDetail={setIsOpenDetail}
                setUserDetail={setUserDetail}
            />
        </>
    );
};

export default TableUser;