import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export interface ContactProps {
  name: string;
  email: string;
  message: string;
}

export const ContactEmailTemplate: React.FC<
  Readonly<Partial<ContactProps>>
> = ({ name, email, message }) => {
  const formattedMessage = message ?? "";
  const shortMessage =
    formattedMessage.length > 100
      ? `${formattedMessage.slice(0, 100)}...`
      : formattedMessage;

  return (
    <Html>
      <Head />
      <Preview>{shortMessage}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.heading}>Contact Form Submission</Heading>
          </Section>
          <Hr style={styles.hr} />
          <Section style={styles.content}>
            <Text style={styles.text}>
              <strong>Name:</strong> {name}
            </Text>
            <Text style={styles.text}>
              <strong>Email:</strong> {email}
            </Text>
            <Text style={styles.text}>
              <strong>Message:</strong>{" "}
              <span style={styles.message}>{message}</span>
            </Text>
          </Section>
          <Hr style={styles.hr} />
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Reply to this email to start a conversation with {name}. It was
              sent via the{" "}
              <Link href="https://nicholasferrara.net/">
                NicholasFerrara.net
              </Link>{" "}
              contact form.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const styles = {
  body: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    margin: 0,
    padding: "10px",
    backgroundColor: "#f4f4f4",
  },
  container: {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center" as React.CSSProperties["textAlign"],
    padding: "10px 0",
  },
  heading: {
    margin: 0,
    fontSize: "24px",
    color: "#333333",
  },
  hr: {
    border: "none",
    borderTop: "1px solid #dddddd",
    margin: "20px 0",
  },
  content: {
    padding: "20px 0",
  },
  text: {
    fontSize: "16px",
    color: "#555555",
  },
  message: {
    whiteSpace: "pre-wrap",
  },
  footer: {
    textAlign: "center" as React.CSSProperties["textAlign"],
  },
  footerText: {
    fontSize: "12px",
    color: "#999999",
  },
};

export default ContactEmailTemplate;
