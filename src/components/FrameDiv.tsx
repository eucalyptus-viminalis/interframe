import { ReactNode } from "react";

type FrameDivProps = {
    children: ReactNode | ReactNode[]
    justifyContent?: string
    alignItems?: string
    letterSpacing?: string
    fontFamily?: string
    fontSize?: number| string
}
export function FrameDiv(props: FrameDivProps) {
    const {children,alignItems, justifyContent,fontSize, letterSpacing, fontFamily} = props
    return (
        <div
            id="frame"
            style={{
                display: "flex",
                width: "100%",
                height: "100%",
                color: "white",
                justifyContent: justifyContent ?? "space-between",
                alignItems: alignItems ?? "center",
                letterSpacing: letterSpacing ?? "-.02em",
                fontFamily: fontFamily ?? "mono",
                fontSize: fontSize ?? 50,
                background:
                    "linear-gradient(to bottom right, #343E90, #210446)",
                flexDirection: "column",
            }}
        >
            {children}
        </div>
    );
}
