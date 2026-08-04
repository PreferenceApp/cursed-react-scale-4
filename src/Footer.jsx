import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="footer">
      <Link to="/about" className="footer-link">
        About
      </Link>

      <span className="footer-divider">|</span>

      <Link to="/faqs" className="footer-link">
        FAQs
      </Link>

      <span className="footer-divider">|</span>

      <Link to="/privacy" className="footer-link">
        Privacy
      </Link>

      <span className="footer-divider">|</span>

      <Link to="/rules" className="footer-link">
        Rules
      </Link>
    </footer>
  );
};