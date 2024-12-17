import DetailBook from "components/client/book/detail.book"
import { useEffect } from "react";
import { useParams } from "react-router-dom"

const BookPage = () => {
    const id = useParams();

    useEffect(() => {
        if (id) {
            console.log(id)
        }
    }, [id])
    return (
        <DetailBook />
    )
}

export default BookPage