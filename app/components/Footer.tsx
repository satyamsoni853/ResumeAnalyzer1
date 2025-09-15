import * as React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const handleSubmit = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
    // Allow normal POST submit to Web3Forms. Validate config first.
    const key = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
    if (!key) {
      e.preventDefault();
      alert('Contact form is not configured. Please set VITE_WEB3FORMS_KEY in your .env');
      return;
    }
  }, []);

  const web3formsKey = (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined) || '';

  return (
    <footer className={`${styles.footer} mt-16 border-t border-dark-700`}>      
      <div className="container mx-auto px-4 py-10 flex flex-col gap-8 items-center">
        <h2 className="text-3xl font-semibold text-light-100">Contact Us</h2>
        <p className="text-light-200 text-center max-w-2xl">
          Questions, feedback, or partnership ideas? Drop us a message and we’ll get back to you.
        </p>
        <form
          action="https://api.web3forms.com/submit"
          method="POST"
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="access_key" value={web3formsKey} />
          <input type="hidden" name="subject" value="New message from AI Resume Analyzer" />
          <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

          <div className={styles.row}>
            <div className="form-div">
              <label htmlFor="name">Your Name</label>
              <input id="name" name="name" type="text" placeholder="Jane Doe" required />
            </div>
            <div className="form-div">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="jane@example.com" required />
            </div>
          </div>

          <div className="form-div mt-2">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} placeholder="How can we help?" required />
          </div>

          <div className="mt-4 flex justify-end">
            <button type="submit" className="primary-button w-fit">Send Message</button>
          </div>
        </form>

        <div className="text-sm text-light-300 mt-6">
          © {new Date().getFullYear()} Resume Analyzer. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

