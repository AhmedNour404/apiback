// pages/api/sendEmail.js
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(SENDGRID_API_KEY);

async function handleRequest(request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { name, phone, message } = await request.json();

  if (!name || !phone || !message) {
    return new Response(JSON.stringify({ success: false, error: "Missing fields" }), { status: 400 });
  }

  try {
    await sendgrid.send({
      to: "your-email@gmail.com",
      from: "your-email@gmail.com", 
      subject: `New message from ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nMessage:\n${message}`,
    });

    return new Response(JSON.stringify({ success: true, message: "Email sent successfully" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}

  }
}
