import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Trending extends Component {
  state = {
    category: 'ALL',
    apiStatus: apiStatusConstants.initial,
    list: [],
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {category} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${category}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.projects.map(videos => ({
        id: videos.id,
        name: videos.name,
        imageurl: videos.image_url,
      }))
      console.log(updatedData)

      this.setState({
        list: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" className="button" onClick={this.getProducts}>
        Retry
      </button>
    </div>
  )

  renderTrendingVideosview = () => {
    const {list} = this.state
    return (
      <div className="">
        <div className="right-side-home-contaier1">
          <ul className="alignment1">
            {list.map(eachvideo => (
              <li className="individual">
                <img src={eachvideo.imageurl} alt={eachvideo.name} />
                <p className="margin">{eachvideo.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  getalltrendingvideos = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderTrendingVideosview()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  handleOptionChange = e => {
    console.log(e.target.value)
    this.setState({category: e.target.value})
    this.getProducts()
  }

  render() {
    const {category} = this.state
    console.log(category)
    return (
      <div className="projectShowcase">
        <div className="background">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="image"
          />
        </div>

        <div className="tophomecontainer">
          <div>
            <label htmlFor="dropdown">Tags</label>
            <br />
            <select
              id="dropdown"
              value={category}
              onChange={this.handleOptionChange}
              className="inputs"
            >
              {categoriesList.map(eachitem => (
                <option value={eachitem.id}>{eachitem.displayText}</option>
              ))}
            </select>

            <div className="right-side-home-contaier">
              {this.getalltrendingvideos()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Trending
