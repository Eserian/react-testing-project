/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import { rest } from 'msw';
import { uniqueId } from 'lodash';

export default [
  rest.post('/api/v1/lists/:listId/tasks', (req, res, ctx) => {
    const { listId } = req.params;
    const newTask = {
      completed: false,
      id: uniqueId(),
      listId,
      text: req.body.text,
      touched: 1636139229324,
    };

    const savedTasks = JSON.parse(sessionStorage.getItem('tasks')) || [];

    sessionStorage.setItem('tasks', JSON.stringify([...savedTasks, newTask]));

    return res(
      ctx.status(201),
      ctx.json(newTask),
    );
  }),
  rest.patch('/api/v1/tasks/:id', (req, res, ctx) => {
    const { id } = req.params;
    const { completed } = req.body;

    const savedTasks = JSON.parse(sessionStorage.getItem('tasks'));
    const task = savedTasks.find((t) => t.id === id);
    const newTask = { ...task, completed };
    const tasksWithoutUpdated = savedTasks.filter((t) => t.id !== id);

    sessionStorage.setItem('tasks', JSON.stringify([...tasksWithoutUpdated, newTask]));

    return res(
      ctx.status(201),
      ctx.json(newTask),
    );
  }),
  rest.delete('/api/v1/tasks/:id', (req, res, ctx) => res(
    ctx.status(204),
  )),
  rest.post('/api/v1/lists', (req, res, ctx) => {
    const { name } = req.body;

    const newList = {
      id: uniqueId(),
      name,
      removable: true,
    };

    const savedLists = JSON.parse(sessionStorage.getItem('lists')) || [];

    sessionStorage.setItem('lists', JSON.stringify([...savedLists, newList]));

    return res(
      ctx.status(201),
      ctx.json(newList),
    );
  }),
];
