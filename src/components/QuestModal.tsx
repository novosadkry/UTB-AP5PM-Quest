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
  IonDatetimeButton,
  IonDatetime,
  IonLabel,
} from '@ionic/react';
import { useQuests } from '@/hooks/useQuests';

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
  const [isOptional, setIsOptional] = useState(false);
  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadline, setDeadline] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuestLineId('');
      setTitle('');
      setDescription('');
      setIsOptional(false);
      setHasDeadline(false);
      setDeadline(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!questLineId || !title.trim()) {
      return;
    }

    addQuest({
      title,
      description,
      isOptional,
      questLineId,
      deadline,
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
              checked={isOptional}
              onIonChange={(e) => setIsOptional(e.detail.checked)}
            >
              Volitelný Quest
            </IonToggle>
          </IonItem>
          <IonItem lines="full" className="ion-margin-bottom">
            <IonLabel>Má deadline?</IonLabel>
            <IonToggle
              slot="end"
              checked={hasDeadline}
              onIonChange={(e) => {
                setHasDeadline(e.detail.checked);
                if (!e.detail.checked) {
                  setDeadline(null);
                } else {
                  setDeadline(new Date().toISOString());
                }
              }}
            />
          </IonItem>
          <IonItem lines="full" className="ion-margin-bottom" disabled={!hasDeadline}>
            <IonDatetimeButton datetime="deadline-datetime" />
            <IonModal keepContentsMounted={true}>
              <IonDatetime
                id="deadline-datetime"
                value={deadline}
                onIonChange={(e) => setDeadline(e.detail.value as string)}
                presentation="date-time"
                min={new Date().toISOString()}
              />
            </IonModal>
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
