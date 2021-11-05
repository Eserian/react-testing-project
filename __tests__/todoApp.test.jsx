import React from 'react';
import '@testing-library/jest-dom';
import App from '@hexlet/react-todo-app-with-backend';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import server from '../mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
beforeEach(() => render(<App />));

it('should render page', () => {
  expect(screen.getByRole('textbox', { name: 'New list' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'add list' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'New task' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
});

it('should interact with tasks', async () => {
  userEvent.type(screen.getByRole('textbox', { name: 'New list' }), 'primary');
  userEvent.click(screen.getByRole('button', { name: 'add list' }));
  const primaryList = await screen.findByRole('button', { name: 'primary' });
  expect(primaryList).toBeInTheDocument();

  userEvent.type(screen.getByRole('textbox', { name: 'New task' }), 'first task');
  userEvent.click(screen.getByRole('button', { name: 'Add' }));
  const newTaskCheckbox = await screen.findByRole('checkbox', { name: 'first task' });
  expect(newTaskCheckbox).not.toBeChecked();

  userEvent.click(newTaskCheckbox);
  await waitFor(() => {
    expect(newTaskCheckbox).toBeChecked();
  });

  userEvent.click(screen.getByRole('button', { name: 'Remove' }));
  await waitFor(() => {
    expect(newTaskCheckbox).not.toBeInTheDocument();
  });
});
