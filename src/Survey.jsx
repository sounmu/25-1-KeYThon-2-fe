import { useState } from 'react'
import './Survey.css'
import Result from './Result.jsx'

function Survey({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState(new Array(20).fill(null))
  const [isAnimating, setIsAnimating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const questions = [
    "나는 새로운 사람들을 만나는 것을 즐긴다.",
    "나는 계획을 세우는 것을 좋아한다.",
    "나는 다른 사람들의 감정을 잘 이해한다.",
    "4번 질문",
    "5번 질문",
    "나는 혼자만의 시간을 중요하게 생각한다.",
    "나는 새로운 아이디어를 생각해내는 것을 좋아한다.", 
    "나는 다른 사람들과 함께 일하는 것을 선호한다.",
    "나는 세부사항에 주의를 기울인다.",
    "나는 스트레스 상황에서도 차분함을 유지한다.",
    "나는 예술적인 것들에 관심이 많다.",
    "나는 리더십을 발휘하는 것을 좋아한다.",
    "나는 규칙과 질서를 중요하게 여긴다.",
    "나는 다른 사람들을 돕는 것을 즐긴다.",
    "나는 새로운 경험을 추구한다.",
    "나는 논리적인 사고를 하는 것을 좋아한다.",
    "나는 감정적인 결정을 내리는 편이다.",
    "나는 체계적으로 일을 처리하는 것을 선호한다.",
    "나는 창의적인 해결책을 찾는 것을 좋아한다.",
    "나는 다른 사람들의 의견을 경청한다."
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

  const handleAnswer = (optionIndex) => {
    if (isAnimating) return;
    
    setAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[currentQuestion] = optionIndex
      return newAnswers
    })
    
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
      const response = await fetch('http://52.79.237.145:8000/api/survey', {
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
      onComplete(data.result)
    } catch (error) {
      console.error('Error submitting survey:', error)
      alert('설문 제출 중 오류가 발생했습니다. 다시 시도해주세요. error: ' + error)
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
                      onClick={() => handleAnswer(index)}
                      disabled={isAnimating}
                    >
                      <div 
                        className={`option-circle ${answers[currentQuestion] === index ? 'selected' : ''}`}
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
                disabled={isSubmitting || answers[currentQuestion] === null}
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