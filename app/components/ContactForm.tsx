export default function ContactForm() {
  return (
    <section>
      <form data-static-form-name="contact">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          maxLength={100}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          maxLength={255}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows={5}
          required
        ></textarea>
        <button type="submit">Send</button>
      </form>
      <hr />
    </section>
  );
}
