// workers-send-email.js

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ message: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { name, phone, message } = await request.json();

    if (!name || !phone || !message) {
      return new Response(JSON.stringify({ success: false, error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const mailgunApiKey = MAILGUN_API_KEY; // add as Cloudflare environment variable
      const mailgunDomain = MAILGUN_DOMAIN; // add as Cloudflare environment variable
      const toEmail = EMAIL_TO; // add as Cloudflare environment variable

      const formData = new URLSearchParams();
      formData.append("from", `GlowGym <mailgun@${mailgunDomain}>`);
      formData.append("to", toEmail);
      formData.append("subject", `New message from ${name}`);
      formData.append("text", `Name: ${name}\nPhone: ${phone}\nMessage:\n${message}`);

      const response = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`api:${mailgunApiKey}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return new Response(JSON.stringify({ success: false, error: errorText }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true, message: "Email sent successfully" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
