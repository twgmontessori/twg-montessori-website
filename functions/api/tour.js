export async function onRequestPost(context) {
  const formData = await context.request.formData();

  const get = (name) => String(formData.get(name) || "").trim();

  const parentName = get("Parent Name");
  const email = get("Email");
  const phone = get("Phone");
  const childName = get("Child Name");
  const childDob = get("Child DOB");
  const desiredStart = get("Desired Start Date");
  const interest = get("Interest");
  const questions = get("Questions");

  if (!parentName || !email) {
    return new Response(
      JSON.stringify({
        ok: false,
        message: "Missing required fields."
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  const message = `
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

const response = await fetch("https://api.resend.com/emails", {
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
    text: message
  })
});
  if (!response.ok) {
    return new Response("Failed", { status: 500 });
  }

  return new Response(
    JSON.stringify({
      ok: true
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
