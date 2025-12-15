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
  IonList,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonModal,
  IonButton,
  IonInput,
  IonTextarea,
  IonButtons,
  IonBadge,
  IonCardSubtitle,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useQuests } from '@/contexts/QuestContext';

const QuestLinesTab: React.FC = () => {
  const { questLines, quests, loading, addQuestLine } = useQuests();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddQuestLine = () => {
    if (title.trim()) {
      addQuestLine({ title, description });
      setTitle('');
      setDescription('');
      setShowModal(false);
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
                  <IonCardHeader>
                    <IonCardTitle>{questLine.title}</IonCardTitle>
                    <IonCardSubtitle>{questLine.description}</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonBadge color={completedQuests === totalQuests && totalQuests > 0 ? 'success' : 'primary'}>
                      {completedQuests}/{totalQuests} Questů splněno
                    </IonBadge>
                  </IonCardContent>
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

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nová série Questů</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Zavřít</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonInput
                  label="Název"
                  labelPlacement="stacked"
                  value={title}
                  onIonInput={(e) => setTitle(e.detail.value ?? '')}
                  placeholder="Zadej název série"
                />
              </IonItem>
              <IonItem>
                <IonTextarea
                  label="Popis"
                  labelPlacement="stacked"
                  value={description}
                  onIonInput={(e) => setDescription(e.detail.value ?? '')}
                  placeholder="Zadej popis"
                  rows={4}
                />
              </IonItem>
            </IonList>
            <IonButton expand="block" onClick={handleAddQuestLine}>
              Vytvořit Sérii
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default QuestLinesTab;
