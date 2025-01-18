import { useState, useEffect } from 'react'
import './App.css'
import Survey from './Survey'
import Result from './result.jsx'

function App() {
  const [savedResult, setSavedResult] = useState(null)

  useEffect(() => {
    // Check for saved result in cookies
    const getCookie = (name) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop().split(';').shift()
    }
    
    const result = getCookie('surveyResult')
    if (result) {
      setSavedResult(decodeURIComponent(result))
    }
  }, [])

  const handleResetSurvey = () => {
    document.cookie = 'surveyResult=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    setSavedResult(null)
  }

  return (
    <div>
      {savedResult ? (
        <Result result={savedResult} onReset={handleResetSurvey} />
      ) : (
        <Survey onComplete={(result) => {
          // Save result to cookie
          document.cookie = `surveyResult=${encodeURIComponent(result)}; path=/`
          setSavedResult(result)
        }} />
      )}
    </div>
  )
}

export default App
