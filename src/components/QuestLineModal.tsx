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
  IonInput,
  IonTextarea,
} from '@ionic/react';
import { useQuests } from '@/hooks/useQuests';

type QuestLineModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const QuestLineModal: React.FC<QuestLineModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addQuestLine } = useQuests();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!title.trim()) {
      return;
    }

    addQuestLine({
      title,
      description,
    });

    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nová série Questů</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Zavřít</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem lines="full" className="ion-margin-bottom">
            <IonInput
              label="Název"
              labelPlacement="stacked"
              value={title}
              onIonInput={(e) => setTitle(e.detail.value ?? '')}
              placeholder="Zadej název série"
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
        </IonList>
        <IonButton
          expand="block"
          shape="round"
          className="ion-margin-top"
          onClick={handleSubmit}
        >
          Vytvořit Sérii
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default QuestLineModal;
