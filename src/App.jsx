import { useEffect, useState } from "react"
import Footer from "./components/Footer"
import Main from "./components/Main"
import SideBar from "./components/SideBar"


function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  function handleToggleModal() {
    setShowModal(!showModal);
  }

  useEffect(() => {
    async function fetchApiData() {
      const NASA_KEY = import.meta.env.VITE_NASA_API_KEY;
      const url = 'https://api.nasa.gov/planetary/apod' + `?api_key=${NASA_KEY}`

      const today = (new Date()).toDateString();
      const localKey = `NASA_${today}`;
      const localData = localStorage.getItem(localKey);
      if (localData) {
        const apiData = JSON.parse(localData);
        setData(apiData);
        console.log('Fetched from cache today')
        return;
      }
      localStorage.clear()

      try {
        const res = await fetch(url)
        const apiData = await res.json()
        localStorage.setItem(localKey, JSON.stringify(apiData));
        setData(apiData)
        console.log('Fetched from API today');
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchApiData()
    
  }, [])
  
  return (
    <>
      {data ? (<Main data={data} />) : (
        <div className="loadingState">
          <i className="fa-solid fa-spinner"></i>
        </div>
      )}
      {showModal && (
        <SideBar data={data} handleToggleModal={handleToggleModal}/>
      )}
      {data && <Footer data={data} handleToggleModal={handleToggleModal} />}
    </>
  )
}

export default App
