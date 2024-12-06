import type { FormProps } from 'antd';
import { App, Button, Divider, Form, Input } from 'antd';
import './register.scss'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { registerAPI } from '@/services/api';

type FieldType = {
    fullName?: string;
    email?: string;
    password?: string;
    phone?: string;
};

const RegisterPage: React.FC = () => {
    const { message } = App.useApp();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)
        const res = await registerAPI(values.fullName!, values.email!, values.password!, values.phone!)
        if (res?.data) {
            message.success("Đăng ký thành công. Hãy đăng nhập vào hệ thống!")
            navigate("/login")
        } else {
            message.warning("Email đã tồn tại trong hệ thống!")
            console.log(">> check res: ", res.message)
        }
        setIsLoading(false)
    };

    return (
        <div className="register-page">
            <main className='main'>
                <div className='container'>
                    <section className='wrapper'>
                        <div className='heading'>
                            <h2 className='text text-large'>Đăng ký tài khoản</h2>
                            <Divider />
                        </div>
                        <Form
                            layout='vertical'
                            name="form-register"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Họ tên"
                                name="fullName"
                                rules={[{ required: true, message: 'Không được để trống họ tên!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Không được để trống email!' },
                                    { type: "email", message: "Email không đúng đinh dạng!" }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Không được để trống password!' }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Số điện thoại"
                                name="phone"
                                rules={[{ required: true, message: 'Không được để trống số điện thoại!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isLoading}
                                >
                                    Đăng ký
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className='text text-normal' style={{ textAlign: "center" }}>
                                Đã có tài khoản? <Link to={"/login"}>Đăng nhập</Link>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default RegisterPage