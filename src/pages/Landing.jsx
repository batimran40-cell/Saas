import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="landing">
      <div className="container landing-inner">
        <h1 className="hero-headline">Give every shop its own homepage, in minutes</h1>
        <p className="hero-subhead">
          Sign up, and you get a homepage you can edit yourself — your name, your photos, your
          products, your colors. No code, no designer needed.
        </p>
        <div className="landing-actions">
          <Link to="/signup" className="btn">
            Create your shop
          </Link>
          <Link to="/login" className="btn btn-outline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
