import { getCategoryAPI } from "@/services/api";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Col, Divider, Form, GetProp, Image, Input, InputNumber, Modal, Row, Select, Upload, UploadFile, UploadProps } from "antd"
import { UploadChangeParam } from "antd/es/upload";
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";

interface IProps {
    isOpenCreate: boolean;
    setIsOpenCreate: (v: boolean) => void;
}

type FieldType = {
    _id: string,
    thumbnail: string,
    slider: string[],
    mainText: string,
    author: string,
    price: number,
    sold: number,
    quantity: number,
    category: string,
    createdAt: Date,
    updatedAt: Date,
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const CreateBook = (props: IProps) => {
    const { isOpenCreate, setIsOpenCreate } = props;
    const [form] = Form.useForm();
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const { message } = App.useApp()

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);

    const [listCategory, setListCategory] = useState<{
        label: string;
        value: string;
    }[]>([]);

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await getCategoryAPI();
            if (res && res.data) {
                const d = res.data.map(item => {
                    return { label: item, value: item }
                })
                setListCategory(d);
            }
        }
        fetchCategory();
    }, [])

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        setLoadingSubmit(true)
        console.log('Success:', values);
        setLoadingSubmit(false)
    };

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
        if (!isLt2M) {
            message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
        }
        return isJpgOrPng && isLt2M;
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };
    const handleChange = (info: UploadChangeParam, type: "thumbnail" | "slider") => {
        if (info.file.status === 'uploading') {
            type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
        }
    };
    const handleUploadFile: UploadProps['customRequest'] = ({ file, onSuccess, onError }) => {
        setTimeout(() => {
            if (onSuccess)
                onSuccess("ok");
        }, 1000);
    };
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <>
            <Modal title="Thêm mới sách"
                open={isOpenCreate}
                onOk={form.submit}
                onCancel={() => {
                    form.resetFields();
                    setIsOpenCreate(false)
                }}
                width={"50vw"}
                destroyOnClose={true}
                okButtonProps={{ loading: loadingSubmit }}
                confirmLoading={loadingSubmit}
                okText="Thêm sách"
                cancelText="Huỷ"
                maskClosable={false}
            >
                <Divider />
                <Form
                    form={form}
                    onFinish={onFinish}
                    name="form-create-book"
                    layout="vertical"
                    autoComplete="off"
                >
                    <Row gutter={15}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Tên sách"
                                name="mainText"
                                rules={[{ required: true, message: 'Sách không tên hả???' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Tác giả"
                                name="author"
                                rules={[{ required: true, message: 'Ai viết sách zậy mày?!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                label="Giá tiền"
                                name="price"
                                rules={[{ required: true, message: 'Nhập cái giá vào!' }]}
                            >
                                <InputNumber
                                    min={0} // Không cho phép giá trị âm
                                    style={{ width: '100%' }}
                                    formatter={(value) =>
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                    addonAfter={"đ"}
                                    controls={false}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                label="Thể loại"
                                name="category"
                                rules={[{ required: true, message: 'Thể loại sách là gì? Chọn đi hộ tao' }]}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                label="Số lượng"
                                name="quantity"
                                rules={[{ required: true, message: 'Có bao nhiêu cuốn thì nhập vào!' }]}
                            >
                                <InputNumber min={1} style={{ width: " 100%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Ảnh thumbnail"
                                name="thumbnail"
                                rules={[{ required: true, message: "Upload ảnh thumbnail đi bạn ê!" }]}
                                valuePropName="fileList"
                                getValueFromEvent={normFile}

                            >
                                <Upload
                                    listType="picture-card"
                                    onPreview={handlePreview}
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFile}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, "thumbnail")}
                                    onPreview={handlePreview}
                                >
                                    <div>
                                        {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Ảnh slider"
                                name="slider"
                                rules={[{ required: true, message: "Upload ảnh thumbnail đi bạn!" }]}
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    listType="picture-card"
                                    onPreview={handlePreview}
                                    className="avatar-uploader"
                                    multiple
                                    customRequest={handleUploadFile}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, "slider")}
                                    onPreview={handlePreview}
                                >
                                    <div>
                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />)
                }
            </Modal >
        </>
    )
}
export default CreateBook