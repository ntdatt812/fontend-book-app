import { FORMATE_DATE_VN } from "@/services/helper";
import { Avatar, Badge, Descriptions, Drawer } from "antd";
import dayjs from "dayjs";

interface IProps {
    userDetail: IUserTable | null;
    isOpenDetail: boolean
    setIsOpenDetail: (v: boolean) => void;
    setUserDetail: (v: IUserTable | null) => void;
}

const DetailUser = (props: IProps) => {
    const { isOpenDetail, userDetail, setIsOpenDetail, setUserDetail } = props;
    return (<>

        {userDetail ?
            <Drawer
                title="Chi tiết"
                onClose={() => {
                    setIsOpenDetail(false)
                    setUserDetail(null)
                }}
                open={isOpenDetail}
                width={"50vw"}

            >
                <Descriptions
                    title="Thông tin user"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="ID" >{userDetail._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên hiển thị">{userDetail.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{userDetail.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{userDetail.phone}</Descriptions.Item>
                    <Descriptions.Item label="Role">
                        <Badge status="success" text={userDetail.role} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Avatar">
                        <Avatar size={40} src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${userDetail.avatar}`}>USER</Avatar>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created at">{dayjs(userDetail.createdAt).format(FORMATE_DATE_VN)}</Descriptions.Item>
                    <Descriptions.Item label="Updated at">{dayjs(userDetail.updatedAt).format(FORMATE_DATE_VN)}</Descriptions.Item>
                </Descriptions>
            </Drawer >
            :
            <></>
        }
    </>
    )
}
export default DetailUser;