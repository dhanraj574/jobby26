import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import {TiHome} from 'react-icons/ti'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const {history} = props

  const logoutfunction = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className='header-section'>
      <Link to='/'>
        <img
          className='header-logo'
          src='https://assets.ccbp.in/frontend/react-js/logo-img.png'
          alt='website logo'
        />
      </Link>
      <ul className='header-link-list'>
        <Link to='/' className='header-link'>
          <li>Home</li>
        </Link>
        <Link to='/jobs' className='header-link'>
          <li>Jobs</li>
        </Link>
      </ul>
      <button className='logout-btn' type='button' onClick={logoutfunction}>
        Logout
      </button>
      <div className='sm-link-cont'>
        <Link to='/'>
          <TiHome className='sm-link' />
        </Link>
        <Link to='/jobs'>
          <BsBriefcaseFill className='sm-link' />
        </Link>
        <FiLogOut className='sm-link' onClick={logoutfunction} />
      </div>
    </div>
  )
}

export default withRouter(Header)
