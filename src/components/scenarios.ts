// components/scenarios.ts
export const SCENARIOS = {
    germany: {
      tourist: {
        title: 'Germany Tourist Visa',
        fields: [
          { type: 'short_text', title: 'Full Name' },
          { type: 'email', title: 'Email Address' },
        ],
      },
      work: {
        title: 'Germany Work Visa',
        fields: [
          { type: 'short_text', title: 'Full Name' },
          { type: 'email', title: 'Email Address' },
          { type: 'short_text', title: 'Company Name in Germany' },
        ],
      },
      student: {
        title: 'Germany Student Visa',
        fields: [
          { type: 'short_text', title: 'Full Name' },
          { type: 'email', title: 'Email Address' },
          { type: 'short_text', title: 'University Name in Germany' },
        ],
      },
    },
    usa: {
      tourist: {
        title: 'USA Tourist Visa',
        fields: [
          { type: 'short_text', title: 'Full Name' },
          { type: 'email', title: 'Email Address' },
        ],
      },
      work: {
        title: 'USA Work Visa',
        fields: [
          { type: 'short_text', title: 'Full Name' },
          { type: 'email', title: 'Email Address' },
          { type: 'short_text', title: 'Employer Name in the US' },
        ],
      },
      student: {
        title: 'USA Student Visa',
        fields: [
          { type: 'short_text', title: 'Full Name' },
          { type: 'email', title: 'Email Address' },
          { type: 'short_text', title: 'University Name in the US' },
        ],
      },
    },
    uk: {
      tourist: {
        title: 'UK Tourist Visa',
        fields: [
          { type: 'short_text', title: 'Full Name' },
          { type: 'email', title: 'Email Address' },
        ],
      },
      work: {
        title: 'UK Work Visa',
        fields: [
          { type: 'short_text', title: 'Full Name' },
          { type: 'email', title: 'Email Address' },
          { type: 'short_text', title: 'Employer in the UK' },
        ],
      },
      student: {
        title: 'UK Student Visa',
        fields: [
          { type: 'short_text', title: 'Full Name' },
          { type: 'email', title: 'Email Address' },
          { type: 'short_text', title: 'University Name in the UK' },
        ],
      },
    },
  };
  