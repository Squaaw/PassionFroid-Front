export type ImageData = {
    id: number,
    name: string,
    base64: string,
    tags?: string[],
    description?: string
}

export type ImagesData = ImageData[]