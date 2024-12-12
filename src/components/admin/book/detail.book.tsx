import { FORMATE_DATE_VN } from "@/services/helper";
import { Badge, Descriptions, Divider, Drawer, Image, Upload, UploadFile, UploadProps } from "antd"
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { GetProp } from "antd/lib";
import { v4 as uuidv4 } from 'uuid';

interface IProps {
    dataDetail: IBookTable | null;
    isOpenDetail: boolean;
    setDataDetail: (v: IBookTable | null) => void;
    setIsOpenDetail: (v: boolean) => void;
}

const DetailBook = (props: IProps) => {
    const { dataDetail, isOpenDetail,
        setDataDetail, setIsOpenDetail } = props;
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    useEffect(() => {
        if (dataDetail) {
            let imgThumbnail: any = {};
            const imgSlider: UploadFile[] = [];
            if (dataDetail?.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataDetail.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataDetail.thumbnail}`,
                }
            }
            if (dataDetail?.slider && dataDetail.slider.length > 0) {
                dataDetail.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    })
                })
            }
            setFileList([imgThumbnail, ...imgSlider])
        }
    }, [dataDetail])

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);
    return (
        <>

            {
                dataDetail ?
                    <Drawer
                        title="Chi tiết thông tin sách"
                        onClose={() => {
                            setDataDetail(null)
                            setIsOpenDetail(false)
                        }}
                        open={isOpenDetail}
                        width={"70vw"}
                    >
                        < Descriptions
                            title="Thông tin sách"
                            bordered
                            column={2}
                        >
                            <Descriptions.Item label="ID" >{dataDetail._id}</Descriptions.Item>
                            <Descriptions.Item label="Tên sách">{dataDetail.mainText}</Descriptions.Item>
                            <Descriptions.Item label="Tác giả">{dataDetail.author}</Descriptions.Item>
                            <Descriptions.Item label="Giá tiền">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataDetail?.price)}</Descriptions.Item>
                            <Descriptions.Item label="Thể loại" span={2}>
                                <Badge status="success" text={dataDetail.category} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Created at">{dayjs(dataDetail.createdAt).format(FORMATE_DATE_VN)}</Descriptions.Item>
                            <Descriptions.Item label="Updated at">{dayjs(dataDetail.updatedAt).format(FORMATE_DATE_VN)}</Descriptions.Item>
                        </Descriptions >
                        <Divider orientation="left" >Ảnh Books</Divider>
                        <Upload
                            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            showUploadList={
                                { showRemoveIcon: false }
                            }
                        >
                        </Upload>
                        {previewImage && (
                            <Image
                                wrapperStyle={{ display: 'none' }}
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: (visible) => setPreviewOpen(visible),
                                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                }}
                                src={previewImage}
                            />
                        )}
                    </Drawer > : <></>
            }
        </>
    )
}
export default DetailBook