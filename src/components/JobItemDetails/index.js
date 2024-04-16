import {Component} from 'react'
import Header from '../Header'
import {FaExternalLinkAlt} from 'react-icons/fa'
import {BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FaStar} from 'react-icons/fa'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import './index.css'

const apiStatusList = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobItemApiStatus: apiStatusList.initial,
    jobDetails: {},
    similarJobsList: [],
    lifeAtCompany: {},
    skillList: [],
  }
  componentDidMount() {
    this.getJobItemDetails()
  }
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.getJobItemDetails()
      window.scrollTo(0, 0); 
    }
  }

  updateCaseJobDetails = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  updateCaseLifeatcompany = data => ({
    description: data.description,
    imageUrl: data.image_url,
  })

  updateCaseSkills = data => ({
    name: data.name,
    imageUrl: data.image_url,
  })

  updateCaseSimilarJobs = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  jobItemRetryBtn = () => {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({
      jobItemApiStatus: apiStatusList.inProgress,
    })
    const id = this.props.match.params.id
    console.log(id)
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedJobDetails = this.updateCaseJobDetails(
        fetchedData.job_details,
      )
      const updatedLifeAtCompany = this.updateCaseLifeatcompany(
        fetchedData.job_details.life_at_company,
      )
      const updatedSkillsList = fetchedData.job_details.skills.map(each =>
        this.updateCaseSkills(each),
      )
      const updatedSimilarJobs = fetchedData.similar_jobs.map(each =>
        this.updateCaseSimilarJobs(each),
      )
      this.setState({
        jobDetails: updatedJobDetails,
        lifeAtCompany: updatedLifeAtCompany,
        skillList: updatedSkillsList,
        similarJobsList: updatedSimilarJobs,
        jobItemApiStatus: apiStatusList.success,
      })
    } else if (response.status === 400) {
      this.setState({
        jobItemApiStatus: apiStatusList.failure,
      })
    }
  }
  renderJobItem = () => {
    const {jobDetails, lifeAtCompany, skillList} = this.state
    return (
      <div className="jobitem-details-cont">
        <div className="jobitem-details">
          <div className="jobitem-sec-1">
            <div className="jobitem-logo-cont">
              <img
                className="jobitem-logo-img"
                src={jobDetails.companyLogoUrl}
                alt="job details company logo"
              />
            </div>
            <div className="jobitem-position-cont">
              <h1 className="jobitem-companyname">{jobDetails.title}</h1>
              <div className="jobitemcompany-ratingcont">
                <FaStar className="jobitem-ratingstar" />
                <p className="jobitem-rating">{jobDetails.rating}</p>
              </div>
            </div>
          </div>
          <div className="jobitem-sec-2">
            <div className="jobitem-locationcont">
              <div className="jobitem-location">
                <MdLocationOn className="jobitem-locationicon" />
                <p className="jobitem-locationtext">{jobDetails.location}</p>
              </div>
              <div className="jobitem-jobtypecont">
                <BsBriefcaseFill className="jobitem-briefcaseicon" />
                <p className="jobitem-jobtype">{jobDetails.employmentType}</p>
              </div>
            </div>
            <div className="jobitem-jobpackagecont">
              <p className="jobitem-package">{jobDetails.packagePerAnnum}</p>
            </div>
          </div>
          <div className="jobitem-sec-3">
            <div className="jobitem-description-cont">
              <h1 className="jobitem-descriptionhead">Description</h1>
              <div className="jobitem-descriptionlink">
                <a
                  className="descriptionlink"
                  href={jobDetails.companyWebsiteUrl}
                >
                  <p className="descriptionlink-text">Visit</p>
                  <FaExternalLinkAlt className="descriptionlink-icon" />
                </a>
              </div>
            </div>
            <p className="jobitem-description">{jobDetails.jobDescription}</p>
          </div>
          <div className="jobitem-skills-section">
            <h1 className="jobitem-skills-head">Skills</h1>
            <ul className="jobitem-skillslist">
              {skillList.map(each => (
                <li className="jobitem-skillsitem" key={each.id}>
                  <img
                    className="skill-img"
                    src={each.imageUrl}
                    alt={each.name}
                  />
                  <p className="skill-name">{each.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="jobitem-lifeatcompany-section">
            <h1 className="lifeatcompany-head">Life at Company</h1>
            <div className="lifeatcompany-description-cont">
              <p className="lifeatcompany-description">
                {lifeAtCompany.description}
              </p>
              <img
                className="lifeatcompany-img"
                src={lifeAtCompany.imageUrl}
                alt="life at company"
              />
            </div>
          </div>
        </div>
        {this.renderSimilarJobs()}
      </div>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobsList} = this.state
    const {history} = this.props
    const navigateToSimilarJobs = (productId) => {
      history.push(`/jobs/${productId}`);
    };
    return (
      <div className="similarjobs-section">
        <h1 className="similarjobs-heading">Similar Jobs</h1>
        <ul className="similarjobs-cont">
          {similarJobsList.map(each => (
            
               <li className="similarjobs-listitem" key={each.id} onClick={() => navigateToSimilarJobs(each.id)}>
              <div className="similarjobs-sec-1">
                <div className="similarjobs-logo-cont">
                  <img
                    className="similarjobs-logo-img"
                    alt="similar job company logo"
                    src={each.companyLogoUrl}
                  />
                </div>
                <div className="similarjobs-position-cont">
                  <h1 className="similarjobs-companyname">{each.title}</h1>
                  <div className="similarjobs-ratingcont">
                    <FaStar className="similarjobs-ratingstar" />
                    <p className="similarjobs-rating">{each.rating}</p>
                  </div>
                </div>
              </div>
              <div className="similarjobs-description-cont">
                <h1 className="similarjobs-descriptionhead">Description</h1>
                <p className="similarjobs-description">{each.jobDescription}</p>
              </div>
              <div className="similarjobs-sec-2">
                <div className="similarjobs-locationcont">
                  <MdLocationOn className="similarjobs-locationicon" />
                  <p className="similarjobs-location">{each.location}</p>
                </div>
                <div className="similarjobs-jobtypecont">
                  <BsBriefcaseFill className="similarjobs-briefcaseicon" />
                  <p className="similarjobs-jobtype">{each.employmentType}</p>
                </div>
              </div>
            </li>
           
          ))}
        </ul>
      </div>
    )
  }

  renderLoaderView = () => (
    <div className="jobitem-loader-container" data-testid="loader">
      <Loader
        type="ThreeDots"
        color="#ffffff"
        height="50"
        width="50"
        className="jobitem-loader"
      />
    </div>
  )

  renderJobItemFailureView = () => {
    return (
      <div className="jobitem-failureview">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          className="jobitem-failureimg"
          alt="failure view"
        />
        <h1 className="jobitem-failurehead">Oops! Something Went Wrong</h1>
        <p className="jobitem-failuredescription">
          We cannot seem to find the page you are looking for
        </p>
        <button
          className="jobitem-retrybtn"
          onClick={() => this.jobItemRetryBtn()}
        >
          Retry
        </button>
      </div>
    )
  }

  renderAllJobItem = () => {
    const {jobItemApiStatus} = this.state
    switch (jobItemApiStatus) {
      case apiStatusList.success:
        return this.renderJobItem()
      case apiStatusList.failure:
        return this.renderJobItemFailureView()
      case apiStatusList.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-item-section">
        <Header />
        {this.renderAllJobItem()}
      </div>
    )
  }
}

export default JobItemDetails
