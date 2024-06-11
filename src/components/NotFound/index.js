import Header from '../Header'
import './index.css'

const NotFound = () => {
  return (
    <div className="notfound-section">
      <Header />
      <div className="notfound-content">
        <img
          className="notfound-img"
          src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
          alt="not found"
        />
        <h1 className="notfound-heading">Page Not Found</h1>
        <p className="notfound-description">
          We are sorry,the page you requested could not be found
        </p>
      </div>
    </div>
  )
}

export default NotFound