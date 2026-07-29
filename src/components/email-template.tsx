import * as React from "react";

interface EmailTemplateProps {
  fullName: string;
  email: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  fullName,
  email,
  message,
}) => (
  <div>
    <h1>Message from {fullName}</h1>
    <p className="text-red-500">Reply to {email}</p>
    <blockquote>{message}</blockquote>
  </div>
);
