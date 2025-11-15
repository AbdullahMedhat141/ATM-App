import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <h1>⚠️ 404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/dashboard" className="go-home-link">
          🏠 Go Back Home
        </Link>
      </div>
    </div>
  );
}
