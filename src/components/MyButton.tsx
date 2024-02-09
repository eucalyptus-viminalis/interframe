type MyButtonProps = {
    id: string
    text?: string
    imgSrc?: string
    disabled?: boolean
};
export function MyButton(props: MyButtonProps) {
    const { id, imgSrc, text, disabled } = props;
    const bg = "linear-gradient(to bottom, rgba(68, 57, 192, 1), rgba(9, 6, 44, 0))"
    const bgDisabled = "linear-gradient(to bottom, rgba(31, 31, 34, 1), rgba(86, 85, 94, 1))"
    const borderColor = "rgba(116, 114, 196, 0.15)"
    const borderColorDisabled = "rgba(13, 13, 14, 0.35)"
    const colorDisabled = "rgba(255, 255, 255, 0.18)"
    return (
        <div
            id={id}
            tw="p-2 m-0"
            style={{
                display: "flex",
                background: disabled ? bgDisabled : bg,
                boxShadow: "0px 5px 18px 10px rgb(0,0,0.25)",
                height: "80px",
                width: "270px",
                fontSize: 48,
                border: "solid 3px",
                borderColor: disabled ? borderColorDisabled : borderColor,
                color: disabled ? colorDisabled : "",
                borderRadius: "38px",
                fontFamily: "robotoMonoBold",
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {text ? text : null}
            {imgSrc ? (
                <img
                    id="base-logo"
                    alt="Base Logo"
                    height="64"
                    width="64"
                    src={`"${imgSrc}"`}
                    style={{
                        opacity: 1,
                        borderRadius: "100%",
                        objectFit: "cover", // Crop the image to cover the specified dimensions
                        objectPosition: "center", // Center the cropped area within the image container
                    }}
                />
            ) : null}
        </div>
    );
}
