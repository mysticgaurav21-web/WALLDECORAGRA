export const DEFAULT_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";

export function createWhatsAppUrl(message: string, number = DEFAULT_WHATSAPP_NUMBER) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
