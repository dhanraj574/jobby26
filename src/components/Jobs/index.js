import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import {BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FaStar} from 'react-icons/fa'
import Header from '../Header'
import './index.css'

const apiStatusList = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobsList: [],
    profileApiStatus: apiStatusList.initial,
    jobsApiStatus: apiStatusList.initial,
    jobSearchValue: '',
    employmentType: [],
    salaryPackage: '',
    isChecked: false,
  }

  componentDidMount = () => {
    this.getProfileDetails()
    this.getJobsList()
  }
  

  getProfileDetails = async () => {
    this.setState({
      profileApiStatus: apiStatusList.inProgress,
    })
    
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()

      const updatedProfileDetails = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }

      this.setState({
        profileDetails: updatedProfileDetails,
        profileApiStatus: apiStatusList.success,
      })
    } else if (response.status === 404) {
      this.setState({
        profileApiStatus: apiStatusList.failure,
      })
    }
  }

  getJobsList = async () => {
    this.setState({jobsApiStatus: apiStatusList.inProgress})
    const {employmentType, salaryPackage, jobSearchValue} = this.state

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salaryPackage}&search=${jobSearchValue}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()

      const updatedData = fetchedData.jobs.map(each =>
        this.updateCaseData(each),
      )
      this.setState({
        jobsList: updatedData,
        jobsApiStatus: apiStatusList.success,
      })
    } else if (response.status === 400) {
      this.setState({
        jobsApiStatus: apiStatusList.failure,
      })
    }
  }

  updateCaseData = data => ({
    id: data.id,
    title: data.title,
    rating: data.rating,
    location: data.location,
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    packagePerAnnum: data.package_per_annum,
    jobDescription: data.job_description,
  })

  onChangeSearchValue = event => {
    this.setState({jobSearchValue: event.target.value})
  }

  onClickEnter = event => {
    if (event.key === 'Enter') {
      this.getJobsList()
    }
  }

  onClickSearch = () => {
    this.getJobsList()
  }

  activeEmploymentType = value => {
    const {employmentType} = this.state
    if (employmentType.includes(value)) {
      const filteredList = employmentType.filter(each => each !== value)
      this.setState({employmentType: filteredList}, this.getJobsList)
    } else {
      this.setState(
        prevState => ({employmentType: [...prevState.employmentType, value]}),
        this.getJobsList,
      )
    }
  }

  activeSalaryRange = value => {
    this.setState({salaryPackage: value}, this.getJobsList)
  }

  profileRetryBtn = () => {
    this.getProfileDetails()
  }

  jobsRetryBtn = () => {
    this.getJobsList()
  }

  renderProfileFailureView = () => (
    <div className="profile-failureview">
      <button className="retry-btn" onClick={() => this.profileRetryBtn()}>
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileView = () => {
    const {profileDetails} = this.state
    return (
      <div className="profile">
        <img
          className="profile-img"
          src={profileDetails.profileImageUrl}
          alt="profile"
        />
        <h1 className="profile-name">Dhanraj</h1>
        <p className="profile-bio">Frontend Developer</p>
      </div>
    )
  }

  renderAllProfile = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusList.success:
        return this.renderProfileView()
      case apiStatusList.failure:
        return this.renderProfileFailureView()
      case apiStatusList.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  renderEmploymentTypes = () => {
    const {employmentTypes} = this.props
    return (
      <div className="employment-filter">
        <h1 className="heading">Type of Employment</h1>
        <ul className="filter-list">
          {employmentTypes.map(each => (
            <li className="filter-item" key={each.id}>
              <input
                className="checkbox"
                type="checkbox"
                id={each.employmentTypeId}
                value={each.label}
                onChange={() =>
                  this.activeEmploymentType(each.employmentTypeId)
                }
              />
              <label htmlFor={each.employmentTypeId} className="label">
                {each.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderSalaryFilter = () => {
    const {salaryRanges} = this.props

    return (
      <div className="salary-filter">
        <h1 className="heading">Salary Range</h1>
        <ul className="filter-list">
          {salaryRanges.map(each => (
            <li className="filter-item" key={each.salaryRangeId}>
              <input
                type="radio"
                className="radio"
                id={each.salaryRangeId}
                value={each.label}
                name="salary"
                onChange={() => this.activeSalaryRange(each.salaryRangeId)}
              />
              <label htmlFor={each.salaryRangeId} className="label">
                {each.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderSearchInput = () => {
    const {jobSearchValue} = this.state

    return (
      <div className="search-cont">
        <input
          type="search"
          className="search"
          placeholder="Search"
          onChange={this.onChangeSearchValue}
          onKeyDown={this.onClickEnter}
          value={jobSearchValue}
        />
        <button
          className="search-btn"
          type="button"
          data-testid="searchButton"
          onClick={() => this.onClickSearch()}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderJobs = () => {
    const {jobsList} = this.state

    if (jobsList.length > 1) {
      return (
        <ul className="jobs-list">
          {jobsList.map(each => (
            <Link className="jobs-link" to={`jobs/${each.id}`}>
              <li className="jobs-item" key={each.id}>
                <div className="jobs-sec-1">
                  <div className="job-logo-cont">
                    <img
                      className="job-logo-img"
                      src={each.companyLogoUrl}
                      alt="company logo"
                    />
                  </div>
                  <div className="job-position-cont">
                    <h1 className="company-name">{each.title}</h1>
                    <div className="company-rating-cont">
                      <FaStar className="rating-star" />
                      <p className="rating">{each.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="jobs-sec-2">
                  <div className="job-location-cont">
                    <div className="location-cont">
                      <MdLocationOn className="location-icon" />
                      <p className="location">{each.location}</p>
                    </div>
                    <div className="jobtype-cont">
                      <BsBriefcaseFill className="briefcase-icon" />
                      <p className="jobtype">{each.employmentType}</p>
                    </div>
                  </div>
                  <div className="job-package-cont">
                    <p className="package">{each.packagePerAnnum}</p>
                  </div>
                </div>
                <div className="jobs-sec-3">
                  <h1 className="description-head">Description</h1>
                  <p className="description">{each.jobDescription}</p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      )
    } else if (jobsList.length === 0) {
      return this.renderNoJobView()
    }
  }

  renderJobsFailureView = () => {
    return (
      <div className="jobs-failureview">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          className="job-failureimg"
          alt="failure view"
        />
        <h1 className="jobfailure-head">Oops! Something Went Wrong</h1>
        <p className="jobfailure-description">
          We cannot seem to find the page you are looking for
        </p>
        <button className="retry-btn" onClick={() => this.jobsRetryBtn()}>
          Retry
        </button>
      </div>
    )
  }

  renderAllJobs = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiStatusList.success:
        return this.renderJobs()
      case apiStatusList.failure:
        return this.renderJobsFailureView()
      case apiStatusList.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }
  renderNoJobView = () => {
    return (
      <div className="jobs-failureview">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="job-failureimg"
          alt="no jobs"
        />
        <h1 className="jobfailure-head">No Jobs Found</h1>
        <p className="jobfailure-description">
          We could not find any jobs. Try others filters
        </p>
      </div>
    )
    
  }
  render() {
    return (
      <div className="jobs-section">
        <Header />
        <div className="jobs-content-cont">
          <div className="filters-section">
            <div className="profile-cont">
              <div className="sm-search-cont">{this.renderSearchInput()}</div>
              {this.renderAllProfile()}
            </div>
            {this.renderEmploymentTypes()}
            {this.renderSalaryFilter()}
          </div>
          <div className="jobs-list-section">
            <div className="lg-search-cont">{this.renderSearchInput()}</div>
            <div className="jobslist-cont">{this.renderAllJobs()}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
