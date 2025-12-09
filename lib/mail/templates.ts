interface BookingConfirmationData {
  attendeeName: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  ticketCode: string;
}

export const getBookingConfirmationEmail = (data: BookingConfirmationData) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #59DECA; font-size: 28px; margin: 0;">DevEvent</h1>
      <p style="color: #71717a; margin-top: 8px;">Booking Confirmation</p>
    </div>

    <!-- Main Content -->
    <div style="background-color: #18181b; border-radius: 12px; padding: 32px; border: 1px solid #27272a;">
      <!-- Success Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 64px; height: 64px; background-color: rgba(89, 222, 202, 0.1); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
          <span style="font-size: 32px;">✓</span>
        </div>
      </div>

      <h2 style="color: #ffffff; text-align: center; font-size: 24px; margin: 0 0 8px 0;">
        You're In, ${data.attendeeName}!
      </h2>
      <p style="color: #71717a; text-align: center; margin: 0 0 32px 0;">
        Your spot has been confirmed for the event below.
      </p>

      <!-- Event Details Card -->
      <div style="background-color: #27272a; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h3 style="color: #59DECA; font-size: 18px; margin: 0 0 16px 0;">
          ${data.eventName}
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #71717a; font-size: 14px;">📅 Date</td>
            <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">${
              data.eventDate
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #71717a; font-size: 14px;">🕐 Time</td>
            <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">${
              data.eventTime
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #71717a; font-size: 14px;">📍 Location</td>
            <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">${
              data.eventLocation
            }</td>
          </tr>
        </table>
      </div>

      <!-- Ticket Code -->
      <div style="background-color: #0a0a0a; border: 2px dashed #59DECA; border-radius: 8px; padding: 20px; text-align: center;">
        <p style="color: #71717a; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">
          Your Ticket Code
        </p>
        <p style="color: #59DECA; font-size: 28px; font-family: monospace; font-weight: bold; margin: 0; letter-spacing: 2px;">
          ${data.ticketCode}
        </p>
        <p style="color: #71717a; font-size: 12px; margin: 12px 0 0 0;">
          Present this code at the event check-in
        </p>
      </div>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin-top: 32px;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/settings" 
         style="display: inline-block; background-color: #59DECA; color: #0a0a0a; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
        View Your Tickets
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #27272a;">
      <p style="color: #71717a; font-size: 12px; margin: 0 0 8px 0;">
        Need to cancel? You can do so from your account settings.
      </p>
      <p style="color: #52525b; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} DevEvent. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;
};

export const getCancellationEmail = (data: {
  attendeeName: string;
  eventName: string;
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Cancelled</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #59DECA; font-size: 28px; margin: 0;">DevEvent</h1>
    </div>

    <!-- Main Content -->
    <div style="background-color: #18181b; border-radius: 12px; padding: 32px; border: 1px solid #27272a;">
      <h2 style="color: #ffffff; text-align: center; font-size: 24px; margin: 0 0 16px 0;">
        Booking Cancelled
      </h2>
      <p style="color: #71717a; text-align: center; margin: 0 0 24px 0;">
        Hi ${
          data.attendeeName
        }, your booking for <strong style="color: #ffffff;">${
    data.eventName
  }</strong> has been cancelled.
      </p>
      <p style="color: #71717a; text-align: center; margin: 0;">
        We're sorry to see you go! Feel free to browse other events on our platform.
      </p>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin-top: 32px;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}" 
         style="display: inline-block; background-color: #59DECA; color: #0a0a0a; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
        Browse Events
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #27272a;">
      <p style="color: #52525b; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} DevEvent. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;
};
