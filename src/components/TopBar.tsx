import { ReactNode } from "react";

type TopBarProps = {
    children?: ReactNode;
    height?: number | string
};
export default function TopBar(props: TopBarProps) {
    const {children, height} = props
    return (
        <div
            id="top-bar"
            style={{
                padding: 0,
                margin: 0,
                width: "100%",
                display: "flex",
                height: height ?? "auto",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
            }}
        >{children}</div>
    );
}
