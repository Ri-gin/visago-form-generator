import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { title, fields } = req.body;

  if (!title || !fields || !Array.isArray(fields)) {
    return res.status(400).json({ success: false, error: 'Missing or invalid title/fields' });
  }

  const payload = {
    title,
    fields,
    settings: {
      is_public: true, // 👈 гарантирует публикацию
    },
    thankyou_screens: [
      {
        title: "Thanks! We received your form.",
        properties: {
          show_button: false,
        },
      },
    ],
  };

  try {
    const tfRes = await fetch('https://api.typeform.com/forms', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TYPEFORM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await tfRes.json();

    if (tfRes.ok && data.id) {
      return res.status(200).json({
        success: true,
        link: `https://form.typeform.com/to/${data.id}`,
      });
    } else {
      console.error('❌ Typeform API error:', data);
      return res.status(500).json({
        success: false,
        error: data,
      });
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return res.status(500).json({
      success: false,
      error: 'Unexpected server error',
    });
  }
}
