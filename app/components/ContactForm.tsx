export default function ContactForm() {
  return (
    <section>
      <h2>Contact me</h2>
      <form method="post" action="/api/contact_form">
        <fieldset className="grid">
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
        </fieldset>
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
