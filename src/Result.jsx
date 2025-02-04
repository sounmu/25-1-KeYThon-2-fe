import { useState, useEffect } from 'react'
import './Result.css'

function Result({ result, onReset }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [searchResults, setSearchResults] = useState(null)

  const cleanHtmlString = (str) => {
    if (!str) return '';
    // HTML 엔티티 디코딩
    const decoded = str.replace(/&quot;/g, '"')
                      .replace(/&amp;/g, '&')
                      .replace(/&lt;/g, '<')
                      .replace(/&gt;/g, '>')
                      .replace(/&#39;/g, "'")
                      .replace(/&nbsp;/g, ' ');
    
    // HTML 태그 제거
    return decoded.replace(/<[^>]*>/g, '');
  }

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
    
    if (!searchTerm.trim()) {
      alert('검색어를 입력해주세요')
      return
    }

    setHasSearched(true)

    const searchData = {
      progressive: result.progressive,
      moderate: result.moderate,
      conservative: result.conservative,
      query: searchTerm
    }

    try {
      const response = await fetch('https://test.kusis.kr/api/topic', {
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
        <h2>{hasSearched ? "분석 결과" : "당신의 성향 분석 결과"}</h2>
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
                placeholder="성향을 반영한 추천 기사를 검색해보세요"
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
              <div className="search-summary">
                총 <span className="result-count">{searchResults.count}</span>개의 기사가 검색되었습니다
              </div>
              <div className="results-grid">
                {searchResults.data.map((item, index) => (
                  <div key={index} className="result-card">
                    <div className="card-header">
                      <h3 className="card-title">{cleanHtmlString(item.title)}</h3>
                      <span className={`bias-tag ${item.bias}`}>{item.bias}</span>
                    </div>
                    <p className="card-description">{cleanHtmlString(item.descriptions)}</p>
                    <div className="card-footer">
                      <span className="office-name">{cleanHtmlString(item.office)}</span>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="more-link">
                        자세히 보기 →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
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
                placeholder="성향을 반영한 추천 기사를 검색해보세요"
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
