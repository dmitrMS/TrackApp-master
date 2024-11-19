import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  TextInput,
  StyleSheet,
  Platform,
  Button,
  FlatList,
  View,
  useColorScheme,
} from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type Project = {
  id: string;
  name: string;
  elapsedTime: string;
};

export default function HomeScreen() {
  const [projectName, setProjectName] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const colorScheme = useColorScheme();

  // Функция для запуска и остановки таймера
  const toggleTimer = () => {
    if (isRunning) {
      // Остановка таймера и добавление проекта с временем
      clearInterval(intervalRef.current!);
      addProject();
    } else {
      // Запуск таймера
      setElapsedTime(0); // Сброс времени
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    setIsRunning(!isRunning);
  };

  // Функция для добавления нового проекта с прошедшим временем
  const addProject = () => {
    if (projectName.trim()) {
      setProjects((prevProjects) => [
        ...prevProjects,
        {
          id: Date.now().toString(),
          name: projectName,
          elapsedTime: formatTime(elapsedTime),
        },
      ]);
      setProjectName(''); // Очистить поле ввода
      setElapsedTime(0); // Сброс времени
    }
  };

  // Форматирование времени (секунды -> HH:MM:SS)
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Динамические стили, адаптированные к теме
  const themeStyles = {
    input: {
      ...styles.input,
      backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      borderColor: colorScheme === 'dark' ? '#666' : '#ddd',
    },
    projectItem: {
      ...styles.projectItem,
      backgroundColor: colorScheme === 'dark' ? '#444' : '#f0f0f0',
    },
    emptyText: {
      ...styles.emptyText,
      color: colorScheme === 'dark' ? '#aaa' : '#888',
    },
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Система для Трэкинга времени</ThemedText>
        <HelloWave />
      </ThemedView>
      
      {/* Поле ввода для названия проекта */}
      <TextInput
        style={themeStyles.input}
        placeholder="Введите Название проекта"
        placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#888'}
        value={projectName}
        onChangeText={setProjectName}
      />

      {/* Визуализация таймера */}
      <ThemedText style={styles.timerText}>
        {isRunning ? `Текущее время: ${formatTime(elapsedTime)}` : 'Таймер остановлен'}
      </ThemedText>

      <Button title={isRunning ? 'Остановить таймер и добавить' : 'Запустить таймер'} onPress={toggleTimer} />

      {/* Список проектов */}
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={themeStyles.projectItem}>
            <ThemedText>{item.name} - {item.elapsedTime}</ThemedText>
          </ThemedView>
        )}
        ListEmptyComponent={<ThemedText style={themeStyles.emptyText}>Нет проектов</ThemedText>}
      />
      {/* Остальные компоненты */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 8,
    marginVertical: 10,
    borderRadius: 5,
  },
  timerText: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10,
    color: 'blue',
  },
  projectItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
  },
});
