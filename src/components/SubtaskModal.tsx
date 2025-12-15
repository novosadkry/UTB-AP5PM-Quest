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
  IonToggle,
} from '@ionic/react';
import { useQuests } from '@/hooks/useQuests';

type SubtaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  questId: string | null;
};

const SubtaskModal: React.FC<SubtaskModalProps> = ({
  isOpen,
  onClose,
  questId,
}) => {
  const { addSubtask } = useQuests();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isOptional, setIsOptional] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setIsOptional(false);
    }
  }, [isOpen, questId]);

  const handleSubmit = () => {
    if (!questId || !title.trim()) {
      return;
    }

    addSubtask(questId, {
      title,
      description,
      isOptional,
    });

    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nový podúkol</IonTitle>
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
              placeholder="Zadej název podúkolu"
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
              checked={isOptional}
              onIonChange={(e) => setIsOptional(e.detail.checked)}
            >
              Volitelný podúkol
            </IonToggle>
          </IonItem>
        </IonList>
        <IonButton
          expand="block"
          shape="round"
          className="ion-margin-top"
          onClick={handleSubmit}
        >
          Vytvořit podúkol
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default SubtaskModal;
