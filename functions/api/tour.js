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

We have successfully received your inquiry.

Our admissions team will review your information and contact you within 1–2 business days.

If you have any questions in the meantime, please feel free to reply to this email.

Warm regards,
Together We Grow Montessori School

Unit 200 – 604 West Broadway
Vancouver, BC V5Z 1G1

604-657-8289
info@twgmontessori.ca
www.twgmontessori.ca`;

  const parentHtml = `
<div style="margin:0;padding:0;background:#fff7ef;font-family:Georgia,'Times New Roman',serif;color:#1f2f33;">
  <div style="max-width:680px;margin:0 auto;padding:24px 12px;">
    <div style="background:#fffaf5;border-radius:24px;overflow:hidden;border:1px solid #f1dacb;">
      
      <div style="text-align:center;background:#fff7ef;padding:28px 24px 22px;">
        <img src="https://www.twgmontessori.ca/assets/logo_full.jpg"
             alt="Together We Grow Montessori School"
             style="max-width:520px;width:100%;height:auto;display:block;margin:0 auto;">
      </div>

      <div style="background:#ffffff;border-radius:22px;margin:0 18px 18px;padding:34px 38px;">
        <p style="font-size:20px;margin:0 0 24px;">Dear ${parentName},</p>

        <p style="font-size:17px;line-height:1.7;margin:0 0 20px;">
          Thank you for your interest in <strong>Together We Grow Montessori School</strong>.
        </p>

        <p style="font-size:17px;line-height:1.7;margin:0 0 20px;">
          We have successfully received your inquiry.
        </p>

        <p style="font-size:17px;line-height:1.7;margin:0 0 28px;">
          Our admissions team will review your information and contact you within
          <strong>1–2 business days</strong>.
        </p>

        <div style="background:#fff7ef;border-radius:16px;padding:22px 24px;margin:26px 0;">
          <div style="padding:12px 0;border-bottom:1px solid #efd7c5;">
            <strong>Inquiry received</strong><br>
            <span style="font-size:15px;color:#4b4b4b;">Thank you for reaching out to our school.</span>
          </div>

          <div style="padding:12px 0;border-bottom:1px solid #efd7c5;">
            <strong>Our admissions team is reviewing your inquiry</strong><br>
            <span style="font-size:15px;color:#4b4b4b;">We will carefully review your information.</span>
          </div>

          <div style="padding:12px 0;">
            <strong>We will contact you shortly</strong><br>
            <span style="font-size:15px;color:#4b4b4b;">We look forward to connecting with you.</span>
          </div>
        </div>

        <p style="font-size:16px;line-height:1.7;margin:28px 0 22px;">
          If you have any questions in the meantime, please feel free to reply to this email.
        </p>

        <p style="font-size:16px;line-height:1.7;margin:0 0 8px;">
          Warm regards,
        </p>

        <p style="font-size:20px;color:#c9954a;margin:0 0 30px;">
          Together We Grow Montessori School
        </p>

        <hr style="border:none;border-top:1px solid #efd7c5;margin:26px 0;">

        <p style="font-size:14px;line-height:1.7;margin:0;color:#333;">
          <strong>Unit 200 – 604 West Broadway</strong><br>
          Vancouver, BC V5Z 1G1<br><br>
          604-657-8289<br>
          <a href="mailto:info@twgmontessori.ca" style="color:#1f2f33;">info@twgmontessori.ca</a><br>
          <a href="https://www.twgmontessori.ca" style="color:#1f2f33;">www.twgmontessori.ca</a>
        </p>
      </div>

      <div style="text-align:center;background:#fdeee2;padding:24px 18px;color:#5f5f5f;letter-spacing:3px;font-size:13px;">
        NURTURING INDEPENDENCE.<br>
        INSPIRING A LIFELONG LOVE OF LEARNING.
      </div>

    </div>
  </div>
</div>
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
