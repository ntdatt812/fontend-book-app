import { createBookAPI, getCategoryAPI, uploadFileAPI } from "@/services/api";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
    App, Col, Divider, Form, GetProp,
    Image, Input, InputNumber, Modal, Row,
    Select, Upload, UploadFile, UploadProps
} from "antd"
import { UploadChangeParam } from "antd/es/upload";
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type UserUploadType = "thumbnail" | "slider";

interface IProps {
    isOpenCreate: boolean;
    setIsOpenCreate: (v: boolean) => void;
    reloadTableBook: () => void;
}

type FieldType = {
    mainText: string;
    author: string;
    price: number;
    category: string;
    quantity: number;
    thumbnail: any;
    slider: any;
};

const CreateBook = (props: IProps) => {
    const { isOpenCreate, setIsOpenCreate,
        reloadTableBook
    } = props;
    const [form] = Form.useForm();
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const { message, notification } = App.useApp()

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
    }, []);
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoadingSubmit(true)
        const sliderBook = fileListSlider.map((item) => item.name) ?? [];
        // console.log('Success:', values, fileListThumbnail[0].name, sliderBook);
        // console.log("values fileListThumbnail: ", fileListThumbnail)
        // console.log("values fileListSlider: ", fileListSlider)
        const res = await createBookAPI(fileListThumbnail[0].name, sliderBook, values.mainText, values.author, values.price, values.quantity, values.category);
        if (res.data) {
            notification.success({
                message: "Thành công!",
                description: `Sách ${values.mainText} đã được thêm.`
            })
            form.resetFields()
            setFileListSlider([]);
            setFileListThumbnail([]);
            setIsOpenCreate(false);
            reloadTableBook();
        } else {
            notification.error({
                message: "Có lỗi xảy ra!",
                description: res.message
            })
        }
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
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleRemove = async (file: UploadFile, type: UserUploadType) => {
        if (type === 'thumbnail') {
            setFileListThumbnail([])
        }
        if (type === 'slider') {
            const newSlider = fileListSlider.filter(x => x.uid !== file.uid);
            setFileListSlider(newSlider);
        }
    };

    const handleChange = (info: UploadChangeParam, type: UserUploadType) => {
        if (info.file.status === 'uploading') {
            type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
        }
    };

    const handleUploadFile = async (options: RcCustomRequestOptions, type: UserUploadType) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, "book");

        if (res && res.data) {
            const uploadedFile: any = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`
            }
            if (type === "thumbnail") {
                setFileListThumbnail([{ ...uploadedFile }]);
            }
            if (type === "slider") {
                setFileListSlider((prevState) => [...prevState, { ...uploadedFile }])
            }
            if (onSuccess) {
                onSuccess('ok')
            } else {
                message.error(res.message);
            }
        }
    }
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
                    setFileListSlider([]);
                    setFileListThumbnail([]);
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
                                rules={[{ required: true, message: 'Tên sách không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Tác giả"
                                name="author"
                                rules={[{ required: true, message: 'Tác giả không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                label="Giá tiền"
                                name="price"
                                rules={[{ required: true, message: 'Giá tiền  không được để trống!' }]}
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
                                rules={[{ required: true, message: 'Chưa chọn thể loại sách!' }]}
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
                                rules={[{ required: true, message: 'Số lượng  không được để trống!' }]}
                            >
                                <InputNumber min={1} style={{ width: " 100%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Ảnh thumbnail"
                                name="thumbnail"
                                rules={[{ required: true, message: "Cần upload ảnh thumbnail!" }]}
                                valuePropName="fileList"
                                getValueFromEvent={normFile}

                            >
                                <Upload
                                    listType="picture-card"
                                    onPreview={handlePreview}
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={(options) => handleUploadFile(options, 'thumbnail')}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, "thumbnail")}
                                    onPreview={handlePreview}
                                    onRemove={(file) => { handleRemove(file, 'thumbnail') }}
                                    fileList={fileListThumbnail}
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
                                rules={[{ required: true, message: "Cần upload ảnh slider!" }]}
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    multiple
                                    listType="picture-card"
                                    onPreview={handlePreview}
                                    className="avatar-uploader"
                                    customRequest={(options) => handleUploadFile(options, 'slider')}
                                    onRemove={(file) => { handleRemove(file, 'slider') }}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, "slider")}
                                    onPreview={handlePreview}
                                    fileList={fileListSlider}
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