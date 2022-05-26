import React from 'react';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import TodoItem from './components/TodoItem';

export interface Todo {
	id: string;
	text: string;
	done: boolean;
}

function App() {
	const [todoResults, setTodoResults] = useState([]);
	const [filteredTodos, setFilteredTodos] = useState([]);
	const [filterDone, setFilterDone] = useState(false);
	const [filterNotDone, setFilterNotDone] = useState(false);
	const [todoText, setTodoText] = useState('');

	// get todos

	const fetchTodos = () => {
		fetch('http://localhost:3001/todos')
			.then((res) => res.json())
			.then((result) => setTodoResults(result))
			.catch((e) => console.error(e));
	};

	useEffect(() => {
		fetchTodos();
	}, []);

	// filters

	useEffect(() => {
		if (filterDone && filterNotDone) {
			setFilteredTodos(todoResults);
		} else if (filterDone) {
			setFilteredTodos(todoResults?.filter((todo: Todo) => todo.done === true));
		} else if (filterNotDone) {
			setFilteredTodos(
				todoResults?.filter((todo: Todo) => todo.done === false)
			);
		} else {
			setFilteredTodos(todoResults);
		}
	}, [todoResults, filterDone, filterNotDone]);

	const handleMatch = (value: string): void => {
		const matchedTodos = todoResults?.filter((todo: Todo) =>
			todo.text.includes(value)
		);
		setFilteredTodos(matchedTodos);
		if (!value) {
			setFilteredTodos(todoResults);
		}
	};

	// add todo

	const addTodo = (text: string) => {
		fetch('http://localhost:3001/todos', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id: uuidv4(), text, done: false }),
		})
			.then((res) => res.json())
			.then((result: Todo) => setTodoResults([...todoResults, result] as any))
			.catch((e) => console.error(e));
	};

	const handleSubmit = (e: { preventDefault: () => void }) => {
		e.preventDefault();
		if (!todoText) return;
		addTodo(todoText);
		setTodoText('');
	};

	// update todo

	const updateTodo = (id: string, text: string, done: boolean) => {
		fetch(`http://localhost:3001/todos/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id, text, done }),
		})
			.then((res) => res.json())
			.then(() => fetchTodos())
			.catch((e) => console.error(e));
	};

	// delete todo

	const deleteTodo = (id: string) => {
		fetch(`http://localhost:3001/todos/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id }),
		})
			.then((res) => res.json())
			.then(() => fetchTodos())
			.catch((e) => console.error(e));
	};

	return (
		<div className="content-container">
			<header className="header">
				<h1>Annie's Todo App 🐱</h1>
			</header>

			<div className="filter-section">
				<h2>Filters:</h2>
				<button
					className={filterDone ? 'done' : ''}
					onClick={() => setFilterDone(!filterDone)}
				>
					Show done
				</button>
				<button
					className={filterNotDone ? 'done' : ''}
					onClick={() => setFilterNotDone(!filterNotDone)}
				>
					Show not done
				</button>

				<input
					placeholder="type to filter..."
					onChange={(e) => handleMatch(e.target.value)}
				/>
			</div>
			<ul>
				<form onSubmit={handleSubmit}>
					<input
						className="todo--add"
						placeholder="type to add todo"
						value={todoText}
						onChange={(e) => setTodoText(e.target.value)}
					/>
					<button type="submit">Add</button>
				</form>
				{filteredTodos.map((todo: Todo) => (
					<TodoItem
						key={todo.id}
						id={todo.id}
						text={todo.text}
						done={todo.done}
						updateTodo={(id: string, text: string, done: boolean) =>
							updateTodo(id, text, done)
						}
						deleteTodo={(id: string) => deleteTodo(id)}
					/>
				))}
			</ul>
		</div>
	);
}

export default App;
