import { ArrowLeftOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Divider, Rate, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import ImageGallery from "react-image-gallery";
import 'style/book.scss'
import ModalGallery from "./modal.gallery";
import { useNavigate } from "react-router-dom";


interface IProps {
    dataDetail: IBookTable | null
}

type UserAction = "MINUS" | "PLUS";

const DetailBook = (props: IProps) => {
    const { dataDetail } = props;
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const navigate = useNavigate()
    const [imageGallery, setImageGallery] = useState<{
        original: string,
        thumbnail: string,
        originalClass: string,
        thumbnailClass: string
    }[]>([])

    const refGallery = useRef<ImageGallery>(null);

    const [quantity, setQuantity] = useState<number>(1);

    const handleOnClickImage = () => {
        //get current index onClick
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
    }

    const handleChangeQuantity = (type: UserAction) => {
        if (type === 'PLUS' && dataDetail) {
            if (quantity + 1 > +dataDetail?.quantity) return;
            setQuantity(quantity + 1);
        }
        if (type === 'MINUS') {
            if (quantity - 1 <= 0) return;
            setQuantity(quantity - 1);

        }
    }

    const handleOnchangeInput = (value: string) => {
        if (+value > 0 && dataDetail && +value <= dataDetail?.quantity) {
            setQuantity(+value);
        }
    }

    useEffect(() => {

        if (dataDetail) {
            const images = [];
            if (dataDetail.thumbnail) {
                images.push({
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataDetail.thumbnail}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataDetail.thumbnail}`,
                    originalClass: "original-image",
                    thumbnailClass: "thumbnail-image"
                })
            }
            if (dataDetail.thumbnail) {
                dataDetail.slider.map(item => {
                    images.push({
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image"
                    })
                })
            }
            setImageGallery(images)
        }
    }, [dataDetail]);


    const handleBack = () => {
        navigate(-1); // Quay lại trang trước đó
    };

    return (
        <>
            {dataDetail ? <>

                <div style={{ background: '#efefef', padding: '20px 0' }}>
                    <div className="view-detail-book" style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                        <div className="back-button" onClick={() => {
                            handleBack()
                            setQuantity(1)
                        }}>
                            <ArrowLeftOutlined />
                            <span>Trở về</span>
                        </div>
                        <div style={{ padding: '20px', background: '#fff', borderRadius: 5 }}>
                            <Row gutter={[20, 20]}>
                                <Col md={10} sm={0} xs={0}>
                                    <ImageGallery
                                        ref={refGallery}
                                        items={imageGallery}
                                        showPlayButton={false}
                                        showFullscreenButton={false}
                                        renderLeftNav={() => <></>}
                                        renderRightNav={() => <></>}
                                        slideOnThumbnailOver={true}
                                        onClick={() => handleOnClickImage()}
                                    />
                                </Col>
                                <Col md={14} sm={24}>
                                    <Col md={0} sm={24} xs={24}>
                                        <ImageGallery
                                            items={imageGallery}
                                            showPlayButton={false}
                                            showFullscreenButton={false}
                                            renderLeftNav={() => <></>}
                                            renderRightNav={() => <></>}
                                            showThumbnails={false}
                                        />
                                    </Col>
                                    <Col span={24}>
                                        <div className='author'>Tác giả: <a href='#'>{dataDetail.author}</a> </div>
                                        <div className='title'>{dataDetail.mainText}</div>
                                        <div className='rating'>
                                            <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                            <span className='sold'>
                                                <Divider type="vertical" />
                                                Đã bán {dataDetail.sold ?? 0}</span>
                                        </div>
                                        <div className='price'>
                                            <span className='currency'>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataDetail.price ?? 0)}
                                            </span>
                                        </div>
                                        <div className='delivery'>
                                            <div>
                                                <span className='left'>Vận chuyển</span>
                                                <span className='right'>Miễn phí vận chuyển</span>
                                            </div>
                                        </div>
                                        <div className='delivery'>
                                            <div>
                                                <span className='left'>Sản phẩm còn lại: </span>
                                                <span className='rightQuantity'>{dataDetail.quantity}</span>
                                            </div>
                                        </div>
                                        <div className='quantity'>
                                            <span className='left'>Số lượng</span>
                                            <span className='right'>
                                                <button onClick={() => { handleChangeQuantity('MINUS') }}><MinusOutlined /></button>
                                                <input value={quantity} onChange={(event) => { handleOnchangeInput(event.target.value) }} />
                                                <button onClick={() => { handleChangeQuantity('PLUS') }}><PlusOutlined /></button>
                                            </span>
                                        </div>
                                        <div className='buy'>
                                            <button className='cart'>
                                                <BsCartPlus className='icon-cart' />
                                                <span>Thêm vào giỏ hàng</span>
                                            </button>
                                            <button className='now'>Mua ngay</button>
                                        </div>
                                    </Col>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <ModalGallery
                    isOpenModalGallery={isOpenModalGallery}
                    setIsOpen={setIsOpenModalGallery}
                    currentIndex={currentIndex}
                    items={imageGallery}
                    title={dataDetail.mainText}
                /></> : <></>}

        </>
    )
}

export default DetailBook;