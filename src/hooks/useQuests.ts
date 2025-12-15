import { QuestContextType } from "@/contexts/QuestContext";
import { createContext, useContext } from "react";

export const QuestContext = createContext<QuestContextType | undefined>(undefined);

export const useQuests = () => {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error('useQuests must be used within a QuestProvider');
  }
  return context;
};
