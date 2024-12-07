import { loginAPI } from "@/services/api";
import { App, Button, Divider, Form, Input } from "antd"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import type { FormProps } from 'antd'
import './login.scss'
import { useCurrentApp } from "components/context/app.context";
interface FieldType {
    email: string;
    password: string;
}

const LoginPage = () => {
    const { notification } = App.useApp();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser, setIsAuthenticated } = useCurrentApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true)
        const res = await loginAPI(values.email, values.password);
        if (res?.data) {
            setIsAuthenticated(true);
            setUser(res.data.user);
            localStorage.setItem('access_token', res.data.access_token);
            notification.success({
                message: "Đang nhập thành công",
                description: "Chào mừng bạn đã đến với hệ thống!"
            })
            navigate("/")
        } else {
            notification.error({
                message: "Có lỗi xảy ra!",
                // description: JSON.stringify(res.message)
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
        setIsLoading(false)
    };

    return (
        <div className="register-page">
            <main className='main'>
                <div className='container'>
                    <section className='wrapper'>
                        <div className='heading'>
                            <h2 className='text text-large'>Đăng nhập hệ thống</h2>
                            <Divider />
                        </div>
                        <Form
                            layout="vertical"
                            name="form-register"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
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
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isLoading}
                                >
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className='text text-normal' style={{ textAlign: "center" }}>
                                Đã chưa có tài khoản? <Link to={"/register"}>Đăng ký</Link>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default LoginPage