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

  const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [
            {
              email: "info@twgmontessori.ca",
              name: "Together We Grow Montessori School"
            }
          ]
        }
      ],
      from: {
        email: "noreply@twgmontessori.ca",
        name: "Together We Grow Website"
      },
      reply_to: {
        email,
        name: parentName
      },
      subject: `New Tour Inquiry - ${parentName}`,
      content: [
        {
          type: "text/plain",
          value: message
        }
      ]
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
