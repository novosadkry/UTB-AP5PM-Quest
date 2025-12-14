import React, { createContext, useContext, useState, useEffect } from 'react';
import { Quest, QuestLine, Task } from '@/types/quest';
import { useAuth } from './AuthContext';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';

type AddQuestLine = Omit<QuestLine, 'id'>;
type AddQuest = Omit<Quest, 'id' | 'tasks' | 'isCompleted'>;
type AddTask = Omit<Task, 'id' | 'isCompleted'>;

interface QuestContextType {
  questLines: QuestLine[];
  quests: Quest[];
  loading: boolean;
  addQuestLine: (questLine: AddQuestLine) => void;
  addQuest: (quest: AddQuest) => void;
  addTask: (questId: string, task: AddTask) => void;
  toggleTask: (questId: string, taskId: string) => void;
  deleteQuestLine: (questLineId: string) => void;
  deleteQuest: (questId: string) => void;
  deleteTask: (questId: string, taskId: string) => void;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export const QuestProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [questLines, setQuestLines] = useState<QuestLine[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setQuestLines([]);
      setQuests([]);
      setLoading(false);
      return;
    }

    let questLinesCallbackId: string | undefined;
    let questsCallbackId: string | undefined;

    const setupListeners = async () => {
      try {
        // Listen to quest lines changes
        const qlId = await FirebaseFirestore.addCollectionSnapshotListener({
          reference: `users/${user.uid}/questLines`,
        }, (event) => {
          if (event && event.snapshots) {
            setQuestLines(event.snapshots.map((snapshot) => ({
              id: snapshot.id,
              ...snapshot.data,
            } as QuestLine)));
          }
        });
        questLinesCallbackId = qlId;

        // Listen to quests changes
        const qId = await FirebaseFirestore.addCollectionSnapshotListener({
          reference: `users/${user.uid}/quests`,
        }, (event) => {
          if (event && event.snapshots) {
            setQuests(event.snapshots.map((snapshot) => ({
              id: snapshot.id,
              ...snapshot.data,
            } as Quest)));
          }
          setLoading(false);
        });
        questsCallbackId = qId;
      } catch (error) {
        console.error('Error setting up listeners:', error);
        setLoading(false);
      }
    };

    setupListeners();

    return () => {
      if (questLinesCallbackId) {
        FirebaseFirestore.removeSnapshotListener({ callbackId: questLinesCallbackId });
      }
      if (questsCallbackId) {
        FirebaseFirestore.removeSnapshotListener({ callbackId: questsCallbackId });
      }
    };
  }, [user]);

  const addQuestLine = async (questLine: AddQuestLine) => {
    if (!user) return;

    const id = crypto.randomUUID();
    const newQuestLine: QuestLine = {
      ...questLine,
      id,
    };

    try {
      await FirebaseFirestore.setDocument({
        reference: `users/${user.uid}/questLines/${id}`,
        data: newQuestLine,
      });
    } catch (error) {
      console.error('Error adding quest line:', error);
    }
  };

  const addQuest = async (quest: AddQuest) => {
    if (!user) return;

    const id = crypto.randomUUID();
    const newQuest: Quest = {
      ...quest,
      id,
      tasks: [],
      isCompleted: false,
    };

    try {
      await FirebaseFirestore.setDocument({
        reference: `users/${user.uid}/quests/${id}`,
        data: newQuest,
      });
    } catch (error) {
      console.error('Error adding quest:', error);
    }
  };

  const addTask = async (questId: string, task: AddTask) => {
    if (!user) return;

    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      isCompleted: false,
    };

    const updatedQuest = {
      ...quest,
      tasks: [...quest.tasks, newTask],
    };

    try {
      await FirebaseFirestore.setDocument({
        reference: `users/${user.uid}/quests/${questId}`,
        data: updatedQuest,
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (questId: string, taskId: string) => {
    if (!user) return;

    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    const updatedTasks = quest.tasks.map(t =>
      t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
    );
    const requiredTasks = updatedTasks.filter(t => !t.isOptional);
    const allRequiredCompleted = requiredTasks.length === 0
      ? updatedTasks.length > 0 && updatedTasks.every(t => t.isCompleted)
      : requiredTasks.every(t => t.isCompleted);

    const updatedQuest = {
      ...quest,
      tasks: updatedTasks,
      isCompleted: allRequiredCompleted,
    };

    try {
      await FirebaseFirestore.setDocument({
        reference: `users/${user.uid}/quests/${questId}`,
        data: updatedQuest,
      });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteQuestLine = async (questLineId: string) => {
    if (!user) return;

    try {
      await FirebaseFirestore.deleteDocument({
        reference: `users/${user.uid}/questLines/${questLineId}`,
      });
    } catch (error) {
      console.error('Error deleting quest line:', error);
    }
  };

  const deleteQuest = async (questId: string) => {
    if (!user) return;

    try {
      await FirebaseFirestore.deleteDocument({
        reference: `users/${user.uid}/quests/${questId}`,
      });
    } catch (error) {
      console.error('Error deleting quest:', error);
    }
  };

  const deleteTask = async (questId: string, taskId: string) => {
    if (!user) return;

    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    const updatedQuest = {
      ...quest,
      tasks: quest.tasks.filter(t => t.id !== taskId),
    };

    try {
      await FirebaseFirestore.setDocument({
        reference: `users/${user.uid}/quests/${questId}`,
        data: updatedQuest,
      });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <QuestContext.Provider
      value={{
        questLines,
        quests,
        loading,
        addQuestLine,
        addQuest,
        addTask,
        toggleTask,
        deleteQuestLine,
        deleteQuest,
        deleteTask,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
};

export const useQuests = () => {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error('useQuests must be used within a QuestProvider');
  }
  return context;
};
