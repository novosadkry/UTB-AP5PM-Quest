import { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonCardSubtitle,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonAlert,
} from '@ionic/react';
import { add, trash } from 'ionicons/icons';
import { useQuests } from '@/hooks/useQuests';
import QuestLineModal from '@/components/QuestLineModal';

const QuestLinesTab: React.FC = () => {
  const { questLines, quests, loading, deleteQuestLine } = useQuests();
  const [showModal, setShowModal] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState<{ show: boolean; questLineId: string; title: string }>({
    show: false,
    questLineId: '',
    title: '',
  });

  const handleDeleteQuestLine = (questLineId: string, title: string) => {
    setDeleteAlert({ show: true, questLineId, title });
  };

  const confirmDelete = () => {
    if (deleteAlert.questLineId) {
      deleteQuestLine(deleteAlert.questLineId);
      setDeleteAlert({ show: false, questLineId: '', title: '' });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Série Questů</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Série Questů</IonTitle>
          </IonToolbar>
        </IonHeader>

        {loading ? (
          <IonCard>
            <IonCardContent>
              <p>Načítání sérií questů...</p>
            </IonCardContent>
          </IonCard>
        ) : (
          <>
            {questLines.map((questLine) => {
              const lineQuests = quests.filter(q => q.questLineId === questLine.id);
              const completedQuests = lineQuests.filter(q => q.isCompleted).length;
              const totalQuests = lineQuests.length;

              return (
                <IonCard key={questLine.id}>
                  <IonItemSliding>
                    <IonItem lines="none" className="ion-no-padding">
                      <div style={{ width: '100%' }}>
                        <IonCardHeader>
                          <IonCardTitle>{questLine.title}</IonCardTitle>
                          <IonCardSubtitle>{questLine.description}</IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>
                          <IonBadge color={completedQuests === totalQuests && totalQuests > 0 ? 'success' : 'primary'}>
                            {completedQuests}/{totalQuests} Questů splněno
                          </IonBadge>
                        </IonCardContent>
                      </div>
                    </IonItem>
                    <IonItemOptions side="end">
                      <IonItemOption color="danger" onClick={() => handleDeleteQuestLine(questLine.id, questLine.title)}>
                        <IonIcon slot="icon-only" icon={trash} />
                      </IonItemOption>
                    </IonItemOptions>
                  </IonItemSliding>
                </IonCard>
              );
            })}
            {questLines.length === 0 && (
              <IonCard>
                <IonCardContent>
                  <p>Zatím žádné série questů. Vytvoř první!</p>
                </IonCardContent>
              </IonCard>
            )}
          </>
        )}

        <IonAlert
          isOpen={deleteAlert.show}
          onDidDismiss={() => setDeleteAlert({ show: false, questLineId: '', title: '' })}
          header="Smazat sérii questů?"
          message={`Opravdu chceš smazat sérii "${deleteAlert.title}"? Tato akce smaže také všechny questy a úkoly v této sérii. Tato akce je nevratná.`}
          buttons={[
            {
              text: 'Zrušit',
              role: 'cancel',
            },
            {
              text: 'Smazat',
              role: 'destructive',
              handler: confirmDelete,
            },
          ]}
        />

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <QuestLineModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default QuestLinesTab;
