import { FC } from "react";
import { Outlet } from "react-router-dom";

const Layout: FC = () => {
    return (
        <>
            <h1>navbar</h1>
            <Outlet />
        </>
    );
};

export default Layout;

