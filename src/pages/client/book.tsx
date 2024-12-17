import LoaderBook from "@/components/client/book/loader.book";
import { getBookDetailAPI } from "@/services/api";
import { App } from "antd";
import DetailBook from "components/client/book/detail.book"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

const BookPage = () => {
    const { id } = useParams();
    const { notification } = App.useApp()
    const [dataDetail, setDataDetail] = useState<IBookTable | null>(null)
    const [loadingDetail, setLoadingDetail] = useState<boolean>(false)

    useEffect(() => {
        if (id) {
            fetchBookDetail()
        }
    }, [id])

    const fetchBookDetail = async () => {
        setLoadingDetail(true);
        const res = await getBookDetailAPI(id!);
        if (res.data) {
            console.log("check id: ", res)
            setDataDetail(res.data)
        } else {
            notification.error({
                message: "Có lỗi xảy ra!",
                description: res.message
            })
        }
        setLoadingDetail(false);
    }

    return (
        <div>
            {loadingDetail ?
                <  LoaderBook />
                :
                <DetailBook
                    dataDetail={dataDetail}
                />}
        </div>

    )
}

export default BookPage