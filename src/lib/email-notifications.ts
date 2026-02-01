/**
 * Email Notifications for Plant Evidence System
 * Uses Resend API for transactional emails
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'PlantingPlans <notifications@plantingplans.uk>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@plantingplans.uk';

/**
 * Send email when evidence is verified
 */
export async function sendEvidenceVerifiedEmail(
  userEmail: string,
  botanicalName: string,
  evidenceType: string,
  imageUrl: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: `Your ${botanicalName} evidence has been verified`,
      html: `
        <h2>Evidence Verified ✅</h2>
        <p>Great news! Your plant evidence has been verified and will help improve our rendering accuracy.</p>

        <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Plant:</strong> ${botanicalName}</p>
          <p><strong>Evidence Type:</strong> ${evidenceType}</p>
          <p><strong>Status:</strong> Verified</p>
        </div>

        <p>Your contribution will be used to refine botanical parameters and ensure our plant symbols accurately represent ${botanicalName}.</p>

        <p>Thank you for helping us build the most accurate plant rendering system!</p>

        <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">
          PlantingPlans - Professional Garden Design Software
        </p>
      `
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    // Don't throw - email failure shouldn't block the verification process
  }
}

/**
 * Send email when evidence is rejected
 */
export async function sendEvidenceRejectedEmail(
  userEmail: string,
  botanicalName: string,
  evidenceType: string,
  reason?: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: `Update on your ${botanicalName} evidence`,
      html: `
        <h2>Evidence Review Update</h2>
        <p>Thank you for submitting plant evidence. After review, we were unable to verify this submission.</p>

        <div style="background: #fef2f2; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Plant:</strong> ${botanicalName}</p>
          <p><strong>Evidence Type:</strong> ${evidenceType}</p>
          <p><strong>Status:</strong> Not verified</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        </div>

        <p>Common reasons for rejection:</p>
        <ul>
          <li>Photo quality insufficient for identification</li>
          <li>Species mismatch (photo doesn't match botanical name)</li>
          <li>Duplicate submission</li>
        </ul>

        <p>You're welcome to submit additional evidence with clearer photos.</p>

        <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">
          PlantingPlans - Professional Garden Design Software
        </p>
      `
    });
  } catch (error) {
    console.error('Failed to send rejection email:', error);
  }
}

/**
 * Send email to admin when new evidence is submitted
 */
export async function sendNewEvidenceNotification(
  botanicalName: string,
  evidenceType: string,
  imageUrl: string,
  uploaderEmail: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New plant evidence: ${botanicalName}`,
      html: `
        <h2>New Evidence Submitted</h2>
        <p>A user has submitted new plant evidence for review.</p>

        <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Plant:</strong> ${botanicalName}</p>
          <p><strong>Evidence Type:</strong> ${evidenceType}</p>
          <p><strong>Uploaded by:</strong> ${uploaderEmail}</p>
        </div>

        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/plant-review" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">Review Now</a></p>

        <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">
          PlantingPlans Admin Notifications
        </p>
      `
    });
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
}

/**
 * Send email when preset suggestion is approved
 */
export async function sendSuggestionApprovedEmail(
  botanicalName: string,
  suggestionType: string,
  currentValue: string,
  suggestedValue: string,
  confidence: number
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Preset updated: ${botanicalName}`,
      html: `
        <h2>Preset Suggestion Approved</h2>
        <p>A suggestion has been approved and applied to the presets.</p>

        <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Plant:</strong> ${botanicalName}</p>
          <p><strong>Change Type:</strong> ${suggestionType.replace('_', ' ')}</p>
          <p><strong>Confidence:</strong> ${(confidence * 100).toFixed(0)}%</p>
          <p><strong>Previous:</strong> ${currentValue}</p>
          <p><strong>Updated:</strong> ${suggestedValue}</p>
        </div>

        <p>The preset file has been updated. Symbol generation will now use the new parameters.</p>

        <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">
          PlantingPlans Admin Notifications
        </p>
      `
    });
  } catch (error) {
    console.error('Failed to send approval email:', error);
  }
}
