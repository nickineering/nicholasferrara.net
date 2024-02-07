export default function Faq() {
  return (
    <section>
      <h2>FAQ</h2>
      <ul>
        <li>
          <details role="list">
            <summary aria-haspopup="listbox">Show us some code!</summary>
            <p>
              Much of my code is proprietary, but check out{" "}
              <a
                href="https://github.com/nickineering/nicholasferrara.net"
                target="_blank"
                rel="noopener noreferrer"
              >
                the source for this website
              </a>
              , or how{" "}
              <a
                href="https://github.com/nickineering/setup"
                target="_blank"
                rel="noopener noreferrer"
              >
                I took automation to the next level
              </a>{" "}
              by configuring everything on my Mac with code.
            </p>
          </details>
        </li>
        <li>
          <details role="list">
            <summary aria-haspopup="listbox">
              Are you open to new roles?
            </summary>
            <p>Yes.</p>
          </details>
        </li>
        <li>
          <details role="list">
            <summary aria-haspopup="listbox">
              Would you consider a contract, or only permanent?
            </summary>
            <p>I&apos;m open to exploring possibilities.</p>
          </details>
        </li>
        <li>
          <details role="list">
            <summary aria-haspopup="listbox">
              Do you have the right to work in the UK?
            </summary>
            <p>Yes.</p>
          </details>
        </li>
        <li>
          <details role="list">
            <summary aria-haspopup="listbox">
              Would you work for a company outside of central London?
            </summary>
            <p>
              Of course! I would only visit the office on special occasions,
              though.
            </p>
          </details>
        </li>
        <li>
          <details role="list">
            <summary aria-haspopup="listbox">
              What is your preferred industry, tech stack, working pattern,
              company size, office mug colour etc?
            </summary>
            <p>
              I&apos;m primarily motivated by continuously learning to solve
              real problems in a strong, supportive culture that attracts like
              minded driven individuals. The exact way I would like to solve
              those problems will depend on the business situation and in fact I
              prefer a bit of variety when I can get it. I prefer to avoid
              excessive meetings or anything else that distracts from the core
              problems I was hired to solve, though.
            </p>
          </details>
        </li>
        <li>
          <details role="list">
            <summary aria-haspopup="listbox">
              Could you speak at my conference?
            </summary>
            <p>Let&apos;s talk more.</p>
          </details>
        </li>
        <li>
          <details role="list">
            <summary aria-haspopup="listbox">
              Want to come to my meetup?
            </summary>
            <p>Send me the link!</p>
          </details>
        </li>
        <li>
          <details role="list">
            <summary aria-haspopup="listbox">
              Would you be willing to volunteer with my nonprofit?
            </summary>
            <p>
              I am actually very keen on finding nonprofits relating to code as
              long as the time commitment is reasonable.
            </p>
          </details>
        </li>
        <li>
          <details role="list">
            <summary aria-haspopup="listbox">
              I&apos;m just getting into tech. Could you help me out?
            </summary>
            <p>I&apos;d love to share some advice or look over your CV.</p>
          </details>
        </li>
      </ul>
    </section>
  );
}
