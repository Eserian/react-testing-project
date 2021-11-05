import React from 'react';
import '@testing-library/jest-dom';
import App from '@hexlet/react-todo-app-with-backend';
import { render, screen } from '@testing-library/react';

test('should render page', () => {
  render(<App />);
	expect(screen.getByRole('textbox', { name: 'New list'})).toBeInTheDocument();
	expect(screen.getByRole('button', { name: 'add list'})).toBeInTheDocument();
	expect(screen.getByRole('textbox', { name: 'New task'})).toBeInTheDocument();
	expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
});
