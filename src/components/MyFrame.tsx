import { ReactNode } from "react";

type MyFrameProps = {
    children: ReactNode
}
export function MyFrame(props: MyFrameProps) {
    return (
        <div
            id="frame"
            style={{
                display: "flex",
                width: "100%",
                height: "100%",
                color: "white",
                alignItems: "center",
                letterSpacing: "-.02em",
                fontFamily: "robotoMono",
                fontSize: 50,
                background:
                    "linear-gradient(to bottom right, #343E90, #210446)",
                flexDirection: "column",
                justifyContent: "space-between",
                // textAlign: "center",
            }}
        >
            {props.children}
        </div>
    );
}
