import { getBooksAPI } from "@/services/api";
import { DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
// import { CSVLink } from "react-csv";
import DetailBook from "./detail.book";
import CreateBook from "./create.book";
import UpdateBook from "./update.book";

type TSearchBook = {
    mainText: string,
    author: string,
    updatedAt: string
};

const TableBook = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })
    const [dataDetail, setDataDetail] = useState<IBookTable | null>(null);
    const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);

    const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false)
    const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false)
    const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false)

    const columns: ProColumns<IBookTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
            hidden: true
        },
        {
            title: 'ID',
            dataIndex: '_id',
            hideInSearch: true,
            render(_, entity) {
                return (
                    <a
                        href="#"
                        onClick={() => {
                            setDataDetail(entity);
                            setIsOpenDetail(true)
                        }}
                    >
                        {entity._id}
                    </a>
                )
            },
        },
        {
            title: 'Tên sách',
            dataIndex: 'mainText',
            sorter: true
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            hideInSearch: true
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: true
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            hideInSearch: true,
            sorter: true,
            render: (_, entity) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity.price),

        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            sorter: true,
            valueType: "date",
            hideInSearch: true,
        },
        {
            title: "Action",
            hideInSearch: true,
            render(_, entity) {
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
                            // description={`Bạn có chắc chắn muốn xoá ${entity.fullName} không?`}
                            // onConfirm={() => { handleDeleteUser(entity) }}
                            okText="Xác nhận"
                            cancelText="Huỷ"
                            placement='leftBottom'
                            okButtonProps={{
                                // loading: isDelete
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
    const reloadTableBook = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IBookTable, TSearchBook>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);
                    let queryBook = "";
                    if (params) {
                        queryBook += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.mainText) {
                            queryBook += `&mainText=/${params.mainText}/i`
                        }
                        if (params.author) {
                            queryBook += `&author=/${params.author}/i`
                        }
                    }

                    if (sort.mainText) {
                        queryBook += `&sort=${sort.mainText === "ascend" ? "mainText" : "-mainText"}`;
                    }
                    if (sort.author) {
                        queryBook += `&sort=${sort.author === "ascend" ? "author" : "-author"}`;
                    }
                    if (sort.price) {
                        queryBook += `&sort=${sort.price === "ascend" ? "price" : "-price"}`;
                    }
                    if (sort.updatedAt) {
                        queryBook += `&sort=${sort.updatedAt === "ascend" ? "updatedAt" : "-updatedAt"}`;
                    } else queryBook += "&sort=-updatedAt";
                    console.log(queryBook)

                    const res = await getBooksAPI(queryBook);
                    if (res.data) {
                        setMeta(res.data.meta)
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }
                }}

                rowKey="_id"
                search={{
                    labelWidth: 'auto',
                }}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => {
                        return (<div>{range[0]} - {range[1]} trên {total} rows</div>)
                    }
                }}
                headerTitle="Table book"
                toolBarRender={() => [
                    <Button
                        type="primary"
                        icon={<ExportOutlined
                        />}>
                        {/* <CSVLink
                        data={dataExport}
                        filename='export-users.csv'
                    >Export</CSVLink> */}
                        Export
                    </Button>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setIsOpenCreate(true)
                        }}
                        type="primary"
                    >
                        Add book
                    </Button>
                ]}
            />
            <DetailBook
                dataDetail={dataDetail}
                isOpenDetail={isOpenDetail}
                setIsOpenDetail={setIsOpenDetail}
                setDataDetail={setDataDetail}
            />
            <CreateBook
                isOpenCreate={isOpenCreate}
                setIsOpenCreate={setIsOpenCreate}
                reloadTableBook={reloadTableBook}
            />
            <UpdateBook
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                isOpenUpdate={isOpenUpdate}
                setIsOpenUpdate={setIsOpenUpdate}
                reloadTableBook={reloadTableBook}

            />
        </>
    )
}
export default TableBook;