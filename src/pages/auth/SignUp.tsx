import { useState } from 'react';
import { firebaseApp } from '@/firebase';
import { getAuth } from 'firebase/auth';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Redirect } from 'react-router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonPage,
  IonRow,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { lockClosedOutline, personAddOutline, mailOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';

const auth = getAuth(firebaseApp);

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(auth);

  if (user) {
    return (
      <Redirect to="/tab1" />
    );
  }

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Quest</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol sizeXs="12" sizeSm="10" sizeMd="8" sizeLg="6" sizeXl="6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createUserWithEmailAndPassword(email, password);
                }}
              >
                <IonCard className="ion-padding">
                  <IonCardHeader>
                    <IonCardSubtitle>Účet</IonCardSubtitle>
                    <IonCardTitle>Registrace</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {error && (
                      <IonText color="danger">
                        <IonText className="signin-error">{error.message}</IonText>
                      </IonText>
                    )}
                    <IonItem lines="full" className="ion-margin-bottom">
                      <IonInput
                        type="email"
                        label="E-mail"
                        labelPlacement="floating"
                        placeholder="user@example.com"
                        autocomplete="email"
                        value={email}
                        onIonChange={(e) => setEmail(e.detail.value ?? '')}
                      >
                        <IonIcon icon={mailOutline} slot="start" />
                      </IonInput>
                    </IonItem>
                    <IonItem lines="full" className="ion-margin-bottom">
                      <IonInput
                        type="password"
                        label="Heslo"
                        labelPlacement="floating"
                        placeholder="••••••••"
                        autocomplete="new-password"
                        value={password}
                        onIonChange={(e) => setPassword(e.detail.value ?? '')}
                      >
                        <IonIcon icon={lockClosedOutline} slot="start" />
                        <IonInputPasswordToggle slot="end" />
                      </IonInput>
                    </IonItem>
                    <IonButton
                      expand="block"
                      shape="round"
                      type="submit"
                      disabled={loading}
                      className="ion-margin-bottom"
                    >
                      {loading ? (
                        <IonSpinner name="crescent" />
                      ) : (
                        <>
                          <IonText>Vytvořit účet</IonText>
                          <IonIcon icon={personAddOutline} slot="end" />
                        </>
                      )}
                    </IonButton>
                    <IonText color="medium">
                      <IonText>
                        Už máš účet? <Link to="/signin">Přihlásit se.</Link>
                      </IonText>
                    </IonText>
                  </IonCardContent>
                </IonCard>
              </form>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}

export default SignUp;
