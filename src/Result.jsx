import { useState, useEffect } from 'react'
import './Result.css'

function Result({ result, onReset }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [searchResults, setSearchResults] = useState(null)

  const handleBack = () => {
    if (onReset) {
      onReset()
    } else {
      window.location.reload()
    }
  }

  const handleReturn = () => {
    setHasSearched(false)
    setSearchResults(null)
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setHasSearched(true)

    const searchData = {
      progressive: result.progressive,
      moderate: result.moderate,
      conservative: result.conservative,
      query: searchTerm
    }

    try {
      const response = await fetch('http://localhost:8000/api/topic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData)
      })

      if (!response.ok) {
        throw new Error('검색 중 오류가 발생했습니다')
      }

      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error('검색 오류:', error)
      alert('검색 중 오류가 발생했습니다')
    }
  }

  return (
    <div className="result-container">
      <div className="result-header">
        <button className="back-button" onClick={handleBack}>
          ← 설문 새로하기
        </button>
        <h2>당신의 성격 유형 분석 결과</h2>
        {hasSearched && (
          <button className="return-button" onClick={handleReturn}>
            결과보기 →
          </button>
        )}
      </div>
      
      {hasSearched ? (
        <>
          <div className={`search-container searched`}>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="관심있는 주제를 검색해보세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                검색
              </button>
            </form>
          </div>

          {searchResults && (
            <div className="search-results">
              <pre>{JSON.stringify(searchResults, null, 2)}</pre>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="result-content">
            <div className="result-percentages">
              <div className="percentage-item">
                <h3>진보성향</h3>
                <p>{result.progressive}%</p>
              </div>
              <div className="percentage-item">
                <h3>중도성향</h3>
                <p>{result.moderate}%</p>
              </div>
              <div className="percentage-item">
                <h3>보수성향</h3>
                <p>{result.conservative}%</p>
              </div>
            </div>
          </div>

          <div className="search-container">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="관심있는 주제를 검색해보세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                검색
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export default Result
