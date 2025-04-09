'use server';

import { Resend } from 'resend';
import { EmailTemplate, EmailTemplateProps } from './templates';

const resend = new Resend(process.env.RESEND_API_KEY);

type Props = {
  email: string;
  subject: string;
} & EmailTemplateProps;

export async function sendEmail(value: Props) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Huanme <noreply@huanme.site>',
      to: [value.email],
      subject: value.subject,
      react: EmailTemplate(value),
    });

    if (error) {
      return {
        success: false,
        error: JSON.stringify(error),
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Dont know what happened',
      detail: error,
    };
  }
}
