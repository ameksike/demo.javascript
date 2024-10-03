const Layout = ({
    children
}: { children: React.ReactNode }) => {
    return (
        <div className="h-full">
            <div className="bg-rose-500 ">
                NavBar
            </div>
            <hr />
            {children}
        </div>
    );
}

export default Layout;