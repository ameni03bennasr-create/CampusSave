import { QRCodeSVG } from 'qrcode.react'

interface QrCodeDisplayProps {
  /** Token issued by the backend after a confirmed payment (never generated on the client). */
  value: string
  size?: number
}

/** Real, scannable QR code (replaces the decorative pseudo-QR of the early prototype). */
export function QrCodeDisplay({ value, size = 188 }: QrCodeDisplayProps) {
  return <QRCodeSVG value={value} size={size} level="M" marginSize={0} bgColor="#FFFFFF" fgColor="#1c1917" role="img" aria-label="QR Code de retrait" />
}
