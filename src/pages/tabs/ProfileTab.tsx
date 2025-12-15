import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonText,
  IonBadge,
} from '@ionic/react';
import { logOutOutline, personCircleOutline, statsChartOutline } from 'ionicons/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useQuests } from '@/hooks/useQuests';

const ProfileTab: React.FC = () => {
  const { user, signOut } = useAuth();
  const { questLines, quests } = useQuests();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const totalQuestLines = questLines.length;
  const totalQuests = quests.length;
  const completedQuests = quests.filter(q => q.isCompleted).length;
  const totalSubtasks = quests.reduce((acc, q) => acc + q.subtasks.length, 0);
  const completedSubtasks = quests.reduce(
    (acc, q) => acc + q.subtasks.filter(st => st.isCompleted).length,
    0
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Profil</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={personCircleOutline} size="large" />
              {' '}Účet
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>
                  <h2>Email</h2>
                  <p>{user?.email || 'Nedostupné'}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>ID Uživatele</h2>
                  <p>{user?.uid || 'Nedostupné'}</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={statsChartOutline} />
              {' '}Statistiky
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>Série Questů</IonLabel>
                <IonBadge slot="end">{totalQuestLines}</IonBadge>
              </IonItem>
              <IonItem>
                <IonLabel>Questy</IonLabel>
                <IonBadge slot="end" color={completedQuests === totalQuests && totalQuests > 0 ? 'success' : 'primary'}>
                  {completedQuests}/{totalQuests}
                </IonBadge>
              </IonItem>
              <IonItem>
                <IonLabel>Podúkoly</IonLabel>
                <IonBadge slot="end" color={completedSubtasks === totalSubtasks && totalSubtasks > 0 ? 'success' : 'primary'}>
                  {completedSubtasks}/{totalSubtasks}
                </IonBadge>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <IonButton expand="block" color="danger" onClick={handleLogout}>
              <IonIcon icon={logOutOutline} slot="start" />
              <IonText>Odhlásit se</IonText>
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ProfileTab;
