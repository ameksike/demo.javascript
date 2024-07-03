const routes = [
    { route: "/", label: "Home" },
    { route: "/about", label: "About" },
    { route: "/user", label: "User" },
    { route: "/componets", label: "componets" },
]
export default routes;

export const routeList: Set<string> = new Set(routes.map(item => item.route));