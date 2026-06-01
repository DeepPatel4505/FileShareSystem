import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Layout = () => {
    return (
        <div className="layout">
            <div className="layout__inner">
                <Sidebar />

                <main className="layout__content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
