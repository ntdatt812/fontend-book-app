import { updateUserAPI } from "@/services/api";
import { App, Input, Modal } from "antd";
import { Form } from "antd";
import { useEffect, useState } from "react";

interface IProps {
    setIsOpenUpdate: (v: boolean) => void;
    isOpenUpdate: boolean;
    setDataUpdate: (v: IUserTable | null) => void;
    dataUpdate: IUserTable | null;
    reloadTable: () => void;
}

const UpdateUser = (props: IProps) => {
    const { isOpenUpdate, setIsOpenUpdate, setDataUpdate, dataUpdate, reloadTable } = props;
    const [form] = Form.useForm();
    const { message } = App.useApp()
    const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false)

    type FieldType = {
        id: string,
        fullName?: string;
        phone?: string;
    };

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                id: dataUpdate._id,
                email: dataUpdate.email,
                fullName: dataUpdate.fullName,
                phone: dataUpdate.phone,
            })
        }
    }, [dataUpdate])

    const handleOk = async (values: FieldType) => {
        setLoadingUpdate(true);
        const res = await updateUserAPI(values.id, values.fullName!, values.phone!);
        if (res.data) {
            message.success(`Cập nhật user thành công!`);

        } else (
            message.error("Có lỗi xảy ra!")
        )
        reloadTable();
        setIsOpenUpdate(false);
        setDataUpdate(null);
        setLoadingUpdate(false);

    };

    return (
        <>
            <Modal title="Update user"
                open={isOpenUpdate}
                onOk={form.submit}
                okText="Cập nhật"
                okButtonProps={{
                    loading: loadingUpdate
                }}
                onCancel={() => {
                    setIsOpenUpdate(false)
                    setDataUpdate(null)
                    form.resetFields();
                }}
                cancelText="Huỷ"
            >
                <Form
                    name="basic"
                    layout='vertical'
                    form={form}
                    onFinish={handleOk}
                >
                    <Form.Item
                        label="Id"
                        name="id"
                        hidden
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"

                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="Tên hiển thị"
                        name="fullName"
                        rules={[{ required: true, message: 'Please input your full name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your phone!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
export default UpdateUser;
