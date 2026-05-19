import nodemailer from "nodemailer";

// Lazy-init: env vars aren't available at import time in ES modules
let _transporter = null;
function getTransporter() {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return _transporter;
}

export const sendMail = async (to, subject, text, html) => {
  try {
    const info = await getTransporter().sendMail({
      from: `"SupportDesk AI" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: html || text,
    });

    console.log("📧 Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Mail error:", error.message);
    // Don't throw - email failures should not break the flow
  }
};

// ─── Styled Email Templates ───

export const sendTicketCreatedToUser = async (userEmail, ticket) => {
  const subject = `✅ Ticket Received: ${ticket.title}`;
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px 32px;">
        <h1 style="color: #fff; margin: 0; font-size: 22px;">🎫 Ticket Created Successfully</h1>
      </div>
      <div style="padding: 24px 32px; background: #fafafa;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi there,</p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Your ticket has been received and is being processed by our AI system. A moderator will be assigned shortly.</p>
        <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
          <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">TICKET TITLE</p>
          <p style="margin: 4px 0 12px; color: #111827; font-size: 16px; font-weight: 600;">${ticket.title}</p>
          <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">DESCRIPTION</p>
          <p style="margin: 4px 0; color: #374151; font-size: 14px; white-space: pre-wrap;">${ticket.description?.substring(0, 300)}${ticket.description?.length > 300 ? '...' : ''}</p>
        </div>
        <p style="color: #6b7280; font-size: 14px;">We'll notify you once a moderator has been assigned and when your ticket is resolved.</p>
      </div>
      <div style="background: #f3f4f6; padding: 16px 32px; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">SupportDesk AI • Automated Notification</p>
      </div>
    </div>
  `;
  return sendMail(userEmail, subject, `Your ticket "${ticket.title}" has been received.`, html);
};

export const sendTicketAssignedToModerator = async (moderatorEmail, ticket) => {
  const subject = `📋 New Ticket Assigned: ${ticket.title}`;
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 24px 32px;">
        <h1 style="color: #fff; margin: 0; font-size: 22px;">🔔 New Ticket Assigned to You</h1>
      </div>
      <div style="padding: 24px 32px; background: #fafafa;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">A new ticket has been assigned to you based on your skills. Please review and resolve it at your earliest convenience.</p>
        <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
          <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">TICKET TITLE</p>
          <p style="margin: 4px 0 12px; color: #111827; font-size: 16px; font-weight: 600;">${ticket.title}</p>
          <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">PRIORITY</p>
          <p style="margin: 4px 0 12px; color: #111827; font-size: 14px; font-weight: 600; text-transform: uppercase;">${ticket.priority || 'medium'}</p>
          <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">DESCRIPTION</p>
          <p style="margin: 4px 0; color: #374151; font-size: 14px; white-space: pre-wrap;">${ticket.description?.substring(0, 300)}${ticket.description?.length > 300 ? '...' : ''}</p>
          ${ticket.relatedSkills?.length > 0 ? `
            <p style="margin: 12px 0 4px; color: #6b7280; font-size: 13px;">REQUIRED SKILLS</p>
            <p style="margin: 4px 0; color: #374151; font-size: 14px;">${ticket.relatedSkills.join(', ')}</p>
          ` : ''}
        </div>
        ${ticket.helpfulNotes ? `
          <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 16px 20px; margin: 16px 0;">
            <p style="margin: 0 0 8px; color: #4338ca; font-size: 13px; font-weight: 600;">✨ AI NOTES</p>
            <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.5;">${ticket.helpfulNotes}</p>
          </div>
        ` : ''}
        <p style="color: #6b7280; font-size: 14px;">Log in to the dashboard to view and resolve this ticket.</p>
      </div>
      <div style="background: #f3f4f6; padding: 16px 32px; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">SupportDesk AI • Automated Notification</p>
      </div>
    </div>
  `;
  return sendMail(moderatorEmail, subject, `A new ticket "${ticket.title}" has been assigned to you.`, html);
};

export const sendTicketAssignedToUser = async (userEmail, ticket, moderatorEmail) => {
  const subject = `👤 Moderator Assigned to Your Ticket: ${ticket.title}`;
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px 32px;">
        <h1 style="color: #fff; margin: 0; font-size: 22px;">👤 Moderator Assigned</h1>
      </div>
      <div style="padding: 24px 32px; background: #fafafa;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Great news! A moderator has been assigned to your ticket and will begin working on it.</p>
        <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
          <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">TICKET</p>
          <p style="margin: 4px 0 12px; color: #111827; font-size: 16px; font-weight: 600;">${ticket.title}</p>
          <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">ASSIGNED TO</p>
          <p style="margin: 4px 0; color: #111827; font-size: 14px; font-weight: 600;">${moderatorEmail}</p>
        </div>
        <p style="color: #6b7280; font-size: 14px;">You'll receive another email once this ticket has been resolved.</p>
      </div>
      <div style="background: #f3f4f6; padding: 16px 32px; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">SupportDesk AI • Automated Notification</p>
      </div>
    </div>
  `;
  return sendMail(userEmail, subject, `A moderator (${moderatorEmail}) has been assigned to your ticket "${ticket.title}".`, html);
};

export const sendTicketResolvedToUser = async (userEmail, ticket) => {
  const subject = `✅ Ticket Resolved: ${ticket.title}`;
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 24px 32px;">
        <h1 style="color: #fff; margin: 0; font-size: 22px;">✅ Your Ticket Has Been Resolved</h1>
      </div>
      <div style="padding: 24px 32px; background: #fafafa;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Your ticket has been reviewed and resolved. Here are the details:</p>
        <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
          <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">TICKET</p>
          <p style="margin: 4px 0 12px; color: #111827; font-size: 16px; font-weight: 600;">${ticket.title}</p>
          <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">RESOLUTION</p>
          <p style="margin: 4px 0; color: #374151; font-size: 14px; white-space: pre-wrap;">${ticket.resolution}</p>
        </div>
        <p style="color: #6b7280; font-size: 14px;">If you're not satisfied with the resolution, you can create a new ticket referencing this one.</p>
      </div>
      <div style="background: #f3f4f6; padding: 16px 32px; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">SupportDesk AI • Automated Notification</p>
      </div>
    </div>
  `;
  return sendMail(userEmail, subject, `Your ticket "${ticket.title}" has been resolved. Resolution: ${ticket.resolution}`, html);
};

export const sendTicketResolvedToModerator = async (moderatorEmail, ticket) => {
  const subject = `📌 Ticket Closed: ${ticket.title}`;
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 24px 32px;">
        <h1 style="color: #fff; margin: 0; font-size: 22px;">📌 Ticket Marked as Resolved</h1>
      </div>
      <div style="padding: 24px 32px; background: #fafafa;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">The following ticket has been successfully resolved and closed.</p>
        <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
          <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">TICKET</p>
          <p style="margin: 4px 0 12px; color: #111827; font-size: 16px; font-weight: 600;">${ticket.title}</p>
          <p style="margin: 4px 0; color: #6b7280; font-size: 13px;">YOUR RESOLUTION</p>
          <p style="margin: 4px 0; color: #374151; font-size: 14px; white-space: pre-wrap;">${ticket.resolution}</p>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Thank you for resolving this ticket. The user has been notified.</p>
      </div>
      <div style="background: #f3f4f6; padding: 16px 32px; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">SupportDesk AI • Automated Notification</p>
      </div>
    </div>
  `;
  return sendMail(moderatorEmail, subject, `Ticket "${ticket.title}" has been resolved.`, html);
};
