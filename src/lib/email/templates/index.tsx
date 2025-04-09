import * as React from 'react';

export interface EmailTemplateProps {
  name: string;
  email: string;
  content: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  content,
}) => (
  <div>
    <h1>Bạn có tin nhắn mới!</h1>
    <p>Từ {name},</p>
    <p>Địa chỉ email: {email}</p>
    <p>
      {content
        ? `Nội dung tin nhắn: ${content}`
        : 'Không có nội dung tin nhắn nào được gửi.'}
    </p>
  </div>
);
