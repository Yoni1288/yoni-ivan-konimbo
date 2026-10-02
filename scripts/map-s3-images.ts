import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { isDeepStrictEqual } from "node:util"
import { z } from "zod"

// Run only through the /map-s3-images command: the one sanctioned change to mock-data/, limited to `thumbnail` and `images`.

const PRODUCTS_FILE: string = path.join(process.cwd(), "mock-data", "products.json")
const IMAGES_DIR: string = path.join(process.cwd(), "public", "s3-images")
const PUBLIC_URL_PREFIX: string = "/s3-images"
const THUMBNAIL_FILE: string = "thumbnail.webp"
const GALLERY_FILE_PATTERN: RegExp = /^image_(\d+)\.(webp|jpe?g|png)$/

const mockProductsSchema = z.array(
  z.looseObject({
    id: z.string(),
    thumbnail: z.string(),
    images: z.array(z.object({ url: z.string() })),
  })
)

type MockProduct = z.infer<typeof mockProductsSchema>[number]

type ImageMapping = {
  productId: string
  thumbnail: string | null
  imageUrls: string[]
}

const toPublicUrl = (productId: string, fileName: string): string => `${PUBLIC_URL_PREFIX}/${productId}/${fileName}`

const getGalleryNumber = (fileName: string): number => Number(GALLERY_FILE_PATTERN.exec(fileName)?.[1])

const readImageMapping = (productId: string): ImageMapping | null => {
  const productDir: string = path.join(IMAGES_DIR, productId)

  if (!existsSync(productDir)) {
    return null
  }

  const fileNames: string[] = readdirSync(productDir)
  const galleryFiles: string[] = fileNames.filter((fileName) => GALLERY_FILE_PATTERN.test(fileName)).sort((a, b) => getGalleryNumber(a) - getGalleryNumber(b))

  return {
    productId,
    thumbnail: fileNames.includes(THUMBNAIL_FILE) ? toPublicUrl(productId, THUMBNAIL_FILE) : null,
    imageUrls: galleryFiles.map((fileName) => toPublicUrl(productId, fileName)),
  }
}

const formatImagesBlock = (imageUrls: string[]): string => {
  const lines: string[] = imageUrls.map((url) => `      { "url": ${JSON.stringify(url)} }`)
  return `"images": [\n${lines.join(",\n")}\n    ]`
}

// Edits the text of one product block so the file's hand formatting, and so the git diff, stays limited to these two fields.
const applyMappingToText = (text: string, mapping: ImageMapping): string => {
  const { productId, thumbnail, imageUrls } = mapping
  const blockStart: number = text.indexOf(`    "id": ${JSON.stringify(productId)},`)
  const blockEnd: number = text.indexOf("\n  }", blockStart)

  if (blockStart === -1 || blockEnd === -1) {
    throw new Error(`Couldn't find the block for ${productId} in products.json`)
  }

  let block: string = text.slice(blockStart, blockEnd)

  if (thumbnail) {
    block = block.replace(/"thumbnail": "[^"]*"/, `"thumbnail": ${JSON.stringify(thumbnail)}`)
  }

  if (imageUrls.length) {
    block = block.replace(/"images": \[[^\]]*\]/, formatImagesBlock(imageUrls))
  }

  return text.slice(0, blockStart) + block + text.slice(blockEnd)
}

const withoutImageFields = (products: MockProduct[]): Record<string, unknown>[] => {
  return products.map(({ thumbnail: _thumbnail, images: _images, ...rest }) => rest)
}

const assertOnlyImageFieldsChanged = (before: MockProduct[], afterText: string): void => {
  const after: MockProduct[] = mockProductsSchema.parse(JSON.parse(afterText))

  if (!isDeepStrictEqual(withoutImageFields(before), withoutImageFields(after))) {
    throw new Error("Aborted: the edit would change fields other than thumbnail and images. products.json was not written.")
  }
}

const describeMapping = ({ productId, thumbnail, imageUrls }: ImageMapping): string => {
  return `  ${productId}: thumbnail ${thumbnail ? "mapped" : "unchanged (no thumbnail.webp)"}, ${imageUrls.length ? `${imageUrls.length} images` : "images unchanged (no image_NN files)"}`
}

const main = (): void => {
  const originalText: string = readFileSync(PRODUCTS_FILE, "utf8")
  const products: MockProduct[] = mockProductsSchema.parse(JSON.parse(originalText))
  const mappings: ImageMapping[] = products.map((product) => readImageMapping(product.id)).filter((mapping): mapping is ImageMapping => mapping !== null)
  const updatedText: string = mappings.reduce(applyMappingToText, originalText)

  assertOnlyImageFieldsChanged(products, updatedText)

  console.log(`Products with an image folder: ${mappings.length} of ${products.length}`)
  mappings.forEach((mapping) => console.log(describeMapping(mapping)))

  if (updatedText === originalText) {
    console.log("No changes: products.json already matches public/s3-images.")
    return
  }

  writeFileSync(PRODUCTS_FILE, updatedText)
  console.log("Updated mock-data/products.json.")
}

main()
