import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons"
import { Button, Checkbox, Col, Divider, Form, InputNumber, Pagination, PaginationProps, Rate, Row, Tabs } from "antd"
import { TabsProps } from "antd/lib";
import 'style/home.scss'
const HomePage = () => {
    const onChange = (key: string) => {
        console.log(key);
    };

    const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
        console.log(current, pageSize);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Phổ biến',
            children: <></>,
        },
        {
            key: '2',
            label: 'Hàng mới',
            children: <></>,
        },
        {
            key: '3',
            label: 'Giá thấp đến cao',
            children: <></>,
        },
        {
            key: '4',
            label: 'Giá cao đến thấp',
            children: <></>,
        },
    ];
    return (
        <div className="homepage-container" style={{ maxWidth: 1440, margin: "0 auto" }}>
            <Row gutter={[20, 20]}>
                <Col md={4} sm={0} xs={0} style={{ border: "1px solid green" }} >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span><FilterTwoTone />  Bộ lọc tìm kiếm</span>
                        <ReloadOutlined title="Tìm kiếm" onClick={() => { }} />
                    </div>
                    <Form>
                        <Form.Item
                            name="category"
                            label="Danh mục sản phẩm"
                            labelCol={{ span: 24 }}
                        >
                            <Checkbox.Group style={{ width: '100%' }}>
                                <Row>
                                    <Col span={24}>
                                        <Checkbox value="A">A</Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="B">B</Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="C">C</Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="D">D</Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="E">E</Checkbox>
                                    </Col>
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                        <Divider />
                        <Form.Item
                            label="Khoảng giá"
                            labelCol={{ span: 24 }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Form.Item name={['range', 'from']}>
                                    <InputNumber
                                        name='from'
                                        min={0}
                                        placeholder="đ TỪ"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        controls={false}
                                    />
                                </Form.Item>
                                <span>-</span>
                                <Form.Item>
                                    <InputNumber
                                        name='to'
                                        min={0}
                                        placeholder="đ ĐẾN"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        controls={false}
                                    />
                                </Form.Item>
                            </div>
                            <div>
                                <Button
                                    type="primary"
                                    style={{ width: "100%" }}
                                    onClick={() => { }}>
                                    Áp dụng
                                </Button>
                            </div>
                        </Form.Item>
                        <Divider />
                        <Form.Item
                            label="Đánh giá"
                            labelCol={{ span: 24 }}
                        >
                            <div>
                                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text"></span>
                            </div>
                            <div>
                                <Rate value={4} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text"> trở lên</span>
                            </div>
                            <div>
                                <Rate value={3} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text"> trở lên</span>
                            </div>
                            <div>
                                <Rate value={2} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text"> trở lên</span>
                            </div>
                            <div>
                                <Rate value={1} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text"> trở lên</span>
                            </div>
                        </Form.Item>
                    </Form>
                </Col>
                <Col md={20} xs={24} style={{ border: "1px solid red" }}>
                    <Row>
                        <Tabs
                            defaultActiveKey="1"
                            items={items}
                            onChange={onChange} />
                    </Row>
                    <Row className="customize-row">
                        <div className="column">
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="thumbnail book" />
                                </div>
                                <div className='text'>Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(70000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                    <span>Đã bán 1k</span>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="thumbnail book" />
                                </div>
                                <div className='text'>Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(70000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                    <span>Đã bán 1k</span>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="thumbnail book" />
                                </div>
                                <div className='text'>Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(70000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                    <span>Đã bán 1k</span>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="thumbnail book" />
                                </div>
                                <div className='text'>Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(70000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                    <span>Đã bán 1k</span>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="thumbnail book" />
                                </div>
                                <div className='text'>Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(70000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                    <span>Đã bán 1k</span>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="thumbnail book" />
                                </div>
                                <div className='text'>Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(70000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                    <span>Đã bán 1k</span>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="thumbnail book" />
                                </div>
                                <div className='text'>Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(70000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                    <span>Đã bán 1k</span>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="thumbnail book" />
                                </div>
                                <div className='text'>Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(70000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                    <span>Đã bán 1k</span>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="thumbnail book" />
                                </div>
                                <div className='text'>Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(70000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                    <span>Đã bán 1k</span>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="thumbnail book" />
                                </div>
                                <div className='text'>Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(70000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                    <span>Đã bán 1k</span>
                                </div>
                            </div>
                        </div>
                    </Row>
                    <Divider />
                    <Row style={{ display: "flex", justifyContent: "center" }}>
                        <Pagination
                            showSizeChanger
                            onShowSizeChange={onShowSizeChange}
                            defaultCurrent={3}
                            total={500}
                        />
                    </Row>
                </Col>
            </Row>
        </div >
    )
}

export default HomePage