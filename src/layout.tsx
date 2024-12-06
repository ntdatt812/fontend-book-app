import { Outlet } from "react-router-dom"
import AppHeader from "components/layout/app.header"
import { useEffect } from "react"
import { fetchAccountAPI } from "services/api"
import { useCurrentApp } from "components/context/app.context"
import SyncLoader from "react-spinners/SyncLoader"

function Layout() {
  const { setUser, isAppLoading, setIsAppLoading, setIsAuthenticated } = useCurrentApp();

  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetchAccountAPI();
      console.log("Check account: ", res)
      if (res.data) {
        setUser(res.data.user);
        setIsAuthenticated(true)
      }
      setIsAppLoading(false);
    }
    fetchAccount()
  }, [])
  return (
    <>{isAppLoading == false ?
      <div>
        <AppHeader />
        <Outlet />
      </div>
      :
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)"
      }}>
        <SyncLoader
          size={30}
          color="#7FFFD4" />
      </div >
    }
    </>
  )
}

export default Layout
