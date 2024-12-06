import { Button, Result } from "antd";
import { useCurrentApp } from "components/context/app.context";
import { Link, useLocation } from "react-router-dom";

interface IProps {
    children: React.ReactNode
}

const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp();
    const location = useLocation();

    if (isAuthenticated === false) {
        return (
            <Result
                status="404"
                title="Not login"
                subTitle="Bạn cần đăng nhập để truy cập tài nguyên này."
                extra={<Button type="primary"><Link to={"/login"}>Đăng nhập</Link></Button>}
            />
        )
    }

    const isAdminRoute = location.pathname.includes("admin")
    if (isAuthenticated === true && isAdminRoute === true) {
        const role = user?.role;
        if (role === "USER") {
            return (
                <Result
                    status="403"
                    title="Not permission"
                    subTitle="Bạn không có quyền truy cập tài nguyên này."
                    extra={<Button type="primary"><Link to={"/"}>Trang chủ</Link></Button>}
                />
            )
        }
    }
    return (
        <>
            {props.children}
        </>
    )
}

export default ProtectedRoute;