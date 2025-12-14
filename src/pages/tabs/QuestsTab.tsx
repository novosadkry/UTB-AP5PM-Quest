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
  IonModal,
  IonButton,
  IonInput,
  IonTextarea,
  IonButtons,
  IonToggle,
  IonItem,
  IonLabel,
  IonBadge,
  IonAccordion,
  IonAccordionGroup,
  IonCheckbox,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { add, checkmark } from 'ionicons/icons';
import { useQuests } from '@/contexts/QuestContext';

const QuestsTab: React.FC = () => {
  const { questLines, quests, addQuest, addTask, toggleTask } = useQuests();
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [questTitle, setQuestTitle] = useState('');
  const [questDescription, setQuestDescription] = useState('');
  const [selectedQuestLineId, setSelectedQuestLineId] = useState<string>('');
  const [isMainQuest, setIsMainQuest] = useState(true);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [isOptional, setIsOptional] = useState(false);

  const handleAddQuest = () => {
    if (selectedQuestLineId && questTitle.trim()) {
      addQuest({
        title: questTitle,
        description: questDescription,
        isMainQuest,
        questLineId: selectedQuestLineId,
      });
      setQuestTitle('');
      setQuestDescription('');
      setSelectedQuestLineId('');
      setIsMainQuest(true);
      setShowQuestModal(false);
    }
  };

  const handleAddTask = () => {
    if (selectedQuestId && taskTitle.trim()) {
      addTask(selectedQuestId, {
        title: taskTitle,
        description: taskDescription,
        isOptional,
      });
      setTaskTitle('');
      setTaskDescription('');
      setIsOptional(false);
      setShowTaskModal(false);
    }
  };

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

        <IonModal isOpen={showQuestModal} onDidDismiss={() => setShowQuestModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nový Quest</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowQuestModal(false)}>Zavřít</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonSelect
                  label="Série questů"
                  labelPlacement="stacked"
                  value={selectedQuestLineId}
                  onIonChange={(e) => setSelectedQuestLineId(e.detail.value)}
                  placeholder="Vyber sérii"
                >
                  {questLines.map((ql) => (
                    <IonSelectOption key={ql.id} value={ql.id}>
                      {ql.title}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonInput
                  label="Název"
                  labelPlacement="stacked"
                  value={questTitle}
                  onIonChange={(e) => setQuestTitle(e.detail.value ?? '')}
                  placeholder="Zadej název questu"
                />
              </IonItem>
              <IonItem>
                <IonTextarea
                  label="Popis"
                  labelPlacement="stacked"
                  value={questDescription}
                  onIonChange={(e) => setQuestDescription(e.detail.value ?? '')}
                  placeholder="Zadej popis"
                  rows={4}
                />
              </IonItem>
              <IonItem>
                <IonToggle checked={isMainQuest} onIonChange={(e) => setIsMainQuest(e.detail.checked)}>
                  Hlavní Quest
                </IonToggle>
              </IonItem>
            </IonList>
            <IonButton expand="block" onClick={handleAddQuest}>
              Vytvořit Quest
            </IonButton>
          </IonContent>
        </IonModal>

        <IonModal isOpen={showTaskModal} onDidDismiss={() => setShowTaskModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nový Úkol</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowTaskModal(false)}>Zavřít</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonInput
                  label="Název"
                  labelPlacement="stacked"
                  value={taskTitle}
                  onIonChange={(e) => setTaskTitle(e.detail.value ?? '')}
                  placeholder="Zadej název úkolu"
                />
              </IonItem>
              <IonItem>
                <IonTextarea
                  label="Popis"
                  labelPlacement="stacked"
                  value={taskDescription}
                  onIonChange={(e) => setTaskDescription(e.detail.value ?? '')}
                  placeholder="Zadej popis"
                  rows={4}
                />
              </IonItem>
              <IonItem>
                <IonToggle checked={isOptional} onIonChange={(e) => setIsOptional(e.detail.checked)}>
                  Volitelný Úkol
                </IonToggle>
              </IonItem>
            </IonList>
            <IonButton expand="block" onClick={handleAddTask}>
              Vytvořit Úkol
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default QuestsTab;
