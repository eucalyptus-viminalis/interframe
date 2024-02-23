import { ReactNode } from "react";

export type Theme = {
  hexColors: string;
  mode: "light" | "dark";
};

type FrameDivProps = {
  children?: ReactNode;
  justifyContent?: string;
  alignItems?: string;
  letterSpacing?: string;
  fontFamily?: string;
  fontSize?: number | string;
  theme?: Theme;
};
export function FrameDiv(props: FrameDivProps) {
  const {
    alignItems,
    fontFamily,
    fontSize,
    justifyContent,
    letterSpacing,
    theme,
    children,
  } = props;
  const bg = theme
    ? `linear-gradient(to bottom right, ${theme.hexColors})`
    : "linear-gradient(to bottom right, #343E90, #210446)";
  const color = theme ? (theme.mode == "dark" ? "white" : "black") : "white";
  return (
    <div
      id="frame"
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        color: color,
        justifyContent: justifyContent ?? "space-between",
        alignItems: alignItems ?? "center",
        letterSpacing: letterSpacing ?? "-.02em",
        fontFamily: fontFamily ?? "mono",
        fontSize: fontSize ?? 50,
        background: bg,
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
}
