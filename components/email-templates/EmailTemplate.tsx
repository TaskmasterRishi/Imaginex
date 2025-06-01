import * as React from 'react';

interface EmailTemplateProps {
  userName: string,
  message: string,
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  userName,
  message
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', color: '#333' }}>
    <div style={{ borderBottom: '1px solid #eaeaea', paddingBottom: '20px', marginBottom: '20px' }}>
      <h1 style={{ color: '#4a6baf', marginBottom: '5px' }}>ImaginX AI</h1>
      <p style={{ color: '#666', margin: 0 }}>AI Model Training Notification</p>
    </div>
    
    <h2 style={{ color: '#4a6baf' }}>Hello {userName},</h2>
    
    <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px', margin: '20px 0' }}>
      <p style={{ margin: 0 }}>{message}</p>
    </div>

    <p style={{ marginBottom: '20px' }}>
      Thank you for using our services. If you have any questions, please don't hesitate to contact us.
    </p>

    <div style={{ borderTop: '1px solid #eaeaea', paddingTop: '20px', marginTop: '20px', color: '#666' }}>
      <p style={{ margin: '5px 0' }}>Best regards,</p>
      <p style={{ margin: '5px 0', fontWeight: 'bold' }}>The ImaginX AI Team</p>
    </div>
  </div>
);