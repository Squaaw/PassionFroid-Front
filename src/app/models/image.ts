// export type ImageData = {
//     id: number,
//     name: string,
//     base64: string,
//     tags?: string[],
//     description?: string
// }

// export type ImagesData = ImageData[]

export type ImagesData = ImageDataAzure[]

export class ImageDataAzure {
    constructor(public name: string, public base64: string, public tags: string | null, public description: string | null, public user: number) {}
}