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
    "나는 액션 영화를 다큐멘터리에 비해 더 선호하는 편이다",
    "나는 책상을 깔끔하게 유지한다",
    "일반적인 국민들은 정치에 깊게 관여할 필요가 없다",
    "전자제품은 최신형을 빠르게 도입해야한다고 생각한다",
    "팀 활동에서 리더가 명확히 지시를 내리는 것이 효율적이라고 생각한다",
    "옷차림은 어느 정도 격식을 갖추는 것이 예의라고 생각한다",
    "나이, 직급과 같은 서열을 존중하는 문화가 필요하다고 본다",
    "불편하더라도 공인된 절차와 형식을 따르는 것이 가장 안전하다고 믿는다",
    "아이들은 어른에게 공손함을 우선적으로 배워야한다고 생각한다",
    "회사에서는 직원이 받는 만큼 일하는 것이 당연하다고 생각한다.",
    "학생들에게는 경쟁보다는 협동을 통해 학습하는 기회를 더 제공해야 한다.",
    "지역 축제나 커뮤니티 행사에 참여하는 것은 사회적 유대감을 위해 가치있다고 생각한다.",
    "친구들과의 논쟁에서 조화를 유지하는 것이 이기는 것보다 더 중요하다고 본다.",
    "나는 채식을 완전히 하지 않더라도 식단에서 고기를 줄이는 것이 필요하다고 본다.",
    "새로운 기술이나 도구를 배우는 것이 삶의 질을 높이는 데 중요하다고 생각한다.",
    "다른 사람의 의견을 수용하는 것이 강한 주장을 고수하는 것보다 중요하다고 본다.",
    "음악을 들으며 일하거나 공부하는 것이 더 효율적이라고 생각한다.",
    "정해진 식사 시간이 아니어도 배고프면 간단히라도 먹는 편이다.",
    "나는 다른 사람의 조언을 받을 때, 비판적인 태도로 검토하려고 한다.",
    "집에서 사용하는 전자기기의 에너지 효율성을 중요하게 생각한다.",
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
      const response = await fetch('https://test.kusis.kr/api/survey', {
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
      <p className="text-h3">One Piece of News</p>
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
                disabled={isSubmitting || answers.includes(null)}
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