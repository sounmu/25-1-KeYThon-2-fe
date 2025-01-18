import { useState } from 'react'
import './App.css'

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})

  const questions = [
    "나는 새로운 사람들을 만나는 것을 즐긴다.",
    "나는 계획을 세우는 것을 좋아한다.",
    "나는 다른 사람들의 감정을 잘 이해한다.",
    // ... 나머지 17개의 질문을 추가하세요
  ]

  const options = [
    "StronglyDisagree",
    "ModeratelyDisagree",
    "SlightlyDisagree",
    "SlightlyAgree",
    "ModeratelyAgree",
    "StronglyAgree"
  ]

  const handleAnswer = (option) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: option
    }))
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
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

  return (
    <div className="survey-container">
      <p className="text-h3">One Piece (가명)</p>
      {currentQuestion < questions.length ? (
        <>
          <h2 className="question-number">Question {currentQuestion + 1}/{questions.length}</h2>
          <p className="question-text">{questions[currentQuestion]}</p>
          
          <div className="options-container">
            {options.map((option, index) => (
              <div key={index} className="option-wrapper">
                <button
                  className="option-button"
                  onClick={() => handleAnswer(option)}
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

          <div className="navigation-buttons">
            <button 
              className="nav-button" 
              onClick={handleBack}
              disabled={currentQuestion === 0}
            >
              Back
            </button>
            <button 
              className="nav-button" 
              onClick={handleNext}
              disabled={currentQuestion === questions.length - 1}
            >
              Next
            </button>
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

export default App
