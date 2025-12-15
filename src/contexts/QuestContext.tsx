import React, { useState, useEffect } from 'react';
import { Quest, QuestLine, Subtask } from '@/types/quest';
import { useAuth } from './AuthContext';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { LocalNotifications } from '@capacitor/local-notifications';
import { QuestContext } from '@/hooks/useQuests';

type AddQuestLine = Omit<QuestLine, 'id'>;
type AddQuest = Omit<Quest, 'id' | 'subtasks' | 'isCompleted'>;
type AddSubtask = Omit<Subtask, 'id' | 'isCompleted'>;

export interface QuestContextType {
  questLines: QuestLine[];
  quests: Quest[];
  loading: boolean;
  addQuestLine: (questLine: AddQuestLine) => void;
  addQuest: (quest: AddQuest) => void;
  addSubtask: (questId: string, subtask: AddSubtask) => void;
  toggleQuest: (questId: string) => void;
  toggleSubtask: (questId: string, subtaskId: string) => void;
  deleteQuestLine: (questLineId: string) => void;
  deleteQuest: (questId: string) => void;
  deleteSubtask: (questId: string, subtaskId: string) => void;
}

export const QuestProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [questLines, setQuestLines] = useState<QuestLine[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const { user } = useAuth();

  // Request notification permissions on mount
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const result = await LocalNotifications.requestPermissions();
        setNotificationPermission(result.display === 'granted');
      } catch (error) {
        console.error('Error requesting notification permissions:', error);
      }
    };
    requestPermissions();
  }, []);

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

  const getNotificationId = (questId: string): number => {
    let hash = 0;
    for (let i = 0; i < questId.length; i++) {
      const char = questId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash) % 2147483647;
  };

  const scheduleNotification = async (quest: Quest) => {
    if (!notificationPermission || !quest.deadline) return;

    try {
      const deadlineDate = new Date(quest.deadline);
      const now = new Date(Date.now());

      if (deadlineDate <= now) return;

      const notificationTime = new Date(deadlineDate.getTime() - 60 * 60 * 1000);
      const scheduleTime = notificationTime > now
        ? notificationTime
        : new Date(now.getTime() + 1000);

      const notificationId = getNotificationId(quest.id);

      await LocalNotifications.schedule({
        notifications: [
          {
            id: notificationId,
            title: 'Připomínka termínu questu',
            body: `Quest "${quest.title}" brzy vyprší!`,
            schedule: { at: scheduleTime },
            smallIcon: 'ic_launcher',
          },
        ],
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const cancelNotification = async (questId: string) => {
    try {
      const notificationId = getNotificationId(questId);
      await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  };

  const calculateQuestCompletion = (subtasks: Subtask[]): boolean => {
    if (subtasks.length === 0) return false;
    const requiredSubtasks = subtasks.filter(st => !st.isOptional);

    return requiredSubtasks.length === 0
      ? subtasks.every(st => st.isCompleted)
      : requiredSubtasks.every(st => st.isCompleted);
  };

  const addQuest = async (quest: AddQuest) => {
    if (!user) return;

    const id = crypto.randomUUID();
    const newQuest: Quest = {
      ...quest,
      id,
      subtasks: [],
      isCompleted: false,
    };

    try {
      await FirebaseFirestore.setDocument({
        reference: `users/${user.uid}/quests/${id}`,
        data: newQuest,
      });

      if (newQuest.deadline) {
        await scheduleNotification(newQuest);
      }
    } catch (error) {
      console.error('Error adding quest:', error);
    }
  };

  const addSubtask = async (questId: string, subtask: AddSubtask) => {
    if (!user) return;

    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    const newSubtask: Subtask = {
      ...subtask,
      id: crypto.randomUUID(),
      isCompleted: false,
    };

    const updatedQuest = {
      ...quest,
      subtasks: [...quest.subtasks, newSubtask],
    };

    try {
      await FirebaseFirestore.setDocument({
        reference: `users/${user.uid}/quests/${questId}`,
        data: updatedQuest,
      });
    } catch (error) {
      console.error('Error adding subtask:', error);
    }
  };

  const toggleQuest = async (questId: string) => {
    if (!user) return;

    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    const wasCompleted = quest.isCompleted;
    const isNowCompleted = !wasCompleted;

    const updatedQuest = {
      ...quest,
      isCompleted: isNowCompleted,
    };

    try {
      await FirebaseFirestore.setDocument({
        reference: `users/${user.uid}/quests/${questId}`,
        data: updatedQuest,
      });
      if (isNowCompleted && !wasCompleted) {
        await cancelNotification(questId);
      }
    } catch (error) {
      console.error('Error toggling quest:', error);
    }
  };

  const toggleSubtask = async (questId: string, subtaskId: string) => {
    if (!user) return;

    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    const updatedSubtasks = quest.subtasks.map(st =>
      st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st
    );

    const wasCompleted = quest.isCompleted;
    const isNowCompleted = calculateQuestCompletion(updatedSubtasks);

    const updatedQuest = {
      ...quest,
      subtasks: updatedSubtasks,
      isCompleted: isNowCompleted,
    };

    try {
      await FirebaseFirestore.setDocument({
        reference: `users/${user.uid}/quests/${questId}`,
        data: updatedQuest,
      });
      if (isNowCompleted && !wasCompleted) {
        await cancelNotification(questId);
      }
    } catch (error) {
      console.error('Error toggling subtask:', error);
    }
  };

  const deleteQuestLine = async (questLineId: string) => {
    if (!user) return;

    try {
      const questsToDelete = quests.filter(q => q.questLineId === questLineId);
      await Promise.all(questsToDelete.map(quest => deleteQuest(quest.id)));
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
      await cancelNotification(questId);
      await FirebaseFirestore.deleteDocument({
        reference: `users/${user.uid}/quests/${questId}`,
      });
    } catch (error) {
      console.error('Error deleting quest:', error);
    }
  };

  const deleteSubtask = async (questId: string, subtaskId: string) => {
    if (!user) return;

    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    const updatedSubtasks = quest.subtasks.filter(st => st.id !== subtaskId);
    const wasCompleted = quest.isCompleted;
    const isNowCompleted = calculateQuestCompletion(updatedSubtasks);

    const updatedQuest = {
      ...quest,
      subtasks: updatedSubtasks,
      isCompleted: isNowCompleted,
    };

    try {
      await FirebaseFirestore.setDocument({
        reference: `users/${user.uid}/quests/${questId}`,
        data: updatedQuest,
      });
      if (isNowCompleted && !wasCompleted) {
        await cancelNotification(questId);
      }
    } catch (error) {
      console.error('Error deleting subtask:', error);
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
        addSubtask,
        toggleQuest,
        toggleSubtask,
        deleteQuestLine,
        deleteQuest,
        deleteSubtask,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
};
