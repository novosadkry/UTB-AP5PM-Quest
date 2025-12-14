import React, { useEffect, useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonTextarea,
  IonToggle,
} from '@ionic/react';
import { useQuests } from '@/contexts/QuestContext';

type QuestModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const QuestModal: React.FC<QuestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { questLines, addQuest } = useQuests();
  const [questLineId, setQuestLineId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isMainQuest, setIsMainQuest] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setQuestLineId('');
      setTitle('');
      setDescription('');
      setIsMainQuest(true);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!questLineId || !title.trim()) {
      return;
    }

    addQuest({
      title,
      description,
      isMainQuest,
      questLineId,
    });

    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nový Quest</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Zavřít</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem lines="full" className="ion-margin-bottom">
            <IonSelect
              label="Série questů"
              labelPlacement="stacked"
              value={questLineId}
              onIonChange={(e) => setQuestLineId(e.detail.value)}
              placeholder="Vyber sérii"
            >
              {questLines.map((ql) => (
                <IonSelectOption key={ql.id} value={ql.id}>
                  {ql.title}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonItem lines="full" className="ion-margin-bottom">
            <IonInput
              label="Název"
              labelPlacement="stacked"
              value={title}
              onIonInput={(e) => setTitle(e.detail.value ?? '')}
              placeholder="Zadej název questu"
            />
          </IonItem>
          <IonItem lines="full" className="ion-margin-bottom">
            <IonTextarea
              label="Popis"
              labelPlacement="stacked"
              value={description}
              onIonInput={(e) => setDescription(e.detail.value ?? '')}
              placeholder="Zadej popis"
              rows={4}
            />
          </IonItem>
          <IonItem lines="full" className="ion-margin-bottom">
            <IonToggle
              checked={isMainQuest}
              onIonChange={(e) => setIsMainQuest(e.detail.checked)}
            >
              Hlavní Quest
            </IonToggle>
          </IonItem>
        </IonList>
        <IonButton
          expand="block"
          shape="round"
          className="ion-margin-top"
          onClick={handleSubmit}
        >
          Vytvořit Quest
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default QuestModal;
