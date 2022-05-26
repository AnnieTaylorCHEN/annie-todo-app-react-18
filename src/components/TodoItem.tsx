import React, { useState } from 'react';
import './TodoItem.css';

interface TodoItemProps {
	id: string;
	text: string;
	done: boolean;
	updateTodo: (id: string, text: string, done: boolean) => void;
	deleteTodo: (id: string) => void;
}

const TodoItem = ({
	id,
	text,
	done,
	updateTodo,
	deleteTodo,
}: TodoItemProps) => {

	return (
		<li>
			{done ? <span className="done">{text}</span> : <span>{text}</span>}
			<div>
				<button
					className={done ? 'done' : ''}
					aria-label="toggle to mark task as done or not done"
					onClick={() => {
						updateTodo(id, text, !done);
					}}
				>
					&#10003;
				</button>

				<button
					className="delete"
					aria-label="delete"
					onClick={() => {
						deleteTodo(id);
					}}
				>
					{' '}
					&#215;
				</button>
			</div>
		</li>
	);
};

export default TodoItem;
