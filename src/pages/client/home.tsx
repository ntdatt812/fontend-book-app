import { getBooksAPI, getCategoryAPI } from "@/services/api";
import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons"
import { Button, Checkbox, Col, Divider, Form, InputNumber, Pagination, Rate, Row, Spin, Tabs } from "antd"
import { TabsProps } from "antd/lib";
import { useEffect, useState } from "react";
import { FormProps } from "antd";
import 'style/home.scss'

type FieldType = {
    category: string[];
    range: {
        from: number,
        to: number,
    }
}

const HomePage = () => {

    const [listBooks, setListBooks] = useState<IBookTable[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);

    const [filter, setFilter] = useState<string>("");
    const [loadingBook, setLoadingBook] = useState<boolean>(false);
    const [sortQuery, setSortQuery] = useState<string>("sort=-sold");
    const [form] = Form.useForm();

    const [dataCategory, setDataCategory] = useState<{
        label: string, value: string
    }[]>([]);

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await getCategoryAPI();
            if (res && res.data) {
                const d = res.data.map(item => {
                    return { label: item, value: item }
                })
                setDataCategory(d);
            }
        }
        fetchCategory();
    }, [])
    useEffect(() => {
        fetchBooks();
    }, [current, filter, pageSize, sortQuery]);

    const fetchBooks = async () => {
        setLoadingBook(true)
        let queryBook = `&current=${current}&pageSize=${pageSize}`
        if (filter) {
            queryBook += `&${filter}`;
        }
        if (sortQuery) {
            queryBook += `&${sortQuery}`;

        }
        const res = await getBooksAPI(queryBook);
        if (res && res.data) {
            setListBooks(res.data.result);
            setTotal(res.data.meta.total)
        }
        setLoadingBook(false)
    }

    const handleOnChangePage = (pagination: { current: number, pageSize: number }) => {

        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
    }

    const handleChangeFilter = (changedValues: any, values: any) => {
        console.log(">>> check handleChangeFilter", changedValues, values);
        if (changedValues.category) {
            const cate = values.category;
            if (cate && cate.length > 0) {
                const f = cate.join(',');
                setFilter(`category=${f}`);
            } else {
                setFilter('');
            }
        }
    }
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (values.range.from >= 0 && values.range.to >= 0) {
            let f = `price>=${values.range.from}&price<=${values.range.to}`;
            if (values.category) {
                const cate = values.category.join(',');
                f += `&category${cate}`
            }
            setFilter(f)
        }
    }
    const items: TabsProps['items'] = [
        {
            key: 'sort=-sold',
            label: 'Phổ biến',
            children: <></>,
        },
        {
            key: 'sort=-createdAt',
            label: 'Hàng mới',
            children: <></>,
        },
        {
            key: 'sort=price',
            label: 'Giá thấp đến cao',
            children: <></>,
        },
        {
            key: 'sort=-price',
            label: 'Giá cao đến thấp',
            children: <></>,
        },
    ];

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="homepage-container" style={{ maxWidth: 1440, margin: "0 auto" }}>
                <Row gutter={[20, 20]}>
                    <Col md={4} sm={0} xs={0}  >
                        <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <strong><FilterTwoTone />&nbsp;&nbsp;&nbsp;Bộ lọc tìm kiếm</strong>
                                <ReloadOutlined title="Tìm kiếm" onClick={() => {
                                    form.resetFields();
                                    setFilter('')
                                }} />
                            </div>
                            <Form
                                onFinish={onFinish}
                                form={form}
                                onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                            >
                                <Form.Item
                                    name="category"
                                    label="Danh mục sản phẩm"
                                    labelCol={{ span: 24 }}
                                >
                                    <Checkbox.Group style={{ width: '100%' }}>
                                        <Row>
                                            {dataCategory.map((item, index) =>
                                                <Col span={24} key={`index-${index}`} style={{ padding: '7px 0' }}>
                                                    <Checkbox value={item.value}>{item.label}</Checkbox>
                                                </Col>
                                            )}
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                                <Divider />
                                <Form.Item
                                    label="Khoảng giá"
                                    labelCol={{ span: 24 }}
                                >
                                    <Row gutter={[10, 10]} style={{ width: "100%" }}>
                                        <Col xl={11} md={24}>
                                            <Form.Item name={["range", 'from']}>
                                                <InputNumber
                                                    name='from'
                                                    min={0}
                                                    placeholder="đ TỪ"
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    style={{ width: '100%' }}
                                                    controls={false}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xl={2} md={0}>
                                            <div > - </div>
                                        </Col>
                                        <Col xl={11} md={24}>
                                            <Form.Item name={["range", 'to']}>
                                                <InputNumber
                                                    name='to'
                                                    min={0}
                                                    placeholder="đ ĐẾN"
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    style={{ width: '100%' }}
                                                    controls={false}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <div>
                                        <Button onClick={() => form.submit()}
                                            style={{ width: "100%" }} type='primary'>Áp dụng</Button>
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
                        </div>
                    </Col>
                    <Col md={20} xs={24} >
                        <Spin spinning={loadingBook} tip={"Đang tải..."}>

                            <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                                <Row>
                                    <Tabs
                                        defaultActiveKey="1"
                                        items={items}
                                        onChange={(value) => setSortQuery(value)}
                                        style={{ overflowX: "auto" }}
                                    />
                                </Row>
                                <Row className="customize-row">
                                    {listBooks.map((item, index) => {
                                        return (
                                            <div className="column" key={index}>
                                                <div className='wrapper'>
                                                    <div className='thumbnail'>
                                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} alt="thumbnail book" />
                                                    </div>
                                                    <div className='text'>{item.mainText}</div>
                                                    <div className='price'>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                    </div>
                                                    <div className='rating'>
                                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                        <span>Đã bán {item.sold ?? 0}</span>
                                                    </div>
                                                </div>
                                            </div>

                                        )
                                    })}


                                </Row>
                                <Divider />
                                <Row style={{ display: "flex", justifyContent: "center" }}>
                                    <Pagination
                                        current={current}
                                        pageSize={pageSize}
                                        total={total}
                                        responsive
                                        onChange={(p, s) => { handleOnChangePage({ current: p, pageSize: s }) }}
                                    />
                                </Row>
                            </div>
                        </Spin>
                    </Col>
                </Row>
            </div >
        </div>
    )
}

export default HomePage
