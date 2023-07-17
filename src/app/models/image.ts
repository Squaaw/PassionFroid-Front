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
    constructor(
        public id: number | null,
        public name: string,
        public base64: string,
        public tags: string | null = null,
        public description: string | null = null,
        public width: number | null = null,
        public height: number | null = null,
        public similarity: number | null = null,
        public user: number = 1
      ) {}
}