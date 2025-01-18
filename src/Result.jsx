import { useState } from 'react'
import './Result.css'

function Result({ result, onReset }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleBack = () => {
    if (onReset) {
      onReset()
    } else {
      window.location.reload()
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // TODO: Implement search functionality with backend
    alert('검색 기능은 아직 구현 중입니다: ' + searchTerm)
  }

  return (
    <div className="result-container">
      <div className="result-header">
        <button className="back-button" onClick={handleBack}>
          ← 설문 새로하기
        </button>
        <h2>당신의 성격 유형 분석 결과</h2>
      </div>
      
      <div className="result-content">
        <p>{result}</p>
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
    </div>
  )
}

export default Result
