import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [apiUrl, setApiUrl] = useState('http://localhost:4000/todos');

  // Load configuration from config.json
  useEffect(() => {
    fetch('/config.json')
      .then(response => response.json())
      .then(config => {
        // Check if it's still a placeholder (for local development)
        if (config.API_URL === 'REACT_APP_API_URL_PLACEHOLDER') {
          setApiUrl('http://localhost:4000/todos');
        } else {
          setApiUrl(config.API_URL);
        }
      })
      .catch(() => {
        // Fallback to default if config.json fails to load
        setApiUrl('http://localhost:4000/todos');
      });
  }, []);

  // Fetch all todos
  useEffect(() => {
    if (!apiUrl) return; // Wait for API URL to be loaded
    
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching todos:', error));
  }, [apiUrl]);

  // Add a new todo
  const addTodo = () => {
    if (!newTodo.trim()) return;

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodo, completed: false })
    })
      .then(response => response.json())
      .then(todo => setTodos([...todos, todo]))
      .catch(error => console.error('Error adding todo:', error));

    setNewTodo('');
  };

  // Update a todo
  const updateTodo = (id, updatedFields) => {
    fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields)
    })
      .then(response => response.json())
      .then(updatedTodo => {
        setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
      })
      .catch(error => console.error('Error updating todo:', error));
  };

  // Delete a todo
  const deleteTodo = id => {
    fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(error => console.error('Error deleting todo:', error));
  };

  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>TODO App</h1>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          style={{ flex: 1, padding: '10px', fontSize: '16px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button
          onClick={addTodo}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li
            key={todo.id}
            style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={e => updateTodo(todo.id, { completed: e.target.checked })}
              style={{ marginRight: '10px' }}
            />
            <span style={{ flex: 1, textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#888' : '#000' }}>
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{ padding: '5px 10px', fontSize: '14px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
