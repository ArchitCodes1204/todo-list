import React, { useState, useEffect } from 'react';
import './QnAPlatform.css';

export default function QnAPlatform() {
  const [questions, setQuestions] = useState(() => {
    const savedQuestions = localStorage.getItem('questions');
    return savedQuestions ? JSON.parse(savedQuestions) : [];
  });
  const [input, setInput] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [filter, setFilter] = useState('all');
  const [suggestions, setSuggestions] = useState([]);

  const tags = ['Coding', 'Placements', 'Subject Help', 'College Life', 'Campus Events', 'Internships'];

  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(questions));
  }, [questions]);

  const addQuestion = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Check for duplicate questions
    const isDuplicate = questions.some(q => 
      q.text.toLowerCase() === input.toLowerCase()
    );

    if (isDuplicate) {
      alert('Similar question already exists!');
      return;
    }

    const newQuestion = {
      id: Date.now(),
      text: input,
      votes: 0,
      tags: selectedTags,
      answers: [],
      createdAt: new Date().toISOString(),
      author: 'Anonymous Student'
    };

    setQuestions([newQuestion, ...questions]);
    setInput('');
    setSelectedTags([]);
  };

  const upvote = (id) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, votes: q.votes + 1 } : q
    ));
  };

  const addAnswer = (questionId, answer) => {
    if (!answer.trim()) return;
    setQuestions(questions.map(q =>
      q.id === questionId
        ? { ...q, answers: [...q.answers, { text: answer, votes: 0 }] }
        : q
    ));
  };

  const upvoteAnswer = (questionId, answerIndex) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? {
            ...q,
            answers: q.answers.map((a, i) =>
              i === answerIndex ? { ...a, votes: a.votes + 1 } : a
            )
          }
        : q
    ));
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredQuestions = questions.filter(q => {
    if (filter === 'all') return true;
    if (filter === 'answered') return q.answers.length > 0;
    if (filter === 'unanswered') return q.answers.length === 0;
    return q.tags.includes(filter);
  });

  return (
    <div className="container">
      <h1>🎓 College Q&A Forum</h1>
      
      <form onSubmit={addQuestion} className="input-section">
        <input
          type="text"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="question-input"
        />
        <button type="submit" className="ask-button">Ask Question</button>
      </form>

      <div className="tags-section">
        <h3>Select Tags:</h3>
        <div className="tags-container">
          {tags.map(tag => (
            <button
              key={tag}
              className={`tag-button ${selectedTags.includes(tag) ? 'selected' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All Questions
        </button>
        <button 
          className={filter === 'answered' ? 'active' : ''} 
          onClick={() => setFilter('answered')}
        >
          Answered
        </button>
        <button 
          className={filter === 'unanswered' ? 'active' : ''} 
          onClick={() => setFilter('unanswered')}
        >
          Unanswered
        </button>
      </div>

      <div className="questions-list">
        {filteredQuestions.map(q => (
          <div key={q.id} className="question-item">
            <div className="question-header">
              <div className="question-text">{q.text}</div>
              <div className="question-meta">
                <span className="author">By: {q.author}</span>
                <span className="date">
                  {new Date(q.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="question-tags">
              {q.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>

            <div className="question-actions">
              <button onClick={() => upvote(q.id)} className="vote-button">
                👍 {q.votes}
              </button>
            </div>

            <div className="answers-section">
              <h4>Answers ({q.answers.length})</h4>
              {q.answers.map((answer, index) => (
                <div key={index} className="answer-item">
                  <div className="answer-text">{answer.text}</div>
                  <button 
                    onClick={() => upvoteAnswer(q.id, index)}
                    className="vote-button"
                  >
                    👍 {answer.votes}
                  </button>
                </div>
              ))}
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const answer = e.target.answer.value;
                  addAnswer(q.id, answer);
                  e.target.answer.value = '';
                }}
                className="answer-form"
              >
                <input
                  type="text"
                  name="answer"
                  placeholder="Write your answer..."
                  className="answer-input"
                />
                <button type="submit" className="submit-answer">Submit Answer</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 