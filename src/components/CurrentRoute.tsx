type CurrentRouteProps = {
    pathname: string
}
export function CurrentRoute(props: CurrentRouteProps) {
    return (
        <div
            id="current-route"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.8,
            }}
        >
            {"/" + props.pathname.split('/').pop()}
        </div>
    );
}
