export async function onRequestPost(context) {
  const formData = await context.request.formData();
  const get = (name) => String(formData.get(name) || "").trim();

  const parentName = get("Parent Name");
  const email = get("Email").toLowerCase();
  const phone = get("Phone");
  const childName = get("Child Name");
  const childDob = get("Child DOB");
  const desiredStart = get("Desired Start Date");
  const interest = get("Interest");
  const questions = get("Questions");

  if (!parentName || !email) {
    return new Response(JSON.stringify({
      ok: false,
      message: "Missing required fields."
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const commonTypos = ["qq.cpm", "gamil.com", "hotmial.com", "hotmai.com"];

  if (!emailPattern.test(email) || commonTypos.some((typo) => email.includes(typo))) {
    return new Response(JSON.stringify({
      ok: false,
      message: "Please check your email address and try again."
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const adminText = `
New website inquiry

Parent Name: ${parentName}
Email: ${email}
Phone: ${phone}

Child Name: ${childName}
DOB: ${childDob}
Desired Start: ${desiredStart}
Interest: ${interest}

Questions:
${questions}
`;

  const parentText = `Dear ${parentName},

Thank you for your interest in Together We Grow Montessori School.

We are delighted to hear from your family. Your inquiry has been successfully received.

Our admissions team will carefully review your information and contact you within 1–2 business days.

If you have any questions in the meantime, please feel free to reply to this email.

Warm regards,
Together We Grow Montessori School

Unit 200 – 604 West Broadway
Vancouver, BC V5Z 1G1

604-657-8289
info@twgmontessori.ca
www.twgmontessori.ca

Nurturing independence. Inspiring a lifelong love of learning.`;

  const parentHtml = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0;padding:0;background:#fff7ef;">
  <tr>
    <td align="center" style="padding:16px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#fffaf5;border:1px solid #f2d9c7;border-radius:20px;overflow:hidden;">
        
        <tr>
          <td align="center" style="padding:0;background:#fff7ef;">
            <img
              src="https://www.twgmontessori.ca/assets/email_header.png"
              alt="Together We Grow Montessori School"
              width="640"
              style="display:block;width:100%;max-width:640px;height:auto;border:0;"
            >
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:28px 24px 24px;font-family:Arial,Helvetica,sans-serif;color:#1f2f33;">
            <p style="font-size:22px;line-height:1.4;margin:0 0 20px;">Dear ${parentName},</p>

            <p style="font-size:17px;line-height:1.7;margin:0 0 18px;">
              Thank you for your interest in <strong>Together We Grow Montessori School</strong>.
            </p>

            <p style="font-size:17px;line-height:1.7;margin:0 0 18px;">
              We are delighted to hear from your family. Your inquiry has been successfully received.
            </p>

            <p style="font-size:17px;line-height:1.7;margin:0 0 22px;">
              Our admissions team will carefully review your information and contact you within
              <strong>1–2 business days</strong>.
            </p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ef;border:1px solid #f1dacb;border-radius:16px;margin:22px 0;">
              <tr>
                <td style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;">
                  <p style="font-size:18px;font-weight:bold;margin:0 0 12px;color:#1f2f33;">What happens next?</p>
                  <p style="font-size:15px;line-height:1.7;margin:0 0 8px;">• We have received your inquiry.</p>
                  <p style="font-size:15px;line-height:1.7;margin:0 0 8px;">• Our admissions team will carefully review your information.</p>
                  <p style="font-size:15px;line-height:1.7;margin:0;">• We will contact you within <strong>1–2 business days</strong>.</p>
                </td>
              </tr>
            </table>

            <p style="font-size:16px;line-height:1.7;margin:22px 0;">
              If you have any questions in the meantime, please feel free to reply to this email.
            </p>

            <p style="font-size:16px;line-height:1.7;margin:0 0 6px;">Warm regards,</p>
          <img
  src="https://www.twgmontessori.ca/assets/email_signature.png"
  alt="Together We Grow Montessori School"
 width="260"
style="display:block;border:0;margin:0 0 30px;"
>

            <hr style="border:none;border-top:1px solid #efd7c5;margin:22px 0;">

            <p style="font-size:14px;line-height:1.7;margin:0;color:#333;">
              <strong>Unit 200 – 604 West Broadway</strong><br>
              Vancouver, BC V5Z 1G1<br><br>
              604-657-8289<br>
              <a href="mailto:info@twgmontessori.ca" style="color:#1f2f33;">info@twgmontessori.ca</a><br>
              <a href="https://www.twgmontessori.ca" style="color:#1f2f33;">www.twgmontessori.ca</a>
            </p>
          </td>
        </tr>

        <tr>
          <td align="center" style="background:#fdeee2;padding:22px 18px;font-family:Arial,Helvetica,sans-serif;color:#5f5f5f;font-size:12px;line-height:1.8;letter-spacing:2px;">
            NURTURING INDEPENDENCE.<br>
            INSPIRING A LIFELONG LOVE OF LEARNING.
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
`;

  const adminResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${context.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Together We Grow Website <noreply@twgmontessori.ca>",
      to: ["info@twgmontessori.ca"],
      reply_to: email,
      subject: `New Tour Inquiry - ${parentName}`,
      text: adminText
    })
  });

  const parentResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${context.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Together We Grow Montessori School <noreply@twgmontessori.ca>",
      to: [email],
      reply_to: "info@twgmontessori.ca",
      subject: "Thank you for your interest in Together We Grow Montessori School",
      text: parentText,
      html: parentHtml
    })
  });

  if (!adminResponse.ok || !parentResponse.ok) {
    return new Response("Failed", { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
