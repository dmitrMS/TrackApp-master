import * as React from 'react';
import renderer from 'react-test-renderer';
// import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '@/app/(tabs)/index';

import { ThemedText } from '../ThemedText';

it(`renders correctly`, () => {
  const tree = renderer.create(<ThemedText>Snapshot test!</ThemedText>).toJSON();

  expect(tree).toMatchSnapshot();
});

describe('HomeScreen Component', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<HomeScreen />);

    expect(getByText('Система для Трэкинга времени')).toBeTruthy();
    expect(getByPlaceholderText('Введите Название проекта')).toBeTruthy();
  });

  it('starts and stops the timer correctly', async () => {
    const { getByText, getByPlaceholderText } = render(<HomeScreen />);

    // Enter a project name
    const input = getByPlaceholderText('Введите Название проекта');
    fireEvent.changeText(input, 'Test Project');

    // Start the timer
    const startButton = getByText('Запустить таймер');
    fireEvent.press(startButton);

    // Check if timer started
    // expect(getByText(/Текущее время: 00:00:01/)).toBeTruthy();

    // Wait a bit before stopping
    await waitFor(() => new Promise((r) => setTimeout(r, 1100)));

    // Stop the timer
    fireEvent.press(getByText('Остановить таймер и добавить'));

    // Check if project is added
    expect(getByText('Test Project - 00:00:01')).toBeTruthy();
  });

  it('does not add project without a name', () => {
    const { getByText } = render(<HomeScreen />);

    // Start the timer without a project name
    fireEvent.press(getByText('Запустить таймер'));
    fireEvent.press(getByText('Остановить таймер и добавить'));

    // No projects should be added
    expect(getByText('Нет проектов')).toBeTruthy();
  });
});