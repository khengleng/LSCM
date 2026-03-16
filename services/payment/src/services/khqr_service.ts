import QRCode from 'qrcode';

export interface KHQRData {
  bakongId: string;
  merchantName: string;
  merchantCity: string;
  amount: number;
  currency: 'USD' | 'KHR';
  orderId: string;
}

/**
 * Service to generate KHQR compliant strings and QR Codes.
 * KHQR follows the EMVCo QR code specification.
 */
export class KHQRService {
  /**
   * Generates a KHQR dynamic string for top-ups.
   */
  static generateKHQRString(data: KHQRData): string {
    // Simplified EMVCo generation for Lifestyle Machine MVP
    // Payload Format Indicator (00)
    let payload = '000201';
    // Point of Initiation Method (01): 12 = Dynamic
    payload += '010212';
    
    // Merchant Account Information (29 for Bakong)
    const merchantInfo = `0010${data.bakongId}0112${data.merchantName}`;
    payload += `29${merchantInfo.length.toString().padStart(2, '0')}${merchantInfo}`;
    
    // Merchant Category Code (52)
    payload += '52040000';
    // Transaction Currency (53): 840 = USD, 116 = KHR
    const currencyCode = data.currency === 'USD' ? '840' : '116';
    payload += `5303${currencyCode}`;
    
    // Transaction Amount (54)
    const amountStr = data.amount.toFixed(2);
    payload += `54${amountStr.length.toString().padStart(2, '0')}${amountStr}`;
    
    // Country Code (58)
    payload += '5802KH';
    // Merchant Name (59)
    payload += `59${data.merchantName.length.toString().padStart(2, '0')}${data.merchantName}`;
    // Merchant City (60)
    payload += `60${data.merchantCity.length.toString().padStart(2, '0')}${data.merchantCity}`;
    
    // Additional Data Field Template (62)
    const additionalData = `01${data.orderId.length.toString().padStart(2, '0')}${data.orderId}`;
    payload += `62${additionalData.length.toString().padStart(2, '0')}${additionalData}`;

    // CRC (63) - Placeholder for MVP
    payload += '6304';
    
    return payload;
  }

  /**
   * Generates a Base64 QR code image from a KHQR string.
   */
  static async generateQRCodeBase64(khqrString: string): Promise<string> {
    try {
      return await QRCode.toDataURL(khqrString);
    } catch (err) {
      console.error('[KHQR-Service] Error generating QR code:', err);
      throw new Error('Failed to generate QR Code');
    }
  }
}
