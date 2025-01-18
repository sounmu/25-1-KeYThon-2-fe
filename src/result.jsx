import './Result.css'

function Result({ result }) {
  return (
    <div className="result-container">
      <h2>당신의 성격 유형 분석 결과</h2>
      <div className="result-content">
        <p>{result}</p>
      </div>
    </div>
  )
}

export default Result
