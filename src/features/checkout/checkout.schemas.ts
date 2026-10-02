import { isValidPhoneNumber } from "libphonenumber-js"
import { z } from "zod"
import { COUNTRY_CODES } from "./checkout.constants"

const requiredText = (message: string, maxLength: number): z.ZodString => z.string().trim().min(1, message).max(maxLength, `Use at most ${maxLength} characters`)

const checkoutFieldsSchema = z.object({
  email: z.string().trim().pipe(z.email("Enter a valid email address")),
  firstName: requiredText("Enter your first name", 50),
  lastName: requiredText("Enter your last name", 50),
  address1: requiredText("Enter your street address", 100),
  address2: z.string().trim().max(100, "Use at most 100 characters"),
  city: requiredText("Enter your city", 50),
  postalCode: requiredText("Enter your postal code", 12).regex(/^[A-Za-z0-9 -]+$/, "Use letters, numbers, spaces or dashes"),
  country: z.enum(COUNTRY_CODES, "Choose a country"),
  // Optional: an empty string means no phone.
  phone: z.string().trim().max(20, "Enter a valid phone number"),
})

type CheckoutFields = z.infer<typeof checkoutFieldsSchema>

// The phone is checked against the chosen country, so a local number like 050-1234567 is valid for Israel.
const validatePhoneForCountry = ({ phone, country }: CheckoutFields, context: z.RefinementCtx): void => {
  if (!phone || isValidPhoneNumber(phone, country)) return
  context.addIssue({ code: "custom", path: ["phone"], message: "Enter a valid phone number" })
}

export const checkoutFormSchema = checkoutFieldsSchema.superRefine(validatePhoneForCountry)

export const checkoutItemSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().positive(),
})

export const checkoutRequestSchema = checkoutFieldsSchema.extend({ items: z.array(checkoutItemSchema).min(1, "Your cart is empty") }).superRefine(validatePhoneForCountry)

export const checkoutResponseSchema = z.object({
  orderNumber: z.string().min(1),
})

// Matches generateOrderNumber in services/place-order.ts.
export const orderNumberSchema = z.string().regex(/^GS-[0-9A-F]{6}$/)

export const orderNumberParamsSchema = z.object({
  orderNumber: orderNumberSchema,
})

export const orderConfirmationSchema = z.object({
  orderNumber: z.string(),
  firstName: z.string(),
  email: z.string().nullable(),
  shippingAddressLines: z.array(z.string()),
  items: z.array(z.object({ title: z.string(), variantTitle: z.string(), quantity: z.number().int().positive() })),
  totalPaid: z.number().int().nonnegative(),
  currencyCode: z.string(),
})
