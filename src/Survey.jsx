import { useState } from 'react'
import './Survey.css'
import Result from './result.jsx'

function Survey() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isAnimating, setIsAnimating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const questions = [
    "나는 새로운 사람들을 만나는 것을 즐긴다.",
    "나는 계획을 세우는 것을 좋아한다.",
    "나는 다른 사람들의 감정을 잘 이해한다.",
    // ... 나머지 17개의 질문을 추가하세요
  ]

  const options = [
    "강하게 비동의",
    "다소 비동의",
    "약간 비동의",
    "약간 동의",
    "다소 동의",
    "강하게 동의"
  ]

  const handleAnswer = (option) => {
    if (isAnimating) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: option
    }))
    
    if (currentQuestion < questions.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('http://localhost:8080/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit survey')
      }

      const data = await response.json()
      setResult(data.result)
    } catch (error) {
      console.error('Error submitting survey:', error)
      alert('설문 제출 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (result) {
    return <Result result={result} />
  }

  return (
    <div className="survey-container">
      <p className="text-h3">One Piece (가명)</p>
      {currentQuestion < questions.length ? (
        <>
          <h2 className="question-number">Question {currentQuestion + 1}/{questions.length}</h2>
          <div className="question-container">
            <div className={`question-slide ${isAnimating ? 'question-slide-exit' : ''}`}>
              <p className="question-text">{questions[currentQuestion]}</p>
              
              <div className="options-container">
                {options.map((option, index) => (
                  <div key={index} className="option-wrapper">
                    <button
                      className="option-button"
                      onClick={() => handleAnswer(option)}
                      disabled={isAnimating}
                    >
                      <div 
                        className={`option-circle ${answers[currentQuestion] === option ? 'selected' : ''}`}
                      ></div>
                      <span>{option}</span>
                    </button>
                    {index < options.length - 1 && <div className="option-line"></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="navigation-buttons">
            <button 
              className="nav-button" 
              onClick={handleBack}
              disabled={currentQuestion === 0}
            >
              Back
            </button>
            {currentQuestion === questions.length - 1 ? (
              <button 
                className="nav-button finish-button" 
                onClick={handleSubmit}
                disabled={isSubmitting || !answers[currentQuestion]}
              >
                {isSubmitting ? '제출 중...' : 'Finish'}
              </button>
            ) : (
              <button 
                className="nav-button" 
                onClick={handleNext}
                disabled={currentQuestion === questions.length - 1}
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="survey-complete">
          <h2>설문이 완료되었습니다!</h2>
        </div>
      )}
    </div>
  )
}

export default Survey 