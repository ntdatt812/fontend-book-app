import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, Table, Upload } from "antd";
import { UploadProps } from "antd";
import { Buffer } from 'buffer';
import { useState } from "react";
import Exceljs from 'exceljs'
import { bulkCreateUserAPI } from "@/services/api";
import templateFile from "assets/template/user.xlsx?url"
const { Dragger } = Upload

interface IProps {
    setIsOpenImport: (v: boolean) => void;
    isOpenImport: boolean;
    reloadTable: () => void;
}

interface IDataImport {
    fullName: string;
    email: string;
    phone: string;
}



const ModalImport = (props: IProps) => {
    const { isOpenImport, setIsOpenImport, reloadTable } = props;
    const { message, notification } = App.useApp();

    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const [loadingImport, setLoadingImport] = useState<boolean>(false)
    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false, //chỉ upload 1 file
        maxCount: 1,

        //chỉ chấp nhận file csv hoặc excel
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",

        customRequest({ file, onSuccess }) {
            setTimeout(async () => {
                if (onSuccess) onSuccess("ok");
            }, 1000)
        },

        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
                console.log(info);

            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                if (info.file) {
                    const file = info.file.originFileObj!;

                    //load file buffer
                    const workbook = new Exceljs.Workbook();
                    const arrayBuffer = await file.arrayBuffer()
                    const buffer = Buffer.from(arrayBuffer);
                    await workbook.xlsx.load(buffer);

                    //convert file to json
                    const jsonData: IDataImport[] = [];
                    workbook.worksheets.forEach(function (sheet) {
                        // read first row as data keys
                        const firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) return;
                        const keys = firstRow.values as any[];
                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber == 1) return;
                            const values = row.values as any;
                            const obj: any = {};
                            for (let i = 1; i < keys.length; i++) {
                                obj[keys[i]] = values[i];
                            }
                            jsonData.push(obj);
                        })
                    });
                    setDataImport(jsonData);
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },

        onRemove() {
            setDataImport([])
        }
    };

    const handleBulkCreate = async () => {
        setLoadingImport(true)
        const dataUsersImport = dataImport.map(user => ({
            ...user,
            password: import.meta.env.VITE_USER_PASSWORD,

        }))
        const res = await bulkCreateUserAPI(dataUsersImport);
        if (res.data) {
            notification.info({
                message: "Thông báo",
                description: (<span>
                    <span style={{ color: 'green' }}> Đã thêm thành công {res.data.countSuccess}</span>, <span style={{ color: 'red' }}> thất bại {res.data.countError}</span>!
                </span >)
            })
        }
        setLoadingImport(false)
        setIsOpenImport(false);
        setDataImport([]);
        reloadTable();
    }

    return (
        <>
            <Modal title="Import file user"
                open={isOpenImport}
                onOk={() => handleBulkCreate()}
                onCancel={() => {
                    setIsOpenImport(false);
                    setDataImport([]);
                }}
                okText="Import data"
                okButtonProps={{
                    disabled: dataImport.length > 0 ? false : true,
                    loading: loadingImport
                }}
                //không đóng khi nhấn ra ngoài
                maskClosable={false}

                destroyOnClose={true}
            >
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Only accept .csv, .xls, .xlsx
                        <a
                            onClick={e => e.stopPropagation()}
                            href={templateFile}
                            download>
                            Download sample file
                        </a>
                    </p>
                </Dragger>
                <div style={{ paddingTop: 20 }}>
                    <Table
                        title={() => <span>Dữ liệu upload: </span>}
                        dataSource={dataImport}
                        rowKey={"email"}
                        columns={[
                            { dataIndex: 'fullName', title: 'Tên hiển thị' },
                            { dataIndex: 'email', title: 'Email' },
                            { dataIndex: 'phone', title: 'Số điện thoại' },
                        ]} />
                </div>
            </Modal >

        </>
    )
}

export default ModalImport