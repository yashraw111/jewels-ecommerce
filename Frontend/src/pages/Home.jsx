import React from 'react'
import HeroSection from '../components/HeroSection'
import CategorySection from '../components/CategorySection'
import NewArrivals from '../components/NewArrivals'
import OfferBanner from '../components/OfferBanner'
import BestSeller from '../components/BestSellers'
import CustomerReviews from '../components/CustomerReviews'
import ChooseUs from '../components/ChooseUs'
import InstagramGallery from '../components/InstagramGallery'

const Home = () => {
  return (
    <div >
        <HeroSection/>
        <CategorySection/>
        <NewArrivals/>
        <OfferBanner/>
        <BestSeller/>
        <CustomerReviews/>
        <ChooseUs/>
        <InstagramGallery/>
    </div>
  )
}

export default Home