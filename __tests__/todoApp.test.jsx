import React from 'react';
import '@testing-library/jest-dom';
import App from '@hexlet/react-todo-app-with-backend';
import { render, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';
import handlers from '../mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
beforeEach(() => render(<App />));

const addTask = async (taskName) => {
  userEvent.type(screen.getByRole('textbox', { name: /^new task$/i }), taskName);
  userEvent.click(screen.getByRole('button', { name: /^add$/i }));
};

const addList = async (listName) => {
  userEvent.type(screen.getByRole('textbox', { name: /^new list$/i }), listName);
  userEvent.click(screen.getByRole('button', { name: /^add list$/i }));
};

describe('tasks', () => {
  it('should toggle tasks state', async () => {
    addList('primary');
    await screen.findByRole('button', { name: /primary/i });
    addTask('first task');
    const firstTaskCheckbox = await screen.findByRole('checkbox', { name: /first task/i });
    addTask('second task');
    const secondTaskCheckbox = await screen.findByRole('checkbox', { name: /second task/i });
    expect(firstTaskCheckbox).not.toBeChecked();
    expect(secondTaskCheckbox).not.toBeChecked();

    userEvent.click(firstTaskCheckbox);
    await waitFor(() => {
      expect(firstTaskCheckbox).toBeChecked();
    });
    expect(secondTaskCheckbox).not.toBeChecked();
  });

  it('should delete task', async () => {
    addList('primary');
    await screen.findByRole('button', { name: /primary/i });
    addTask('first task');
    const firstTask = await screen.findByRole('checkbox', { name: /first task/i });
    addTask('second task');
    const secondTask = await screen.findByRole('checkbox', { name: /second task/i });

    const deleteFirstTaskBtn = screen.getAllByRole('button', { name: /remove/i })[1];
    userEvent.click(deleteFirstTaskBtn);
    await waitFor(() => {
      expect(firstTask).not.toBeInTheDocument();
    });
    expect(secondTask).toBeInTheDocument();
  });
});

describe('lists', () => {
  it('should not create lists with the same name', async () => {
    addList('new list');
    await screen.findByRole('button', { name: /new list/i });
    addList('new list');
    const invalidFeedback = await screen.findByText(/new list already exists/i);
    expect(invalidFeedback).toBeInTheDocument();
  });

  it('should delete tasks with list', async () => {
    addList('new list');
    const list = await screen.findByRole('button', { name: /new list/i });
    addTask('first task');
    const firstTask = await screen.findByRole('checkbox', { name: /first task/i });
    addTask('second task');
    const secondTask = await screen.findByRole('checkbox', { name: /second task/i });

    const removeListBtn = screen.getByRole('button', { name: /remove list/i });
    userEvent.click(removeListBtn);
    await waitFor(() => {
      expect(list).not.toBeInTheDocument();
    });

    addList('new list');
    await screen.findByRole('button', { name: /new list/i });
    expect(firstTask).not.toBeInTheDocument();
    expect(secondTask).not.toBeInTheDocument();
  });

  it('should not affect other lists', async () => {
    addList('new list');
    const newList = await screen.findByRole('button', { name: /new list/i });

    addTask('first list task');
    const firstTask = await screen.findByRole('checkbox', { name: /first list task/i });

    addList('another list');
    await screen.findByRole('button', { name: /another list/i });
    addTask('another list task');

    const anotherFirstTask = await screen.findByRole('checkbox', { name: /another list task/i });

    userEvent.click(anotherFirstTask);
    await waitFor(() => {
      expect(anotherFirstTask).toBeChecked();
    });

    userEvent.click(newList);
    await waitFor(() => {
      expect(firstTask).not.toBeChecked();
    });
  });
});
