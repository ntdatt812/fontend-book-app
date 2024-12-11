import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, Table, Upload } from "antd";
import { UploadProps } from "antd";

const { Dragger } = Upload

interface IProps {
    setIsOpenImport: (v: boolean) => void;
    isOpenImport: boolean;
}



const ModalImport = (props: IProps) => {
    const { isOpenImport, setIsOpenImport } = props;
    const { message } = App.useApp();

    const handleOk = () => {
        setIsOpenImport(false);
    };

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false, //chỉ upload 1 file
        maxCount: 1,

        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",

        customRequest({ file, onSuccess }) {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok");
            }, 1000)
        },

        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <>
            <Modal title="Import file user"
                open={isOpenImport}
                onOk={handleOk}
                onCancel={() => setIsOpenImport(false)}
                okText="Import data"
                okButtonProps={{
                    disabled: true
                }}
                //không đóng khi nhấn ra ngoài
                maskClosable={false}
            >
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                        banned files.
                    </p>
                </Dragger>
                <div style={{ paddingTop: 20 }}>
                    <Table
                        title={() => <span>Dữ liệu upload: </span>}
                        columns={[
                            { dataIndex: 'fullName', title: 'Tên hiển thị' },
                            { dataIndex: 'email', title: 'Email' },
                            { dataIndex: 'phone', title: 'Số điện thoại' },
                        ]} />
                </div>
            </Modal>

        </>
    )
}

export default ModalImport