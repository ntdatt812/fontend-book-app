import { deleteUserAPI, getUsersAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { DeleteOutlined, EditOutlined, ExportOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import DetailUser from './detail.user';
import CreateUser from './create.user';
import ModalImport from './import.user';
import { CSVLink } from 'react-csv';
import UpdateUser from './update.user';

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
    const [openCreateUser, setOpenCreteUser] = useState<boolean>(false);
    const [isOpenImport, setIsOpenImport] = useState<boolean>(false);
    const [dataExport, setDataExport] = useState<IUserTable[]>([])
    const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false)
    const [isDelete, setIsDelete] = useState<boolean>(false)
    const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null)
    const { message, notification } = App.useApp();


    const handleDeleteUser = async (user: IUserTable) => {
        setIsDelete(true)
        const res = await deleteUserAPI(user._id);
        if (res.data) {
            message.success(`Đã xoá user ${user.fullName} khỏi danh sách!`)
        } else {
            notification.error({
                message: "Có lỗi xảy ra!",
                description: res.message
            })
        }
        reloadTable()
        setIsDelete(false)
    };

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
            render(dom, entity) {
                return (
                    < >
                        <EditOutlined
                            style={{
                                marginRight: "25px", color: "orange", cursor: "pointer"
                            }}
                            onClick={() => {
                                setIsOpenUpdate(true)
                                setDataUpdate(entity)
                            }}
                        />
                        <Popconfirm
                            title="Xoá người dùng"
                            description={`Bạn có chắc chắn muốn xoá ${entity.fullName} không?`}
                            onConfirm={() => { handleDeleteUser(entity) }}
                            okText="Xác nhận"
                            cancelText="Huỷ"
                            placement='leftBottom'
                            okButtonProps={{
                                loading: isDelete
                            }}
                        >
                            <DeleteOutlined
                                style={{
                                    color: "red", cursor: "pointer"
                                }}
                            />
                        </Popconfirm>

                    </>
                )
            },
        }
    ];

    const reloadTable = () => {
        actionRef.current?.reload();
    }

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
                    } else query += `&sort=-createdAt`;

                    const res = await getUsersAPI(query);

                    if (res.data) {
                        setMeta(res.data.meta);
                        setDataExport(res.data?.result ?? []);
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
                    <CSVLink
                        data={dataExport}
                        filename='export-users.csv'
                    >
                        <Button
                            type="primary"
                            icon={<ExportOutlined
                            />}>
                            Export
                        </Button></CSVLink>,
                    <Button
                        type="primary"
                        icon={<ImportOutlined />}
                        onClick={() => setIsOpenImport(true)}
                    >
                        Import
                    </Button>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            actionRef.current?.reload();
                            setOpenCreteUser(true)
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
            <CreateUser
                openCreateUser={openCreateUser}
                setOpenCreteUser={setOpenCreteUser}
                reloadTable={reloadTable}
            />
            <ModalImport
                setIsOpenImport={setIsOpenImport}
                isOpenImport={isOpenImport}
                reloadTable={reloadTable}
            />
            <UpdateUser
                setIsOpenUpdate={setIsOpenUpdate}
                isOpenUpdate={isOpenUpdate}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                reloadTable={reloadTable}
            />
        </>
    );
};

export default TableUser;