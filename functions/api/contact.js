// Cloudflare Pages Function: /api/contact
export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { name, email, service, message } = body || {};

    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Name and email are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Forward directly to devinrcopc@gmail.com with activated token
    try {
      await fetch('https://formsubmit.co/ajax/9e36bb3103cc7f2ea587de073031640e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          service: service || 'General Consultation',
          message: message || '',
          _subject: `New Consultation Request: ${name} - ${service} [DevinRC]`,
          _template: 'table',
          _captcha: 'false'
        })
      });
    } catch (e) {
      console.warn('FormSubmit forwarding note:', e.message);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Inquiry delivered to devinrcopc@gmail.com',
      destination: 'devinrcopc@gmail.com'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
