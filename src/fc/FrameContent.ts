import { FrameButton } from "./FrameButton"

export type FrameContent = {
    frameTitle: string,
    frameVersion: "vNext",
    frameImageUrl: string,
    framePostUrl: string,
    frameButtons: FrameButton[],
    input?: boolean
}