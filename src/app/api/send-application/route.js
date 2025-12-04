// app/api/send-application/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const formData = await request.json();

    // Create email content
    const emailContent = `
      New Work With Us Application Submission
      ========================================
      
      Personal Information:
      ---------------------
      Name: ${formData.firstName} ${formData.lastName}
      Phone: ${formData.phone}
      Email: ${formData.email}
      
      Social Media Handles:
      ---------------------
      Instagram: ${formData.instagram || "Not provided"}
      Twitter/X: ${formData.twitter || "Not provided"}
      TikTok: ${formData.tiktok || "Not provided"}
      YouTube: ${formData.youtube || "Not provided"}
      
      Audience Type:
      --------------
      ${formData.audienceType}
      
      Additional Information:
      -----------------------
      ${formData.additionalInfo}
      
      ========================================
      Submitted on: ${new Date().toLocaleString()}
    `;

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Izinto Application Form" <${process.env.SMTP_USER}>`,
      to: "jacobdinoko@gmail.com",
      subject: `New Application: ${formData.firstName} ${formData.lastName}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #0096FF;">New Work With Us Application</h2>
          
          <h3>Personal Information</h3>
          <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
          <p><strong>Phone:</strong> ${formData.phone}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          
          <h3>Social Media Handles</h3>
          <p><strong>Instagram:</strong> ${formData.instagram || "Not provided"}</p>
          <p><strong>Twitter/X:</strong> ${formData.twitter || "Not provided"}</p>
          <p><strong>TikTok:</strong> ${formData.tiktok || "Not provided"}</p>
          <p><strong>YouTube:</strong> ${formData.youtube || "Not provided"}</p>
          
          <h3>Audience Type</h3>
          <p>${formData.audienceType}</p>
          
          <h3>Additional Information</h3>
          <p>${formData.additionalInfo.replace(/\n/g, "<br>")}</p>
          
          <hr>
          <p style="color: #666; font-size: 12px;">
            Submitted on: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send application" },
      { status: 500 },
    );
  }
}
