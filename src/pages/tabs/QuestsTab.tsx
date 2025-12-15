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
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonItem,
  IonLabel,
  IonBadge,
  IonAccordion,
  IonAccordionGroup,
  IonCheckbox,
  IonAlert,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from '@ionic/react';
import { add, checkmark, time, trash } from 'ionicons/icons';
import { useQuests } from '@/hooks/useQuests';
import QuestModal from '@/components/QuestModal';
import SubtaskModal from '@/components/SubtaskModal';

const QuestsTab: React.FC = () => {
  const { questLines, quests, toggleQuest, toggleSubtask, deleteQuest, deleteSubtask } = useQuests();
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [showSubtaskModal, setShowSubtaskModal] = useState(false);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [deleteQuestAlert, setDeleteQuestAlert] = useState<{ show: boolean; questId: string; title: string }>({
    show: false,
    questId: '',
    title: '',
  });
  const [deleteSubtaskAlert, setDeleteSubtaskAlert] = useState<{ show: boolean; questId: string; subtaskId: string; title: string }>({
    show: false,
    questId: '',
    subtaskId: '',
    title: '',
  });

  const openSubtaskModal = (questId: string) => {
    setSelectedQuestId(questId);
    setShowSubtaskModal(true);
  };

  const handleDeleteQuest = (questId: string, title: string) => {
    setDeleteQuestAlert({ show: true, questId, title });
  };

  const confirmDeleteQuest = () => {
    if (deleteQuestAlert.questId) {
      deleteQuest(deleteQuestAlert.questId);
      setDeleteQuestAlert({ show: false, questId: '', title: '' });
    }
  };

  const handleDeleteSubtask = (questId: string, subtaskId: string, title: string) => {
    setDeleteSubtaskAlert({ show: true, questId, subtaskId, title });
  };

  const confirmDeleteSubtask = () => {
    if (deleteSubtaskAlert.questId && deleteSubtaskAlert.subtaskId) {
      deleteSubtask(deleteSubtaskAlert.questId, deleteSubtaskAlert.subtaskId);
      setDeleteSubtaskAlert({ show: false, questId: '', subtaskId: '', title: '' });
    }
  };

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    return date.toLocaleString('cs-CZ', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const isDeadlineSoon = (deadline?: string) => {
    if (!deadline) return false;
    const date = new Date(deadline);
    const now = new Date();
    const hoursDiff = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff > 0 && hoursDiff <= 24;
  };

  const isDeadlinePassed = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Questy</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Questy</IonTitle>
          </IonToolbar>
        </IonHeader>

        {questLines.map((questLine) => {
          const lineQuests = quests.filter((q) => q.questLineId === questLine.id);
          if (lineQuests.length === 0) return null;

          return (
            <IonCard key={questLine.id}>
              <IonCardHeader>
                <IonCardTitle>{questLine.title}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonAccordionGroup>
                  {lineQuests.map((quest) => {
                    const completedSubtasks = quest.subtasks.filter((st) => st.isCompleted).length;
                    const totalSubtasks = quest.subtasks.length;
                    const requiredSubtasks = quest.subtasks.filter((st) => !st.isOptional);
                    const completedRequired = requiredSubtasks.filter((st) => st.isCompleted).length;

                    return (
                      <IonItemSliding>
                        <IonItem>
                          <IonAccordion key={quest.id} value={quest.id}>
                            <IonItem slot="header">
                              <IonCheckbox
                                slot="start"
                                checked={quest.isCompleted}
                                onIonChange={() => toggleQuest(quest.id)}
                              />
                              <IonLabel>
                                <h2>{quest.title}</h2>
                                <p>{quest.description}</p>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                                  {quest.isCompleted && (
                                    <IonBadge color="success">
                                      <IonIcon icon={checkmark} style={{ marginRight: '4px' }} />
                                      Splněno
                                    </IonBadge>
                                  )}
                                  {quest.isOptional && (
                                    <IonBadge color="tertiary">
                                      Volitelný
                                    </IonBadge>
                                  )}
                                  {quest.deadline && (
                                    <IonBadge
                                      color={
                                        quest.isCompleted
                                          ? 'success'
                                          : isDeadlinePassed(quest.deadline)
                                              ? 'danger'
                                              : isDeadlineSoon(quest.deadline)
                                                ? 'warning'
                                                : 'medium'
                                      }
                                    >
                                      <IonIcon icon={time} style={{ marginRight: '4px' }} />
                                      {formatDeadline(quest.deadline)}
                                    </IonBadge>
                                  )}
                                </div>
                              </IonLabel>
                            </IonItem>
                            <IonList slot="content">
                              {quest.subtasks.map((subtask) => (
                                <IonItemSliding key={subtask.id}>
                                  <IonItem>
                                    {subtask.isOptional && (
                                      <IonBadge color="tertiary" slot="start" style={{ marginRight: '8px' }}>
                                        Volitelný
                                      </IonBadge>
                                    )}
                                    <IonCheckbox
                                      checked={subtask.isCompleted}
                                      onIonChange={() => toggleSubtask(quest.id, subtask.id)}
                                    >
                                      <IonLabel>
                                        <h3>{subtask.title}</h3>
                                        <p>{subtask.description}</p>
                                      </IonLabel>
                                    </IonCheckbox>
                                  </IonItem>
                                  <IonItemOptions side="end">
                                    <IonItemOption color="danger" onClick={() => handleDeleteSubtask(quest.id, subtask.id, subtask.title)}>
                                      <IonIcon slot="icon-only" icon={trash} />
                                    </IonItemOption>
                                  </IonItemOptions>
                                </IonItemSliding>
                              ))}
                              <IonItem>
                                <IonButton slot="end" size="small" onClick={() => openSubtaskModal(quest.id)}>
                                  Přidat podúkol
                                </IonButton>
                              </IonItem>
                              <IonItem lines="none">
                                <IonLabel>
                                  <p><b>Splněno podúkolů:</b></p>
                                  <p>{completedRequired}/{requiredSubtasks.length} povinných</p>
                                  <p>{completedSubtasks}/{totalSubtasks} celkem</p>
                                </IonLabel>
                              </IonItem>
                            </IonList>
                          </IonAccordion>
                        </IonItem>
                        <IonItemOptions side="end">
                          <IonItemOption color="danger" onClick={() => handleDeleteQuest(quest.id, quest.title)}>
                            <IonIcon slot="icon-only" icon={trash} />
                          </IonItemOption>
                        </IonItemOptions>
                      </IonItemSliding>
                    );
                  })}
                </IonAccordionGroup>
              </IonCardContent>
            </IonCard>
          );
        })}

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

        <SubtaskModal
          isOpen={showSubtaskModal}
          onClose={() => setShowSubtaskModal(false)}
          questId={selectedQuestId}
        />

        <IonAlert
          isOpen={deleteQuestAlert.show}
          onDidDismiss={() => setDeleteQuestAlert({ show: false, questId: '', title: '' })}
          header="Smazat quest?"
          message={`Opravdu chceš smazat quest "${deleteQuestAlert.title}"? Tato akce je nevratná.`}
          buttons={[
            {
              text: 'Zrušit',
              role: 'cancel',
            },
            {
              text: 'Smazat',
              role: 'destructive',
              handler: confirmDeleteQuest,
            },
          ]}
        />

        <IonAlert
          isOpen={deleteSubtaskAlert.show}
          onDidDismiss={() => setDeleteSubtaskAlert({ show: false, questId: '', subtaskId: '', title: '' })}
          header="Smazat podúkol?"
          message={`Opravdu chceš smazat podúkol "${deleteSubtaskAlert.title}"?`}
          buttons={[
            {
              text: 'Zrušit',
              role: 'cancel',
            },
            {
              text: 'Smazat',
              role: 'destructive',
              handler: confirmDeleteSubtask,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default QuestsTab;
