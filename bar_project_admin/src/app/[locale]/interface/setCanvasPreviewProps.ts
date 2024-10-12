import { PixelCrop } from "react-image-crop"

export interface setCanvasPreviewProps {
    image: React.FC<HTMLImageElement> // HTMLImageElement
    canvas: React.FC<HTMLCanvasElement> // HTMLCanvasElement
    crop: PixelCrop
}