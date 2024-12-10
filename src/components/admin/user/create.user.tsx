import { createUserAPI } from "@/services/api";
import { App, Form, Input, Modal } from "antd";

interface IProps {
    openCreateUser: boolean;
    setOpenCreteUser: (v: boolean) => void;
    reloadTable: () => void;
}

type FieldType = {
    fullName: string,
    password: string,
    email: string,
    phone: string,
}

const CreateUser = (props: IProps) => {
    const { openCreateUser, setOpenCreteUser, reloadTable } = props;
    const [form] = Form.useForm();
    const { message, notification } = App.useApp()

    const handleCreateUser = async (values: FieldType) => {
        const res = await createUserAPI(values.fullName, values.password, values.email, values.phone);
        if (res.data) {
            message.success("Đã thêm người dùng!")
            reloadTable()
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
        setOpenCreteUser(false);
        form.resetFields()
    };

    return (
        <Modal
            title="Thêm mới người dùng"
            open={openCreateUser}
            okText="Thêm"
            onOk={form.submit}
            onCancel={() => {
                setOpenCreteUser(false);
                form.resetFields()
            }}
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleCreateUser}
            >
                <Form.Item
                    name="fullName"
                    label="Tên hiển thị"
                    rules={[{ required: true, message: "Không được để trống tên hiển thị" }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: "Không được để trống mật khẩu" }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: "Không được để trống email!" },
                        { type: "email", message: "Email không đúng định dạng!" }
                    ]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: "Không được để trống số điện thoại" }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default CreateUser;