import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

export interface TicketData {
  eventId: string;
  eventName: string;
  ticketCode: string;
  attendeeEmail: string;
  attendeeName: string;
  date: string;
  location: string;
}

export const generateTicketCode = () => {
  // Generate a shorter, reader-friendly ticket code (e.g., DE-XXXX-XXXX)
  const suffix = uuidv4().split("-")[0].toUpperCase();
  return `DE-${suffix}`;
};

export const generateQRCode = async (text: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error("QR Code generation failed", err);
    return "";
  }
};
