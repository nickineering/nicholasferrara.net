import styles from "~/styles/_index.module.css";

export default function Bio() {
  return (
    <div className={styles.bio}>
      <p>Hey, I&apos;m Nick 👋</p>
      <p>
        Ever since I was a teenager I&apos;ve been fascinated by code. Less than
        1% of the world&apos;s workforce actually write it, but collectively it
        enables the modern way of life. That spectacular efficiency is what drew
        me to software engineering and keeps me going today.
      </p>
      <p>
        I like to avoid work for work&apos;s sake, and instead focus on the work
        that makes a difference. The best way to do that is to find force
        multipliers, and engineering has many of those. I enjoy mentoring and
        collaborating with other engineers, pushing the limits of what is
        possible to automate, or better yet staying close to the product so I
        can quickly realise when code does not have to be written at all.
      </p>
      <p>
        It&apos;s great to meet like minded people, so if you&apos;ve made it
        this far I&apos;d love to hear from you - be it a job, your crazy
        startup idea, or just to chat about tech. Even if it&apos;s a bit
        different to what I&apos;ve done before, I&apos;m a polyglot at heart. I
        can write more computer languages and speak more human languages than I
        care to count, so let&apos;s add another!
      </p>
    </div>
  );
}
