import { Skeleton, Row, Col, Rate, Divider } from 'antd';

const LoaderBook = () => {
    return (
        <div style={{ background: '#efefef', padding: '20px 0' }}>
            <div className="view-detail-book" style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                <div style={{ padding: '20px', background: '#fff', borderRadius: 5 }}>
                    <Row gutter={[20, 20]}>
                        <Col md={10} sm={0} xs={0}>
                            <div>
                                <Skeleton.Image active style={{ width: "580px", height: "290px" }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: "5px", marginTop: "20px" }}>
                                <Skeleton.Image active />
                                <Skeleton.Image active />
                                <Skeleton.Image active />
                            </div>
                        </Col>
                        <Col md={14} sm={24}>
                            <Col md={0} sm={24} xs={24}>
                                <Skeleton.Image active style={{ width: "300px", height: "320px" }} />
                            </Col>
                            <Col span={24}>
                                <Skeleton.Input style={{ width: 200, marginBottom: 10 }} active />

                                <Skeleton.Input style={{ width: 300, marginBottom: 10 }} active />

                                <Skeleton active paragraph={{ rows: 1 }} />
                                <div className='rating'>
                                    <Rate value={0} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                    <span className='sold'>
                                        <Divider type="vertical" />
                                        <Skeleton.Input style={{ width: 100 }} active />
                                    </span>
                                </div>

                                <div className='price'>
                                    <Skeleton.Input style={{ width: 150 }} active />
                                </div>

                                <div className='delivery'>
                                    <Skeleton.Input style={{ width: 200 }} active />
                                </div>

                                <div className='quantity'>
                                    <Skeleton.Input active />
                                    <span className='right'>
                                        <Skeleton.Input active />
                                    </span>
                                </div>

                                <div className='buy'>
                                    <button className='cart' >
                                        <Skeleton.Button active />
                                    </button>
                                    <button className='now' >
                                        <Skeleton.Button active />
                                    </button>
                                </div>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default LoaderBook;