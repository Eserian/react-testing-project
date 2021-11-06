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

const addTask = async (taskName) => {
  userEvent.type(screen.getByRole('textbox', { name: 'New task' }), taskName);
  userEvent.click(screen.getByRole('button', { name: 'Add' }));
  await waitFor(() => {
    expect(screen.getByRole('checkbox', { name: taskName })).toBeInTheDocument();
  });
};

const addList = async (listName) => {
  userEvent.type(screen.getByRole('textbox', { name: 'New list' }), listName);
  userEvent.click(screen.getByRole('button', { name: 'add list' }));
  await waitFor(() => {
    expect(screen.getByRole('button', { name: listName })).toBeInTheDocument();
  });
};

it('should render page', () => {
  expect(screen.getByRole('textbox', { name: 'New list' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'add list' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'New task' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
});

it('should interact with tasks', async () => {
  await addList('primary');
  await addTask('first task');

  const newTaskCheckbox = screen.getByRole('checkbox', { name: 'first task' });
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

it('should not create lists with the same name', async () => {
  await addList('new list');
  await addList('new list');
  const invalidFeedback = await screen.findByText(/new list already exists/i);
  expect(invalidFeedback).toBeInTheDocument();
});

it('should delete tasks with list', async () => {
  await addList('new list');
  await addTask('first task');
  await addTask('second task');
  const firstTask = screen.getByRole('checkbox', { name: 'first task' });
  const secondTask = screen.getByRole('checkbox', { name: 'second task' });

  const removeListBtn = screen.getByRole('button', { name: 'remove list' });
  userEvent.click(removeListBtn);
  await waitFor(() => {
    expect(removeListBtn).not.toBeInTheDocument();
  });

  await addList('new list');
  expect(firstTask).not.toBeInTheDocument();
  expect(secondTask).not.toBeInTheDocument();
});

it('should not affect other lists', async () => {
  await addList('new list');
  await addTask('first list task');

  const newList = screen.getByRole('button', { name: 'new list' });
  const firstTask = screen.getByRole('checkbox', { name: 'first list task' });

  await addList('another list');
  await addTask('another list task');

  const anotherFirstTask = screen.getByRole('checkbox', { name: 'another list task' });

  userEvent.click(anotherFirstTask);
  await waitFor(() => {
    expect(anotherFirstTask).toBeChecked();
  });

  userEvent.click(newList);
  await waitFor(() => {
    expect(firstTask).not.toBeChecked();
  });
});
