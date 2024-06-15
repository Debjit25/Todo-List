import React, { useState, useEffect } from 'react';
import { TodoForm } from './TodoForm';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from './Todo';
import { EditTodoForm } from './EditTodoForm';

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [filterCompleted, setFilterCompleted] = useState('all'); // 'all', 'completed', 'incomplete'

  useEffect(() => {
    // Example: Load todos from localStorage or an API
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(savedTodos);
  }, []);

  // Function to add a new todo
  const addTodo = (todo) => {
    setTodos([
      ...todos,
      { id: uuidv4(), task: todo, completed: false, isEditing: false },
    ]);
    localStorage.setItem('todos', JSON.stringify([...todos, { id: uuidv4(), task: todo, completed: false, isEditing: false }]))
  }

  // Function to delete a todo
  const deleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  }

  // Function to toggle completion status of a todo
  const toggleComplete = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  }

  // Function to toggle edit mode for a todo
  const editTodo = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
    );
    setTodos(updatedTodos);
  }

  // Function to edit task content of a todo
  const editTask = (task, id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, task, isEditing: false } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  }

  // Function to handle sorting
  const handleSort = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    const sortedTodos = [...todos].sort((a, b) => {
      const taskA = a.task.toLowerCase();
      const taskB = b.task.toLowerCase();
      if (newSortOrder === 'asc') {
        return taskA.localeCompare(taskB);
      } else {
        return taskB.localeCompare(taskA);
      }
    });
    setTodos(sortedTodos);
  }

  // Function to handle filtering
  const handleFilter = (filter) => {
    setFilterCompleted(filter);
  }

  // Filtered todos based on completion status
  const filteredTodos = todos.filter(todo => {
    if (filterCompleted === 'completed') {
      return todo.completed;
    } else if (filterCompleted === 'incomplete') {
      return !todo.completed;
    } else {
      return true; // 'all' filter, show all todos
    }
  });

  return (
    <div className="TodoWrapper">
      <h1>Get Things Done!</h1>
      <TodoForm addTodo={addTodo} />
      
      {/* Sorting and Filtering Controls */}
      <div className='btnfn'>
        <button onClick={handleSort}> Sort ({sortOrder})</button>
        <button onClick={() => handleFilter('all')}>All</button>
        <button onClick={() => handleFilter('completed')}>Completed</button>
        <button onClick={() => handleFilter('incomplete')}>Incomplete</button>
      </div>

      {/* Displaying Todos */}
      {filteredTodos.map(todo =>
        todo.isEditing ? (
          <EditTodoForm key={todo.id} editTodo={editTask} task={todo} />
        ) : (
          <Todo
            key={todo.id}
            task={todo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            toggleComplete={toggleComplete}
          />
        )
      )}
    </div>
  );
};
