import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonList,
  IonCard,
  IonCardContent,
  IonButton,
  IonItem,
  IonLabel,
  IonBadge,
  IonAccordion,
  IonAccordionGroup,
  IonCheckbox,
} from '@ionic/react';
import { add, checkmark } from 'ionicons/icons';
import { useQuests } from '@/contexts/QuestContext';
import QuestModal from '@/components/QuestModal';
import TaskModal from '@/components/TaskModal';

const QuestsTab: React.FC = () => {
  const { questLines, quests, toggleTask } = useQuests();
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  const openTaskModal = (questId: string) => {
    setSelectedQuestId(questId);
    setShowTaskModal(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Questy</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Questy</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonAccordionGroup>
          {quests.map((quest) => {
            const completedTasks = quest.tasks.filter((t) => t.isCompleted).length;
            const totalTasks = quest.tasks.length;
            const requiredTasks = quest.tasks.filter((t) => !t.isOptional);
            const completedRequired = requiredTasks.filter((t) => t.isCompleted).length;
            const questLine = questLines.find((ql) => ql.id === quest.questLineId);

            return (
              <IonAccordion key={quest.id} value={quest.id}>
                <IonItem slot="header">
                  <IonLabel>
                    <h2>{quest.title}</h2>
                    <p>{quest.description}</p>
                    {questLine && <p><small>Série: {questLine.title}</small></p>}
                  </IonLabel>
                  <IonBadge slot="end" color={quest.isMainQuest ? 'primary' : 'secondary'}>
                    {quest.isMainQuest ? 'Hlavní' : 'Vedlejší'}
                  </IonBadge>
                  <IonBadge slot="end" color="success" className={quest.isCompleted ? '' : 'ion-display-none'}>
                    <IonIcon icon={checkmark} /> Splněno
                  </IonBadge>
                </IonItem>
                <IonList slot="content">
                  {quest.tasks.map((task) => (
                    <IonItem key={task.id}>
                      <IonBadge slot="start" color="tertiary" className={task.isOptional ? '' : 'ion-display-none'}>
                        Volitelný
                      </IonBadge>
                      <IonCheckbox
                        checked={task.isCompleted}
                        onIonChange={() => toggleTask(quest.id, task.id)}
                      >
                        <IonLabel>
                          <h3>{task.title}</h3>
                          <p>{task.description}</p>
                        </IonLabel>
                      </IonCheckbox>
                    </IonItem>
                  ))}
                  <IonItem>
                    <IonButton slot="end" size="small" onClick={() => openTaskModal(quest.id)}>
                      Přidat Úkol
                    </IonButton>
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>
                      <p><b>Splněno úkolů:</b></p>
                      <p>{completedRequired}/{requiredTasks.length} povinných</p>
                      <p>{completedTasks}/{totalTasks} celkem</p>
                    </IonLabel>
                  </IonItem>
                </IonList>
              </IonAccordion>
            );
          })}
        </IonAccordionGroup>

        {quests.length === 0 && (
          <IonCard>
            <IonCardContent>
              <p>Zatím žádné questy. Přidej první!</p>
            </IonCardContent>
          </IonCard>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowQuestModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <QuestModal
          isOpen={showQuestModal}
          onClose={() => setShowQuestModal(false)}
        />

        <TaskModal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          questId={selectedQuestId}
        />
      </IonContent>
    </IonPage>
  );
};

export default QuestsTab;
