import Header from '../Header'
import {Link} from 'react-router-dom'
import './index.css'

const Home = () => {
  return (
    <div className='home-section'>
      <Header />
      <div className='home-content'>
        <h1 className='home-heading'>Find The Job That Fits Your Life</h1>
        <p className='home-description'>
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job thats fits your abilities and potential.
        </p>

        <button className='home-btn' type='button'>
          <Link to='/jobs' className='home-link'>
            Find Jobs
          </Link>
        </button>
      </div>
    </div>
  )
}

export default Home
